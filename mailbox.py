from flask import Flask, request, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for cross-origin requests

MESSAGE_FILE = "messages.txt"

@app.route("/send_message", methods=["POST"])
def send_message():
    try:
        data = request.get_json()  # Ensure JSON is properly parsed
        if not data:
            return jsonify({"error": "Invalid request, JSON required"}), 400

        username = data.get("username", "Anonymous").strip()
        message = data.get("message", "").strip()
        ip_address = request.remote_addr  # Get sender's IP

        if not message:
            return jsonify({"error": "Message cannot be empty!"}), 400

        log_entry = f"IP: {ip_address} | Name: {username}\nMessage:\n{message}\n{'-'*40}\n"

        # Save message to file
        with open(MESSAGE_FILE, "a", encoding="utf-8") as file:
            file.write(log_entry)

        return jsonify({"success": "Message sent successfully!"}), 200

    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500

# Test endpoint to verify server is running
@app.route("/test", methods=["GET"])
def test():
    return "Flask is working!"

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)