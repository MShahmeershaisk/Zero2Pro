const Test = require("../models/test");

const QUESTIONS_PER_ATTEMPT = 35;
const PASS_PERCENTAGE = 75;

// Har category ka fixed qNum range (seed.js isi order mein data daalta hai).
// Ab category naam (string) match karne ke bajaye seedha range se call karte
// hain — na case-mismatch ka dar, na extra loop.
const CATEGORY_RANGES = {
  Python: { start: 1, end: 100 },
  Java: { start: 101, end: 200 },
  HTML: { start: 201, end: 300 },
  JavaScript: { start: 301, end: 400 },
};

// Range ke andar se `count` unique random numbers nikalta hai.
// (Poore 100-question pool ko shuffle karne se zyada seedha — bas
// numbers pick karo, phir unse questions map kar lo.)
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

    // Dropdown hamesha isi fixed order mein dikhana hai, list page par
    // har test ke saath.
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
  const test = await Test.findById(req.params.id);
  if (!test) return res.redirect("/test");

  // Language select karna zaroori hai — bina category ke test start nahi hoga
  const category = req.query.category;
  const range = CATEGORY_RANGES[category];
  if (!category || !range) {
    return res.redirect("/test?error=missing_category");
  }

  // qNum -> question ka quick lookup map banayein (range ke andar se
  // random numbers nikalne ke baad seedha match ke liye)
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
}

async function submitTest(req, res) {
  try {
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
    const pass = percentage >= PASS_PERCENTAGE;

    res.json({
      success: true,
      percentage: Math.round(percentage * 100) / 100,
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