// AI Chat Controller — Gemini API ko server-side call karta hai,
// taake API key kabhi bhi browser/frontend mein expose na ho.

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = "gemini-flash-latest"; // hamesha latest stable Flash model istemal karta hai
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

// Simple in-memory history store, session ke hisaab se (optional, per user)
// Agar aapko history rakhni ho to req.session.aiHistory use kar sakte ho.

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Gemini kabhi kabhi 503 (high demand / temporarily overloaded) deta hai.
// Yeh temporary hota hai, isliye chhoti si delay ke saath 2 baar dobara try karo.
async function callGeminiWithRetry(url, body, attempts = 3) {
  let lastData = null;
  for (let i = 0; i < attempts; i++) {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await response.json();

    if (response.ok) {
      return { ok: true, data };
    }

    lastData = data;
    const status = data && data.error && data.error.status;
    const isRetryable = status === "UNAVAILABLE" || (response.status === 503) || (response.status === 429);

    if (!isRetryable || i === attempts - 1) {
      return { ok: false, data, status: response.status };
    }

    // Har retry se pehle thoda zyada wait karo (1s, phir 2s)
    await sleep((i + 1) * 1000);
  }
  return { ok: false, data: lastData, status: 503 };
}

async function chatWithAI(req, res) {
  try {
    if (!GEMINI_API_KEY) {
      return res.status(500).json({
        success: false,
        reply: "Server error: GEMINI_API_KEY set nahi hai. .env file mein GEMINI_API_KEY=your_key_here daalein.",
      });
    }

    const { message, history } = req.body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ success: false, reply: "Message khaali nahi ho sakta." });
    }

    // Pichli history (agar frontend ne bheji ho) ko Gemini ke format mein convert karo
    const contents = [];

    if (Array.isArray(history)) {
      for (const turn of history) {
        if (!turn || !turn.role || !turn.text) continue;
        contents.push({
          role: turn.role === "assistant" ? "model" : "user",
          parts: [{ text: String(turn.text) }],
        });
      }
    }

    contents.push({ role: "user", parts: [{ text: message }] });

    const response = await callGeminiWithRetry(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
      contents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 800,
      },
    });

    if (!response.ok) {
      console.error("Gemini API error:", response.data);
      const errMsg = (response.data && response.data.error && response.data.error.message) || "Unknown error from Gemini API";
      const friendlyMsg =
        response.status === 503
          ? "AI abhi busy hai (high demand), thodi der baad dobara try karein."
          : "AI se jawab nahi mil saka: " + errMsg;
      return res.status(502).json({ success: false, reply: friendlyMsg });
    }

    const data = response.data;

    const reply =
      data &&
      data.candidates &&
      data.candidates[0] &&
      data.candidates[0].content &&
      data.candidates[0].content.parts &&
      data.candidates[0].content.parts[0] &&
      data.candidates[0].content.parts[0].text;

    if (!reply) {
      return res.json({ success: true, reply: "(AI ne koi jawab nahi diya, dobara try karein)" });
    }

    res.json({ success: true, reply: reply.trim() });
  } catch (err) {
    console.error("AI chat error:", err);
    res.status(500).json({ success: false, reply: "Server error: " + err.message });
  }
}

module.exports = {
  chatWithAI,
};