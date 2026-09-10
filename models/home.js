const mongoose = require("mongoose");

// One guided step in a tutorial: a code snippet plus a plain-language
// explanation of exactly what that code does.
const sectionSchema = new mongoose.Schema(
  {
    heading: { type: String, default: "" },
    explanation: { type: String, default: "" },
    code: { type: String, default: "" },
  },
  { _id: false }
);

const homeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    // Legacy plain-text content (used only when a tutorial has no sections)
    content: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      default: "General",
    },
    // Structured, step-by-step tutorial body: each section is a code block
    // paired with a written explanation of what it does.
    sections: {
      type: [sectionSchema],
      default: [],
    },
  },
  { timestamps: true }
);

// Tutorials are listed per category, newest first — make those lookups indexed
// instead of scanning every tutorial document.
homeSchema.index({ category: 1, createdAt: -1 });
homeSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Home", homeSchema);
