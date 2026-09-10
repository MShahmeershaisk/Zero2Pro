const { OAuth2Client } = require("google-auth-library");
const User = require("../models/user");

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

async function googleLogin(req, res) {
  try {
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ success: false, message: "No credential provided." });
    }

    // Verify the Google JWT token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    if (!email) {
      return res.status(400).json({ success: false, message: "Google account has no email." });
    }

    // Check if user already exists (by googleId or email)
    let user = await User.findOne({ $or: [{ googleId }, { email }] });

    if (user) {
      // Update existing user with Google info if not already set
      if (!user.googleId) {
        user.googleId = googleId;
        if (picture && !user.avatar) user.avatar = picture;
        await user.save();
      }
    } else {
      // Create new user — no password needed for Google users
      user = await User.create({
        name: name || email.split("@")[0],
        email,
        googleId,
        avatar: picture || "",
        password: null, // No password for Google-authenticated users
      });
    }

    // Set session
    req.session.regenerate(() => {
      req.session.user = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      };
      res.json({ success: true, redirect: "/" });
    });
  } catch (err) {
    console.error("Google auth error:", err);
    res.status(401).json({ success: false, message: "Google authentication failed. Please try again." });
  }
}

module.exports = { googleLogin };
