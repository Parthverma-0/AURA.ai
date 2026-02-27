/*
============================================================
  AURA AI ASSISTANT - FRONTEND JAVASCRIPT
============================================================

  PURPOSE:
  --------
  - Handles UI interaction
  - Sends messages to backend
  - Executes system actions (apps + websites)
  - Voice input + TTS
  - Wake word support

  CORE DESIGN (UNCHANGED):
  ------------------------
  - Backend decides WHAT action to perform
  - Frontend ONLY executes system_action if provided
  - No guessing on frontend
============================================================
*/

/* ===================== DOM REFERENCES ===================== */
const chatMessages = document.getElementById("chatMessages");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const micBtn = document.getElementById("micBtn");

const settingsBtn = document.getElementById("settingsBtn");
const settingsModal = document.getElementById("settingsModal");
const closeSettings = document.getElementById("closeSettings");

const personalitySelect = document.getElementById("personalitySelect");
const responseStyleSelect = document.getElementById("responseStyleSelect");
const systemControlToggle = document.getElementById("systemControlToggle");
const wakeWordToggle = document.getElementById("wakeWordToggle");

/* ===================== STATE ===================== */
let personality = localStorage.getItem("personality") || "friendly";
let responseStyle = localStorage.getItem("responseStyle") || "concise";
let systemControlEnabled = localStorage.getItem("systemControlEnabled") !== "false";
let wakeWordEnabled = localStorage.getItem("wakeWordEnabled") !== "false";

personalitySelect.value = personality;
responseStyleSelect.value = responseStyle;
systemControlToggle.checked = systemControlEnabled;
wakeWordToggle.checked = wakeWordEnabled;

/* ===================== CHAT UI ===================== */
function addMessage(text, isUser) {
  const msgDiv = document.createElement("div");
  msgDiv.className = `message ${isUser ? "user" : "ai"}`;
  msgDiv.innerHTML = `<div class="message-content">${text}</div>`;
  chatMessages.appendChild(msgDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

/* ===================== TEXT TO SPEECH ===================== */
function speak(text) {
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1;
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
}

/* ===================== SYSTEM ACTION EXECUTION ===================== */
/*
  IMPORTANT:
  ----------
  Backend sends system_action in ONE consistent format:
  {
    type: "app" | "web",
    action: "open" | "close",
    exe?: "...",
    url?: "...",
    name: "..."
  }

  Frontend must forward it AS-IS.
*/
async function executeSystemAction(systemAction) {
  if (!systemControlEnabled) return;

  console.log("Executing system action:", systemAction);

  try {
    await fetch("/system-control", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(systemAction) // 🔑 DO NOT MODIFY SHAPE
    });
  } catch (err) {
    console.error("System control failed:", err);
  }
}

/* ===================== SEND MESSAGE ===================== */
async function sendMessage() {
  const msg = messageInput.value.trim();
  if (!msg) return;

  // Show user message
  addMessage(msg, true);
  messageInput.value = "";

  try {
    const res = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: msg,
        personality: personality,
        response_style: responseStyle,
        system_control: systemControlEnabled
      })
    });

    const data = await res.json();

    // Execute system action FIRST (real-world action)
    if (data.system_action && data.system_action.type) {
      executeSystemAction(data.system_action);
    }

    // Show AI response
    addMessage(data.response, false);
    speak(data.response);

  } catch (err) {
    console.error("Chat error:", err);
    addMessage("Something went wrong. Try again.", false);
  }
}

/* ===================== EVENTS ===================== */
sendBtn.onclick = sendMessage;

messageInput.onkeydown = (e) => {
  if (e.key === "Enter") sendMessage();
};

/* ===================== SETTINGS ===================== */
settingsBtn.onclick = () => {
  settingsModal.style.display = "block";
};

closeSettings.onclick = () => {
  settingsModal.style.display = "none";
};

personalitySelect.onchange = () => {
  personality = personalitySelect.value;
  localStorage.setItem("personality", personality);
};

responseStyleSelect.onchange = () => {
  responseStyle = responseStyleSelect.value;
  localStorage.setItem("responseStyle", responseStyle);
};

systemControlToggle.onchange = () => {
  systemControlEnabled = systemControlToggle.checked;
  localStorage.setItem("systemControlEnabled", systemControlEnabled);
};

wakeWordToggle.onchange = () => {
  wakeWordEnabled = wakeWordToggle.checked;
  localStorage.setItem("wakeWordEnabled", wakeWordEnabled);
};

/* ===================== VOICE INPUT (BASIC) ===================== */
let recognition = null;

if ("webkitSpeechRecognition" in window) {
  recognition = new webkitSpeechRecognition();
  recognition.lang = "en-US";
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onresult = (e) => {
    const transcript = e.results[0][0].transcript;
    messageInput.value = transcript;
    sendMessage();
  };

  recognition.onerror = (e) => {
    console.error("Speech recognition error:", e);
  };
}

micBtn.onclick = () => {
  if (recognition) {
    recognition.start();
  }
};

/* ===================== WAKE WORD (OPTIONAL) ===================== */
/*
  NOTE:
  -----
  Wake word UI + toggle already exist.
  For true wake-word detection, browser limitations apply.
  Current setup keeps architecture intact without breaking core flow.
*/
