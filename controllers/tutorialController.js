const Home = require("../models/home");

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

// Browse page — any logged-in user. Shows all tutorials grouped by category.
async function listTutorials(req, res) {
  try {
    const tutorials = await Home.find().sort({ createdAt: -1 });
    // Group tutorials by category for a clean library layout
    const grouped = {};
    tutorials.forEach((t) => {
      const cat = t.category || "General";
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(t);
    });
    const categories = Object.keys(grouped);

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

    // /tutorials?cat=HTML — the category is pre-selected via the footer / any link
    const requestedCat = req.query.cat || null;
    const activeCategory = requestedCat && grouped[requestedCat] ? requestedCat : null;

    res.render("tutorial/tutorials", {
      grouped,
      categories,
      activeCategory,
      tutorialsData: tutorialsMap,
    });
  } catch (err) {
    console.error(err);
    res.status(500).render("tutorial/tutorials", {
      grouped: {},
      categories: [],
      activeCategory: null,
      tutorialsData: {},
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
  listTutorials,
  dashboard,
  addTutorial,
  deleteTutorial,
  editTutorial,
};
