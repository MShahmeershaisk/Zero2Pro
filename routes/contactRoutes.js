const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contactController");
const { requireAdmin } = require("../controllers/authController");
const { contactLimiter } = require("../middleware/security");

// Public: contact form
router.get("/contact", contactController.getContactPage);
router.post("/contact", contactLimiter, contactController.submitContact);

// Admin: reply to a message (messenger thread lives on the /admin dashboard)
router.post("/admin/message/:id/reply", requireAdmin, contactController.adminReply);

module.exports = router;
