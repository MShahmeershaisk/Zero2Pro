// Express 5–compatible NoSQL injection guard.
//
// The express-mongo-sanitize package (v2.2.0) is not Express 5 compatible —
// it tries to assign req.query, which Express 5 exposes as a getter-only
// property, so every request throws. We sanitize the real attack surface
// (req.body) with the same classic algorithm and leave req.query/req.params
// alone (our routes only read plain strings/numbers from them).
//
// MongoDB operator injection works by nesting keys that start with `$`
// (e.g. { "$gt": "" }) or contain dots (e.g. { "role.$ne": "admin" }) in a
// query. Strip any such key from the request body recursively.

function isSafeKey(key) {
  return !/[$\\]/.test(key) && !key.includes(".");
}

function sanitizeRecursive(value) {
  if (value && typeof value === "object") {
    for (const key of Object.keys(value)) {
      if (!isSafeKey(key)) {
        delete value[key];
      } else {
        sanitizeRecursive(value[key]);
      }
    }
  }
  return value;
}

module.exports = function sanitizeBody(req, res, next) {
  if (req.body && typeof req.body === "object") {
    sanitizeRecursive(req.body);
  }
  next();
};