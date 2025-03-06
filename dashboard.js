let user = JSON.parse(localStorage.getItem("loggedInUser"));
if (!user) {
    window.location.href = "login.html";
} else {
    document.getElementById("userName").innerText = user.name;
}

function logout() {
    localStorage.removeItem("loggedInUser");
    window.location.href = "login.html";
}
