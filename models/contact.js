const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    memberId: {
      type: String,
      default: "",
    },
    subject: {
      type: String,
      required: true,
      enum: [
        "Password Change",
        "Email Change",
        "Username Change",
        "Account Issue",
        "Bug Report",
        "Other",
      ],
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "read", "resolved"],
      default: "pending",
    },
    adminNote: {
      type: String,
      default: "",
    },
    // Conversation threads — user and admin can reply to each other
    replies: [
      {
        sender: {
          type: String,
          enum: ["user", "admin"],
          required: true,
        },
        senderName: {
          type: String,
          default: "",
        },
        message: {
          type: String,
          required: true,
          trim: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

// Admin dashboard queries by status + newest first
contactSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model("Contact", contactSchema);
