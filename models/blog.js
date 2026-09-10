const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    excerpt: {
      type: String,
      default: "",
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      default: "Zero to Pro Team",
    },
    tags: {
      type: [String],
      default: [],
    },
    featuredImage: {
      type: String,
      default: "",
    },
    published: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Auto-generate slug from title if not provided
blogSchema.pre("validate", function (next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }
  next();
});

// Query performance: blog list/tag pages sort by createdAt and filter by
// published + tags. Without an index MongoDB does a full collection scan.
blogSchema.index({ published: 1, createdAt: -1 });
blogSchema.index({ tags: 1, published: 1, createdAt: -1 });
blogSchema.index({ views: -1 });

module.exports = mongoose.model("Blog", blogSchema);
