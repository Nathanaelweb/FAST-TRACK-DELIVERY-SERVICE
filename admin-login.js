document.getElementById("adminLoginForm").addEventListener("submit", function (e) {
    e.preventDefault();

    let email = document.getElementById("adminLoginEmail").value;
    let password = document.getElementById("adminLoginPassword").value;

    let admins = JSON.parse(localStorage.getItem("admins")) || [];
    let admin = admins.find(admin => admin.email === email && admin.password === password);

    if (admin) {
        localStorage.setItem("loggedInAdmin", JSON.stringify(admin));
        alert("Admin login successful!");
        window.location.href = "admin-dashboard.html";
    } else {
        alert("Invalid email or password.");
    }
});
