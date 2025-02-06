from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)

# Move CORS setup here
CORS(app, origins=["https://thuis.felixband.nl"])

MESSAGE_FILE = "messages.txt"

def is_duplicate(ip_address, message):
    """Check if the same IP has already sent the exact message."""
    try:
        with open(MESSAGE_FILE, "r", encoding="utf-8") as file:
            logs = file.readlines()

        # Convert logs to a list of messages from this IP
        existing_messages = []
        current_ip = None
        current_message = []
        
        for line in logs:
            if line.startswith("IP: "):
                if current_ip == ip_address and current_message:
                    existing_messages.append("\n".join(current_message).strip())
                current_ip = line.split("|")[0].replace("IP: ", "").strip()
                current_message = []
            elif line.strip():
                current_message.append(line.strip())

        # Add last message in the log (if it matches the IP)
        if current_ip == ip_address and current_message:
            existing_messages.append("\n".join(current_message).strip())

        return message in existing_messages

    except FileNotFoundError:
        return False  # If file doesn't exist, allow the message

@app.route("/send_message", methods=["POST"])
def send_message():
    data = request.get_json()
    username = data.get("username", "Anonymous").strip()
    message = data.get("message", "").strip()

    # Get real IP address
    ip_address = request.headers.get("X-Forwarded-For", request.remote_addr).split(",")[0].strip()

    if not message:
        return "Error: Message cannot be empty!", 400

    # Check if this message from this IP is a duplicate
    if is_duplicate(ip_address, message):
        return "Error: Duplicate message detected!", 400

    log_entry = f"IP: {ip_address} | Name: {username}\nMessage:\n{message}\n\n"

    # Save message to file
    with open(MESSAGE_FILE, "a", encoding="utf-8") as file:
        file.write(log_entry)

    return "Message sent successfully!"

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)  # Internal only, managed by Gunicorn