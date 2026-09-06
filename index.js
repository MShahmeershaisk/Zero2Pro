require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const path = require("path");
const cors = require("cors");

const homeRoutes = require("./routes/homeRoutes");
const compilerRoutes = require("./routes/compilerRoutes");
const testRoutes = require("./routes/testRoutes");
const authRoutes = require("./routes/authRoutes");
const aiRoutes = require("./routes/aiRoutes");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");
const certificateRoutes = require("./routes/certificateRoutes");

const app = express();
const PORT = process.env.PORT || 3000;
const SESSION_SECRET = process.env.SESSION_SECRET || "dev-only-insecure-secret";

if (SESSION_SECRET === "dev-only-insecure-secret" && process.env.NODE_ENV === "production") {
  console.warn("WARNING: SESSION_SECRET is not set — set a strong random value in .env before deploying.");
}

// ---------- Middleware ----------
app.use(cors());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use("/logo", express.static(path.join(__dirname, "logo")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    },
  })
);

// Make the logged-in user available on every page (for the navbar)
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// ---------- MongoDB Connect ----------
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/crud";
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// ---------- Routes ----------
app.use("/", homeRoutes);
app.use("/", compilerRoutes);
app.use("/", testRoutes);
app.use("/", authRoutes);
app.use("/", aiRoutes);
app.use("/", adminRoutes);
app.use("/", userRoutes);
app.use("/", certificateRoutes);


// ---------- 404 Handler ----------
// Return JSON for API requests, plain text for everything else.
app.use((req, res) => {
  res.status(404);
  if (req.path.startsWith("/api/")) {
    return res.json({ success: false, message: "Not Found" });
  }
  res.send("404 - Page Not Found");
});

// ---------- Global Error Handler ----------
app.use((err, req, res, next) => {
  // Handle body parse errors (invalid JSON / too large) cleanly so the server does not crash
  if (err && (err.type === "entity.parse.failed" || err.type === "entity.too.large")) {
    console.error("Request body error:", err);
    if (req.path.startsWith("/api/")) {
      return res.status(err.status || 400).json({ success: false, reply: "Bad request: " + (err.message || "Invalid JSON body") });
    }
    return res.status(err.status || 400).send("Bad request");
  }

  console.error("Unhandled error:", err);

  // The error page files (views/errors/*) were removed, so send a plain response instead.
  res.status(500);
  if (req.path.startsWith("/api/")) {
    res.json({ success: false, reply: "Server error: " + (err && err.message) });
  } else {
    res.send("Internal Server Error");
  }
});

// ---------- Start Server ----------
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});