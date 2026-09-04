const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");
const { requireAdmin } = require("../controllers/authController");

router.get("/admin", requireAdmin, adminController.dashboard);
router.post("/admin/user/:id/role", requireAdmin, adminController.updateUserRole);
router.post("/admin/user/:id/delete", requireAdmin, adminController.deleteUser);
router.post("/admin/tutorial/:id/delete", requireAdmin, adminController.deleteTutorial);

module.exports = router;
