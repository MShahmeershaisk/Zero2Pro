const sanitizeHtml = require("sanitize-html");

// Allow the exact HTML subset the blog template knows how to style
// (headings, paragraphs, lists, code, blockquotes, images, links, emphasis).
// Everything else — scripts, iframes, event handlers, style attrs — is stripped.
const ALLOWED_TAGS = [
  "h1", "h2", "h3", "h4", "h5", "h6",
  "p", "br", "hr",
  "ul", "ol", "li",
  "a", "strong", "em", "b", "i", "u", "s",
  "code", "pre", "blockquote",
  "img", "span", "div",
];

const ALLOWED_ATTRS = {
  a: ["href", "title", "target", "rel"],
  img: ["src", "alt", "title", "width", "height"],
  code: ["class"],
  pre: ["class"],
  span: ["class"],
  div: ["class"],
};

module.exports = function sanitizeContent(html, overrides) {
  return sanitizeHtml(html || "", {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: ALLOWED_ATTRS,
    allowedSchemes: ["http", "https", "mailto"],
    allowedSchemesByTag: { img: ["http", "https", "data"] },
    // Force rel="noopener noreferrer" on every link (target stays as-is)
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer", target: "_blank" }),
    },
    // Disallow javascript: URLs in href/src
    disallowedTagsMode: "discard",
    ...overrides, // e.g. { allowedTags: [], allowedAttributes: {} } for plain text
  });
};