const User = require("../models/user");
const { LOGOS } = require("../lib/languages");

// /certificates page — shows the user's earned certificates.
// If the user has not passed a test in any language, the certificates array is
// empty and the page shows a "no certificate" message.
async function certificates(req, res) {
  try {
    const user = await User.findById(req.session.user.id);
    if (!user) return res.redirect("/login");

    // Show the newest certificate first (reverse chronological order)
    const list = (user.certificates || []).slice().sort((a, b) => new Date(b.earnedAt) - new Date(a.earnedAt));

    res.render("certificates/certificates", {
      user,
      certificates: list,
      error: null,
      logos: LOGOS,
    });
  } catch (err) {
    console.error(err);
    res.status(500).render("certificates/certificates", {
      user: null,
      certificates: [],
      error: "Failed to load certificates.",
    });
  }
}

module.exports = {
  certificates,
};