const express = require("express");
const router = express.Router();

const certificateController = require("../controllers/certificateController");
const { requireAuth } = require("../controllers/authController");

router.get("/certificates", requireAuth, certificateController.certificates);

module.exports = router;