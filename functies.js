document.addEventListener("DOMContentLoaded", function () {
    let nameInput = document.getElementById("username");

    // Load name from cookies if available
    let savedName = getCookie("username");
    if (savedName) {
        nameInput.value = savedName;
    }

    document.getElementById("mailForm").addEventListener("submit", function (event) {
        event.preventDefault(); // Stop the form from reloading the page

        let username = nameInput.value.trim();
        let message = document.getElementById("message").value.trim();

        if (username === "" || message === "") {
            alert("Please fill in all fields.");
            return;
        }

        // Store name in a cookie (expires in 1 year)
        setCookie("username", username, 365);

        // Send message to Flask backend
        fetch("http://thuis.felixband.nl:5000/send_message", { // Replace with your actual server IP
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, message })
        })
        .then(response => response.text())
        .then(data => {
            document.getElementById("statusMessage").innerText = data;
        })
        .catch(error => {
            console.error("Error:", error);
            document.getElementById("statusMessage").innerText = "Error sending message.";
        });
    });
});

// Function to get a cookie value
function getCookie(name) {
    let match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    return match ? match[2] : "";
}

// Function to set a cookie
function setCookie(name, value, days) {
    let expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = name + "=" + value + "; expires=" + expires.toUTCString() + "; path=/";
}

function copyToClipboard() {
    var text = document.getElementById('serverAddress').innerText; // Get the text of the server address
    navigator.clipboard.writeText(text).then(() => {
        alert('Address copied to clipboard!'); // Notification after successful copy
    }).catch(err => {
        console.error('Failed to copy text: ', err); // Error handling
    });
}