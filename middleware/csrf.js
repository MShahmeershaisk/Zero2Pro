const crypto = require("crypto");

// Session-based CSRF protection.
//
// How it works:
//  1. Every request gets a per-session random token (created here, kept in
//     req.session.csrfToken) and exposed as `csrfToken` so EJS forms and the
//     head partial can embed it.
//  2. Forms send it back as a hidden `_csrf` field; AJAX calls send it in the
//     `X-CSRF-Token` header (read from a <meta> tag).
//  3. On any state-changing method (POST/PUT/PATCH/DELETE) we compare the
//     submitted token against the session token. A token can only be read by
//     matching code running on our own origin, so a cross-site request — which
//     cannot read the <meta> tag or the session — fails with 403.

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

function csrf(req, res, next) {
  // Ensure every session carries a CSRF token.
  if (!req.session.csrfToken) {
    req.session.csrfToken = crypto.randomBytes(32).toString("hex");
  }
  res.locals.csrfToken = req.session.csrfToken;

  if (SAFE_METHODS.has(req.method)) return next();

  const submitted =
    (req.body && req.body._csrf) ||
    req.get("x-csrf-token") ||
    "";

  if (!submitted || submitted !== req.session.csrfToken) {
    return res.status(403).json({
      success: false,
      message: "Invalid or missing CSRF token. Please refresh the page and try again.",
    });
  }
  next();
}

module.exports = csrf;