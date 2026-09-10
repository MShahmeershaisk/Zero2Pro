const rateLimit = require("express-rate-limit");

// ---------- Global Rate Limiter ----------
// 300 requests per 15 minutes per IP. Applies to dynamic routes only
// (static assets are served before this middleware), so a normal browsing
// session stays well under the budget while abuse is still throttled.
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, reply: "Too many requests. Please try again later." },
});

// ---------- AI Chat Rate Limiter ----------
// 10 requests per minute — prevents Gemini API quota exhaustion
const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, reply: "AI is receiving too many requests. Please wait a moment and try again." },
});

// ---------- Compiler Rate Limiter ----------
// 20 requests per minute — prevents server overload from code execution
const compilerLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, output: "Too many code executions. Please wait a moment and try again." },
});

// ---------- Auth (login/signup) Rate Limiter ----------
// 10 attempts per 15 minutes per IP — stops credential stuffing / brute-force
// on accounts without punishing a normal human (who never needs 10 logins in
// a quarter hour).
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many login attempts. Please wait 15 minutes and try again." },
});

// ---------- Contact Form Rate Limiter ----------
// 5 submissions per 15 minutes — prevents spam while allowing a genuine
// user to resubmit if they made a mistake.
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many messages. Please wait 15 minutes before sending again." },
});

// ---------- Chat Rate Limiter ----------
// 30 messages per 15 minutes — a real conversation easily exceeds the 5/15min
// contactLimiter, so the messenger gets its own (still abuse-hard to hit)
// budget instead of blocking active users mid-conversation.
const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many messages sent. Please wait a moment before continuing." },
});

module.exports = { globalLimiter, aiLimiter, compilerLimiter, authLimiter, contactLimiter, chatLimiter };
