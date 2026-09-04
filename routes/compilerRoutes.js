const express = require("express");
const router = express.Router();

const compilerController = require("../controllers/compilerController");
const { requireAuth } = require("../controllers/authController");

router.get("/compiler", requireAuth, compilerController.showCompiler);
router.post("/api/run", requireAuth, compilerController.runCode);

module.exports = router;