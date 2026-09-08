const Home = require("../models/home");
const { LANGS, LOGOS, slugFor, nameFor, infoFor } = require("../lib/languages");

/**
 * Extract structured sections from the request body.
 * The admin form sends arrays like sections[0][heading], sections[0][explanation], sections[0][code].
 * We compact them into an array of { heading, explanation, code } objects,
 * dropping any completely empty rows.
 */
function parseSections(body) {
  const headings = body["sections[heading]"];
  const explanations = body["sections[explanation]"];
  const codes = body["sections[code]"];

  // If no section arrays at all, return empty
  if (!headings) return [];

  // Ensure we always work with arrays (single section sends a string, not array)
  const h = Array.isArray(headings) ? headings : [headings];
  const e = Array.isArray(explanations) ? explanations : [explanations];
  const c = Array.isArray(codes) ? codes : [codes];

  const sections = [];
  for (let i = 0; i < h.length; i++) {
    const heading = (h[i] || "").trim();
    const explanation = (e[i] || "").trim();
    const code = (c[i] || "").trim();
    // Only keep sections that have at least a heading or explanation
    if (heading || explanation) {
      sections.push({ heading, explanation, code });
    }
  }
  return sections;
}

// Language-select landing page — any logged-in user.
// Shows all known languages as cards (logo + name + tutorial count).
async function languageLanding(req, res) {
  // Back-compat: old footer links like /tutorials?cat=HTML → deep link to the slug
  if (req.query.cat) {
    return res.redirect("/tutorials/" + slugFor(req.query.cat));
  }
  try {
    const tutorials = await Home.find().sort({ createdAt: -1 });

    // Count tutorials per category
    const counts = {};
    tutorials.forEach((t) => {
      const cat = t.category || "General";
      counts[cat] = (counts[cat] || 0) + 1;
    });

    // Build the grid: fixed order from LANGS first, then any DB-only categories
    const seen = new Set();
    const languages = LANGS.map((l) => {
      seen.add(l.name);
      const count = counts[l.name] || 0;
      return { ...l, count, hasContent: count > 0 };
    });
    Object.keys(counts)
      .filter((cat) => !seen.has(cat))
      .forEach((cat) => {
        const info = infoFor(cat);
        languages.push({ ...info, count: counts[cat], hasContent: true });
      });

    const total = tutorials.length;
    res.render("tutorial/languages", { languages, total });
  } catch (err) {
    console.error(err);
    res.status(500).render("tutorial/languages", { languages: [], total: 0 });
  }
}

// Language tutorials page — any logged-in user.
// Shows ONLY the tutorials for the requested language (url slug).
async function listTutorials(req, res) {
  const slug = String(req.params.lang || "").toLowerCase();
  const category = nameFor(slug);

  // Unknown language → back to the language grid
  if (!category) return res.redirect("/tutorials");

  try {
    const tutorials = await Home.find({ category }).sort({ createdAt: -1 });

    // Group by category (single entry here) so the existing view keeps working
    const grouped = {};
    tutorials.forEach((t) => {
      if (!grouped[category]) grouped[category] = [];
      grouped[category].push(t);
    });

    // Build a lookup object keyed by tutorial id for the reader modal.
    // We use a JSON blob in the page so the modal can render sections
    // without data-* attribute escaping issues.
    const tutorialsMap = {};
    tutorials.forEach((t) => {
      tutorialsMap[t._id.toString()] = {
        title: t.title,
        description: t.description,
        category: t.category,
        sections: t.sections || [],
        content: t.content || "",
      };
    });

    res.render("tutorial/tutorials", {
      grouped,
      categories: grouped[category] ? [category] : [],
      activeCategory: category,
      tutorialsData: tutorialsMap,
      isSingleLang: true,
      langName: category,
      langCount: tutorials.length,
      comingSoon: tutorials.length === 0,
      logos: LOGOS,
    });
  } catch (err) {
    console.error(err);
    res.status(500).render("tutorial/tutorials", {
      grouped: {},
      categories: [],
      activeCategory: null,
      tutorialsData: {},
      isSingleLang: true,
      langName: category,
      langCount: 0,
      comingSoon: true,
      logos: LOGOS,
    });
  }
}

// Management dashboard — admin only. Redirects regular users to the browse page.
async function dashboard(req, res) {
  // Non-admins should not see management controls
  if (req.session.user.role !== "admin") {
    return res.redirect("/tutorials");
  }
  try {
    const tutorials = await Home.find().sort({ createdAt: -1 });
    res.render("tutorial/dashboard", {
      tutorials,
      error: req.session.flash?.error || null,
      message: req.session.flash?.message || null,
    });
    // Clear flash after rendering
    delete req.session.flash;
  } catch (err) {
    console.error(err);
    res.status(500).render("tutorial/dashboard", {
      tutorials: [],
      error: "Failed to load tutorials.",
      message: null,
    });
  }
}

async function addTutorial(req, res) {
  try {
    const { title, description, content, category } = req.body;
    if (!title || !description) {
      req.session.flash = { error: "Title and description are required." };
      return res.redirect("/home");
    }
    const sections = parseSections(req.body);
    await Home.create({
      title,
      description,
      content: content || "",
      category: category || "General",
      sections,
    });
    req.session.flash = { message: "Tutorial added successfully." };
    res.redirect("/home");
  } catch (err) {
    console.error(err);
    req.session.flash = { error: "Failed to add tutorial." };
    res.redirect("/home");
  }
}

async function deleteTutorial(req, res) {
  try {
    await Home.findByIdAndDelete(req.params.id);
    req.session.flash = { message: "Tutorial deleted." };
    res.redirect("/home");
  } catch (err) {
    console.error(err);
    req.session.flash = { error: "Failed to delete tutorial." };
    res.redirect("/home");
  }
}

async function editTutorial(req, res) {
  try {
    const { title, description, content, category } = req.body;
    const sections = parseSections(req.body);
    await Home.findByIdAndUpdate(req.params.id, {
      title,
      description,
      content: content || "",
      category,
      sections,
    });
    req.session.flash = { message: "Tutorial updated." };
    res.redirect("/home");
  } catch (err) {
    console.error(err);
    req.session.flash = { error: "Failed to update tutorial." };
    res.redirect("/home");
  }
}

module.exports = {
  languageLanding,
  listTutorials,
  dashboard,
  addTutorial,
  deleteTutorial,
  editTutorial,
};
