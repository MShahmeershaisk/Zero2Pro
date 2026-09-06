const express = require("express");
const router = express.Router();

const homeController = require("../controllers/homeController");
const tutorialController = require("../controllers/tutorialController");
const { requireAuth, requireAdmin } = require("../controllers/authController");

// Public landing page
router.get("/", homeController.landing);

// Tutorials browse page (any logged-in user)
router.get("/tutorials", requireAuth, tutorialController.listTutorials);

// Tutorial management dashboard (admin only)
router.get("/home", requireAdmin, tutorialController.dashboard);

// Tutorial management actions (admin only)
router.post("/home/add", requireAdmin, tutorialController.addTutorial);
router.post("/home/delete/:id", requireAdmin, tutorialController.deleteTutorial);
router.post("/home/edit/:id", requireAdmin, tutorialController.editTutorial);

module.exports = router;
