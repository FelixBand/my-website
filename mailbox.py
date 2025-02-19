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
    username = data.get("username", "Anonymous").strip()
    message = data.get("message", "").strip()

    # Log received data for debugging
    print(f"Received data: {data}")
    if not message:
        return "Error: Message cannot be empty!", 400

    # Get current date and time (dd/mm/yyyy HH:MM:SS)
    timestamp = datetime.now().strftime("%d/%m/%Y %H:%M:%S")

    log_entry = f"Time: {timestamp}\nIP: {request.remote_addr} | Name: {username}\nMessage:\n{message}\n\n"

    # Log to a separate test file
    with open("test_log.txt", "a", encoding="utf-8") as test_file:
        test_file.write(log_entry)
    
    # Also save to your actual messages file
    with open(MESSAGE_FILE, "a", encoding="utf-8") as file:
        file.write(log_entry)

    return "Message sent successfully!"



if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)  # Internal only, managed by Gunicorn