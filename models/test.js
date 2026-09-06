const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  // Fixed sequential number (1-700) used to bucket questions by category
  // range instead of relying on string matching. See seed.js for the
  // exact ranges (1-100 HTML, 101-200 CSS, 201-300 JavaScript, 301-400 PHP,
  // 401-500 C++, 501-600 React, 601-700 Bootstrap).
  qNum: {
    type: Number,
    default: null,
  },
  questionText: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    required: true,
    validate: (arr) => arr.length >= 2,
  },
  correctAnswerIndex: {
    type: Number,
    required: true,
  },
  // Optional tag like "Java", "Python", "HTML", "JavaScript" — still kept
  // for display (navbar tag, dropdown label) even though filtering now
  // uses qNum ranges.
  category: {
    type: String,
    default: null,
  },
});

const testSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    questions: [questionSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Test", testSchema);