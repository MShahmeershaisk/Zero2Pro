const mongoose = require("mongoose");
const Test = require("../models/test");
const User = require("../models/user");

const QUESTIONS_PER_ATTEMPT = 35;
const PASS_PERCENTAGE = 75;

// Category -> certificate code (a short label used in the certId)
const CERT_CODES = {
  HTML: "HTML",
  CSS: "CSS",
  JavaScript: "JS",
  PHP: "PHP",
  "C++": "CPP",
  React: "RCT",
  Bootstrap: "BST",
  General: "GEN",
};

function certCode(cat) {
  return CERT_CODES[cat] || cat.slice(0, 3).toUpperCase();
}

// Each category has a fixed qNum range (seed.js inserts data in this order).
// We fetch by range instead of matching the category name (string), so there
// is no risk of a case mismatch and no extra loop.
// NOTE: keep these ranges in sync with seed.js (qNum buckets).
const CATEGORY_RANGES = {
  HTML: { start: 1, end: 100 },
  CSS: { start: 101, end: 200 },
  JavaScript: { start: 201, end: 300 },
  PHP: { start: 301, end: 400 },
  "C++": { start: 401, end: 500 },
  React: { start: 501, end: 600 },
  Bootstrap: { start: 601, end: 700 },
  General: { start: 701, end: 800 },
};

// Pick `count` unique random numbers from within a range.
// (Simpler than shuffling the whole 100-question pool — just pick numbers,
// then map those numbers to questions.)
function pickRandomNumbers(start, end, count) {
  const total = end - start + 1;
  const picked = new Set();
  const limit = Math.min(count, total);
  while (picked.size < limit) {
    const n = start + Math.floor(Math.random() * total);
    picked.add(n);
  }
  return picked;
}

async function listTests(req, res) {
  try {
    const tests = await Test.find();

    // Always show the dropdown in this fixed order, with every test on the list page.
    const categories = Object.keys(CATEGORY_RANGES);

    res.render("test/test", {
      tests,
      categories,
      mode: "list",
      QUESTIONS_PER_ATTEMPT,
      PASS_PERCENTAGE,
      error: req.query.error || null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).render("test/test", {
      tests: [],
      categories: [],
      mode: "list",
      QUESTIONS_PER_ATTEMPT,
      PASS_PERCENTAGE,
      error: "Failed to load tests.",
    });
  }
}

async function startTest(req, res) {
  try {
    // Guard against malformed/non-ObjectId test ids (otherwise Mongoose throws
    // a CastError and the request dies with a 500).
    if (!mongoose.isValidObjectId(req.params.id)) return res.redirect("/test");

    const test = await Test.findById(req.params.id);
    if (!test) return res.redirect("/test");

    // Selecting a language is required — the test cannot start without a category
    const category = req.query.category;
    const range = CATEGORY_RANGES[category];
    if (!category || !range) {
      return res.redirect("/test?error=missing_category");
    }

    // Build a quick lookup map from qNum -> question (to match directly after
    // picking random numbers from the range)
    const byQNum = new Map();
    test.questions.forEach((q) => {
      if (typeof q.qNum === "number") byQNum.set(q.qNum, q);
    });

    const pickedNumbers = pickRandomNumbers(range.start, range.end, QUESTIONS_PER_ATTEMPT);
    const selected = Array.from(pickedNumbers)
      .map((n) => byQNum.get(n))
      .filter(Boolean);

    if (selected.length === 0) {
      return res.redirect("/test?error=no_questions");
    }

    const safeQuestions = selected.map((q) => ({
      id: q._id,
      questionText: q.questionText,
      options: q.options,
    }));

    res.render("test/test", {
      test,
      safeQuestions,
      category,
      mode: "attempt",
      QUESTIONS_PER_ATTEMPT: selected.length,
      PASS_PERCENTAGE,
    });
  } catch (err) {
    console.error("Failed to start test:", err);
    res.redirect("/test");
  }
}

async function submitTest(req, res) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ success: false, message: "Test not found" });
    }

    const test = await Test.findById(req.params.id);
    if (!test) return res.status(404).json({ success: false, message: "Test not found" });

    const answers = req.body.answers || {};
    const questionIds = Array.isArray(req.body.questionIds) ? req.body.questionIds : [];

    if (!questionIds.length) {
      return res.status(400).json({ success: false, message: "No questions submitted" });
    }

    const questionMap = new Map(test.questions.map((q) => [String(q._id), q]));

    let score = 0;
    let total = 0;

    questionIds.forEach((qid) => {
      const q = questionMap.get(String(qid));
      if (!q) return;
      total++;
      const given = answers[qid];
      if (given !== undefined && parseInt(given) === q.correctAnswerIndex) {
        score++;
      }
    });

    if (total === 0) {
      return res.status(400).json({ success: false, message: "No valid questions submitted" });
    }

    const percentage = (score / total) * 100;
    const roundedPercent = Math.round(percentage * 100) / 100;
    const pass = percentage >= PASS_PERCENTAGE;

    // If the user passes, save a certificate for that language on their account.
    // If they pass the same language again (a retake), the score/date is updated
    // instead of creating a duplicate certificate.
    if (pass && req.session && req.session.user) {
      try {
        const user = await User.findById(req.session.user.id);
        if (user) {
          const categoryName = String(req.body.category || "General").trim();
          const existing = user.certificates.find((c) => c.category === categoryName);
          if (existing) {
            existing.percentage = roundedPercent;
            existing.testTitle = test.title;
            existing.earnedAt = new Date();
          } else {
            user.certificates.push({
              category: categoryName,
              testTitle: test.title,
              percentage: roundedPercent,
              certId: `Z2H-${certCode(categoryName)}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
            });
          }
          await user.save();
        }
      } catch (err) {
        // The result should still reach the user even if saving the certificate fails
        console.error("Certificate save error:", err);
      }
    }

    res.json({
      success: true,
      percentage: roundedPercent,
      pass,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
}

module.exports = {
  listTests,
  startTest,
  submitTest,
};