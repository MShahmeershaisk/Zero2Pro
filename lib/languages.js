/**
 * Shared language catalog for the whole app.
 *
 * Every place that needs to map a programming language to its URL slug or its
 * logo — the tutorials grid, tutorial cards, certificates — reads from here,
 * so a language is defined exactly once instead of being copied into each
 * controller and view.
 */

/** Default logo for any category that is not in the catalog. */
const DEFAULT_LOGO = "/logo/badge.png";

/**
 * All known languages in display order (used by the tutorials grid).
 * slug = URL segment (/tutorials/:slug), name = DB category, logo = image.
 */
const LANGS = [
  { slug: "html", name: "HTML", logo: "/logo/html5.png" },
  { slug: "css", name: "CSS", logo: "/logo/css3.png" },
  { slug: "javascript", name: "JavaScript", logo: "/logo/javascript.png" },
  { slug: "php", name: "PHP", logo: "/logo/php.png" },
  { slug: "cpp", name: "C++", logo: "/logo/cpp.png" },
  { slug: "react", name: "React", logo: "/logo/react.png" },
  { slug: "bootstrap", name: "Bootstrap", logo: "/logo/bootstrap.png" },
  { slug: "java", name: "Java", logo: "/logo/java.png" },
  { slug: "python", name: "Python", logo: "/logo/python.png" },
];

/** Category name → logo path map, convenient to pass straight into EJS views. */
const LOGOS = Object.fromEntries(LANGS.map((l) => [l.name, l.logo]));

/** Look up a catalog entry by URL slug (case-insensitive). */
function bySlug(slug) {
  return LANGS.find((l) => l.slug === String(slug || "").toLowerCase()) || null;
}

/** Look up a catalog entry by category name. */
function byName(name) {
  return LANGS.find((l) => l.name === name) || null;
}

/** URL slug for a category name — falls back to a slugified raw string. */
function slugFor(category) {
  const entry = byName(category);
  if (entry) return entry.slug;
  return String(category || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Category name for a URL slug — null if the slug is not a known language. */
function nameFor(slug) {
  const entry = bySlug(slug);
  return entry ? entry.name : null;
}

/** Catalog entry for a category name — badge entry for anything unrecognized. */
function infoFor(category) {
  const entry = byName(category);
  if (entry) return entry;
  return { slug: slugFor(category), name: category || "General", logo: DEFAULT_LOGO };
}

/** Logo path for a category name — badge for anything unrecognized. */
function logoFor(category) {
  const entry = byName(category);
  return entry ? entry.logo : DEFAULT_LOGO;
}

module.exports = { LANGS, LOGOS, DEFAULT_LOGO, bySlug, byName, slugFor, nameFor, infoFor, logoFor };