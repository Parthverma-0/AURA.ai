"""
============================================================
  AURA AI - BACKEND SERVER (WINDOWS)
============================================================

CORE IDEAS (UNCHANGED):
- Flask backend
- Gemini handles conversation
- Python handles system control
- Frontend triggers system actions

WHAT IS FIXED:
- App vs Website routing
- Browser fallback for unknown apps
- Single, consistent system_action contract
============================================================
"""

from flask import Flask, request, jsonify, send_from_directory
import google.generativeai as genai
import subprocess, os, re
from dotenv import load_dotenv
from datetime import datetime

# ================= ENV SETUP =================
load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

MODEL = genai.GenerativeModel("models/gemini-2.5-flash")
app = Flask(__name__)

# ================= WINDOWS APP MAP =================
# Apps that actually exist on the system
WINDOWS_APPS = {
    "chrome": "chrome.exe",
    "google chrome": "chrome.exe",
    "edge": "msedge.exe",
    "firefox": "firefox.exe",
    "spotify": "Spotify.exe",
    "vscode": "Code.exe",
    "visual studio code": "Code.exe",
    "notepad": "notepad.exe",
    "calculator": "calc.exe",
    "file explorer": "explorer.exe"
}

# ================= WEBSITE MAP =================
# Known websites → open in browser
WEBSITES = {
    "youtube": "https://www.youtube.com",
    "gmail": "https://mail.google.com",
    "google": "https://www.google.com",
    "instagram": "https://www.instagram.com",
    "facebook": "https://www.facebook.com",
    "twitter": "https://twitter.com",
    "x": "https://x.com",
    "github": "https://github.com",
    "linkedin": "https://www.linkedin.com"
}

# ================= HELPERS =================
def open_app(exe):
    """Open a Windows application"""
    subprocess.Popen(exe, shell=True)

def close_app(exe):
    """Close a Windows application"""
    subprocess.run(
        ["taskkill", "/F", "/IM", exe],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL
    )

def open_url(url):
    """Open a URL in default browser"""
    subprocess.Popen(["start", url], shell=True)

def detect_system_action(message: str):
    """
    Detects whether user wants to:
    - open/close an app
    - open a website
    - fallback to browser search
    """
    msg = message.lower()

    if not any(w in msg for w in ["open", "launch", "start", "close", "quit"]):
        return None

    is_open = any(w in msg for w in ["open", "launch", "start"])
    is_close = any(w in msg for w in ["close", "quit"])

    # 1️⃣ Installed apps
    for name, exe in WINDOWS_APPS.items():
        if name in msg:
            return {
                "type": "app",
                "action": "open" if is_open else "close",
                "exe": exe,
                "name": name
            }

    # 2️⃣ Known websites
    for site, url in WEBSITES.items():
        if site in msg and is_open:
            return {
                "type": "web",
                "action": "open",
                "url": url,
                "name": site
            }

    # 3️⃣ Fallback → Google search
    if is_open:
        query = re.sub(r"(open|launch|start)", "", msg).strip()
        return {
            "type": "web",
            "action": "open",
            "url": f"https://www.google.com/search?q={query}",
            "name": query
        }

    return None

# ================= ROUTES =================
@app.route("/")
def index():
    return send_from_directory(".", "index.html")

@app.route("/<path:path>")
def static_files(path):
    return send_from_directory(".", path)

@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    message = data.get("message", "")

    system_action = detect_system_action(message)

    prompt = f"""
You are Aura AI, a Windows desktop assistant.
Respond naturally and briefly.
Date: {datetime.now().strftime('%B %d, %Y')}

User: {message}
"""

    try:
        ai_response = MODEL.generate_content(prompt).text.strip()
    except Exception as e:
        app.logger.exception("Model call failed")
        # Return a friendly JSON error so the frontend can show a helpful message
        return jsonify({"response": "Sorry — I can't reach the AI right now. Check your GEMINI_API_KEY and try again."}), 200

    response = {"response": ai_response}
    if system_action:
        response["system_action"] = system_action

    return jsonify(response)

@app.route("/system-control", methods=["POST"])
def system_control():
    action = request.json

    if action["type"] == "app":
        if action["action"] == "open":
            open_app(action["exe"])
        else:
            close_app(action["exe"])
        return jsonify({"success": True})

    if action["type"] == "web":
        open_url(action["url"])
        return jsonify({"success": True})

    return jsonify({"success": False})

if __name__ == "__main__":
    app.run(debug=True)
