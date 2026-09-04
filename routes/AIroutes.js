const express = require("express");
const router = express.Router();

const aiController = require("../controllers/aiController");
const { requireAuth } = require("../controllers/authController");

router.post("/api/ai/chat", requireAuth, aiController.chatWithAI);

module.exports = router;