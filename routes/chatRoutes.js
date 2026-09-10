const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");
const { requireAuth } = require("../controllers/authController");
const { chatLimiter } = require("../middleware/security");

// Chat page
router.get("/chat", requireAuth, chatController.getChatPage);

// API endpoints
router.get("/api/chat/messages", requireAuth, chatController.getMessages);
router.get("/api/chat/conversation/:id", requireAuth, chatController.getConversation);
router.post("/api/chat/reply/:id", requireAuth, chatLimiter, chatController.sendReply);
router.post("/api/chat/send", requireAuth, chatLimiter, chatController.sendNewMessage);

module.exports = router;
