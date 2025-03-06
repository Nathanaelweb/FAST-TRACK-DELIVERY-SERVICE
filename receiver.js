if (Notification.permission === "default") {
    Notification.requestPermission();
}



function sendReply() {
    const input = document.getElementById("reply-input");
    const message = input.value.trim();

    if (message === "") return;

    let messages = JSON.parse(localStorage.getItem("chatMessages")) || [];
    let timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    messages.push({ sender: "Receiver", text: message, time: timestamp });

    localStorage.setItem("chatMessages", JSON.stringify(messages));

    input.value = "";
    loadMessages();
}

let lastMessageCount = 0;
let audio = new Audio('notification-2-269292.mp3'); // Load the sound file

function playNotificationSound() {
    audio.currentTime = 0; // Start from the beginning
    audio.play();
    setTimeout(() => {
        audio.pause(); // Pause after 2 seconds
        audio.currentTime = 0; // Reset the sound
    }, 2000); // 2000 milliseconds = 2 seconds
}


function loadMessages() {
    const chatBox = document.getElementById("chat-box");
    chatBox.innerHTML = "";

    let messages = JSON.parse(localStorage.getItem("chatMessages")) || [];

    // Check if a new message has been added
    if (messages.length > lastMessageCount) {
        let latestMessage = messages[messages.length - 1];

        // Send a notification only if the message is from the sender
        if (latestMessage.sender === "Sender" && Notification.permission === "granted") {
            new Notification("New Message from Sender", {
                body: latestMessage.text,
                icon: "notification-icon.png"
            });
            playNotificationSound(); // Play sound when message is received
        }
       
    }

    lastMessageCount = messages.length; // Update message count

    // Display all messages
   
    messages.forEach(msg => {
        let messageDiv = document.createElement("div");
        messageDiv.classList.add("message");
        messageDiv.classList.add(msg.sender === "Sender" ? "sender-message" : "receiver-message");
    
        if (msg.text) {
            messageDiv.innerHTML = `${msg.text} <br> <span class="timestamp">${msg.time}</span>`;
        } else if (msg.image) {
            messageDiv.innerHTML = `<img src="${msg.image}" style="max-width:100%;" /><br> <span class="timestamp">${msg.time}</span>`;
        }
    
        chatBox.appendChild(messageDiv);
    });

    chatBox.scrollTop = chatBox.scrollHeight;
}

// Load messages when the page opens
document.addEventListener("DOMContentLoaded", () => {
    setTimeout(loadMessages, 1000);
});

// Check for new messages every 2 seconds
setInterval(loadMessages, 2000);

function clearChat() {
    if (confirm("Are you sure you want to clear the chat? This cannot be undone.")) {
        localStorage.removeItem("chatMessages"); // Clear chat history
        document.getElementById("chat-box").innerHTML = ""; // Clear UI
    }
  }
  function sendImage(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const imageMessage = {
                sender: window.location.pathname.includes("sender") ? "Sender" : "Receiver",
                image: e.target.result,
                time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            };

            let messages = JSON.parse(localStorage.getItem("chatMessages")) || [];
            messages.push(imageMessage);
            localStorage.setItem("chatMessages", JSON.stringify(messages));
            loadMessages();
        };
        reader.readAsDataURL(file);
    }
}

function openCamera() {
    const video = document.getElementById('camera');
    const canvas = document.getElementById('snapshot');

    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            video.style.display = 'block';
            video.srcObject = stream;

            // Automatically take a snapshot after 3 seconds
            setTimeout(() => {
                const context = canvas.getContext('2d');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                context.drawImage(video, 0, 0, canvas.width, canvas.height);

                stream.getTracks().forEach(track => track.stop());
                video.style.display = 'none';

                const imageData = canvas.toDataURL('image/png');

                let messages = JSON.parse(localStorage.getItem("chatMessages")) || [];
                messages.push({
                    sender: window.location.pathname.includes("sender") ? "Sender" : "Receiver",
                    image: imageData,
                    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                });

                localStorage.setItem("chatMessages", JSON.stringify(messages));
                loadMessages();
            }, 7000); // 3-second delay before taking a snapshot
        })
        .catch(err => console.error(err));
}

function takeSnapshot(video, stream) {
    const canvas = document.getElementById('snapshot');
    canvas.style.display = 'block';
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    stream.getTracks().forEach(track => track.stop());
    const imageData = canvas.toDataURL('image/png');

    let messages = JSON.parse(localStorage.getItem("chatMessages")) || [];
    messages.push({
        sender: window.location.pathname.includes("sender") ? "Sender" : "Receiver",
        image: imageData,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    });

    localStorage.setItem("chatMessages", JSON.stringify(messages));
    loadMessages();
}