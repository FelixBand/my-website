from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)

# Move CORS setup here
CORS(app, origins=["https://thuis.felixband.nl"])

MESSAGE_FILE = "messages.txt"

@app.route("/send_message", methods=["POST"])
def send_message():
    data = request.get_json()
    print(f"Received data: {data}")  # Log the received data
    username = data.get("username", "Anonymous").strip()
    message = data.get("message", "").strip()
    if not message:
        return "Error: Message cannot be empty!", 400
    # Additional log for debugging
    print(f"Processing message from {username}: {message}")
    # Your message saving logic here...
    return "Message sent successfully!"


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)  # Internal only, managed by Gunicorn