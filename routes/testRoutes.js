const express = require("express");
const router = express.Router();

const testController = require("../controllers/testController");
const { requireAuth } = require("../controllers/authController");

router.get("/test", requireAuth, testController.listTests);
router.get("/test/:id", requireAuth, testController.startTest);
router.post("/api/test/:id/submit", requireAuth, testController.submitTest);

module.exports = router;
