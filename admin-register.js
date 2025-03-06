// Handle registration and OTP sending
document.getElementById('registerForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent default form submission

    // Get user details
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Generate OTP (6 digits)
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Send OTP to the provided email using EmailJS
    sendOTPEmail(email, otp).then(() => {
        // OTP sent successfully, alert the user
        alert("An OTP has been sent to your email. Please verify it.");

        // Hide the registration form and show OTP input form
        document.getElementById('registerForm').style.display = 'none';
        document.getElementById('otpVerification').style.display = 'block';

        // Store OTP and user details in local storage for later use
        localStorage.setItem('otp', otp);
        localStorage.setItem('userDetails', JSON.stringify({ name, email, password }));
    }).catch((error) => {
        console.error("Error sending OTP email:", error);
        alert("Failed to send OTP. Please try again.");
    });
});
