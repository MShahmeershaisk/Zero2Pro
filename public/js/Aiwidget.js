// Floating AI Chat Widget
// - Har page pe dikhta hai, SIRF /test wale page pe hide ho jaata hai.
// - Bubble button click karke chat panel khulta hai.
// - Panel ke andar X (close) button se band ho jaata hai, bubble button wapas
//   reh jaata hai jisse dobara khola ja sakta hai.
// - Backend /api/ai/chat endpoint ko call karta hai (Gemini API server-side hai).

(function () {
  // ---- 1. Test page par widget bilkul mount hi nahi hoga ----
  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  if (path === "/test" || path.startsWith("/test/")) {
    return;
  }

  // ---- 2. Styles inject karo ----
  const style = document.createElement("style");
  style.textContent = `
    #ai-widget-btn {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 58px;
      height: 58px;
      border-radius: 50%;
      background: linear-gradient(135deg, #4f8cff, #6a5cff);
      color: #fff;
      border: none;
      box-shadow: 0 4px 14px rgba(0,0,0,0.25);
      cursor: pointer;
      font-size: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 99998;
      transition: transform 0.15s ease;
    }
    #ai-widget-btn:hover { transform: scale(1.07); }

    #ai-widget-panel {
      position: fixed;
      bottom: 96px;
      right: 24px;
      width: 340px;
      max-width: calc(100vw - 32px);
      height: 460px;
      max-height: calc(100vh - 140px);
      background: #fff;
      border-radius: 14px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.25);
      display: none;
      flex-direction: column;
      overflow: hidden;
      z-index: 99999;
      font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
    }
    #ai-widget-panel.open { display: flex; }

    #ai-widget-header {
      background: linear-gradient(135deg, #4f8cff, #6a5cff);
      color: #fff;
      padding: 12px 14px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-weight: 600;
      font-size: 15px;
    }
    #ai-widget-close {
      background: rgba(255,255,255,0.2);
      border: none;
      color: #fff;
      width: 26px;
      height: 26px;
      border-radius: 50%;
      cursor: pointer;
      font-size: 15px;
      line-height: 1;
    }
    #ai-widget-close:hover { background: rgba(255,255,255,0.35); }

    #ai-widget-messages {
      flex: 1;
      overflow-y: auto;
      padding: 12px;
      background: #f5f7fb;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .ai-msg {
      max-width: 85%;
      padding: 8px 12px;
      border-radius: 12px;
      font-size: 14px;
      line-height: 1.4;
      white-space: pre-wrap;
      word-wrap: break-word;
    }
    .ai-msg.user {
      align-self: flex-end;
      background: #4f8cff;
      color: #fff;
      border-bottom-right-radius: 2px;
    }
    .ai-msg.bot {
      align-self: flex-start;
      background: #fff;
      color: #222;
      border: 1px solid #e2e5ee;
      border-bottom-left-radius: 2px;
    }
    .ai-msg.typing { color: #888; font-style: italic; }

    #ai-widget-inputRow {
      display: flex;
      gap: 6px;
      padding: 10px;
      border-top: 1px solid #eee;
      background: #fff;
    }
    #ai-widget-input {
      flex: 1;
      resize: none;
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 8px 10px;
      font-size: 14px;
      font-family: inherit;
      max-height: 80px;
    }
    #ai-widget-send {
      background: #4f8cff;
      color: #fff;
      border: none;
      border-radius: 8px;
      padding: 0 14px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
    }
    #ai-widget-send:disabled { opacity: 0.6; cursor: default; }
  `;
  document.head.appendChild(style);

  // ---- 3. Bubble button ----
  const btn = document.createElement("button");
  btn.id = "ai-widget-btn";
  btn.title = "AI Assistant";
  btn.textContent = "AI";
  document.body.appendChild(btn);

  // ---- 4. Chat panel ----
  const panel = document.createElement("div");
  panel.id = "ai-widget-panel";
  panel.innerHTML = `
    <div id="ai-widget-header">
      <span>🤖 AI Assistant</span>
      <button id="ai-widget-close" title="Band karein">✕</button>
    </div>
    <div id="ai-widget-messages"></div>
    <div id="ai-widget-inputRow">
      <textarea id="ai-widget-input" rows="1" placeholder="Ask Pro AI..."></textarea>
      <button id="ai-widget-send">Send</button>
    </div>
  `;
  document.body.appendChild(panel);

  const messagesEl = panel.querySelector("#ai-widget-messages");
  const inputEl = panel.querySelector("#ai-widget-input");
  const sendBtn = panel.querySelector("#ai-widget-send");
  const closeBtn = panel.querySelector("#ai-widget-close");

  let history = [];
  let welcomed = false;

  function addMessage(role, text) {
    const div = document.createElement("div");
    div.className = "ai-msg " + (role === "user" ? "user" : "bot");
    div.textContent = text;
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return div;
  }

  function openPanel() {
    panel.classList.add("open");
    if (!welcomed) {
      addMessage("bot", "Paste your error here to debug");
      welcomed = true;
    }
    inputEl.focus();
  }

  function closePanel() {
    panel.classList.remove("open");
  }

  btn.addEventListener("click", () => {
    if (panel.classList.contains("open")) {
      closePanel();
    } else {
      openPanel();
    }
  });

  closeBtn.addEventListener("click", closePanel);

  async function sendMessage() {
    const text = inputEl.value.trim();
    if (!text) return;

    addMessage("user", text);
    history.push({ role: "user", text });
    inputEl.value = "";
    sendBtn.disabled = true;

    const typingEl = addMessage("bot", "Type kar raha hai...");
    typingEl.classList.add("typing");

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history }),
      });
      const data = await res.json();

      typingEl.remove();

      if (data.success) {
        addMessage("bot", data.reply);
        history.push({ role: "assistant", text: data.reply });
      } else {
        addMessage("bot", data.reply || "Kuch masla ho gaya, dobara try karein.");
      }
    } catch (err) {
      typingEl.remove();
      addMessage("bot", "Error: " + err.message);
    } finally {
      sendBtn.disabled = false;
    }
  }

  sendBtn.addEventListener("click", sendMessage);
  inputEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
})();