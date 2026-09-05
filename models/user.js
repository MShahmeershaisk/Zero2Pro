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
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    // Har user ke earned certificates — test pass karne par per-language
    // ek certificate add hota hai (same category retake hone par update).
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

// Password ko save karne se pehle hash karo
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Login ke waqt password compare karne ke liye method
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);