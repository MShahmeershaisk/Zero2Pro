const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { googleLogin } = require("../controllers/googleAuthController");
const { authLimiter } = require("../middleware/security");

router.get("/signup", authController.getSignup);
router.post("/signup", authLimiter, authController.postSignup);

router.get("/login", authController.getLogin);
router.post("/login", authLimiter, authController.postLogin);

// POST only: a GET logout is a CSRF vector (an <img> tag could log users out).
router.post("/logout", authController.logout);

// Google Social Login
router.post("/api/auth/google", googleLogin);

// Forgot / Reset Password
router.get("/forgot-password", authController.getForgotPassword);
router.post("/forgot-password", authLimiter, authController.postForgotPassword);
router.get("/reset-password/:token", authController.getResetPassword);
router.post("/reset-password/:token", authLimiter, authController.postResetPassword);

module.exports = router;
