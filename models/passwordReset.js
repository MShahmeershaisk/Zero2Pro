const mongoose = require("mongoose");

const passwordResetSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  token: {
    type: String,
    required: true,
    unique: true, // also creates an index — no separate index({ token }) needed
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  used: {
    type: Boolean,
    default: false,
  },
});

// Auto-cleanup expired tokens (MongoDB deletes doc when expiresAt < now)
passwordResetSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
// token lookup: handled by unique: true above (no extra index needed)

module.exports = mongoose.model("PasswordReset", passwordResetSchema);
