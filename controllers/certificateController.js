const User = require("../models/user");

// /certificates page — user ke earned certificates dikhata hai.
// Agar koi language ka test pass nahi kiya, to certificates array empty
// hoga aur page par "no certificate" message aayega.
async function certificates(req, res) {
  try {
    const user = await User.findById(req.session.user.id);
    if (!user) return res.redirect("/login");

    // Sabse naye certificate pehle dikhane ke liye (reverse chronological)
    const list = (user.certificates || []).slice().sort((a, b) => new Date(b.earnedAt) - new Date(a.earnedAt));

    res.render("certificates/certificates", {
      user,
      certificates: list,
      error: null,
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