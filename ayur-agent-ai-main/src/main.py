import os
import google.generativeai as genai
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# Read Gemini API key from environment when using Flask backend
# Prefer GEMINI_API_KEY; fallback to provided key for immediate functionality
api_key = "AIzaSyC2NZyha37rsd4sDn5Y-ZUQPTT4pIfWljE"
genai.configure(api_key=api_key)
# Use a stable, widely available model name
model = genai.GenerativeModel('gemini-2.5-flash')

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        user_message = data.get('message')

        if not user_message:
            return jsonify({"error": "Message is required"}), 400

        response = model.generate_content(user_message)

        # Safely access the response text across SDK versions
        reply = getattr(response, 'text', None)
        if not reply:
            parts = getattr(response, 'parts', None)
            if parts:
                reply = ''.join(getattr(part, 'text', '') for part in parts)
        if not reply:
            reply = "I'm sorry, I couldn't generate a response."

        return jsonify({"reply": reply})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
