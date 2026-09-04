const User = require("../models/user");

async function profile(req, res) {
  try {
    const currentUser = await User.findById(req.session.user.id);
    if (!currentUser) return res.redirect("/login");

    res.render("user/profile", { profile: currentUser, error: null });
  } catch (err) {
    console.error(err);
    res.status(500).render("user/profile", { profile: null, error: "Failed to load profile." });
  }
}

module.exports = {
  profile,
};
