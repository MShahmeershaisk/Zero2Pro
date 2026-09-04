const User = require("../models/user");
const Home = require("../models/home");

async function dashboard(req, res) {
  try {
    const [users, tutorials] = await Promise.all([
      User.find().sort({ createdAt: -1 }),
      Home.find().sort({ createdAt: -1 }),
    ]);
    res.render("admin/dashboard", {
      users,
      tutorials,
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

module.exports = {
  dashboard,
  updateUserRole,
  deleteUser,
  deleteTutorial,
};