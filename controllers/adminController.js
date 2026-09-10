const User = require("../models/user");
const Home = require("../models/home");
const Blog = require("../models/blog");
const Contact = require("../models/contact");
const sanitizeContent = require("../lib/sanitize");

async function dashboard(req, res) {
  try {
    // .lean() returns plain JS objects (no Mongoose document overhead) and
    // projections avoid pulling heavy fields (tutorial sections, blog bodies)
    // that the admin table never displays.
    const [users, tutorials, blogs, messages] = await Promise.all([
      User.find().sort({ createdAt: -1 }).select("name email role password createdAt").lean(),
      Home.find().sort({ createdAt: -1 }).select("title category createdAt").lean(),
      Blog.find().sort({ createdAt: -1 }).select("title excerpt tags published views createdAt").lean(),
      Contact.find().sort({ createdAt: -1 }).lean(),
    ]);
    res.render("admin/dashboard", {
      users,
      tutorials,
      blogs,
      messages,
      error: req.session.flash?.error || null,
      message: req.session.flash?.message || null,
    });
    // Clear flash after rendering
    delete req.session.flash;
  } catch (err) {
    console.error(err);
    res.status(500).render("admin/dashboard", {
      users: [],
      tutorials: [],
      blogs: [],
      messages: [],
      error: "Failed to load admin data.",
      message: null,
    });
  }
}

async function updateUserRole(req, res) {
  try {
    const { id } = req.params;
    const target = await User.findById(id);
    if (!target) return res.redirect("/admin");

    // Admins cannot change their own role to prevent locking everyone out
    if (String(target._id) === String(req.session.user.id)) {
      return res.redirect("/admin");
    }

    target.role = target.role === "admin" ? "user" : "admin";
    await target.save();
    req.session.flash = {
      message: `${target.name} is now ${target.role === "admin" ? "an admin" : "a regular user"}.`,
    };
    res.redirect("/admin");
  } catch (err) {
    console.error(err);
    req.session.flash = { error: "Failed to update user role." };
    res.redirect("/admin");
  }
}

async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    const target = await User.findById(id);
    if (!target) {
      req.session.flash = { error: "User not found." };
      return res.redirect("/admin");
    }

    // Prevent admins from deleting their own account
    if (String(target._id) === String(req.session.user.id)) {
      req.session.flash = { error: "You cannot delete your own account." };
      return res.redirect("/admin");
    }

    // Prevent deleting the last remaining admin (avoids locking everyone out)
    if (target.role === "admin") {
      const adminCount = await User.countDocuments({ role: "admin" });
      if (adminCount <= 1) {
        req.session.flash = { error: "You cannot delete the last admin account." };
        return res.redirect("/admin");
      }
    }

    await User.findByIdAndDelete(target._id);
    req.session.flash = { message: `Deleted user ${target.name} (${target.email}).` };
    res.redirect("/admin");
  } catch (err) {
    console.error(err);
    req.session.flash = { error: "Failed to delete user." };
    res.redirect("/admin");
  }
}

async function deleteTutorial(req, res) {
  try {
    await Home.findByIdAndDelete(req.params.id);
    req.session.flash = { message: "Tutorial deleted." };
    res.redirect("/admin");
  } catch (err) {
    console.error(err);
    req.session.flash = { error: "Failed to delete tutorial." };
    res.redirect("/admin");
  }
}

// ---------- Blog CRUD ----------

async function createBlog(req, res) {
  try {
    const { title, excerpt, content, author, tags, featuredImage, published } = req.body;
    if (!title || !content) {
      req.session.flash = { error: "Title and content are required." };
      return res.redirect("/admin");
    }
    await Blog.create({
      title: title.trim(),
      excerpt: (excerpt || "").trim(),
      // Write-time sanitization: scripts/event handlers never even reach the DB
      content: sanitizeContent(content),
      author: (author || "Zero to Pro Team").trim(),
      tags: tags ? tags.split(",").map(t => t.trim()).filter(Boolean) : [],
      featuredImage: (featuredImage || "").trim(),
      published: published === "on" || published === "true",
    });
    req.session.flash = { message: "Blog post created." };
    res.redirect("/admin");
  } catch (err) {
    console.error("Create blog error:", err);
    req.session.flash = { error: "Failed to create blog post." };
    res.redirect("/admin");
  }
}

async function updateBlog(req, res) {
  try {
    const { title, excerpt, content, author, tags, featuredImage, published } = req.body;
    const post = await Blog.findById(req.params.id);
    if (!post) {
      req.session.flash = { error: "Post not found." };
      return res.redirect("/admin");
    }
    post.title = (title || post.title).trim();
    post.excerpt = (excerpt || "").trim();
    post.content = content ? sanitizeContent(content) : post.content;
    post.author = (author || post.author).trim();
    post.tags = tags ? tags.split(",").map(t => t.trim()).filter(Boolean) : post.tags;
    post.featuredImage = (featuredImage || "").trim();
    post.published = published === "on" || published === "true";
    await post.save();
    req.session.flash = { message: "Blog post updated." };
    res.redirect("/admin");
  } catch (err) {
    console.error("Update blog error:", err);
    req.session.flash = { error: "Failed to update blog post." };
    res.redirect("/admin");
  }
}

async function deleteBlog(req, res) {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    req.session.flash = { message: "Blog post deleted." };
    res.redirect("/admin");
  } catch (err) {
    console.error("Delete blog error:", err);
    req.session.flash = { error: "Failed to delete blog post." };
    res.redirect("/admin");
  }
}

async function toggleBlogPublish(req, res) {
  try {
    const post = await Blog.findById(req.params.id);
    if (!post) {
      req.session.flash = { error: "Post not found." };
      return res.redirect("/admin");
    }
    post.published = !post.published;
    await post.save();
    req.session.flash = { message: `Post ${post.published ? "published" : "unpublished"}.` };
    res.redirect("/admin");
  } catch (err) {
    console.error("Toggle blog error:", err);
    req.session.flash = { error: "Failed to toggle post status." };
    res.redirect("/admin");
  }
}

// ---------- User Edit ----------

async function editUser(req, res) {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    if (!name || !name.trim()) {
      return res.json({ success: false, message: "Name is required." });
    }
    if (!email || !email.trim()) {
      return res.json({ success: false, message: "Email is required." });
    }

    const target = await User.findById(id);
    if (!target) {
      return res.json({ success: false, message: "User not found." });
    }

    // Check if email is already taken by another user
    const emailTaken = await User.findOne({ email: email.trim().toLowerCase(), _id: { $ne: id } });
    if (emailTaken) {
      return res.json({ success: false, message: "This email is already taken by another user." });
    }

    target.name = name.trim();
    target.email = email.trim().toLowerCase();
    await target.save();

    res.json({ success: true, message: "User updated successfully." });
  } catch (err) {
    console.error("Edit user error:", err);
    res.status(500).json({ success: false, message: "Failed to update user." });
  }
}

// ---------- Admin Reset User Password ----------

async function resetUserPassword(req, res) {
  try {
    const { id } = req.params;
    const { password } = req.body;

    // Validate password strength
    if (typeof password !== "string" || password.length < 8) {
      return res.json({ success: false, message: "Password must be at least 8 characters." });
    }
    if (!/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/.test(password)) {
      return res.json({ success: false, message: "Password needs at least 1 uppercase, 1 lowercase, and 1 number." });
    }

    const target = await User.findById(id);
    if (!target) {
      return res.json({ success: false, message: "User not found." });
    }

    target.password = password;
    await target.save(); // triggers the pre-save hash hook

    res.json({ success: true, message: "Password updated successfully." });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ success: false, message: "Failed to reset password." });
  }
}

module.exports = {
  dashboard,
  updateUserRole,
  deleteUser,
  deleteTutorial,
  createBlog,
  updateBlog,
  deleteBlog,
  toggleBlogPublish,
  editUser,
  resetUserPassword,
};