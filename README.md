# 🌟 Aura AI — Your Local Desktop AI Assistant

**"Hey Aura, open YouTube."**  
*Aura: opens YouTube in your browser* 😌

Aura AI is a Gemini-powered desktop assistant that runs entirely on your local system. It doesn't just chat—it takes action. No cloud dependencies, no bloated frameworks, no unnecessary complexity. Just Python, Flask, JavaScript, and Gemini working together seamlessly.

---

## 🚀 What Makes Aura AI Different?

Aura AI understands your intent and acts intelligently based on context:

- **`open spotify`** → Launches the Spotify app
- **`open chrome`** → Launches Chrome browser
- **`open vscode`** → Launches Visual Studio Code
- **`open youtube`** → Opens Chrome and navigates to youtube.com
- **`open gmail`** → Opens Gmail in your browser
- **`close spotify`** → Closes the Spotify app

Aura intelligently decides whether to launch an installed application, open a website in your browser, or perform a Google search if the intent is unclear. It behaves like a real assistant should.

---

## 🧠 Architecture Overview

The flow is straightforward and secure:

**User Input** → **Frontend (JavaScript)** → **Backend (Flask)** → **Gemini (Intent Recognition)** → **Python (System Execution)** → **Frontend (Response Display)**

**Important:** Gemini processes language and understands intent, but it never directly controls your system. All system-level actions are handled safely through Python, ensuring security and control.

---

## 🛠️ Technology Stack

- **Backend:** Python + Flask
- **AI Model:** Google Gemini (`models/gemini-2.5-flash`)
- **Frontend:** HTML, CSS, Vanilla JavaScript
- **Voice Input:** Web Speech API
- **Platform:** Windows (currently)

No React. No Electron. No bloat. Just the essentials.

---

## 📁 Project Structure

```
aura-ai/
│
├── main.py          # Flask backend, Gemini integration, system control
├── script.js        # Frontend logic, chat interface, voice input
├── index.html       # User interface
├── style.css        # Styling
├── .env             # API key storage (DO NOT COMMIT)
└── README.md        # Documentation
```

---

## 🔧 Installation & Setup

### Prerequisites

- Python 3.8 or higher
- A Google Gemini API key ([Get one here](https://ai.google.dev/))

### Step 1: Clone the Repository

```bash
git clone https://github.com/your-username/aura-ai.git
cd aura-ai
```

### Step 2: Install Dependencies

```bash
pip install flask python-dotenv google-generativeai
```

### Step 3: Configure Your API Key

Create a `.env` file in the project root:

```env
GEMINI_API_KEY=your_api_key_here
```

**⚠️ Security Note:** Never commit your `.env` file to version control. Add it to `.gitignore`.

### Step 4: Launch Aura AI

```bash
python main.py
```

Open your browser and navigate to:

```
http://localhost:5000
```

Say hello to Aura 👋

---

## 🎙️ Voice Control

1. Click the 🎤 microphone button
2. Speak your command naturally
3. Aura converts speech to text and executes the action

The interface includes a wake-word UI ("Hey Aura"), though true always-on wake word detection is limited by browser API constraints.

---

## 🧪 Example Commands

Here are some commands you can try:

- `open spotify`
- `open youtube`
- `open github`
- `close spotify`
- `who are you`
- `what is today's date`

Aura learns from context and improves over time with better prompting.

---

## ⚠️ Current Limitations

- Windows-only system control (macOS and Linux support planned)
- Requires applications to be installed locally
- Browser-based voice has inherent limitations
- Wake-word detection is UI-based, not always-on

These are all addressable—see the roadmap below.

---

## 🛣️ Roadmap

Future improvements we're considering:

- Auto-detection of installed applications
- Persistent memory across sessions
- Windows system tray integration
- Standalone executable (.exe) for easy distribution
- True always-on wake word detection
- Cross-platform support (macOS, Linux)

---

## 🤝 Contributing

Contributions are welcome! If you have ideas to make Aura smarter or more capable:

1. Fork the repository
2. Create a feature branch
3. Submit a pull request

Feel free to open issues for bugs or feature requests.

---

## 📜 License

This project is licensed under the MIT License. Feel free to use, modify, and distribute it.

---

## ❤️ Philosophy

Aura AI is designed to be:

- **Practical** — It actually does things
- **Hackable** — Easy to understand and modify
- **Local** — Your data stays on your machine
- **Fun** — Because building AI should be enjoyable

If Siri and a hacker's weekend project had a baby, this would be it. 😄

---

## ⭐ Support

If you find Aura AI useful, consider starring the repository! Your support helps the project grow.

**Built with curiosity and code.**
