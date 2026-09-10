const express = require("express");
const router = express.Router();

const aiController = require("../controllers/aiController");
const { requireAuth } = require("../controllers/authController");
const { aiLimiter } = require("../middleware/security");

router.post("/api/ai/chat", requireAuth, aiLimiter, aiController.chatWithAI);

module.exports = router;