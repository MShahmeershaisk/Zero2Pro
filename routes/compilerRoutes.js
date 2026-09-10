const express = require("express");
const router = express.Router();

const compilerController = require("../controllers/compilerController");
const { requireAuth } = require("../controllers/authController");
const { compilerLimiter } = require("../middleware/security");

router.get("/compiler", requireAuth, compilerController.showCompiler);
router.post("/api/run", requireAuth, compilerLimiter, compilerController.runCode);

module.exports = router;