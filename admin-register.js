document.getElementById("adminRegisterForm").addEventListener("submit", function (e) {
    e.preventDefault();

    let name = document.getElementById("adminName").value;
    let email = document.getElementById("adminEmail").value;
    let password = document.getElementById("adminPassword").value;

    let admins = JSON.parse(localStorage.getItem("admins")) || [];

    if (admins.some(admin => admin.email === email)) {
        alert("Email already registered!");
        return;
    }

    admins.push({ name, email, password });
    localStorage.setItem("admins", JSON.stringify(admins));
    alert("Admin registered successfully!");
    window.location.href = "admin-login.html";
});
