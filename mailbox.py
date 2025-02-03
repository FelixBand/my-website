from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)

MESSAGE_FILE = "messages.txt"

@app.route("/send_message", methods=["POST"])
def send_message():
    CORS(app, origins=["https://thuis.felixband.nl"])  # Restrict CORS
    data = request.get_json()
    username = data.get("username", "Anonymous").strip()
    message = data.get("message", "").strip()
    ip_address = request.remote_addr  # Get sender's IP

    if not message:
        return "Error: Message cannot be empty!", 400

    log_entry = f"IP: {ip_address} | Name: {username}\nMessage:\n{message}\n\n"

    # Save message to file
    with open(MESSAGE_FILE, "a", encoding="utf-8") as file:
        file.write(log_entry)

    return "Message sent successfully!"

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000)  # Internal only, managed by Gunicorn
