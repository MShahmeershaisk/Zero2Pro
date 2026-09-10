const crypto = require("crypto");
const User = require("../models/user");
const PasswordReset = require("../models/passwordReset");
const { sendResetEmail } = require("../lib/mailer");

const PASSWORD_MIN_LENGTH = 8;
const EMAIL_REGEX = /^[^\s@]+@gmail\.com$/i;
const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;

// Login check middleware — protects any route that needs a logged-in user
function requireAuth(req, res, next) {
  if (!req.session.user) return res.redirect("/login");
  next();
}

// Admin check middleware — protects admin-only routes
function requireAdmin(req, res, next) {
  if (!req.session.user) return res.redirect("/login");
  if (req.session.user.role !== "admin") return res.redirect("/");
  next();
}

// Lightweight signup validation — returns an error message, or null if valid.
function validateSignup({ name, email, password, confirmPassword }) {
  if (!name || !name.trim()) return "Name is required.";
  if (!EMAIL_REGEX.test(email || "")) return "Email must be a valid @gmail.com address";
  if (typeof password !== "string" || password.length < PASSWORD_MIN_LENGTH) {
    return `Password must be at least ${PASSWORD_MIN_LENGTH} characters`;
  }
  if (!PASSWORD_REGEX.test(password)) {
    return "Password needs at least 1 uppercase letter, 1 lowercase letter, and 1 number.";
  }
  if (confirmPassword !== undefined && password !== confirmPassword) {
    return "Password and Confirm Password must match";
  }
  return null;
}

function getSignup(req, res) {
  res.render("auth/signup", { error: null });
}

async function postSignup(req, res) {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // Validate before touching the database
    const validationError = validateSignup({ name, email, password, confirmPassword });
    if (validationError) {
      return res.render("auth/signup", { error: validationError });
    }

    // Emails are case-insensitive — normalize so "ABC@gmail.com" and
    // "abc@gmail.com" can't create two separate accounts.
    const normalizedEmail = email.trim().toLowerCase();

    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.render("auth/signup", { error: "Email already registered" });
    }
    const user = new User({ name: name.trim(), email: normalizedEmail, password });
    await user.save();
    req.session.regenerate(() => {
      req.session.user = { id: user._id, name: user.name, email: user.email, role: user.role };
      res.redirect("/"); // Redirect to the Home/Landing page
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.render("auth/signup", { error: "Something went wrong. Try again." });
  }
}

function getLogin(req, res) {
  res.render("auth/login", { error: null, success: null });
}

async function postLogin(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: (email || "").trim().toLowerCase() });
    if (!user) return res.render("auth/login", { error: "Invalid email or password", success: null });

    const match = await user.comparePassword(password);
    if (!match) return res.render("auth/login", { error: "Invalid email or password", success: null });

    req.session.regenerate(() => {
      req.session.user = { id: user._id, name: user.name, email: user.email, role: user.role };
      res.redirect("/"); // Redirect to the Home/Landing page
    });
  } catch (err) {
    console.error(err);
    res.render("auth/login", { error: "Something went wrong. Try again.", success: null });
  }
}

function logout(req, res) {
  req.session.destroy(() => res.redirect("/"));
}

// ---------- Forgot / Reset Password ----------

function getForgotPassword(req, res) {
  res.render("auth/forgot-password", { error: null, success: null });
}

async function postForgotPassword(req, res) {
  try {
    const { email } = req.body;
    if (!email || !email.trim()) {
      return res.render("auth/forgot-password", { error: "Email is required.", success: null });
    }

    // Always show the same message (prevents email enumeration)
    const GENERIC = "If that email exists, a password reset link has been sent. Check your inbox.";

    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      return res.render("auth/forgot-password", { error: null, success: GENERIC });
    }

    // Invalidate any previous unused tokens for this email
    await PasswordReset.deleteMany({ email: user.email, used: false });

    // Create new token (1 hour expiry)
    const token = crypto.randomBytes(32).toString("hex");
    await PasswordReset.create({
      email: user.email,
      token,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    });

    const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`;
    const resetUrl = `${baseUrl}/reset-password/${token}`;

    await sendResetEmail(user.email, resetUrl);

    return res.render("auth/forgot-password", { error: null, success: GENERIC });
  } catch (err) {
    console.error("Forgot password error:", err);
    return res.render("auth/forgot-password", { error: "Something went wrong. Please try again.", success: null });
  }
}

function getResetPassword(req, res) {
  res.render("auth/reset-password", { error: null, token: req.params.token });
}

async function postResetPassword(req, res) {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    const record = await PasswordReset.findOne({ token, used: false });
    if (!record || record.expiresAt < new Date()) {
      return res.render("auth/reset-password", {
        error: "This reset link is invalid or has expired. Please request a new one.",
        token,
      });
    }

    // Validate password
    if (typeof password !== "string" || password.length < PASSWORD_MIN_LENGTH) {
      return res.render("auth/reset-password", {
        error: `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`,
        token,
      });
    }
    if (!PASSWORD_REGEX.test(password)) {
      return res.render("auth/reset-password", {
        error: "Password needs at least 1 uppercase letter, 1 lowercase letter, and 1 number.",
        token,
      });
    }
    if (password !== confirmPassword) {
      return res.render("auth/reset-password", {
        error: "Password and Confirm Password must match.",
        token,
      });
    }

    // Update password and mark token used
    const user = await User.findOne({ email: record.email });
    if (!user) {
      return res.render("auth/reset-password", { error: "Account not found.", token });
    }

    user.password = password;
    await user.save(); // triggers the pre-save hash hook

    record.used = true;
    await record.save();

    return res.render("auth/login", { error: null, success: "Password reset successful! You can now log in with your new password." });
  } catch (err) {
    console.error("Reset password error:", err);
    return res.render("auth/reset-password", { error: "Something went wrong. Please try again.", token: req.params.token });
  }
}

module.exports = {
  requireAuth,
  requireAdmin,
  getSignup,
  postSignup,
  getLogin,
  postLogin,
  logout,
  getForgotPassword,
  postForgotPassword,
  getResetPassword,
  postResetPassword,
};