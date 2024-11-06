function copyToClipboard() {
    var text = document.getElementById('serverAddress').innerText; // Get the text of the server address
    navigator.clipboard.writeText(text).then(() => {
        alert('Address copied to clipboard!'); // Notification after successful copy
    }).catch(err => {
        console.error('Failed to copy text: ', err); // Error handling
    });
}