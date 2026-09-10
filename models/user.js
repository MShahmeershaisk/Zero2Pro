const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: false, // Optional for Google-authenticated users
      default: null,
    },
    googleId: {
      type: String,
      default: null,
    },
    avatar: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    // The user's earned certificates — one is added per language when they
    // pass a test (and updated when they retake the same category).
    certificates: [
      {
        category: {
          type: String,
          required: true,
        },
        testTitle: {
          type: String,
          default: "Zero to Pro Certification Test",
        },
        percentage: {
          type: Number,
          default: 0,
        },
        certId: {
          type: String,
        },
        earnedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

// Hash the password before saving it (skip for Google users with null password)
userSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Admin dashboard filters/orders users by role and join date — index those.
userSchema.index({ role: 1, createdAt: -1 });

// Method to compare the password during login (returns false for Google-only users)
userSchema.methods.comparePassword = function (candidatePassword) {
  if (!this.password) return Promise.resolve(false);
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);