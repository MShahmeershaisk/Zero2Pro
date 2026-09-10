const Blog = require("../models/blog");
const sanitizeContent = require("../lib/sanitize");

const POSTS_PER_PAGE = 9;

// Blog listing page — public, paginated
async function listPosts(req, res) {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const total = await Blog.countDocuments({ published: true });
    const totalPages = Math.ceil(total / POSTS_PER_PAGE);

    const posts = await Blog.find({ published: true })
      .sort({ createdAt: -1 })
      .skip((page - 1) * POSTS_PER_PAGE)
      .limit(POSTS_PER_PAGE)
      .lean();

    res.render("blog/list", {
      posts,
      currentPage: page,
      totalPages,
      total,
      meta: {
        description: "Read coding tutorials, tips, and guides on the Zero to Pro blog. Learn HTML, CSS, JavaScript, Python, React and more.",
        ogUrl: "https://zerotopro.dev/blog",
      },
    });
  } catch (err) {
    console.error("Blog list error:", err);
    res.status(500).render("blog/list", {
      posts: [],
      currentPage: 1,
      totalPages: 0,
      total: 0,
      meta: {},
    });
  }
}

// Single blog post — public
async function viewPost(req, res) {
  try {
    const post = await Blog.findOne({ slug: req.params.slug, published: true });
    if (!post) return res.redirect("/blog");

    // Increment view count
    post.views = (post.views || 0) + 1;
    await post.save();

    // Render-time sanitization: keeps existing posts safe even if a script
    // was stored before this protection was added.
    post.content = sanitizeContent(post.content);

    res.render("blog/post", {
      post,
      meta: {
        // Strip all HTML tags for the meta description (plain text only)
        description: sanitizeContent(post.excerpt || post.title, {
          allowedTags: [],
          allowedAttributes: {},
        }),
        ogImage: post.featuredImage || "/logo/brand-logo.png",
        ogUrl: `https://zerotopro.dev/blog/${post.slug}`,
        keywords: post.tags.join(", ") + ", coding tutorial, Zero to Pro",
      },
    });
  } catch (err) {
    console.error("Blog view error:", err);
    res.redirect("/blog");
  }
}

// Posts filtered by tag
async function postsByTag(req, res) {
  try {
    const tag = req.params.tag;
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const total = await Blog.countDocuments({ published: true, tags: tag });
    const totalPages = Math.ceil(total / POSTS_PER_PAGE);

    const posts = await Blog.find({ published: true, tags: tag })
      .sort({ createdAt: -1 })
      .skip((page - 1) * POSTS_PER_PAGE)
      .limit(POSTS_PER_PAGE)
      .lean();

    res.render("blog/list", {
      posts,
      currentPage: page,
      totalPages,
      total,
      activeTag: tag,
      meta: {
        description: `Browse ${tag} tutorials and articles on Zero to Pro blog.`,
        ogUrl: `https://zerotopro.dev/blog/tag/${tag}`,
      },
    });
  } catch (err) {
    console.error("Blog tag error:", err);
    res.redirect("/blog");
  }
}

module.exports = {
  listPosts,
  viewPost,
  postsByTag,
};
