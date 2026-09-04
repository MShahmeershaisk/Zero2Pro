const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const { requireAuth } = require("../controllers/authController");

router.get("/profile", requireAuth, userController.profile);

module.exports = router;
