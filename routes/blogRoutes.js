const express = require("express");
const router = express.Router();

const blogController = require("../controllers/blogController");

// Public blog routes
router.get("/blog", blogController.listPosts);
router.get("/blog/tag/:tag", blogController.postsByTag);
router.get("/blog/:slug", blogController.viewPost);

module.exports = router;
