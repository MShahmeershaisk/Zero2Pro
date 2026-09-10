const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");
const { requireAdmin } = require("../controllers/authController");

router.get("/admin", requireAdmin, adminController.dashboard);
router.post("/admin/user/:id/role", requireAdmin, adminController.updateUserRole);
router.post("/admin/user/:id/delete", requireAdmin, adminController.deleteUser);
router.post("/admin/user/:id/edit", requireAdmin, adminController.editUser);
router.post("/admin/user/:id/password", requireAdmin, adminController.resetUserPassword);
router.post("/admin/tutorial/:id/delete", requireAdmin, adminController.deleteTutorial);

// Blog management
router.post("/admin/blog", requireAdmin, adminController.createBlog);
router.post("/admin/blog/:id/update", requireAdmin, adminController.updateBlog);
router.post("/admin/blog/:id/delete", requireAdmin, adminController.deleteBlog);
router.post("/admin/blog/:id/toggle", requireAdmin, adminController.toggleBlogPublish);

module.exports = router;
