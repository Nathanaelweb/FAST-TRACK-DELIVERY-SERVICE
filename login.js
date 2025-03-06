document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();

    let email = document.getElementById("loginEmail").value;
    let password = document.getElementById("loginPassword").value;

    // Retrieve the registered users from localStorage
    let users = JSON.parse(localStorage.getItem("users")) || [];
    
    // Check if the user exists with the provided email and password
    let user = users.find(user => user.email === email && user.password === password);

    if (user) {
        // Save the logged-in user information to localStorage for session
        localStorage.setItem("loggedInUser", JSON.stringify(user));
        alert("Login successful!");
        window.location.href = "dashboard.html"; // Redirect to dashboard
    } else {
        alert("Invalid email or password.");
    }
});
