let admin = JSON.parse(localStorage.getItem("loggedInAdmin"));
if (!admin) {
    window.location.href = "admin-login.html";
} else {
    document.getElementById("adminName").innerText = admin.name;
}

// Function to update package status
function updatePackage() {
    let trackingId = document.getElementById("trackingId").value;
    let newStatus = document.getElementById("packageStatus").value;

    let packages = JSON.parse(localStorage.getItem("packages")) || [];
    let packageIndex = packages.findIndex(pkg => pkg.trackingId === trackingId);

    if (packageIndex !== -1) {
        packages[packageIndex].status = newStatus;
        localStorage.setItem("packages", JSON.stringify(packages));
        alert("Package status updated!");
        loadPackages();
    } else {
        alert("Package not found!");
    }
}

// Function to load packages in admin panel
function loadPackages() {
    let packageList = document.getElementById("packageList");
    packageList.innerHTML = "";
    let packages = JSON.parse(localStorage.getItem("packages")) || [];

    packages.forEach(pkg => {
        let li = document.createElement("li");
        li.innerText = `ID: ${pkg.trackingId}, Status: ${pkg.status}`;
        packageList.appendChild(li);
    });
}

function logoutAdmin() {
    localStorage.removeItem("loggedInAdmin");
    window.location.href = "admin-login.html";
}

// Dark Mode Toggle
function toggleDarkMode() {
    let body = document.getElementById("body");
    body.classList.toggle("dark-mode");
    let form = document.querySelector("form");
    form.classList.toggle("dark-mode");
    let buttons = document.querySelectorAll("button");
    buttons.forEach(button => button.classList.toggle("dark-mode"));
    let links = document.querySelectorAll("a");
    links.forEach(link => link.classList.toggle("dark-mode"));
    let packageList = document.getElementById("packageList");
    packageList.classList.toggle("dark-mode");
    let packageItems = document.querySelectorAll("#packageList li");
    packageItems.forEach(item => item.classList.toggle("dark-mode"));

    // Save dark mode preference to localStorage
    localStorage.setItem("darkMode", body.classList.contains("dark-mode"));
}

// Load dark mode preference on page load
window.onload = function() {
    // Check dark mode preference
    const isDarkMode = JSON.parse(localStorage.getItem("darkMode"));
    if (isDarkMode) {
        document.body.classList.add("dark-mode");
        document.getElementById("darkModeToggle").checked = true;
    }
    
    loadPackages();
    loadStats();
}

// Function to load package stats
function loadStats() {
    let packages = JSON.parse(localStorage.getItem("packages")) || [];
    let totalPackages = packages.length;
    let inTransit = packages.filter(pkg => pkg.status === "In Transit").length;
    let delivered = packages.filter(pkg => pkg.status === "Delivered").length;

    document.getElementById("totalPackages").innerText = totalPackages;
    document.getElementById("inTransit").innerText = inTransit;
    document.getElementById("delivered").innerText = delivered;
}

// Search package by Tracking ID
function searchPackage() {
    let searchQuery = document.getElementById("searchPackage").value.toLowerCase();
    let packages = JSON.parse(localStorage.getItem("packages")) || [];
    let searchResults = packages.filter(pkg => pkg.trackingId.toLowerCase().includes(searchQuery));
    
    let searchResultsList = document.getElementById("searchResults");
    searchResultsList.innerHTML = "";
    searchResults.forEach(pkg => {
        let li = document.createElement("li");
        li.innerText = `ID: ${pkg.trackingId}, Status: ${pkg.status}`;
        searchResultsList.appendChild(li);
    });
}

// Add new package to the list
document.getElementById("addPackageForm").addEventListener("submit", function(event) {
    event.preventDefault();

    // Generate a random tracking ID
    let trackingId = "PKG" + Math.floor(Math.random() * 1000000);

    // Get input values
    let sender = document.getElementById("sender").value;
    let receiver = document.getElementById("receiver").value;
    let receiverEmail = document.getElementById("receiverEmail").value;
    let receiverPhone = document.getElementById("receiverPhone").value;
    let receiverAddress = document.getElementById("receiverAddress").value;
    let location = document.getElementById("location").value;
    let currentLocation = document.getElementById("currentLocation").value;
    let weight = document.getElementById("weight").value;
    let deliveryFee = document.getElementById("deliveryFee").value;

    // Create package object
    let packageData = {
        trackingId,
        sender,
        receiver,
        receiverEmail,
        receiverPhone,
        receiverAddress,
        location,
        currentLocation,
        weight,
        deliveryFee,
        status: "Pending"
    };

    // Save to localStorage
    let packages = JSON.parse(localStorage.getItem("packages")) || [];
    packages.push(packageData);
    localStorage.setItem("packages", JSON.stringify(packages));

    // Refresh package list
    displayPackages();

    // Clear form
    document.getElementById("addPackageForm").reset();
});

// Function to display packages in table format
function displayPackages() {
    let packages = JSON.parse(localStorage.getItem("packages")) || [];
    let tableBody = document.querySelector("#packageTable tbody");
    tableBody.innerHTML = ""; // Clear the table before displaying

    packages.forEach(pkg => {
        let row = `<tr>
            <td>${pkg.trackingId}</td>
            <td>${pkg.sender}</td>
            <td>${pkg.receiver}</td>
            <td>${pkg.receiverEmail}</td>
            <td>${pkg.receiverPhone}</td>
            <td>${pkg.receiverAddress}</td>
            <td>${pkg.location}</td>
            <td>${pkg.currentLocation}</td>
            <td>${pkg.weight} kg</td>
            <td>$${pkg.deliveryFee}</td>
            <td>${pkg.status}</td>
        </tr>`;
        tableBody.innerHTML += row;
    });
}
// View Package Details
function viewPackageDetails() {
    let trackingId = document.getElementById("packageTrackingId").value;
    let packages = JSON.parse(localStorage.getItem("packages")) || [];
    let package = packages.find(pkg => pkg.trackingId === trackingId);

    if (package) {
        let details = document.getElementById("details");
        details.innerHTML = `
            <h3>Package Details</h3>
            <p><strong>Tracking ID:</strong> ${package.trackingId}</p>
            <p><strong>Sender:</strong> ${package.sender}</p>
            <p><strong>Receiver:</strong> ${package.receiver}</p>
            <p><strong>Receiver Email:</strong> ${package.receiverEmail}</p>
            <p><strong>Receiver Phone:</strong> ${package.receiverPhone}</p>
            <p><strong>Receiver Address:</strong> ${package.receiverAddress}</p>
            <p><strong>Final Delivery Location:</strong> ${package.location}</p>
            <p><strong>Current Location:</strong> ${package.currentLocation}</p>
            <p><strong>Package Weight:</strong> ${package.weight} kg</p>
            <p><strong>Delivery Fee:</strong> $${package.deliveryFee}</p>
            <p><strong>Status:</strong> ${package.status}</p>
        `;
    } else {
        alert("Package not found!");
    }
}
