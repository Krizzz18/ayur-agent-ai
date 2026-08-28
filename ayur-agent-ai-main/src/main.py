import os
import joblib
import numpy as np
import google.generativeai as genai
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Load env from project root and from src dir (handles both python src/main.py and flask run)
load_dotenv()
# also try parent dir .env if running from src/
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

app = Flask(__name__)
# Allow all origins for local dev; tighten in production via env var if needed
CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=False)

# Load ML model for dosha prediction
MODEL_DIR = os.path.join(os.path.dirname(__file__), 'models')
try:
    dosha_model = joblib.load(os.path.join(MODEL_DIR, 'ayuragent_model.joblib'))
    scaler = joblib.load(os.path.join(MODEL_DIR, 'scaler.joblib'))
    le_dosha = joblib.load(os.path.join(MODEL_DIR, 'le_dosha.joblib'))
    MODEL_LOADED = True
except Exception as e:
    print(f"Warning: Could not load ML models: {e}")
    dosha_model = None
    scaler = None
    le_dosha = None
    MODEL_LOADED = False

# Read Gemini API key — try GEMINI_API_KEY then fallback to VITE_GEMINI_API_KEY for DX
# (frontend .env currently uses VITE_GEMINI_API_KEY)
api_key = os.getenv("GEMINI_API_KEY") or os.getenv("VITE_GEMINI_API_KEY")

if not api_key or len(api_key) < 20:
    print("WARNING: GEMINI_API_KEY not set or invalid. /api/chat will return 503 until configured.")
    print("  Set GEMINI_API_KEY (or VITE_GEMINI_API_KEY) in .env — get one at https://aistudio.google.com/app/apikey")
    model = None
else:
    try:
        genai.configure(api_key=api_key)
        # Prefer stable model; fallback handled per-request if this name is unavailable
        model = genai.GenerativeModel('gemini-1.5-flash')
    except Exception as e:
        print(f"Failed to configure Gemini: {e}")
        model = None

@app.route('/api/health', methods=['GET'])
@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        "status": "ok",
        "model_loaded": MODEL_LOADED,
        "gemini_configured": model is not None,
        "gemini_key_present": bool(api_key and len(api_key) >= 20)
    })

@app.route('/api/predict-dosha', methods=['POST'])
def predict_dosha():
    try:
        if not MODEL_LOADED:
            return jsonify({"error": "ML model not loaded"}), 503
        
        data = request.get_json(force=True, silent=True) or {}
        quiz_responses = data.get('quiz_responses')
        
        if not quiz_responses or not isinstance(quiz_responses, list):
            return jsonify({"error": "quiz_responses array is required"}), 400
        
        # Convert quiz responses to feature array
        features = np.array(quiz_responses).reshape(1, -1)
        
        # Scale features
        features_scaled = scaler.transform(features)
        
        # Predict
        prediction = dosha_model.predict(features_scaled)[0]
        try:
            probabilities = dosha_model.predict_proba(features_scaled)[0]
        except Exception:
            probabilities = np.array([0.33, 0.33, 0.34])
        
        # Convert to label
        dosha_label = le_dosha.inverse_transform([prediction])[0]
        
        # Get confidence scores
        try:
            confidence_scores = {
                le_dosha.inverse_transform([i])[0]: round(float(prob), 3)
                for i, prob in enumerate(probabilities)
            }
            max_prob = float(max(probabilities))
        except Exception:
            confidence_scores = {str(dosha_label): 1.0}
            max_prob = 1.0
        
        return jsonify({
            "dosha": dosha_label,
            "confidence": round(max_prob, 3),
            "confidence_scores": confidence_scores,
            "model_used": "ayuragent_model.joblib"
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/chat', methods=['POST', 'OPTIONS'])
def chat():
    # Handle preflight
    if request.method == 'OPTIONS':
        return jsonify({"ok": True}), 200
    try:
        if model is None:
            return jsonify({"error": "GEMINI_API_KEY not configured on server. Set GEMINI_API_KEY in .env and restart Flask backend."}), 503

        data = request.get_json(force=True, silent=True) or {}
        user_message = (data.get('message') or '').strip()
        system_instruction = (data.get('systemInstruction') or data.get('system_instruction') or '').strip()

        if not user_message:
            return jsonify({"error": "Message is required"}), 400

        # Build prompt: system instruction as prefix (SDK version without systemInstruction support)
        # If SDK supports systemInstruction in model, we already use it via model init, but we also
        # prepend for maximum compatibility.
        full_prompt = f"{system_instruction}\n\nUser: {user_message}\n\nAssistant (respond as expert Ayurvedic doctor):" if system_instruction else user_message

        # Try configured model, fallback to gemini-2.5-flash if 1.5 fails
        response = None
        last_err = None
        for model_name in ['gemini-1.5-flash', 'gemini-2.5-flash', 'gemini-pro']:
            try:
                try_model = genai.GenerativeModel(model_name, system_instruction=system_instruction) if system_instruction else genai.GenerativeModel(model_name)
                response = try_model.generate_content(full_prompt if not system_instruction else user_message)
                break
            except Exception as e:
                last_err = e
                # If API key invalid / quota, don't retry other models
                msg = str(e).lower()
                if 'api_key_invalid' in msg or 'api key not valid' in msg or 'permission_denied' in msg or 'quota' in msg or 'resource_exhausted' in msg:
                    raise
                continue
        if response is None:
            raise last_err or Exception("No model succeeded")

        # Safely access the response text across SDK versions
        reply = None
        try:
            reply = getattr(response, 'text', None)
            # .text can be property that raises if blocked
            if callable(reply):
                reply = reply()
            if reply:
                reply = str(reply).strip()
        except Exception:
            reply = None
        if not reply:
            # Try candidates path
            try:
                candidates = getattr(response, 'candidates', None)
                if candidates and len(candidates) > 0:
                    parts = getattr(candidates[0].content, 'parts', []) if hasattr(candidates[0], 'content') else []
                    if parts:
                        reply = ''.join(getattr(part, 'text', '') or '' for part in parts).strip()
            except Exception:
                pass
        if not reply:
            # Try direct parts
            try:
                parts = getattr(response, 'parts', None)
                if parts:
                    reply = ''.join(getattr(part, 'text', '') or '' for part in parts).strip()
            except Exception:
                pass
        # Check for blocked / safety
        if not reply:
            try:
                prompt_feedback = getattr(response, 'prompt_feedback', None)
                if prompt_feedback and getattr(prompt_feedback, 'block_reason', None):
                    return jsonify({"error": f"Response blocked by safety filter: {prompt_feedback.block_reason}"}), 400
            except Exception:
                pass
            reply = "I'm sorry, I couldn't generate a response. Please rephrase your question."

        return jsonify({"reply": reply})
    except Exception as e:
        msg = str(e)
        # Map known Gemini errors to clearer messages + appropriate HTTP codes
        lower = msg.lower()
        if 'api_key_invalid' in lower or 'api key not valid' in lower:
            return jsonify({"error": "API_KEY_INVALID: Gemini API key is invalid. Check GEMINI_API_KEY in .env"}), 401
        if 'permission_denied' in lower or 'permission denied' in lower:
            return jsonify({"error": "PERMISSION_DENIED: API key lacks permission for this model"}), 403
        if 'resource_exhausted' in lower or 'quota' in lower or '429' in msg:
            return jsonify({"error": "RESOURCE_EXHAUSTED: Gemini quota exceeded. Try again later."}), 429
        return jsonify({"error": msg}), 500

if __name__ == '__main__':
    port = int(os.getenv("PORT", "5000"))
    print(f"Starting Flask on 0.0.0.0:{port} — health: http://localhost:{port}/api/health")
    app.run(host="0.0.0.0", port=port, debug=True)
