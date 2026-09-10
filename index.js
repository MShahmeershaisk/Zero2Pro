require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo").MongoStore;
const path = require("path");
const cors = require("cors");

// CORS is locked to the app's own origins. The frontend is same-origin
// (server-rendered EJS), so cross-origin AJAX should never happen in
// production — the wildcard "*" was letting any site call our APIs.
const ALLOWED_ORIGINS = ["https://zerotopro.dev", "http://localhost:3000", "http://localhost:3999"];
const helmet = require("helmet");
const compression = require("compression");
const sanitizeBody = require("./middleware/sanitize");
const { globalLimiter } = require("./middleware/security");

const homeRoutes = require("./routes/homeRoutes");
const compilerRoutes = require("./routes/compilerRoutes");
const testRoutes = require("./routes/testRoutes");
const authRoutes = require("./routes/authRoutes");
const aiRoutes = require("./routes/aiRoutes");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");
const certificateRoutes = require("./routes/certificateRoutes");
const seoRoutes = require("./routes/seoRoutes");
const blogRoutes = require("./routes/blogRoutes");
const contactRoutes = require("./routes/contactRoutes");
const chatRoutes = require("./routes/chatRoutes");

const app = express();
const PORT = process.env.PORT || 3000;
const IS_PROD = process.env.NODE_ENV === "production";
const SESSION_SECRET = process.env.SESSION_SECRET || "dev-only-insecure-secret";
// Declared here (before the session store below needs it) and reused by
// mongoose.connect further down.
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/crud";

if (SESSION_SECRET === "dev-only-insecure-secret" && process.env.NODE_ENV === "production") {
  console.warn("WARNING: SESSION_SECRET is not set — set a strong random value in .env before deploying.");
}

// Behind a reverse proxy (NGINX / Heroku / Render / Cloudflare) the client IP
// arrives in X-Forwarded-For. Without this, rate limiting sees the proxy IP
// for every user — one visitor's 429 blocks the whole site.
app.set("trust proxy", 1);

// ---------- Middleware ----------
// Security headers with Content-Security-Policy.
// Allows inline styles/scripts (EJS pages use them heavily) plus the external
// CDNs the app needs: Tailwind, Google Fonts, Google Identity, Monaco editor.
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "default-src": ["'self'"],
        "script-src": [
          "'self'",
          "'unsafe-inline'", // EJS pages inline their JS
          "'unsafe-eval'", // Tailwind Play CDN JIT compiler runs in-browser
          "https://cdn.tailwindcss.com",
          "https://cdnjs.cloudflare.com",
          "https://cdn.jsdelivr.net",
          "https://code.jquery.com",
          "https://accounts.google.com",
          "https://www.googletagmanager.com",
        ],
        "style-src": [
          "'self'",
          "'unsafe-inline'", // EJS pages use inline <style> blocks
          "https://fonts.googleapis.com",
          "https://cdnjs.cloudflare.com",
          "https://cdn.jsdelivr.net",
          "https://cdn.tailwindcss.com",
        ],
        "font-src": ["'self'", "https://fonts.gstatic.com", "data:"],
        "img-src": ["'self'", "data:", "blob:", "https:"],
        "connect-src": ["'self'", "https://generativelanguage.googleapis.com", "https://www.googleapis.com"],
        "object-src": ["'none'"],
        "frame-src": ["https://accounts.google.com", "https://www.youtube.com"],
        "base-uri": ["'self'"],
        "form-action": ["'self'"],
        "script-src-attr": ["'unsafe-inline'"], // EJS pages use onclick handlers (toggleTheme, mobile menu, etc.)
      },
    },
  })
);
app.use(compression()); // gzip compression
app.use(cors({ origin: ALLOWED_ORIGINS, credentials: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
// Static assets: cache aggressively. Versioned/fingerprinted files (e.g.
// style.css?v=3, Aiwidget.js?v=3) are safe to cache forever in the browser —
// a new query string busts the cache. Set-Cookie never applies to these.
const STATIC_CACHE = {
  maxAge: "365d",
  immutable: true,
  setHeaders: (res) => res.setHeader("Cache-Control", "public, max-age=31536000, immutable"),
};
app.use(express.static(path.join(__dirname, "public"), STATIC_CACHE));
app.use("/logo", express.static(path.join(__dirname, "logo"), { maxAge: "30d" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(sanitizeBody); // Prevent NoSQL injection via request body (Express 5 compatible)

// Sessions live in MongoDB (via connect-mongo) instead of in-memory:
//  - they survive server restarts (no random logouts in production)
//  - multiple Node processes / PM2 cluster share the same sessions — this is
//    what makes horizontal scaling possible
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: MONGO_URI,
      touchAfter: 24 * 3600, // don't write to DB on every request
      autoRemove: "native", // let MongoDB TTL-index clean up expired sessions
    }),
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

// CSRF protection: issues a per-session token and enforces it on every
// state-changing request (see middleware/csrf.js). Must run after session
// (it reads req.session) and after body parsers (it reads body._csrf).
const csrf = require("./middleware/csrf");
app.use(csrf);

// Contact message count for navbar bell badge (only when logged in)
const Contact = require("./models/contact");
app.use(async (req, res, next) => {
  if (req.session && req.session.user) {
    try {
      const user = req.session.user;
      const isAdmin = user.role === "admin";
      // Regular users only see their OWN unread messages; admins see the global
      // count. (Before this, every logged-in user saw the site-wide total.)
      const query = isAdmin
        ? { status: "pending" }
        : { status: "pending", $or: [{ email: user.email }, { memberId: user.id }] };
      res.locals.unreadMessages = await Contact.countDocuments(query);
    } catch { res.locals.unreadMessages = 0; }
  } else {
    res.locals.unreadMessages = 0;
  }
  next();
});

// ---------- MongoDB Connect ----------
mongoose
  .connect(MONGO_URI, { serverSelectionTimeoutMS: 10000 })
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// ---------- Routes ----------
// Rate limit applied AFTER static files, so CSS/JS/images are never counted.
// Only dynamic page/API requests consume the per-IP budget.
app.use(globalLimiter);
app.use("/", homeRoutes);
app.use("/", compilerRoutes);
app.use("/", testRoutes);
app.use("/", authRoutes);
app.use("/", aiRoutes);
app.use("/", adminRoutes);
app.use("/", userRoutes);
app.use("/", certificateRoutes);
app.use("/", seoRoutes);
app.use("/", blogRoutes);
app.use("/", contactRoutes);
app.use("/", chatRoutes);

// ---------- 404 Handler ----------
// Return JSON for API requests, the styled error page for page requests.
app.use((req, res) => {
  res.status(404);
  if (req.path.startsWith("/api/")) {
    return res.json({ success: false, message: "Not Found" });
  }
  res.render("errors/404");
});

// ---------- Global Error Handler ----------
app.use((err, req, res, next) => {
  // Handle body parse errors (invalid JSON / too large) cleanly so the server does not crash
  if (err && (err.type === "entity.parse.failed" || err.type === "entity.too.large")) {
    // In development show the concrete reason; in production keep it generic so
    // internal details (paths, DB internals) never leak to the client.
    console.error("Request body error:", err);
    if (req.path.startsWith("/api/")) {
      return res.status(err.status || 400).json({
        success: false,
        reply: IS_PROD ? "Bad request" : `Bad request: ${err.message || "Invalid JSON body"}`,
      });
    }
    return res.status(err.status || 400).send("Bad request");
  }

  console.error("Unhandled error:", err);

  // The error page files (views/errors/*) were removed, so send a plain response instead.
  res.status(500);
  if (req.path.startsWith("/api/")) {
    res.json({ success: false, reply: IS_PROD ? "Internal server error" : `Server error: ${err && err.message}` });
  } else {
    res.send("Internal Server Error");
  }
});

// ---------- Start Server ----------
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});