const User = require("../models/user");

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

function getSignup(req, res) {
  res.render("auth/signup", { error: null });
}

async function postSignup(req, res) {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!/^[^\s@]+@gmail\.com$/i.test(email || "")) {
      return res.render("auth/signup", { error: "Email must be a valid @gmail.com address" });
    }

    if (confirmPassword !== undefined && password !== confirmPassword) {
      return res.render("auth/signup", { error: "Password and Confirm Password must match" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.render("auth/signup", { error: "Email already registered" });
    }
    const user = new User({ name, email, password });
    await user.save();
    req.session.regenerate(() => {
      req.session.user = { id: user._id, name: user.name, email: user.email, role: user.role };
      res.redirect("/"); // Home/Landing page par redirect karega
    });
  } catch (err) {
    console.error(err);
    res.render("auth/signup", { error: "Something went wrong. Try again." });
  }
}

function getLogin(req, res) {
  res.render("auth/login", { error: null });
}

async function postLogin(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.render("auth/login", { error: "Invalid email or password" });

    const match = await user.comparePassword(password);
    if (!match) return res.render("auth/login", { error: "Invalid email or password" });

    req.session.regenerate(() => {
      req.session.user = { id: user._id, name: user.name, email: user.email, role: user.role };
      res.redirect("/"); // Home/Landing page par redirect karega
    });
  } catch (err) {
    console.error(err);
    res.render("auth/login", { error: "Something went wrong. Try again." });
  }
}

function logout(req, res) {
  req.session.destroy(() => res.redirect("/"));
}

module.exports = {
  requireAuth,
  requireAdmin,
  getSignup,
  postSignup,
  getLogin,
  postLogin,
  logout,
};