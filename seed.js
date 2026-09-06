require("dotenv").config();
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const Test = require("./models/test");
const User = require("./models/user");
const Home = require("./models/home");
const questions = require("./data/questions.json");

// Full-course content: seed-data/*.json files (a complete course for each language).
// These JSON files are kept separate so the content is easy to add to or update.
function loadSeedDataTutorials() {
  const dir = path.join(__dirname, "seed-data");
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json") && !f.startsWith("_"));
  const extra = [];
  for (const file of files) {
    try {
      const arr = JSON.parse(fs.readFileSync(path.join(dir, file), "utf8"));
      if (Array.isArray(arr)) extra.push(...arr);
      else console.warn(`[seed-data] ${file}: not an array, skipped`);
    } catch (e) {
      console.error(`[seed-data] ${file}: parse error, skipped — ${e.message}`);
    }
  }
  return extra;
}

// Default tutorial library seeded on first run (HTML, CSS, JavaScript, etc.)
// Each tutorial has a structured "sections" array — every code snippet is paired
// with a plain-language explanation so readers fully understand what each line does.
const defaultTutorials = [
  // ─── HTML Tutorials ────────────────────────────────────────────────────────
  {
    title: "HTML Basics: Elements & Structure",
    description: "Understand the building blocks of every web page — tags, elements, and document structure.",
    category: "HTML",
    content: "",
    sections: [
      {
        heading: "What is HTML?",
        explanation:
          "HTML stands for HyperText Markup Language. It is not a programming language — it is a markup language that tells the browser how to structure content. Every web page you visit is built on HTML. Think of HTML as the skeleton of a web page: it defines the headings, paragraphs, links, images, and every other piece of visible content.",
        code: "",
      },
      {
        heading: "The Document Declaration",
        explanation:
          "Every HTML file must begin with a DOCTYPE declaration. This is NOT an HTML tag — it is an instruction to the browser that tells it to render the page in standards mode using the latest version of HTML (HTML5). Without this line, browsers may switch to a compatibility mode and render your page inconsistently.",
        code: "<!DOCTYPE html>",
      },
      {
        heading: "The Root Element",
        explanation:
          'The <html> tag wraps ALL content on the page. Everything else lives inside it. The lang="en" attribute tells the browser (and screen readers) that the page content is in English. This is important for accessibility — screen readers use it to determine which pronunciation rules to apply when reading text aloud.',
        code: '<html lang="en">\n  <!-- everything goes here -->\n</html>',
      },
      {
        heading: "The Head Section",
        explanation:
          'The <head> section contains metadata — data about the page that is NOT displayed on screen. The <meta charset="UTF-8"> tag ensures that special characters (like e, n, or emojis) display correctly. The <title> tag sets the text that appears in the browser tab. Search engines also use this title to understand what the page is about.',
        code: '<head>\n  <meta charset="UTF-8" />\n  <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n  <title>My First Web Page</title>\n</head>',
      },
      {
        heading: "The Body Section",
        explanation:
          'Everything the user actually sees — text, images, buttons, videos — goes inside the <body> tag. This is where all your visible content lives. When someone opens your page in a browser, they only see what is inside <body>.',
        code: '<body>\n  <h1>Hello, World!</h1>\n  <p>Welcome to my website.</p>\n</body>',
      },
      {
        heading: "Headings and Paragraphs",
        explanation:
          "HTML provides six levels of headings: <h1> through <h6>. <h1> is the most important (used for the main title of the page) and <h6> is the least. A <p> tag defines a paragraph of text. The browser automatically adds spacing before and after paragraphs. Always use headings in order — don't jump from <h1> to <h4> — this helps screen readers and search engines understand your content hierarchy.",
        code: '<h1>Main Page Title</h1>\n<h2>Section Title</h2>\n<h3>Sub-section Title</h3>\n<p>This is a paragraph of text. It can be as long as you want.</p>\n<p>This is another paragraph.</p>',
      },
      {
        heading: "Complete Basic Document",
        explanation:
          "Putting it all together, here is a complete, valid HTML document. Notice how the DOCTYPE comes first, then the <html> root wraps everything, the <head> contains metadata, and the <body> contains the visible content. This is the starting point for every web page you will ever build.",
        code: '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8" />\n  <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n  <title>My First Web Page</title>\n</head>\n<body>\n  <h1>Hello, World!</h1>\n  <p>Welcome to my first web page.</p>\n</body>\n</html>',
      },
      {
        heading: "Semantic Tags",
        explanation:
          'HTML5 introduced semantic tags that give meaning to content. Instead of using generic <div> tags everywhere, you use <header> for the top of the page, <nav> for navigation menus, <main> for the primary content, <section> for grouping related content, <article> for self-contained content (like a blog post), and <footer> for the bottom. These tags don\'t change how the page looks, but they make your code easier to read, improve accessibility for screen readers, and help search engines understand your page structure.',
        code: '<header>\n  <h1>My Blog</h1>\n  <nav>\n    <a href="/">Home</a>\n    <a href="/about">About</a>\n  </nav>\n</header>\n<main>\n  <article>\n    <h2>First Post</h2>\n    <p>This is my blog post content.</p>\n  </article>\n</main>\n<footer>\n  <p>&copy; 2026 My Blog</p>\n</footer>',
      },
    ],
  },
  {
    title: "HTML Forms & Inputs",
    description: "Collect user data with forms, inputs, and validation.",
    category: "HTML",
    content: "",
    sections: [
      {
        heading: "What is an HTML Form?",
        explanation:
          "An HTML form is a section of a page that contains interactive elements for collecting user input. When a user fills out the form and clicks the submit button, the data is sent to a server for processing. Forms are used for login pages, search bars, registration forms, checkout pages, and any other situation where you need to gather information from users.",
        code: "",
      },
      {
        heading: "The Form Element",
        explanation:
          'The <form> element wraps all the input fields. The action attribute tells the browser WHERE to send the form data — it is a URL (like "/submit") that points to a server route. The method attribute tells the browser HOW to send the data: "POST" sends it hidden in the request body (safe for passwords), while "GET" appends it to the URL (visible in the address bar, used for search forms).',
        code: '<form action="/submit" method="POST">\n  <!-- input fields go here -->\n</form>',
      },
      {
        heading: "Labels and Text Inputs",
        explanation:
          'Every input field should have a <label>. The label\'s for attribute must match the input\'s id attribute — this creates a link between them. When a user clicks on the label text, the browser automatically focuses the cursor on the matching input field. This is essential for accessibility: screen readers use this link to announce what each input is for. The type="text" input accepts any text. The required attribute forces the user to fill in this field before submitting.',
        code: '<label for="username">Username</label>\n<input type="text" id="username" name="username" required />\n\n<!-- The "name" attribute is the key that gets sent to the server.\n     When the form submits, the server receives: username=whateverUserTyped -->',
      },
      {
        heading: "Email Input with Built-in Validation",
        explanation:
          'When you use type="email", the browser automatically validates that the input looks like a real email address (it must contain an @ symbol and a domain). If the user types something like "hello" without an @, the browser shows an error and prevents submission. This is free client-side validation — no JavaScript needed. However, server-side validation is still necessary because client-side checks can be bypassed.',
        code: '<label for="email">Email Address</label>\n<input type="email" id="email" name="email" placeholder="you@example.com" required />\n\n<!-- placeholder shows gray hint text inside the input before the user types -->',
      },
      {
        heading: "Password Input",
        explanation:
          'The type="password" input hides the characters as the user types them (shown as dots or asterisks). This prevents anyone looking over the user\'s shoulder from seeing the password. Note: this is only visual hiding — the actual text is still sent to the server in plain text over the form submission, so you must use HTTPS in production to encrypt the data in transit.',
        code: '<label for="password">Password</label>\n<input type="password" id="password" name="password" minlength="8" required />\n\n<!-- minlength="8" requires at least 8 characters -->',
      },
      {
        heading: "Number, Date, and Checkbox Inputs",
        explanation:
          'HTML provides specialized input types for different kinds of data. type="number" only accepts numbers and shows up/down arrows. You can set min and max to limit the range. type="date" shows a date picker calendar. type="checkbox" creates a toggle that can be checked or unchecked — useful for "I agree to terms" or selecting multiple options.',
        code: '<!-- Number input -->\n<label for="age">Age</label>\n<input type="number" id="age" name="age" min="13" max="120" />\n\n<!-- Date input -->\n<label for="birthday">Birthday</label>\n<input type="date" id="birthday" name="birthday" />\n\n<!-- Checkbox -->\n<input type="checkbox" id="agree" name="agree" required />\n<label for="agree">I agree to the terms</label>',
      },
      {
        heading: "Radio Buttons",
        explanation:
          "Radio buttons let the user choose exactly ONE option from a group. The key trick is that all radio buttons in a group share the same name attribute (like name=\"plan\"). This tells the browser that only one of them can be selected at a time — selecting one automatically deselects the others. Each radio button needs a unique id so its label can reference it.",
        code: '<p>Choose your plan:</p>\n<input type="radio" id="free" name="plan" value="free" checked />\n<label for="free">Free</label>\n\n<input type="radio" id="pro" name="plan" value="pro" />\n<label for="pro">Pro ($9/mo)</label>\n\n<input type="radio" id="enterprise" name="plan" value="enterprise" />\n<label for="enterprise">Enterprise</label>\n\n<!-- "checked" makes this option selected by default -->',
      },
      {
        heading: "The Submit Button",
        explanation:
          "The <button type=\"submit\"> element triggers the form submission when clicked. The browser collects all the name/value pairs from every input inside the form and sends them to the URL in the form's action attribute using the specified method. Only inputs with a name attribute are included — unnamed inputs are ignored.",
        code: '<form action="/register" method="POST">\n  <label for="name">Name</label>\n  <input type="text" id="name" name="name" required />\n\n  <label for="email">Email</label>\n  <input type="email" id="email" name="email" required />\n\n  <label for="password">Password</label>\n  <input type="password" id="password" name="password" minlength="8" required />\n\n  <button type="submit">Create Account</button>\n</form>',
      },
    ],
  },
  {
    title: "HTML Links, Images & Media",
    description: "Links, images, audio, video, and embeds — make your pages rich and navigable.",
    category: "HTML",
    content: "",
    sections: [
      {
        heading: "The Anchor Tag for Links",
        explanation:
          'The <a> tag creates a clickable link. The href attribute holds the destination URL, and everything between the opening and closing <a> tags becomes the visible link text. You can wrap any element — text, an image, even a button — inside an anchor to make it clickable. Add target="_blank" to open the link in a new browser tab, always paired with rel="noopener noreferrer" for security.',
        code: '<a href="https://www.google.com/">Visit Google</a>\n\n<!-- Open in a new tab (with security attribute) -->\n<a href="https://www.google.com/" target="_blank" rel="noopener noreferrer">Google</a>\n\n<!-- A link does not have to be text -->\n<a href="/tutorials"><img src="logo.png" alt="Go to tutorials" /></a>',
      },
      {
        heading: "Link States: hover, visited & active",
        explanation:
          'Browsers style links in four default states — unvisited (blue, underlined), visited (purple), hover (mouse over), and active (while clicking). CSS controls each state with pseudo-classes: :link, :visited, :hover, :active. The title attribute adds a small tooltip on hover, which is a quick, accessible way to describe the link\'s destination. Always keep the link text descriptive — never "click here" — because screen-reader users hear it out of context.',
        code: '<a href="/tutorials" title="Browse our full tutorial library">Coding Tutorials</a>\n\n/* CSS link states */\na { color: #6366f1; }          /* unvisited */\na:visited { color: #8b5cf6; }  /* already clicked */\na:hover { color: #4f46e5; }    /* mouse over */\na:active { color: #f59e0b; }   /* while clicking */',
      },
      {
        heading: "Images: src, alt & dimensions",
        explanation:
          'The <img> element embeds an image. src is the file path or URL; alt is the description — screen readers read it aloud, search engines index it, and if the image fails to load the browser shows the alt text instead. An image is a void element: no closing tag. Setting width and height (in pixels) reserves layout space and stops the page jumping around while images load. Use CSS to make images responsive (max-width: 100%) rather than fixed pixels.',
        code: '<img\n  src="covers/html-basics.png"\n  alt="HTML Basics course cover"\n  width="640"\n  height="360"\n/>\n\n/* Responsive images: scale down on small screens */\nimg { max-width: 100%; height: auto; }',
      },
      {
        heading: "Figure & Figcaption",
        explanation:
          'For an image (or a chart, code block, photo) that needs a caption, wrap it in a <figure> element and add a <figcaption> inside. This is a semantic unit: assistive technologies and browsers understand that the media and its caption belong together, which also keeps them styled and positioned as a group. It is far better than a bare <div> holding an image plus a paragraph of caption text.',
        code: '<figure>\n  <img src="charts/user-growth.png" alt="Line chart of user growth from January to June" width="480" />\n  <figcaption>User growth, January through June</figcaption>\n</figure>',
      },
      {
        heading: "Audio & Video Elements",
        explanation:
          'HTML5 added native <audio> and <video> elements — no plugin required. The controls attribute shows play/pause/volume controls; without it nothing is visible, so you almost always include it. Use multiple <source> elements to offer several formats (the browser plays the first one it supports; MP4 is the safest video choice). autoplay that includes sound is usually blocked by browsers, so pair it with muted.',
        code: '<audio controls>\n  <source src="audio/intro.mp3" type="audio/mpeg" />\n  Your browser does not support the audio element.\n</audio>\n\n<video controls width="480">\n  <source src="videos/tutorial.mp4" type="video/mp4" />\n  <source src="videos/tutorial.webm" type="video/webm" />\n  Your browser does not support the video element.\n</video>',
      },
      {
        heading: "Embedding with iframe (YouTube)",
        explanation:
          'To show a YouTube video or another page inside yours, use <iframe> — it creates a mini browser window. The src is the embed URL: on YouTube, click Share → Embed and copy the src of the code it gives you. loading="lazy" tells the browser to wait until the frame is close to the viewport before loading it, which speeds up the initial page load. Give every iframe a title for accessibility.',
        code: '<iframe\n  width="560" height="315"\n  src="https://www.youtube.com/embed/VIDEO_ID"\n  title="Zero to Pro video lesson"\n  loading="lazy"\n  allowfullscreen\n></iframe>\n\n<!-- Fallback for browsers without iframe support -->\n<noscript>Watch the video on YouTube instead.</noscript>',
      },
    ],
  },
  // ─── CSS Tutorials ─────────────────────────────────────────────────────────
  {
    title: "CSS Selectors & Styling",
    description: "Style your HTML with selectors, colors, and the cascade.",
    category: "CSS",
    content: "",
    sections: [
      {
        heading: "What is CSS?",
        explanation:
          "CSS stands for Cascading Style Sheets. While HTML defines the structure and content of a page, CSS controls how it looks — colors, fonts, spacing, layout, animations, and more. CSS works by using selectors to target HTML elements and then applying style rules to them. Without CSS, every web page would look like plain black text on a white background.",
        code: "",
      },
      {
        heading: "Element Selector",
        explanation:
          "The simplest type of CSS selector targets HTML elements directly by their tag name. When you write h1 { color: blue; }, it changes ALL <h1> elements on the page to blue. This is useful for setting base styles, but be careful — it affects every instance of that element, so use it for global defaults rather than specific styling.",
        code: '/* All <h1> elements will be indigo */\nh1 {\n  color: #6366f1;\n  font-size: 2rem;\n}\n\n/* All <p> elements will be gray */\np {\n  color: #6b7280;\n  line-height: 1.6;\n}',
      },
      {
        heading: "Class Selector",
        explanation:
          'A class selector targets elements that have a specific class attribute. You define a class in CSS by prefixing the name with a dot (.). In HTML, you add the class using the class="..." attribute. Classes are reusable — you can apply the same class to as many elements as you want. This is the most common way to style elements because it gives you fine-grained control while keeping your styles DRY (Don\'t Repeat Yourself).',
        code: '/* CSS: define the class */\n.card {\n  background: white;\n  border-radius: 8px;\n  padding: 20px;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);\n}\n\n/* HTML: apply the class to any element */\n<div class="card">This is a card</div>\n<div class="card">This is also a card</div>',
      },
      {
        heading: "ID Selector",
        explanation:
          'An ID selector targets a single, unique element using the # prefix. Each ID must be unique on a page — you cannot have two elements with the same ID. ID selectors are more specific than class selectors, which means they override class styles. However, because IDs are not reusable and make your CSS harder to maintain, most developers prefer using classes for styling.',
        code: '/* CSS: target the element with id="header" */\n#header {\n  background: linear-gradient(135deg, #6366f1, #8b5cf6);\n  padding: 20px;\n  color: white;\n}\n\n/* HTML: */\n<header id="header">Welcome</header>',
      },
      {
        heading: "Common CSS Properties",
        explanation:
          "These are the most frequently used CSS properties. color sets the text color. background sets the background color or image. margin adds space OUTSIDE the element's border. padding adds space INSIDE the element's border. font-size controls how large the text is. border adds a visible line around the element. display controls how the element behaves in layout (block, inline, flex, grid).",
        code: '.box {\n  color: #ffffff;            /* text color */\n  background: #1e293b;       /* background color */\n  margin: 16px;              /* space outside the border */\n  padding: 24px;             /* space inside the border */\n  font-size: 1rem;           /* text size */\n  border: 1px solid #374151; /* visible border */\n  border-radius: 8px;        /* rounded corners */\n}',
      },
      {
        heading: "The Cascade and Specificity",
        explanation:
          "The 'C' in CSS stands for Cascading. When multiple rules target the same element, the browser decides which one wins based on specificity. An ID selector (#header) beats a class selector (.card), which beats an element selector (h1). If two rules have the same specificity, the one that appears LATER in the CSS file wins. This is why it's called the cascade — styles cascade down based on priority.",
        code: '/* These all target the same <p> inside a card */\np { color: gray; }                    /* lowest specificity */\n.card p { color: darkgray; }          /* higher (has a class) */\n#intro p { color: lightgray; }        /* highest (has an ID) */\n\n/* The <p> inside #intro will be lightgray because IDs win. */',
      },
      {
        heading: "Combining Selectors",
        explanation:
          "You can combine selectors to target elements more precisely. A descendant selector (space) targets elements inside other elements. A child selector (>) targets only direct children. A pseudo-class like :hover applies styles when the user interacts with an element. These combinations let you write precise, efficient CSS without adding extra classes to your HTML.",
        code: '/* Descendant: any <a> inside a .nav */\n.nav a { color: white; text-decoration: none; }\n\n/* Child: only direct <li> children of <ul> */\nul > li { list-style: none; }\n\n/* Pseudo-class: style when mouse hovers */\n.button:hover {\n  background: #4f46e5;\n  transform: translateY(-1px);\n}\n\n/* Pseudo-class: style when input is focused */\ninput:focus {\n  outline: 2px solid #6366f1;\n  border-color: transparent;\n}',
      },
    ],
  },
  {
    title: "CSS Flexbox & Grid",
    description: "Build modern responsive layouts with Flexbox and CSS Grid.",
    category: "CSS",
    content: "",
    sections: [
      {
        heading: "The Layout Problem",
        explanation:
          "Before Flexbox and CSS Grid, creating layouts in CSS was painful — developers used floats, positioning hacks, and tables just to center a div or create a two-column layout. Flexbox and Grid are the modern solutions. Flexbox handles one-dimensional layouts (a row OR a column). Grid handles two-dimensional layouts (rows AND columns at the same time). Together, they can build any layout you can imagine.",
        code: "",
      },
      {
        heading: "Flexbox: The Basics",
        explanation:
          'To activate Flexbox on a container, you set display: flex. This turns all direct children into "flex items" that can be arranged along a single axis. By default, items line up in a row (left to right). You can change this to a column with flex-direction: column. The container becomes a flexible layout engine that can distribute space, align items, and reorder them — all with CSS.',
        code: '/* Turn this div into a flex container */\n.container {\n  display: flex;             /* activate Flexbox */\n  flex-direction: row;       /* items in a row (default) */\n  gap: 12px;                 /* space between items */\n}\n\n/* The children (.item) are now flex items */\n<div class="container">\n  <div class="item">One</div>\n  <div class="item">Two</div>\n  <div class="item">Three</div>\n</div>',
      },
      {
        heading: "Flexbox: Main Axis Alignment",
        explanation:
          'justify-content controls how items are spaced along the MAIN axis (horizontal in a row, vertical in a column). "flex-start" packs items to the start. "center" centers them. "space-between" puts equal space BETWEEN items (no space at edges). "space-around" puts equal space around each item. "space-evenly" puts identical gaps everywhere. This one property solves most centering and spacing problems.',
        code: '.container {\n  display: flex;\n  justify-content: center;          /* all items centered horizontally */\n  /* Other options:\n     flex-start  — packed to the left\n     space-between — equal gaps between items\n     space-around  — gaps on all sides of each item\n     space-evenly  — identical gaps everywhere */\n}',
      },
      {
        heading: "Flexbox: Cross Axis Alignment",
        explanation:
          'align-items controls spacing along the CROSS axis (vertical in a row, horizontal in a column). "stretch" makes all items the same height (default). "center" vertically centers them. "flex-start" aligns to the top. "flex-end" aligns to the bottom. Combining justify-content: center AND align-items: center on a flex container is the classic CSS centering trick — it centers an element both horizontally and vertically.',
        code: '.container {\n  display: flex;\n  justify-content: center;  /* horizontal centering */\n  align-items: center;      /* vertical centering */\n  min-height: 100vh;        /* full viewport height */\n  /* This centers the child BOTH horizontally AND vertically */\n}',
      },
      {
        heading: "CSS Grid: The Basics",
        explanation:
          'To activate CSS Grid, set display: grid on the container. Then use grid-template-columns to define how many columns you want and how wide each should be. The repeat() function is a shortcut — repeat(3, 1fr) means "create 3 columns, each taking up 1 equal fraction of the available space." The gap property adds spacing between grid items, just like in Flexbox.',
        code: '.grid-container {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);  /* 3 equal columns */\n  gap: 16px;                              /* space between items */\n}\n\n/* This creates a 3-column grid:\n   [Item 1] [Item 2] [Item 3]\n   [Item 4] [Item 5] [Item 6]\n   Items automatically wrap to new rows */',
      },
      {
        heading: "Grid: Responsive Columns",
        explanation:
          "The auto-fit and minmax() functions create responsive grids that automatically adjust the number of columns based on available space. auto-fit tells the browser to fit as many columns as possible. minmax(250px, 1fr) means each column is at least 250px wide but can grow to fill remaining space. As the viewport gets narrower, columns automatically collapse and items wrap to the next row — no media queries needed.",
        code: '.responsive-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));\n  gap: 16px;\n}\n\n/* Result:\n   Wide screen:  [col1] [col2] [col3] [col4]\n   Medium screen: [col1] [col2] [col3]\n   Narrow screen: [col1] [col2]\n   Phone:         [col1]\n   All automatic! */',
      },
      {
        heading: "Grid: Named Areas",
        explanation:
          "For complex layouts, grid-template-areas lets you visually design your layout using named regions. You literally draw the layout with strings, where each word is an area name. Then you assign each element to an area using grid-area. This makes complex layouts incredibly readable — you can see the layout in the CSS code itself.",
        code: '.page {\n  display: grid;\n  grid-template-columns: 200px 1fr;\n  grid-template-rows: auto 1fr auto;\n  grid-template-areas:\n    "header  header"\n    "sidebar main"\n    "footer  footer";\n  min-height: 100vh;\n}\n\n.header  { grid-area: header; }\n.sidebar { grid-area: sidebar; }\n.main    { grid-area: main; }\n.footer  { grid-area: footer; }',
      },
      {
        heading: "When to Use Flexbox vs Grid",
        explanation:
          "Use Flexbox when you need to arrange items in a single direction — a navigation bar, a row of buttons, centering content, or distributing space among items in a line. Use CSS Grid when you need to control both rows and columns simultaneously — a page layout, a card grid, or a dashboard with multiple sections. They are not competitors — they work together. Many layouts use Grid for the overall page structure and Flexbox for arranging content within individual sections.",
        code: '/* Flexbox: navigation bar (one row of items) */\nnav {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 16px 24px;\n}\n\n/* Grid: the page layout (rows AND columns) */\n.page {\n  display: grid;\n  grid-template-columns: 250px 1fr;\n  grid-template-rows: auto 1fr auto;\n  min-height: 100vh;\n}',
      },
    ],
  },
  // ─── JavaScript Tutorials ──────────────────────────────────────────────────
  {
    title: "JavaScript Fundamentals",
    description: "Variables, data types, and control flow in JavaScript.",
    category: "JavaScript",
    content: "",
    sections: [
      {
        heading: "What is JavaScript?",
        explanation:
          "JavaScript is the programming language of the web. While HTML defines structure and CSS defines style, JavaScript defines behavior — it makes pages interactive. Every time you click a button, see an animation, submit a form without page reload, or see content update in real-time, JavaScript is making it happen. It runs in the browser and can also run on servers (via Node.js).",
        code: "",
      },
      {
        heading: "Declaring Variables with let and const",
        explanation:
          'In JavaScript, variables store values. There are two modern ways to declare them: let creates a variable whose value can be reassigned later (like a box you can put different things in). const creates a constant whose value cannot be changed after it\'s set (like a locked box). Always prefer const — only use let when you know the value needs to change. Never use var (the old way) because it has confusing scoping behavior.',
        code: '// const: value cannot be changed\nconst name = "Zero to Pro";\nconst maxRetries = 3;\n// maxRetries = 5;  // ERROR! Cannot reassign a const\n\n// let: value CAN be reassigned\nlet score = 0;\nscore = 10;        // this is fine\nlet isLoggedIn = false;\nisLoggedIn = true;  // also fine',
      },
      {
        heading: "Data Types",
        explanation:
          'JavaScript has several built-in data types. String is text (wrapped in quotes). Number is any numeric value (integers and decimals — no separate types). Boolean is true or false. Null is an intentional empty value. Undefined means a variable has been declared but not assigned a value. Object stores key-value pairs. Array is an ordered list. Understanding these types helps you know what operations make sense.',
        code: 'const greeting = "Hello";      // String\nconst age = 25;                // Number (no separate int/float)\nconst price = 9.99;            // also Number\nconst isStudent = true;        // Boolean\nconst nothing = null;          // Null (intentional emptiness)\nlet mystery;                   // Undefined (no value assigned)\nconst user = { name: "Ali", age: 22 };  // Object\nconst colors = ["red", "green", "blue"]; // Array',
      },
      {
        heading: "if/else Conditional Statements",
        explanation:
          "Conditional statements let your code make decisions. The if block checks a condition (something that evaluates to true or false). If the condition is true, the code inside the curly braces runs. If not, the else block runs instead. You can chain multiple conditions with else if. Comparison operators include === (equal to), !== (not equal to), > (greater than), < (less than), >= and <=. Always use === (strict equality) instead of == (loose equality).",
        code: 'const score = 85;\n\nif (score >= 90) {\n  console.log("Excellent!");\n} else if (score >= 75) {\n  console.log("Good job!");\n} else if (score >= 50) {\n  console.log("Passed.");\n} else {\n  console.log("Try again.");\n}\n// Output: "Good job!" (because 85 >= 75)',
      },
      {
        heading: "Loops",
        explanation:
          "Loops let you repeat code multiple times. The for loop runs a specific number of times — the initialization (let i = 0) runs once, the condition (i < 5) is checked before each iteration, and the increment (i++) runs after each iteration. The while loop continues as long as its condition is true. Loops are essential for processing lists of data, generating repeated HTML, and many other tasks.",
        code: '// for loop: repeat exactly 5 times\nfor (let i = 0; i < 5; i++) {\n  console.log("Iteration:", i);\n}\n// Output: 0, 1, 2, 3, 4\n\n// while loop: repeat while condition is true\nlet attempts = 0;\nwhile (attempts < 3) {\n  console.log("Attempt number:", attempts + 1);\n  attempts++;\n}\n// Output: 1, 2, 3',
      },
      {
        heading: "Functions",
        explanation:
          "Functions are reusable blocks of code that perform a specific task. You define a function with a name, optional parameters (inputs), and a body (the code to run). You call the function by writing its name followed by parentheses. There are two syntaxes: the function keyword (traditional) and arrow functions (modern, shorter). Functions can return a value using the return keyword. Writing functions is the foundation of organizing code.",
        code: '// Traditional function declaration\nfunction greet(name) {\n  return "Hello, " + name + "!";\n}\nconsole.log(greet("Ali"));  // "Hello, Ali!"\n\n// Arrow function (modern, shorter syntax)\nconst add = (a, b) => {\n  return a + b;\n};\nconsole.log(add(3, 5));  // 8\n\n// Arrow function with implicit return (single expression)\nconst double = (n) => n * 2;\nconsole.log(double(7));  // 14',
      },
      {
        heading: "Template Literals",
        explanation:
          'Template literals are a modern way to build strings in JavaScript. Instead of concatenating with + signs, you wrap the string in backticks and embed variables directly using ${expression}. This is cleaner, more readable, and less error-prone than string concatenation. You can also create multi-line strings without needing special characters.',
        code: 'const name = "Zero to Pro";\nconst version = 2;\n\n// Old way (hard to read)\nconst old = "Welcome to " + name + " version " + version;\n\n// Template literal (clean and readable)\nconst msg = `Welcome to ${name} version ${version}`;\n\n// Multi-line strings\nconst html = `\n  <div class="card">\n    <h2>${name}</h2>\n    <p>Version ${version}</p>\n  </div>\n`;',
      },
      {
        heading: "Arrays and Array Methods",
        explanation:
          "Arrays are ordered lists of values. JavaScript provides powerful built-in methods to work with arrays. .push() adds an item to the end. .pop() removes the last item. .map() creates a new array by transforming each item. .filter() creates a new array with only items that pass a test. .forEach() runs a function on each item without creating a new array. These methods are used constantly in modern JavaScript.",
        code: 'const numbers = [1, 2, 3, 4, 5];\n\n// push: add to end\nnumbers.push(6);  // [1, 2, 3, 4, 5, 6]\n\n// map: transform each item\nconst doubled = numbers.map(n => n * 2);\n// [2, 4, 6, 8, 10, 12]\n\n// filter: keep items that pass a test\nconst evens = numbers.filter(n => n % 2 === 0);\n// [2, 4, 6]\n\n// forEach: do something with each item\nnumbers.forEach(n => console.log(n));',
      },
    ],
  },
  {
    title: "JavaScript DOM Manipulation",
    description: "Select and update elements on the page with the DOM.",
    category: "JavaScript",
    content: "",
    sections: [
      {
        heading: "What is the DOM?",
        explanation:
          "The DOM (Document Object Model) is a tree-structured representation of your HTML page that JavaScript can read and modify. When the browser loads your HTML, it creates a DOM — a live object in memory where every HTML element is a node. JavaScript uses this object model to find elements, change their content, modify their styles, add new elements, remove existing ones, and respond to user actions.",
        code: "",
      },
      {
        heading: "Selecting Elements",
        explanation:
          "Before you can change an element, you need to find it. document.getElementById('id') finds a single element by its unique ID — this is the fastest method. document.querySelector('.class') finds the FIRST element matching any CSS selector. document.querySelectorAll('tag') finds ALL matching elements and returns a NodeList (like an array). querySelector and querySelectorAll are the most versatile because they accept any CSS selector.",
        code: '// By ID — returns ONE element\nconst title = document.getElementById("title");\n\n// By CSS selector — returns FIRST match\nconst card = document.querySelector(".card");\n\n// By CSS selector — returns ALL matches\nconst buttons = document.querySelectorAll("button");\nconsole.log(buttons.length);  // how many buttons exist\n\n// Combine selectors\nconst navLink = document.querySelector("nav a.active");',
      },
      {
        heading: "Changing Text and HTML Content",
        explanation:
          "Once you have an element, you can change what it displays. textContent sets or gets the plain text inside an element — it strips all HTML tags (safe from XSS attacks). innerHTML sets or gets the HTML inside an element — this lets you insert formatted content but is dangerous if you insert user input without sanitizing it. textContent is preferred for simple text changes; innerHTML is needed when you must insert actual HTML markup.",
        code: 'const el = document.getElementById("message");\n\n// textContent: safe, plain text only\nel.textContent = "Hello, World!";\n\n// innerHTML: can include HTML tags (be careful with user input)\nel.innerHTML = "<strong>Hello!</strong> Welcome to the site.";\n\n// Reading content\nconst currentText = el.textContent;\n// "Hello! Welcome to the site."',
      },
      {
        heading: "Changing Styles and Classes",
        explanation:
          "You can change an element's appearance in two ways. The style property gives you direct access to inline styles (el.style.color = 'blue'). This is fine for dynamic changes. For larger style changes, using classes is better: el.classList.add('active') adds a class, .remove('active') removes it, and .toggle('active') adds it if missing or removes it if present. Toggle is especially useful for show/hide functionality.",
        code: 'const box = document.getElementById("box");\n\n// Direct style changes (inline styles)\nbox.style.backgroundColor = "#6366f1";\nbox.style.color = "white";\nbox.style.padding = "20px";\n\n// Class-based changes (preferred for bigger changes)\nbox.classList.add("highlighted");    // add a class\nbox.classList.remove("hidden");      // remove a class\nbox.classList.toggle("active");      // add if missing, remove if present\n\n// Check if a class exists\nif (box.classList.contains("active")) {\n  console.log("Box is active!");\n}',
      },
      {
        heading: "Listening for Events",
        explanation:
          "Events are things that happen on the page — clicks, key presses, form submissions, mouse movements, page loading, etc. addEventListener() lets you run your code whenever a specific event occurs on an element. You specify the event type (like 'click') and a function to run when it happens. This is how you make pages interactive — the user does something, the event fires, and your JavaScript responds.",
        code: 'const button = document.getElementById("myBtn");\n\n// Run this function when the button is clicked\nbutton.addEventListener("click", function() {\n  alert("Button was clicked!");\n});\n\n// Common events:\n// "click"      — mouse click\n// "dblclick"   — double click\n// "keydown"    — key pressed\n// "submit"     — form submitted\n// "mouseover"  — mouse enters element\n// "input"      — value changed in input\n\n// Input example: live character counter\nconst input = document.querySelector("input");\nconst counter = document.querySelector("span");\ninput.addEventListener("input", function() {\n  counter.textContent = input.value.length + " characters";\n});',
      },
      {
        heading: "Creating and Removing Elements",
        explanation:
          "JavaScript can create new HTML elements on the fly and add them to the page. document.createElement('tag') creates a new element in memory (not yet visible). You then need to append it to an existing element using .appendChild() or .append() to make it appear. To remove an element, call element.remove() directly on it. This is how dynamic web applications work — the page updates without reloading.",
        code: '// Creating a new element\nconst newCard = document.createElement("div");\nnewCard.className = "card";\nnewCard.textContent = "I was created by JavaScript!";\n\n// Adding it to the page\nconst container = document.querySelector(".grid");\ncontainer.appendChild(newCard);\n\n// Removing an element\nconst oldCard = document.querySelector(".old-card");\noldCard.remove();\n\n// Practical example: adding items to a list\nconst list = document.querySelector("ul");\nconst items = ["Learn HTML", "Learn CSS", "Learn JS"];\nitems.forEach(text => {\n  const li = document.createElement("li");\n  li.textContent = text;\n  list.appendChild(li);\n});',
      },
      {
        heading: "Practical Example: Interactive To-Do List",
        explanation:
          "Here is a complete mini-project combining everything: selecting elements, listening for events, creating/removing elements, and modifying content. The user types a task, clicks Add, and the task appears in the list with a Delete button. This pattern — event listener creates a DOM element and appends it — is the foundation of every interactive web application.",
        code: 'const input = document.getElementById("taskInput");\nconst addBtn = document.getElementById("addBtn");\nconst list = document.getElementById("taskList");\n\naddBtn.addEventListener("click", function() {\n  const text = input.value.trim();\n  if (!text) return;  // don\'t add empty tasks\n\n  // Create the list item\n  const li = document.createElement("li");\n  li.textContent = text;\n\n  // Create a delete button\n  const delBtn = document.createElement("button");\n  delBtn.textContent = "Delete";\n  delBtn.addEventListener("click", function() {\n    li.remove();  // remove this list item\n  });\n\n  li.appendChild(delBtn);\n  list.appendChild(li);\n  input.value = "";  // clear the input field\n});',
      },
    ],
  },
  {
    title: "JavaScript ES6 Essentials",
    description: "Destructuring, spread/rest, classes, modules, and Promises — modern JavaScript you'll use daily.",
    category: "JavaScript",
    content: "",
    sections: [
      {
        heading: "What is ES6?",
        explanation:
          'ES6 (ECMAScript 2015) was the biggest update in JavaScript\'s history. It added modern syntax that makes code shorter, cleaner, and less bug-prone. These features run in every modern browser and in Node.js, so they are simply "JavaScript" now — not a separate version. Learning them is what sets production-ready code apart from beginner tutorials.',
        code: '// Pre-ES6: verbose variable + function\nvar greet = function (name) { return "Hello, " + name; };\n\n// ES6: const, arrow function, template literal\nconst greet = (name) => `Hello, ${name}`;\nconsole.log(greet("Ali"));  // Hello, Ali',
      },
      {
        heading: "Destructuring",
        explanation:
          'Destructuring unpacks values from arrays or objects directly into variables in one line — no more repeated arr[0] or user.name everywhere. For arrays, order matches position; for objects, the variable names must match the property names (use the colon syntax to rename). It is everywhere in real code, especially function parameters and API responses.',
        code: '// Array destructuring\nconst [first, second, third] = ["red", "green", "blue"];\nconsole.log(first);  // "red"\n\n// Object destructuring\nconst user = { name: "Ali", age: 22, city: "Lahore" };\nconst { name, age } = user;\nconsole.log(name, age);  // Ali 22\n\n// Rename while destructuring\nconst { city: hometown } = user;\nconsole.log(hometown);  // "Lahore"',
      },
      {
        heading: "Spread & Rest Operators (...)",
        explanation:
          'Three dots do two jobs depending on position. Spread unpacks an iterable into individual elements — the clean way to copy arrays/objects and to combine them. Rest collects a variable number of function arguments into one array. Note that spread copies are shallow: top-level items are copied, but nested objects still share a reference.',
        code: '// Spread: copy + combine arrays\nconst a = [1, 2, 3];\nconst b = [...a, 4, 5];   // [1, 2, 3, 4, 5]\nconsole.log(a);             // original untouched: [1, 2, 3]\n\n// Spread: shallow-copy an object and extend it\nconst original = { x: 1, y: 2 };\nconst copy = { ...original, z: 3 };  // { x: 1, y: 2, z: 3 }\n\n// Rest: collect arguments into an array\nfunction sum(...nums) {\n  return nums.reduce((total, n) => total + n, 0);\n}\nconsole.log(sum(1, 2, 3, 4));  // 10',
      },
      {
        heading: "Classes & Inheritance",
        explanation:
          'Classes give JavaScript a clean, familiar syntax for object-oriented code. A class is a blueprint; new ClassName(...) creates an instance. The constructor() method runs on creation. extends builds a child class that inherits the parent, override methods by redefining them, and call the parent constructor with super(). Behind the scenes JavaScript is still prototype-based, but classes make the intent obvious.',
        code: 'class Animal {\n  constructor(name) {\n    this.name = name;\n  }\n  speak() {\n    return `${this.name} makes a sound`;\n  }\n}\n\nclass Dog extends Animal {\n  speak() {\n    return `${this.name} barks 🐶`;\n  }\n}\n\nconst rex = new Dog("Rex");\nconsole.log(rex.speak());  // "Rex barks 🐶"',
      },
      {
        heading: "Modules: import & export",
        explanation:
          'Modules split code into separate files that import each other. The file sharing code uses export (named exports can be many; a default export is the main value of the file), and the consuming file uses import. Modules make code reusable, testable, and keep the global scope clean. In the browser, a module script is loaded with <script type="module">.',
        code: '// utils.js\nconst TAX_RATE = 0.08;\nexport function total(price) {\n  return price + price * TAX_RATE;\n}\nexport const storeName = "Zero to Pro Shop";\n\n// main.js\nimport { total, storeName } from "./utils.js";\n\nconsole.log(total(100));    // 108\nconsole.log(storeName);     // "Zero to Pro Shop"',
      },
      {
        heading: "Promises & Async/Await",
        explanation:
          'Network calls and other slow operations return a Promise — a value that arrives later. fetch() returns one. .then() runs on success, .catch() on failure. Inside an async function, await pauses until the promise settles, making async code read like normal code. Always wrap await in try/catch and fetch in a try/catch so failures are handled gracefully instead of crashing.',
        code: 'async function loadUsers() {\n  try {\n    const res = await fetch("https://jsonplaceholder.typicode.com/users");\n    if (!res.ok) throw new Error("Network error");\n    const users = await res.json();\n    return users;                 // an array of user objects\n  } catch (err) {\n    console.error("Failed:", err);\n  }\n}\n\n// Usage: loadUsers().then(users => console.log(users.length));',
      },
    ],
  },
  // ─── PHP Tutorials
  {
    title: "PHP Introduction & Output",
    description: "What PHP is, how it runs on a server, and printing your first dynamic output.",
    category: "PHP",
    content: "",
    sections: [
      {
        heading: "What is PHP?",
        explanation:
          "PHP is a server-side scripting language that powers most of the web — including WordPress, Laravel, and millions of sites. Its code runs on the server BEFORE the HTML page is sent to the browser, so visitors never see the PHP source, only the HTML it produces. That server-side nature is what makes PHP ideal for dynamic pages: content can change per user, per login, per database row.",
        code: '<!-- Every browser receives the output, never the PHP -->\n<?php\n  echo "This text was generated by PHP on the server.";\n?>',
      },
      {
        heading: "How PHP Runs",
        explanation:
          "PHP needs a web server (Apache or Nginx) with PHP installed. The simplest local setup is XAMPP or Laragon — they bundle Apache + PHP + MySQL together. PHP files are saved with a .php extension and placed in the web root. You request them with an http://localhost/ URL, the server executes the PHP parts, and returns plain HTML to the browser. Nothing happens if you just double-click a .php file — it must go through the web server.",
        code: "# Typical folder for PHP files\nC:/xampp/htdocs/myproject/index.php\n\n# Open in your browser:\n# http://localhost/myproject/index.php",
      },
      {
        heading: "Opening/Closing Tags & echo",
        explanation:
          'PHP code lives between <?php and ?> tags. Anything outside these tags is sent to the browser unchanged, so you can mix PHP with normal HTML freely. echo outputs text, and the <?= ?> shortcut means <?php echo ?>. Every statement ends with a semicolon. The output of echo becomes part of the page in exactly the place the tag sits.',
        code: '<!DOCTYPE html>\n<html>\n<head><title>My Page</title></head>\n<body>\n  <h1><?php echo "Welcome to Zero to Pro"; ?></h1>\n  <p>Today is <?= date("d F Y") ?>.</p>\n</body>\n</html>',
      },
      {
        heading: "Comments & Case Sensitivity",
        explanation:
          "Use // for single-line comments and /* ... */ for multi-line ones. Built-in function names are case-insensitive (echo and ECHO both work), but your own variable names are case-sensitive: $Name and $name are different variables. Pick one convention and stay consistent — snake_case and camelCase are the two common styles. Good comments explain WHY, not what the code obviously does.",
        code: '<?php\n  // single-line comment\n  /* multi-line\n     comment */\n\n  echo "hello";  // works\n  ECHO "hello";  // also works (functions ignore case)\n\n  $name = "Ali";\n  $Name = "Sara";   // a DIFFERENT variable!\n?>',
      },
      {
        heading: "Variables & Data Types",
        explanation:
          "Variables start with $ and PHP is dynamically typed — you never declare a type. Common types: string, integer, float, boolean, array, NULL. Double-quoted strings interpolate $variables inside them; single-quoted strings print everything literally. The var_dump() function prints a variable's type and value and is the standard debugging tool.",
        code: '<?php\n  $name    = "Ali";      // string\n  $age     = 22;         // integer\n  $price   = 9.99;       // float\n  $isAdmin = false;      // boolean\n\n  echo "Hi, I am $name";   // interpolates -> Hi, I am Ali\n  echo \'That costs $price\'; // literal    -> That costs $price\n\n  var_dump($age);   // int(22)\n?>',
      },
    ],
  },
  {
    title: "PHP Variables, Arrays & Functions",
    description: "Arrays, loops, functions, string helpers, and reading input from forms and the URL.",
    category: "PHP",
    content: "",
    sections: [
      {
        heading: "Arrays",
        explanation:
          "PHP arrays are ordered key/value collections. Indexed arrays use automatic numeric keys (0, 1, 2...); associative arrays use named string keys. PHP 5.4+ prefers the short [] syntax over array(). Add an item with $array[] = value. print_r() is the go-to debug function for arrays — it prints the whole structure.",
        code: '<?php\n  // Indexed array\n  $langs = ["PHP", "Python", "JavaScript"];\n  echo $langs[0];   // PHP\n\n  // Associative array\n  $student = ["name" => "Ali", "score" => 92, "passed" => true];\n  echo $student["name"];   // Ali\n\n  $langs[] = "Java";       // add to the end\n  print_r($langs);         // debug output\n?>\n/* Array\n(\n    [0] => PHP\n    [1] => Python\n    [2] => JavaScript\n    [3] => Java\n) */',
      },
      {
        heading: "Loops over Arrays",
        explanation:
          "foreach is built for arrays — it walks every element without you managing counters. Use the $key => $value form for associative arrays so you keep the keys. break; stops the whole loop, continue; skips the rest of the current round and moves on. These three tools (foreach, break, continue) cover almost every array traversal you will write.",
        code: '<?php\n  $fruits = ["apple", "banana", "mango"];\n  foreach ($fruits as $fruit) {\n    echo "$fruit<br>";\n  }\n\n  $student = ["name" => "Ali", "score" => 92];\n  foreach ($student as $key => $value) {\n    echo "$key: $value<br>";\n  }\n\n  foreach ($fruits as $f) {\n    if ($f === "banana") continue;\n    if ($f === "mango")  break;\n    echo $f;\n  }\n?>',
      },
      {
        heading: "Functions",
        explanation:
          "Functions are named, reusable blocks of code. A function declaration starts with function, takes parameters in parentheses, and returns a value with return. Parameters can have defaults. Scope matters: variables created inside a function are local and do not leak out — pass data in as arguments instead of using globals. Public function names are case-insensitive, and functions must be defined before the script calls them (or use PHP 8's declaration ordering).",
        code: '<?php\n  function greet($name = "Guest") {\n    return "Hello, $name!";\n  }\n  echo greet();        // Hello, Guest!\n  echo greet("Ali");   // Hello, Ali!\n\n  function boxVolume($w, $h, $d) {\n    return $w * $h * $d;\n  }\n  echo boxVolume(2, 3, 4);   // 24\n?>',
      },
      {
        heading: "String Functions",
        explanation:
          "PHP ships with hundreds of string helpers. strlen() returns length; strtoupper()/strtolower() change case; str_replace() swaps text; substr() extracts part of a string; explode() splits a string into an array; implode() joins an array back into a string; trim() strips surrounding whitespace. These dozen-or-so functions cover 90% of everyday text work.",
        code: '<?php\n  $msg = " Zero to Pro ";\n\n  echo strlen($msg);     // 13 (counts the spaces)\n  echo trim($msg);       // "Zero to Pro"\n  echo strtoupper($msg); // "ZERO TO PRO"\n  echo str_replace("Pro", "Coder", $msg);    // " Zero to Coder "\n\n  $parts = explode(" ", trim($msg));  // ["Zero", "to", "Pro"]\n  echo implode("-", $parts);          // "Zero-to-Pro"\n?>',
      },
      {
        heading: "Reading Input: $_GET & $_POST",
        explanation:
          "PHP automatically fills the superglobals $_GET and $_POST — associative arrays of the data from the URL query string or a submitted form. $_GET['q'] reads ?q=... from the URL; $_POST['email'] reads the value of the <input name=\"email\"> from a POST form. Always check isset() before reading, and escape output — htmlspecialchars() — so the value can never break your page.",
        code: '<?php\n  // URL: /search.php?q=php+tutorials\n  if (isset($_GET["q"])) {\n    echo "Searching for: " . htmlspecialchars($_GET["q"]);\n  }\n\n  // After <form method="POST"> with <input name="email">\n  if ($_SERVER["REQUEST_METHOD"] === "POST") {\n    $email = $_POST["email"] ?? "";\n    echo "Email received: " . htmlspecialchars($email);\n  }\n?>',
      },
    ],
  },
  {
    title: "PHP Forms & MySQL Basics",
    description: "Handle form submissions, validate input, and talk to a MySQL database safely with PDO.",
    category: "PHP",
    content: "",
    sections: [
      {
        heading: "Form Handling with POST",
        explanation:
          'A form with method="POST" sends its fields in the HTTP request body — invisible in the URL. method="GET" appends them to the URL instead (fine for searches, bad for passwords). The action attribute points at the PHP script that processes the submission. On that script, PHP collects the values into $_POST. This is the standard pattern for logins, signups, and any request that changes data.',
        code: '<!-- form.html -->\n<form action="register.php" method="POST">\n  <input type="text" name="username" required />\n  <input type="email" name="email" required />\n  <button type="submit">Register</button>\n</form>\n\n<!-- register.php -->\n<?php\n  $username = $_POST["username"] ?? "";\n  $email    = $_POST["email"] ?? "";\n  echo "Registered $username ($email)";\n?>',
      },
      {
        heading: "Sanitizing & Validating Input",
        explanation:
          "Never trust user input — it is the number-one source of security holes (XSS and SQL injection). filter_input() validates against a filter: FILTER_VALIDATE_EMAIL rejects anything that is not a real email. htmlspecialchars() escapes output so stored text can never execute as HTML or JavaScript. Passwords are hashed with password_hash() and compared with password_verify() — never stored or compared in plain text.",
        code: '<?php\n  $email = filter_input(INPUT_POST, "email", FILTER_VALIDATE_EMAIL);\n  if ($email === false) {\n    die("Invalid email address.");\n  }\n\n  // Escape anything user-supplied before echoing it\n  $name = htmlspecialchars($_POST["name"] ?? "");\n\n  // Passwords: never plaintext\n  $hash = password_hash($_POST["password"], PASSWORD_DEFAULT);\n  $ok   = password_verify($_POST["password"], $hash);   // true\n?>',
      },
      {
        heading: "Connecting to MySQL with PDO",
        explanation:
          "PDO is PHP's consistent database interface — the same API for MySQL, PostgreSQL, and SQLite. You build a DSN string describing the server, then new PDO(...) opens the connection. Setting ERRMODE to ERRMODE_EXCEPTION makes errors throw exceptions you can catch, instead of failing silently. The dbname points at your database; charset=utf8mb4 makes international text and emoji store correctly.",
        code: '<?php\n  $dsn = "mysql:host=localhost;dbname=learn_db;charset=utf8mb4";\n  $pdo = new PDO($dsn, "root", "", [\n    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,\n    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,\n  ]);\n  echo "Connected successfully";\n?>',
      },
      {
        heading: "Prepared Statements (Injection-Safe SQL)",
        explanation:
          "Never concatenate user input into SQL — that is exactly how SQL injection happens. Prepared statements send the SQL template and the values separately: the question marks or named placeholders are bound with execute(), and the database treats the values as data, never as executable SQL. Injection becomes impossible. Use prepared statements for every query that touches user input.",
        code: '<?php\n  $pdo = new PDO("mysql:host=localhost;dbname=learn_db", "root", "");\n\n  $stmt = $pdo->prepare(\n    "INSERT INTO users (name, email) VALUES (:name, :email)"\n  );\n  $stmt->execute([\n    ":name"  => htmlspecialchars($_POST["name"]),\n    ":email" => filter_input(INPUT_POST, "email", FILTER_VALIDATE_EMAIL),\n  ]);\n  echo "User created, id=" . $pdo->lastInsertId();\n?>\n\n// Reading rows safely in one line:\n// $rows = $pdo->query("SELECT * FROM users")->fetchAll();',
      },
      {
        heading: "Fetching & Displaying Rows",
        explanation:
          "After a SELECT, fetchAll() returns an array of associative rows; fetch() returns one row at a time (kinder to memory on huge tables). Query column names become array keys. Mix HTML and PHP naturally and always htmlspecialchars() anything that came from a database — data edited by other users must never be able to inject scripts into your page.",
        code: '<?php\n  $pdo = new PDO("mysql:host=localhost;dbname=learn_db", "root", "");\n  $users = $pdo->query("SELECT id, name, email FROM users")->fetchAll();\n?>\n\n<table>\n  <?php foreach ($users as $u): ?>\n    <tr>\n      <td><?= $u["id"] ?></td>\n      <td><?= htmlspecialchars($u["name"]) ?></td>\n      <td><?= htmlspecialchars($u["email"]) ?></td>\n    </tr>\n  <?php endforeach; ?>\n</table>',
      },
    ],
  },
  // ─── C++ Tutorials
  {
    title: "C++ Basics: Syntax & Variables",
    description: "A compiled language — hello world, data types, input/output, and naming rules.",
    category: "C++",
    content: "",
    sections: [
      {
        heading: "What is C++?",
        explanation:
          "C++ is a powerful compiled language that grew out of C by adding classes and object-oriented programming. Because it compiles to fast native machine code, it powers games, operating systems, browsers, and embedded systems. You write a .cpp source file, the compiler converts it to a machine-code program, then you run that program — compile, then link, then run. That is the key difference from interpreted languages like Python.",
        code: "# You write source, the compiler makes an executable\n# g++ is the classic compiler\n\ng++ -o hello hello.cpp      # compile + link\n./hello                     # run the program\n\n# On Windows you get hello.exe instead",
      },
      {
        heading: "Hello World Anatomy",
        explanation:
          "#include <iostream> pulls in the input/output library that lets you print to the console. main() is where every program starts — the operating system calls it. Returning 0 tells the OS the program succeeded. std::cout is the output stream; << chains values into it, and std::endl adds a newline and flushes the buffer. std::cout avoids needing using namespace std;.",
        code: '#include <iostream>\n\nint main() {\n    std::cout << "Hello, Zero to Pro!" << std::endl;\n    return 0;\n}\n\n// Compile & run -> prints:\n// Hello, Zero to Pro!',
      },
      {
        heading: "Variables & Data Types",
        explanation:
          "C++ is statically typed — every variable declares its type before use, and the type decides what it can hold. int is a whole number, double a decimal, char a single character, bool true/false, and string text (from <string>). Declare before use. Getting the type right matters because it tells the compiler how much memory to reserve and how to interpret those bytes.",
        code: '#include <iostream>\n#include <string>\n\nint main() {\n    int age = 22;\n    double price = 9.99;\n    char grade = \'A\';\n    bool passed = true;\n    std::string name = "Ali";\n\n    std::cout << age << " " << price << " " << grade\n              << " " << passed << " " << name << std::endl;\n    return 0;\n}',
      },
      {
        heading: "Input with cin & Output with cout",
        explanation:
          "cin reads input from the keyboard with the >> operator. The program pauses until the user types and presses Enter. Extraction skips leading whitespace and stops at the next space or newline. Always print a clear prompt before reading. For full lines with spaces (like a full name) use std::getline(std::cin, line) instead of cin >> , which only reads one word.",
        code: '#include <iostream>\n#include <string>\n\nint main() {\n    std::string name;\n    int age;\n\n    std::cout << "Enter your name: ";\n    std::cin >> name;\n\n    std::cout << "Enter your age: ";\n    std::cin >> age;\n\n    std::cout << "Hi " << name << ", you are " << age << std::endl;\n    return 0;\n}',
      },
      {
        heading: "Comments & Naming Rules",
        explanation:
          "// marks a single-line comment; /* ... */ a multi-line comment. Comments do not compile — they exist for human readers. Name rules: start with a letter or underscore, then letters, digits, and underscores. No spaces, no reserved keywords, and cannot start with a digit. Public convention: snake_case or camelCase for variables, Capitalized names for classes. Good names make code self-documenting.",
        code: '#include <iostream>\n\nint main() {\n    // single-line comment\n    /* multi-line\n       comment */\n\n    int playerScore = 0;    // camelCase\n    int max_lives = 3;      // snake_case also common\n    // int 2fast = 5;       // ERROR: cannot start with a digit\n\n    return 0;\n}',
      },
    ],
  },
  {
    title: "C++ Control Flow & Functions",
    description: "if/else, switch, loops, and writing reusable functions — including overloads.",
    category: "C++",
    content: "",
    sections: [
      {
        heading: "if/else & switch",
        explanation:
          "if, else if, and else branch the program. Comparison operators are == (equal), != (not equal), <, >, <=, >= and logical ones are && (AND), || (OR), ! (NOT). When you compare one variable against several fixed constants, switch is often cleaner: each case compares the value, and break; prevents falling through to the next case. The default: case handles anything unmatched.",
        code: '#include <iostream>\n\nint main() {\n    int score = 85;\n\n    if (score >= 90) {\n        std::cout << "A grade\\n";\n    } else if (score >= 75) {\n        std::cout << "B grade\\n";\n    } else {\n        std::cout << "Keep practicing\\n";\n    }\n\n    char grade = \'A\';\n    switch (grade) {\n        case \'A\': std::cout << "Excellent!\\n"; break;\n        case \'B\': std::cout << "Good job\\n";  break;\n        default:   std::cout << "Keep trying\\n";\n    }\n    return 0;\n}',
      },
      {
        heading: "Loops",
        explanation:
          "A for loop runs a fixed number of times: the counter initializes once, the condition is checked before each round, and the update runs after each round. A while loop runs while its condition is true. A do-while checks the condition AFTER the body, so it always runs at least once. Anything you repeat — printing a list, summing 1..n, reading lines — belongs in a loop.",
        code: '#include <iostream>\n\nint main() {\n    // for: exactly 5 rounds\n    for (int i = 1; i <= 5; i++) {\n        std::cout << i << " ";        // 1 2 3 4 5\n    }\n    std::cout << "\\n";\n\n    // while: runs while condition holds\n    int n = 10;\n    while (n > 0) n--;\n\n    // do-while: guaranteed at least one run\n    int tries = 0;\n    do { tries++; } while (tries < 1);\n\n    return 0;\n}',
      },
      {
        heading: "Functions",
        explanation:
          "A function packages reusable logic. The return type comes first, then the name, then the parameters in parentheses, then the body. Values come back with return. Default parameter values let callers omit arguments. Pass-by-value means the function works on a copy — the caller's variable is untouched. Keep functions small and single-purpose so they are easy to test and reuse.",
        code: '#include <iostream>\n#include <string>\n\nint add(int a, int b) {\n    return a + b;\n}\n\nvoid greet(std::string name = "Guest") {\n    std::cout << "Hello, " << name << "!\\n";\n}\n\nint main() {\n    std::cout << add(3, 5) << "\\n";   // 8\n    greet();                            // Hello, Guest!\n    greet("Ali");                       // Hello, Ali!\n    return 0;\n}',
      },
      {
        heading: "Function Overloading",
        explanation:
          "C++ lets several functions share the same name as long as their parameter lists differ in type or count — this is overloading. The compiler picks the right version from the arguments you call with. You can write one area() for circles (a double) and another for rectangles (two doubles) — a natural, readable API. The return type alone cannot distinguish overloads; the parameters must differ.",
        code: '#include <iostream>\n\nint    add(int a, int b)           { return a + b; }\ndouble add(double a, double b)    { return a + b; }\nint    add(int a, int b, int c)   { return a + b + c; }\n\nint main() {\n    std::cout << add(1, 2) << "\\n";       // 3    (int, int)\n    std::cout << add(1.5, 2.5) << "\\n";   // 4    (double, double)\n    std::cout << add(1, 2, 3) << "\\n";    // 6    (int, int, int)\n    return 0;\n}',
      },
      {
        heading: "Arrays & std::string",
        explanation:
          "A C++ array is a fixed-size list of same-typed elements. The size must be decided when you create it, and indexing starts at 0. Arrays and loops appear together constantly: loop to fill, loop to print. For text, prefer std::string from <string> over raw char arrays — it manages its own memory and provides methods like length() and push_back() that make text work pleasant and safe.",
        code: '#include <iostream>\n#include <string>\n\nint main() {\n    int scores[5] = {90, 82, 75, 91, 88};\n\n    int total = 0;\n    for (int i = 0; i < 5; i++) total += scores[i];\n    std::cout << "Average: " << total / 5 << "\\n";    // 85\n\n    std::string name = "Zero to Pro";\n    std::cout << name.length() << "\\n";               // 11\n    return 0;\n}',
      },
    ],
  },
  {
    title: "C++ Classes & Objects (OOP)",
    description: "Object-oriented C++ — classes, constructors, encapsulation, inheritance, and polymorphism.",
    category: "C++",
    content: "",
    sections: [
      {
        heading: "OOP Concepts",
        explanation:
          "Object-oriented programming groups data and the functions that operate on it into objects. A class is the blueprint; an object is one instance made from it. Three ideas anchor OOP: encapsulation (hide internal state behind methods), inheritance (new classes reuse and extend existing ones), and polymorphism (one interface, different behaviors per type). C++ expresses all three natively.",
        code: '// A class is the blueprint...\nclass Player {\npublic:\n    int score = 0;\n    void boost() { score += 10; }\n};\n\n// ...an object is one instance of it\nPlayer ali;\nali.boost();\n// ali.score is now 10',
      },
      {
        heading: "Defining a Class",
        explanation:
          "class Name { members }; defines a class. Members are data (attributes) and functions (methods). Members are private by default, so open the public: section for what outside code may call. Methods defined inline live inside the class; otherwise declare them there and define them elsewhere with ClassName::method(). Create objects with plain syntax — Player p; (no new needed for stack objects) — and access members with the dot operator.",
        code: '#include <iostream>\n#include <string>\n\nclass Student {\npublic:\n    std::string name;\n    int score;\n\n    void introduce() {\n        std::cout << "I am " << name << ", score " << score << "\\n";\n    }\n};\n\nint main() {\n    Student s;\n    s.name = "Ali";\n    s.score = 92;\n    s.introduce();    // I am Ali, score 92\n    return 0;\n}',
      },
      {
        heading: "Constructors & Destructors",
        explanation:
          'A constructor runs automatically when an object is created — the place to set initial values. It shares the class name and has no return type. A destructor (~Name) runs when the object is destroyed (goes out of scope) — ideal for cleaning up resources. With parameters, you create fully-formed objects in one line: Student s("Ali", 92). That is the standard, safer way to build objects.',
        code: '#include <iostream>\n#include <string>\n\nclass Student {\nprivate:\n    std::string name;\n    int score;\n\npublic:\n    Student(std::string n, int s) : name(n), score(s) {\n        std::cout << "Student created\\n";\n    }\n    ~Student() { std::cout << "Student destroyed\\n"; }\n\n    void show() const {\n        std::cout << name << " : " << score << "\\n";\n    }\n};\n\nint main() {\n    Student ali("Ali", 92);\n    ali.show();\n    return 0;\n}',
      },
      {
        heading: "Encapsulation: private & accessors",
        explanation:
          "Encapsulation protects an object's internal data. Make attributes private, then expose controlled access through public getters and setters. Validate inside the setter — reject a negative score, for example — so an object can never reach an invalid state. The class owns its rules; the rest of the program asks politely through the methods.",
        code: '#include <iostream>\n\nclass BankAccount {\nprivate:\n    double balance = 0;\n\npublic:\n    void deposit(double amount) {\n        if (amount > 0) balance += amount;\n    }\n    bool withdraw(double amount) {\n        if (amount > 0 && amount <= balance) {\n            balance -= amount;\n            return true;\n        }\n        return false;\n    }\n    double getBalance() const { return balance; }\n};\n\nint main() {\n    BankAccount acc;\n    acc.deposit(100);\n    acc.withdraw(40);\n    std::cout << acc.getBalance() << "\\n";    // 60\n    return 0;\n}',
      },
      {
        heading: "Inheritance & Polymorphism",
        explanation:
          "class Derived : public Base lets a new class reuse and extend a base class; it adds members and can override base methods. Mark a base method virtual to enable polymorphism: calling that method through a pointer or reference to the base type runs the derived version, so one interface behaves differently per object. This is how frameworks let you plug in your own behavior.",
        code: '#include <iostream>\n#include <string>\n\nclass Animal {\npublic:\n    virtual std::string speak() const { return "..."; }\n};\n\nclass Dog : public Animal {\npublic:\n    std::string speak() const override { return "Woof!"; }\n};\n\nclass Cat : public Animal {\npublic:\n    std::string speak() const override { return "Meow!"; }\n};\n\nint main() {\n    Dog d; Cat c;\n    Animal* a1 = &d;\n    Animal* a2 = &c;\n    std::cout << a1->speak() << " " << a2->speak() << "\\n";\n    // Woof! Meow!\n    return 0;\n}',
      },
    ],
  },
  // ─── React Tutorials
  {
    title: "React Fundamentals: Components & JSX",
    description: "What React is, setting up with Vite, JSX syntax, functional components, and rendering lists.",
    category: "React",
    content: "",
    sections: [
      {
        heading: "What is React?",
        explanation:
          "React is a JavaScript library for building user interfaces out of components. Instead of editing the DOM by hand, you describe what the UI should look like for each state, and React updates the page automatically when that state changes. A component is a function that returns the UI for one part of the screen. Because React makes minimal, targeted DOM changes, interfaces stay fast even as data changes constantly.",
        code: "// React is component-based:\n// a component is a function that returns UI\nfunction App() {\n  return <h1>Hello from Zero to Pro</h1>;\n}\n\nexport default App;",
      },
      {
        heading: "Setting Up with Vite",
        explanation:
          "Vite is the recommended way to start a React project — one command scaffolds a project with dev server, hot reload, and build tooling, so you can write components immediately. npm create vite@latest prompts for a framework: choose React (JavaScript). Then npm run dev starts the live server. The three files that matter most are src/main.jsx (the entry point that mounts <App />), src/App.jsx (your first component), and index.html (the HTML shell).",
        code: "npm create vite@latest my-app -- --template react\ncd my-app\nnpm install\nnpm run dev\n\n# Files you touch most:\n# src/main.jsx  — entry point, mounts <App />\n# src/App.jsx   — your first component\n# index.html    — the HTML shell",
      },
      {
        heading: "JSX",
        explanation:
          "JSX looks like HTML but is JavaScript — a build step transforms it into React.createElement() calls. Rules to remember: one root element per component (wrap siblings in a fragment <>...</>), className instead of class, attributes use camelCase, and braces {} embed JavaScript expressions in markup. JSX is just syntax sugar for describing the tree React renders, and inside {} you can use any JS expression.",
        code: "function Card() {\n  const user = { name: \"Ali\", online: true };\n\n  return (\n    <div className=\"card\">\n      {/* JS comment inside JSX */}\n      <h2>{user.name}</h2>\n      <p>{user.online ? \"Online\" : \"Offline\"}</p>\n      <button className=\"btn\">Follow</button>\n    </div>\n  );\n}",
      },
      {
        heading: "Functional Components & Props",
        explanation:
          "A functional component is a plain function that receives props — a read-only object of data the parent passes down — and returns JSX. Props flow one way: parents hand data to children, children render it, and children never modify it. Reusing one component with different props is the whole point of component-based UI. Whatever the function returns is exactly what React renders.",
        code: "function UserCard({ name, role }) {\n  return (\n    <div>\n      <h3>{name}</h3>\n      <p className=\"role\">{role}</p>\n    </div>\n  );\n}\n\nfunction App() {\n  return (\n    <>\n      <UserCard name=\"Ali\"  role=\"Student\" />\n      <UserCard name=\"Sara\" role=\"Mentor\" />\n    </>\n  );\n}",
      },
      {
        heading: "Lists with map()",
        explanation:
          "Render lists by mapping an array to JSX with the map() method. React requires a unique key prop on each item so it can efficiently track what changed, was added, or was removed. Keys should come from real identifiers like item.id — never the array index if the list can be reordered. The key goes on the outermost element of the repeated JSX.",
        code: "function Languages() {\n  const languages = [\n    { id: 1, name: \"React\" },\n    { id: 2, name: \"PHP\" },\n    { id: 3, name: \"C++\" },\n  ];\n\n  return (\n    <ul>\n      {languages.map((lang) => (\n        <li key={lang.id}>{lang.name}</li>\n      ))}\n    </ul>\n  );\n}",
      },
    ],
  },
  {
    title: "React State & Props",
    description: "One-way data flow, useState, controlled inputs, and lifting state up.",
    category: "React",
    content: "",
    sections: [
      {
        heading: "Props: One-Way Data Flow",
        explanation:
          "Props are how parents pass data to children. They are read-only — a child can never modify the props it receives. If a child needs to change something, the parent owns the data and passes down both the value and an updater function. This one-way flow keeps the app predictable: data travels down the tree, and changes flow back up through callbacks.",
        code: "function Counter({ value, onIncrement }) {\n  return (\n    <div>\n      <span>Count: {value}</span>\n      <button onClick={onIncrement}>+</button>\n    </div>\n  );\n}\n\nfunction App() {\n  return (\n    <Counter value={5} onIncrement={() => alert(\"incremented!\")} />\n  );\n}",
      },
      {
        heading: "State with useState",
        explanation:
          "State is data a component owns that can change over time and causes re-rendering. The useState hook returns a pair: [currentValue, setter]. When you call the setter with a new value, React re-renders the component and shows the fresh state. useState(0) sets the starting value. State is the heart of interactive React — every input, toggle, and live update is state under the hood.",
        code: "import { useState } from \"react\";\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n\n  return (\n    <button onClick={() => setCount(count + 1)}>\n      Clicked {count} times\n    </button>\n  );\n}",
      },
      {
        heading: "Updating State from Previous State",
        explanation:
          "When new state depends on the previous state, pass the setter a function: setCount((prev) => prev + 1). React guarantees prev is the latest value, so even rapid or batched updates never use a stale count. The direct form setCount(count + 1) is fine for one-off clicks, but the functional form is safer and is the recommended default for counters, toggles, and anything that queues multiple updates.",
        code: "function Counter() {\n  const [count, setCount] = useState(0);\n\n  return (\n    <>\n      <h2>{count}</h2>\n      <button onClick={() => setCount((prev) => prev + 1)}>Add</button>\n      <button onClick={() => setCount((prev) => prev - 1)}>Subtract</button>\n      <button onClick={() => setCount(0)}>Reset</button>\n    </>\n  );\n}",
      },
      {
        heading: "Controlled Components (Forms)",
        explanation:
          "An input whose value is held in React state and updated on every keystroke is a controlled component. The input's value comes from state, and onChange calls the setter with e.target.value. The displayed text and the state are always in sync — one source of truth. That is how React forms work: type -> onChange fires -> state updates -> value re-renders.",
        code: "import { useState } from \"react\";\n\nfunction TextInput() {\n  const [name, setName] = useState(\"\");\n\n  return (\n    <label>\n      Name:\n      <input\n        value={name}\n        onChange={(e) => setName(e.target.value)}\n        placeholder=\"Type here...\"\n      />\n    </label>\n  );\n}",
      },
      {
        heading: "Lifting State Up",
        explanation:
          "When two sibling components need the same data, lift the state to their closest common parent. The parent holds the state and passes both values and updaters down as props. The children stop owning the data — they display it and notify the parent of changes. This single source of truth is the classic React pattern for sharing state between components.",
        code: "function App() {\n  const [score, setScore] = useState(0);\n\n  return (\n    <>\n      <Pane title=\"Left\"  value={score} onAdd={() => setScore((s) => s + 1)} />\n      <Pane title=\"Right\" value={score} onAdd={() => setScore((s) => s + 1)} />\n    </>\n  );\n}\n\nfunction Pane({ title, value, onAdd }) {\n  return (\n    <div>\n      <h3>{title}: {value}</h3>\n      <button onClick={onAdd}>+</button>\n    </div>\n  );\n}",
      },
    ],
  },
  {
    title: "React Events & Hooks",
    description: "Handling events, useState in practice, useEffect, conditional rendering, and data fetching.",
    category: "React",
    content: "",
    sections: [
      {
        heading: "Handling Events",
        explanation:
          "React events are camelCase — onClick, onSubmit, onChange — and always receive a function, not a string. Handlers get the synthetic event object e: e.target is the element that fired the event, and e.preventDefault() stops default behavior like a form submitting and reloading the page. Because handlers are just functions, they close over the current render's props and state.",
        code: "function Form() {\n  function handleSubmit(e) {\n    e.preventDefault();          // stop the page reload\n    console.log(\"Form submitted\");\n  }\n\n  return <form onSubmit={handleSubmit}>...</form>;\n}\n\n// Inline arrows work too:\n// <button onClick={() => console.log(\"clicked\")}>Go</button>",
      },
      {
        heading: "useState in Practice: a To-Do List",
        explanation:
          "Combining state and events drives real UIs. This mini to-do keeps the task list in state, adds a task with the functional update setTasks(prev => [...prev, task]) — always building from the latest array — and removes one with filter(). It is the same pattern used in production apps, just smaller.",
        code: "import { useState } from \"react\";\n\nfunction Todo() {\n  const [tasks, setTasks] = useState([]);\n  const [text, setText] = useState(\"\");\n\n  const addTask = () => {\n    if (!text.trim()) return;\n    setTasks((prev) => [...prev, text.trim()]);\n    setText(\"\");\n  };\n\n  const removeTask = (index) => {\n    setTasks((prev) => prev.filter((_, i) => i !== index));\n  };\n\n  return (\n    <div>\n      <input value={text} onChange={(e) => setText(e.target.value)} />\n      <button onClick={addTask}>Add</button>\n      <ul>\n        {tasks.map((t, i) => (\n          <li key={i} onClick={() => removeTask(i)}>{t}</li>\n        ))}\n      </ul>\n    </div>\n  );\n}\n\nexport default Todo;",
      },
      {
        heading: "useEffect for Side Effects",
        explanation:
          "useEffect runs side effects after the component renders — fetching data, timers, subscriptions, updating the document title. It takes a function and an optional dependency array: with [] it runs once after the first render (mount), with [userId] it re-runs when that value changes, and with no array it runs after every render. A returned cleanup function runs before re-running or on unmount.",
        code: "import { useState, useEffect } from \"react\";\n\nfunction Clock() {\n  const [time, setTime] = useState(new Date().toLocaleTimeString());\n\n  useEffect(() => {\n    const id = setInterval(() => {\n      setTime(new Date().toLocaleTimeString());\n    }, 1000);\n\n    return () => clearInterval(id);    // cleanup on unmount\n  }, []);\n\n  return <p>🕐 {time}</p>;\n}",
      },
      {
        heading: "Conditional Rendering",
        explanation:
          "Conditionals in JSX are just JavaScript expressions. A ternary (cond ? a : b) picks between two branches; && renders a single element only when the condition is truthy. The common pattern is loading/empty states: if there is no data, show a message; otherwise render the list. Because JSX is JavaScript, any expression inside {} can branch.",
        code: "function Profile({ user }) {\n  if (!user) return <p>Please log in.</p>;\n\n  return (\n    <div>\n      <h2>{user.name}</h2>\n      {user.online && <span className=\"badge\">● Online</span>}\n      {user.bio ? <p>{user.bio}</p> : <p>No bio yet.</p>}\n    </div>\n  );\n}",
      },
      {
        heading: "Mini App: Fetching with useEffect",
        explanation:
          "Fetching data is the classic useEffect use case. The effect runs after mount, so define an async function inside it, call it, and store the result in state. The [] dependency array keeps the fetch to a single request, and try/catch plus a loading state ensure the UI never hangs if the network fails. Load on mount -> show loading -> render data powers nearly every data-driven React app.",
        code: "import { useState, useEffect } from \"react\";\n\nfunction UsersList() {\n  const [users, setUsers] = useState([]);\n  const [loading, setLoading] = useState(true);\n\n  useEffect(() => {\n    async function load() {\n      try {\n        const res = await fetch(\"https://jsonplaceholder.typicode.com/users\");\n        setUsers(await res.json());\n      } catch (err) {\n        console.error(err);\n      } finally {\n        setLoading(false);\n      }\n    }\n    load();\n  }, []);\n\n  if (loading) return <p>Loading users...</p>;\n  return (\n    <ul>\n      {users.map((u) => (\n        <li key={u.id}>{u.name}</li>\n      ))}\n    </ul>\n  );\n}",
      },
    ],
  },
  // ─── Bootstrap Tutorials
  {
    title: "Bootstrap 5 Basics & Grid",
    description: "Add Bootstrap with the CDN, understand containers and breakpoints, and build with the 12-column grid.",
    category: "Bootstrap",
    content: "",
    sections: [
      {
        heading: "What is Bootstrap?",
        explanation:
          "Bootstrap is the most popular CSS framework for building responsive websites fast. It gives you pre-styled classes for layout (grid), components (buttons, cards, navbar), and utilities (spacing, colors, visibility). Instead of writing custom CSS for everything, you compose these classes directly in your HTML. Bootstrap 5 dropped the jQuery dependency entirely — it is plain CSS with a little vanilla JavaScript.",
        code: '<button class="btn btn-primary">Primary Button</button>\n\n<div class="card" style="width: 18rem;">\n  <div class="card-body">Card content</div>\n</div>',
      },
      {
        heading: "Installing with the CDN",
        explanation:
          "The fastest setup is the Bootstrap CDN: paste one CSS <link> into the head and one JavaScript bundle <script> before the closing body tag. No download, no build step. The JS bundle powers interactive components like dropdowns, modals, and carousels — all driven by data-attributes, no custom JavaScript needed. For production you might download the compiled files, but the CDN is perfect for learning.",
        code: '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8" />\n  <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />\n</head>\n<body>\n  <!-- page content -->\n  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>\n</body>\n</html>',
      },
      {
        heading: "Containers & Breakpoints",
        explanation:
          "Containers center and pad your content with a max-width that grows at each breakpoint. Breakpoints are Bootstrap's responsive thresholds: sm (≥576px), md (≥768px), lg (≥992px), xl (≥1200px), xxl (≥1400px). The system is mobile-first: styles start for the smallest screen, and breakpoint-prefixed classes apply from that size upward. Using a container keeps your layout aligned and professional on every device.",
        code: '<div class="container">\n  <p>Centered content with a max-width that steps up at each breakpoint.</p>\n</div>\n\n<!-- Breakpoints: sm 576 / md 768 / lg 992 / xl 1200 / xxl 1400 (px) -->\n<div class="bg-dark text-white p-3">Resize me — container + columns adapt.</div>',
      },
      {
        heading: "The Grid System",
        explanation:
          "Bootstrap's grid has 12 columns. You nest a .row inside a container, then add .col-*-* children that span a number of columns. col-md-8 spans 8 columns from the md breakpoint upward, and stacks vertically below md unless you add a base col- class. Rows are flex containers, so children sit side by side. The columns in a row should add up to 12 — anything less leaves empty space.",
        code: '<div class="container">\n  <div class="row">\n    <div class="col-md-8">Main content (8 columns)</div>\n    <div class="col-md-4">Sidebar (4 columns)</div>\n  </div>\n</div>\n\n<!-- Equal halves on every screen -->\n<div class="row">\n  <div class="col-6">Left half</div>\n  <div class="col-6">Right half</div>\n</div>',
      },
      {
        heading: "Responsive Columns",
        explanation:
          "Layer breakpoint classes to control layout on every screen. col-12 means full width on phones; col-md-6 means half width from medium up; col-lg-3 means a quarter from large up — the same markup adapts without a single media query. Auto-layout is free too: a bare col (no number) divides the row evenly among however many columns you add.",
        code: '<div class="row">\n  <!-- 1 column on phones, 2 on tablets, 4 on desktop -->\n  <div class="col-12 col-md-6 col-lg-3">Card 1</div>\n  <div class="col-12 col-md-6 col-lg-3">Card 2</div>\n  <div class="col-12 col-md-6 col-lg-3">Card 3</div>\n  <div class="col-12 col-md-6 col-lg-3">Card 4</div>\n</div>\n\n<!-- Auto layout: equal widths, no sizes needed -->\n<div class="row">\n  <div class="col">A</div>\n  <div class="col">B</div>\n  <div class="col">C</div>\n</div>',
      },
    ],
  },
  {
    title: "Bootstrap Components",
    description: "Buttons, badges, alerts, cards, navbar, progress bars, and spinners out of the box.",
    category: "Bootstrap",
    content: "",
    sections: [
      {
        heading: "Buttons",
        explanation:
          "Buttons arrive fully styled: btn sets the base, then a color class — btn-primary, btn-success, btn-danger, and more. btn-outline-* gives transparent bordered variants, and btn-sm/btn-lg control size. disabled=\"disabled\" greys them out and blocks clicks. The same classes work on <button>, <a>, and <input> elements, so you can style links as buttons without extra CSS.",
        code: '<button class="btn btn-primary">Primary</button>\n<button class="btn btn-success">Success</button>\n<button class="btn btn-danger">Danger</button>\n<button class="btn btn-outline-primary">Outline</button>\n<button class="btn btn-lg btn-warning">Large warning</button>\n<button class="btn btn-sm btn-secondary" disabled>Disabled</button>',
      },
      {
        heading: "Badges & Alerts",
        explanation:
          "Badges attach small labels or counts to a component; with position-relative + translate-middle they sit on a corner. Alerts are contextual feedback boxes — .alert plus .alert-* colors. Add alert-dismissible and a button with data-bs-dismiss=\"alert\" to make one dismissable. Both are trivial to add and instantly readable, which makes them ideal for status messages and notification counts.",
        code: '<h1>Notifications\n  <span class="badge text-bg-danger">3 new</span>\n</h1>\n\n<button class="btn btn-primary position-relative">\n  Inbox\n  <span class="badge text-bg-warning position-absolute top-0 start-100 translate-middle rounded-pill">99+</span>\n</button>\n\n<div class="alert alert-success d-flex justify-content-between">\n  <span>✔ Your changes were saved.</span>\n  <button class="btn-close" data-bs-dismiss="alert"></button>\n</div>',
      },
      {
        heading: "Cards",
        explanation:
          "Cards are flexible content containers. Optional pieces: card-header, card-img-top, card-body (the main area), card-title, card-text, card-footer. Pair a card with the grid to build beautiful content grids in minutes. Cards are the workhorse for profiles, products, posts, and dashboard panels — and they just work on any screen size.",
        code: '<div class="card" style="width: 20rem;">\n  <img src="cover.png" class="card-img-top" alt="Course cover" />\n  <div class="card-body">\n    <h5 class="card-title">Zero to Pro Course</h5>\n    <p class="card-text">Learn React from scratch with hands-on projects.</p>\n    <a href="#" class="btn btn-primary">Start Learning</a>\n  </div>\n</div>\n\n<!-- Cards inside a responsive grid: -->\n<div class="row row-cols-1 row-cols-md-3 g-4">\n  <div class="col"><div class="card"><div class="card-body">Course 1</div></div></div>\n  <div class="col"><div class="card"><div class="card-body">Course 2</div></div></div>\n  <div class="col"><div class="card"><div class="card-body">Course 3</div></div></div>\n</div>',
      },
      {
        heading: "Navbar",
        explanation:
          "navbar is Bootstrap's responsive header. navbar-expand-lg controls when the links switch from a horizontal row to the hamburger menu. The toggler button (data-bs-toggle=\"collapse\") and the menu div (id matched by data-bs-target) make the collapse work with no custom JavaScript. Bootstrap's nav components handle the hardest responsive-pattern pieces for you.",
        code: '<nav class="navbar navbar-expand-lg navbar-dark bg-dark px-3">\n  <a class="navbar-brand" href="#">Zero to Pro</a>\n  <button class="navbar-toggler" type="button"\n    data-bs-toggle="collapse" data-bs-target="#navMenu">\n    <span class="navbar-toggler-icon"></span>\n  </button>\n  <div class="collapse navbar-collapse" id="navMenu">\n    <ul class="navbar-nav ms-auto">\n      <li class="nav-item"><a class="nav-link" href="#">Home</a></li>\n      <li class="nav-item"><a class="nav-link" href="#">Courses</a></li>\n      <li class="nav-item"><a class="nav-link" href="#">About</a></li>\n    </ul>\n  </div>\n</nav>',
      },
      {
        heading: "Progress Bars & Spinners",
        explanation:
          "Progress bars and spinners communicate progress and loading visually. .progress wraps a .progress-bar whose width style sets the fill — update it as data arrives. spinner-border is the classic spinning ring; spinner-grow is a pulsing dot. Both accept size and color modifiers, and with progress-bar-striped animated you get an animated striped bar for file uploads and loading screens.",
        code: '<div class="progress" role="progressbar" style="height: 20px;">\n  <div class="progress-bar progress-bar-striped progress-bar-animated bg-success"\n    style="width: 75%;">75%</div>\n</div>\n\n<div class="spinner-border text-primary" role="status"></div>\n<div class="spinner-grow text-warning" role="status"></div>',
      },
    ],
  },
  {
    title: "Bootstrap Forms & Utilities",
    description: "Stylish form controls, input groups, validation, spacing utilities, and a complete page.",
    category: "Bootstrap",
    content: "",
    sections: [
      {
        heading: "Form Controls",
        explanation:
          "Bootstrap styles every standard input with form-control: text, email, password, select, and textarea. Wrap each label + control in mb-3 for consistent spacing. form-label styles the label text; form-select turns a <select> into the styled dropdown. Touch-friendly sizes, rounded corners, and a working default border — forms come out looking finished with zero custom CSS.",
        code: '<form>\n  <div class="mb-3">\n    <label for="name" class="form-label">Full name</label>\n    <input type="text" class="form-control" id="name" placeholder="Ali Khan" />\n  </div>\n  <div class="mb-3">\n    <label for="email" class="form-label">Email address</label>\n    <input type="email" class="form-control" id="email" placeholder="you@example.com" />\n  </div>\n  <div class="mb-3">\n    <label for="lang" class="form-label">Language</label>\n    <select class="form-select" id="lang">\n      <option selected>PHP</option>\n      <option>C++</option>\n      <option>React</option>\n    </select>\n  </div>\n  <button type="submit" class="btn btn-primary">Submit</button>\n</form>',
      },
      {
        heading: "Input Groups",
        explanation:
          "input-group attaches text, icons, or buttons directly to an input — ideal for search bars, URL prefixes, and currencies. The prefix/suffix sits inside the group and the input's outer corners melt away so everything looks joined as one control. Inside a form the group still submits under the input's name attribute, exactly like an ungrouped input.",
        code: '<div class="input-group mb-3">\n  <input type="search" class="form-control" placeholder="Search tutorials..." />\n  <button class="btn btn-primary" type="button">Search</button>\n</div>\n\n<div class="input-group mb-3">\n  <span class="input-group-text">@</span>\n  <input type="text" class="form-control" placeholder="username" />\n</div>',
      },
      {
        heading: "Validation Classes",
        explanation:
          "Add is-valid or is-invalid to an input and Bootstrap colors it green or red automatically. The matching feedback shows when the control has the class — invalid-feedback must come right after its control. You toggle these classes from JavaScript or server responses during validation. Validation keeps users informed without writing any custom styling.",
        code: '<form>\n  <div class="mb-3">\n    <label for="email" class="form-label">Email</label>\n    <input type="email" id="email" class="form-control is-invalid" value="not-an-email" />\n    <div class="invalid-feedback">Please enter a valid email.</div>\n  </div>\n  <div class="mb-3">\n    <label for="pass" class="form-label">Password</label>\n    <input type="password" id="pass" class="form-control is-valid" value="secret123" />\n    <div class="valid-feedback">Looks good!</div>\n  </div>\n</form>',
      },
      {
        heading: "Spacing & Layout Utilities",
        explanation:
          "Utilities are single-class helpers: p for padding, m for margin, a side letter (t, r, b, s, e, or x/y for horizontal/vertical), and a size 0-5 (0, .25rem, .5rem, 1rem, 1.5rem, 3rem) plus auto. So p-4 is 1.5rem padding all sides, mt-3 is 1rem top margin, and mx-auto centers a block. Prefix a breakpoint — md:mt-0 — to reset margin at that size. Utilities replace most one-off CSS.",
        code: '<div class="p-5 mb-3 bg-primary text-white">Big padding, bottom margin</div>\n<div class="py-2 px-4 bg-secondary text-white">Vertical + horizontal padding</div>\n<div class="mx-auto bg-info text-dark p-2" style="width: 200px;">Centered block</div>\n\n<!-- Responsive: margin on phones, none from md up -->\n<div class="m-2 md:m-0">Responsive margin</div>',
      },
      {
        heading: "Colors, Text & a Complete Page",
        explanation:
          "text-*-* and bg-*-* color everything — text-primary, bg-secondary, text-bg-dark — and typography utilities handle alignment (text-center), size (fs-1 ... fs-6), weight (fw-bold), and muted text. Combine these with the grid and components from the previous lessons and you can assemble a complete, professional landing page using Bootstrap classes alone — no custom CSS file needed.",
        code: '<div class="container py-5">\n  <div class="text-center mb-4">\n    <span class="badge text-bg-primary mb-2">New</span>\n    <h1 class="fw-bold">Zero to Pro</h1>\n    <p class="text-muted fs-5">Learn coding the hands-on way.</p>\n  </div>\n  <div class="row row-cols-1 row-cols-md-3 g-4">\n    <div class="col">\n      <div class="card border-primary">\n        <div class="card-body">\n          <h5 class="card-title">HTML</h5>\n          <p class="card-text text-muted">Structure pages</p>\n        </div>\n      </div>\n    </div>\n    <div class="col">\n      <div class="card border-success">\n        <div class="card-body">\n          <h5 class="card-title">CSS</h5>\n          <p class="card-text text-muted">Style everything</p>\n        </div>\n      </div>\n    </div>\n    <div class="col">\n      <div class="card border-warning">\n        <div class="card-body">\n          <h5 class="card-title">JavaScript</h5>\n          <p class="card-text text-muted">Add behavior</p>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>',
      },
    ],
  },
  ];

async function seedTutorials() {
  const allTutorials = [...defaultTutorials, ...loadSeedDataTutorials()];
  let created = 0;
  let updated = 0;
  for (const t of allTutorials) {
    const existing = await Home.findOne({ title: t.title });
    if (existing) {
      // Update existing tutorial with new sections data
      existing.description = t.description;
      existing.category = t.category;
      existing.sections = t.sections || [];
      existing.content = t.content || "";
      await existing.save();
      updated++;
    } else {
      await Home.create(t);
      created++;
    }
  }
  return { created, updated, total: allTutorials.length };
}

// Question bank is stored in data/questions.json.
// Categories are bucketed by fixed qNum ranges so a category can be fetched
// by number range rather than string matching:
//   qNum   1 -  100  -> HTML
//   qNum 101 -  200  -> CSS
//   qNum 201 -  300  -> JavaScript
//   qNum 301 -  400  -> PHP
//   qNum 401 -  500  -> C++
//   qNum 501 -  600  -> React
//   qNum 601 -  700  -> Bootstrap
//   qNum 701 -  800  -> General

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected");

  // Seed / update the quiz with the question bank
  const existing = await Test.findOne({ title: "Full Stack Programming Quiz" });
  if (existing) {
    existing.questions = questions;
    await existing.save();
    console.log("Updated existing quiz with", questions.length, "questions");
  } else {
    await Test.create({ title: "Full Stack Programming Quiz", questions });
    console.log("Created quiz with", questions.length, "questions");
  }

  // Seed the tutorial library
  const result = await seedTutorials();
  console.log(`Tutorials: ${result.created} created, ${result.updated} updated, ${result.total - result.created - result.updated} unchanged (${result.total} total in seed)`);

  // One-time cleanup: remove the old "DevHub" tutorials from before the rename
  const stale = await Home.deleteMany({ title: /DevHub/i });
  if (stale.deletedCount > 0) console.log(`Removed ${stale.deletedCount} stale "DevHub" tutorial(s)`);

  // Seed a default admin user if none exists
  const adminEmail = process.env.ADMIN_EMAIL || "admin@devhub.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  const admin = await User.findOne({ email: adminEmail });
  if (!admin) {
    await User.create({
      name: "Admin",
      email: adminEmail,
      password: adminPassword,
      role: "admin",
    });
    console.log(`Created default admin: ${adminEmail} (password: ${adminPassword})`);
  } else {
    console.log("Admin user already exists:", adminEmail);
  }

  await mongoose.disconnect();
  console.log("Done. Disconnected.");
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
