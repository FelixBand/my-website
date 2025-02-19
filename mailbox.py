from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)

# Move CORS setup here
CORS(app, origins=["*"])  # Temporarily allow all origins

MESSAGE_FILE = "messages.txt"

@app.route("/send_message", methods=["POST"])
def send_message():
    data = request.get_json()
    username = data.get("username", "Anonymous").strip()
    message = data.get("message", "").strip()

    # Get real IP address
    ip_address = request.headers.get("X-Forwarded-For", request.remote_addr).split(",")[0].strip()

    if not message:
        return "Error: Message cannot be empty!", 400

    # Get current date and time (dd/mm/yyyy HH:MM:SS)
    timestamp = datetime.now().strftime("%d/%m/%Y %H:%M:%S")

    log_entry = f"Time: {timestamp}\nIP: {ip_address} | Name: {username}\nMessage:\n{message}\n\n"

    # Save message to file
    with open(MESSAGE_FILE, "a", encoding="utf-8") as file:
        file.write(log_entry)

    return "Message sent successfully!"

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)  # Internal only, managed by Gunicorn