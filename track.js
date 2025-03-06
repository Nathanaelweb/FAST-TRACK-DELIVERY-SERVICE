// Function to track the package based on the tracking ID
function trackPackage() {
    let trackingId = document.getElementById("trackingIdInput").value;

    if (!trackingId) {
        alert("Please enter a tracking ID.");
        return;
    }

    // Get packages from localStorage
    let packages = JSON.parse(localStorage.getItem("packages")) || [];

    // Find the package with the matching tracking ID
    let package = packages.find(pkg => pkg.trackingId === trackingId);

    if (package) {
        // Display package details
        let packageDetails = document.getElementById("packageDetails");
        packageDetails.innerHTML = `
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
    
        // Show the "Generate Invoice" button
        document.getElementById("generateInvoiceButton").style.display = "inline-block";
    } else {
        alert("Package not found!");
    }
}

/// Function to generate the PDF invoice with enhanced design
function generateInvoice() {
    let trackingId = document.getElementById("trackingIdInput").value;

    // Get packages from localStorage
    let packages = JSON.parse(localStorage.getItem("packages")) || [];

    // Find the package with the matching tracking ID
    let package = packages.find(pkg => pkg.trackingId === trackingId);

    if (package) {
        // Create a new instance of jsPDF
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Optional: Add logo (Replace with your logo URL)
        doc.addImage('delivery-logo-design-template-a4d80ebb3305fef2afe82c687e994b6b_screen-removebg-preview.png', 'PNG', 10, 10, 50, 50);

        // Set font and style
        doc.setFont("helvetica");
        doc.setFontSize(14);

        // Add Invoice Title with Locations
        doc.setTextColor(40, 53, 147); // Dark blue color for the title
        doc.text(`(Package Invoice )`, 105, 60, null, null, "center");

        // Add a line separator
        doc.setDrawColor(40, 53, 147);
        doc.line(10, 65, 200, 65); // Horizontal line

        // Package Details Table
        doc.autoTable({
            head: [["Tracking ID", "Sender", "Receiver", "Current Location", "Final Location", "Status"]],
            body: [
                [
                    package.trackingId,
                    package.sender,
                    package.receiver,
                    package.currentLocation,
                    package.location,
                    package.status
                ]
            ],
            startY: 75, // Table start position
            theme: 'grid',
            headStyles: {
                fillColor: [40, 53, 147], // Header background color
                textColor: 255, // White text color
                fontSize: 12,
                fontStyle: 'bold'
            },
            bodyStyles: {
                fontSize: 12,
                textColor: 0
            }
        });

        /// Add "Additional Details" with light background and center alignment
        let startY = doc.lastAutoTable.finalY + 10;
        
        // Set background color and text styles
        doc.setFillColor(240, 240, 240);  // Light gray background
        doc.rect(10, startY, 190, 50, 'F'); // Light gray box for additional details

        // Set font to bold for Additional Details
        doc.setFont("helvetica", "bold"); // Set font to bold
        doc.setFontSize(12);
        doc.setTextColor(40, 53, 147); // Black text color
        doc.text(`(Additional Package Details  )`, 105, 100, null, null, "center");
        // Center text within the box
        doc.text(`Receiver Email: ${package.receiverEmail}`, 105, startY + 10, null, null, 'center');
        doc.text(`Receiver Phone: ${package.receiverPhone}`, 105, startY + 20, null, null, 'center');
        doc.text(`Receiver Address: ${package.receiverAddress}`, 105, startY + 30, null, null, 'center');
        doc.text(`Package Weight: ${package.weight} kg`, 105, startY + 40, null, null, 'center');
        doc.text(`Delivery Fee: $${package.deliveryFee}`, 105, startY + 50, null, null, 'center');
        // Optional: Add logo (Replace with your logo URL)

        // Generate QR Code for the tracking ID
        let qrData = `https://yourwebsite.com/track?trackingId=${package.trackingId}`; // Replace with your tracking URL
        QRCode.toDataURL(qrData, function(err, url) {
            if (err) {
                console.error(err);
            } else {
                // Add QR code image to PDF (position it in the bottom right corner)
                doc.addImage(url, 'PNG', 150, doc.internal.pageSize.height - 60, 20, 20); // Adjust size and position as needed
                // Save the PDF
                doc.save(`Invoice_${package.trackingId}.pdf`);
            }
        });
        doc.addImage('delivery-logo-design-template-a4d80ebb3305fef2afe82c687e994b6b_screen-removebg-preview.png', 'PNG', 150, 200, 50, 50);
        // Footer section for the invoice
        doc.setFontSize(10);
        doc.text(`Date of Issue: ${new Date().toLocaleDateString()}`, 10, doc.internal.pageSize.height - 30);
        doc.text("Thank you for choosing our delivery service!", 10, doc.internal.pageSize.height - 20);

        // Save the PDF
        doc.save(`Invoice_${package.trackingId}.pdf`);
    } else {
        alert("Package not found!");
    }
}
