const express = require("express");
const router = express.Router();
const Home = require("../models/home");
const { LANGS } = require("../lib/languages");

// Dynamic sitemap.xml — includes tutorials, blog posts, and static pages
router.get("/sitemap.xml", async (req, res) => {
  try {
    const baseUrl = req.protocol + "://" + req.get("host");

    // Static pages
    const staticPages = [
      { url: "/", changefreq: "weekly", priority: "1.0" },
      { url: "/tutorials", changefreq: "weekly", priority: "0.9" },
      { url: "/compiler", changefreq: "monthly", priority: "0.8" },
      { url: "/test", changefreq: "weekly", priority: "0.8" },
      { url: "/certificates", changefreq: "monthly", priority: "0.6" },
      { url: "/blog", changefreq: "daily", priority: "0.9" },
      { url: "/login", changefreq: "monthly", priority: "0.3" },
      { url: "/signup", changefreq: "monthly", priority: "0.3" },
    ];

    // Language tutorial pages
    const tutorialPages = LANGS.map((l) => ({
      url: `/tutorials/${l.slug}`,
      changefreq: "weekly",
      priority: "0.8",
    }));

    // Blog posts (only published ones)
    let blogPages = [];
    try {
      const Blog = require("../models/blog");
      const posts = await Blog.find({ published: true }).select("slug updatedAt").lean();
      blogPages = posts.map((p) => ({
        url: `/blog/${p.slug}`,
        changefreq: "weekly",
        priority: "0.7",
        lastmod: p.updatedAt ? p.updatedAt.toISOString().split("T")[0] : undefined,
      }));
    } catch (e) {
      // Blog model may not exist yet — skip silently
    }

    const allPages = [...staticPages, ...tutorialPages, ...blogPages];
    const today = new Date().toISOString().split("T")[0];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    for (const page of allPages) {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}${page.url}</loc>\n`;
      if (page.lastmod) xml += `    <lastmod>${page.lastmod}</lastmod>\n`;
      else xml += `    <lastmod>${today}</lastmod>\n`;
      xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
      xml += `    <priority>${page.priority}</priority>\n`;
      xml += `  </url>\n`;
    }

    xml += `</urlset>`;

    res.set("Content-Type", "application/xml");
    res.send(xml);
  } catch (err) {
    console.error("Sitemap error:", err);
    res.status(500).send("Error generating sitemap");
  }
});

// robots.txt — tell search engines what to crawl
router.get("/robots.txt", (req, res) => {
  const baseUrl = req.protocol + "://" + req.get("host");
  const txt = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/
Disallow: /profile

Sitemap: ${baseUrl}/sitemap.xml
`;
  res.set("Content-Type", "text/plain");
  res.send(txt);
});

module.exports = router;
