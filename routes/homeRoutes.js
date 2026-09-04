const express = require("express");
const router = express.Router();

const homeController = require("../controllers/homeController");
const tutorialController = require("../controllers/tutorialController");
const { requireAuth } = require("../controllers/authController");

// Public landing page
router.get("/", homeController.landing);

// Tutorials dashboard (logged-in users only)
router.get("/home", requireAuth, tutorialController.dashboard);
router.post("/home/add", requireAuth, tutorialController.addTutorial);
router.post("/home/delete/:id", requireAuth, tutorialController.deleteTutorial);
router.post("/home/edit/:id", requireAuth, tutorialController.editTutorial);

module.exports = router;
