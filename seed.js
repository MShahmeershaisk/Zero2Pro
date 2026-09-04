require("dotenv").config();
const mongoose = require("mongoose");
const Test = require("./models/test");
const User = require("./models/user");
const Home = require("./models/home");
const questions = require("./data/questions.json");

// Default tutorial library seeded on first run (HTML, CSS, JavaScript, General)
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
        code: '// const: value cannot be changed\nconst name = "DevHub";\nconst maxRetries = 3;\n// maxRetries = 5;  // ERROR! Cannot reassign a const\n\n// let: value CAN be reassigned\nlet score = 0;\nscore = 10;        // this is fine\nlet isLoggedIn = false;\nisLoggedIn = true;  // also fine',
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
        code: 'const name = "DevHub";\nconst version = 2;\n\n// Old way (hard to read)\nconst old = "Welcome to " + name + " version " + version;\n\n// Template literal (clean and readable)\nconst msg = `Welcome to ${name} version ${version}`;\n\n// Multi-line strings\nconst html = `\n  <div class="card">\n    <h2>${name}</h2>\n    <p>Version ${version}</p>\n  </div>\n`;',
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
  // ─── General Tutorial ──────────────────────────────────────────────────────
  {
    title: "Getting Started with DevHub",
    description: "How to make the most of the compiler, quizzes, and AI assistant.",
    category: "General",
    content: "",
    sections: [
      {
        heading: "Welcome to DevHub!",
        explanation:
          "DevHub is your all-in-one coding education platform. It combines a live code compiler, knowledge quizzes, structured tutorials, and an AI assistant into a single interface. Whether you are learning your first language or sharpening your skills, DevHub gives you everything you need to practice and grow — all without leaving the browser.",
        code: "",
      },
      {
        heading: "The Live Code Compiler",
        explanation:
          "Navigate to the Compiler page to access a full-featured code editor powered by Monaco Editor (the same editor that powers VS Code). Select your language from the dropdown — Python, Java, JavaScript, or HTML — and start writing code. Click Run to execute it. The output appears in the panel to the right. For HTML, you get a live preview of your rendered page. You can also paste stdin input for programs that require user input.",
        code: '// Try this JavaScript example:\nconst languages = ["Python", "Java", "JavaScript", "HTML"];\nlanguages.forEach(lang => {\n  console.log(`DevHub supports ${lang}!`);\n});',
      },
      {
        heading: "The Quiz System",
        explanation:
          "Test your knowledge with automated quizzes covering Python, Java, HTML, and JavaScript. Each quiz contains 35 randomly selected questions from a pool of 400. You need 75% or higher to pass. Select your category, answer each question, and submit to see your score immediately. The quiz tracks your results and shows you which questions you got wrong so you can study those topics.",
        code: "",
      },
      {
        heading: "The AI Assistant",
        explanation:
          "Look for the chat widget in the bottom-right corner of every page (it is intentionally hidden on the quiz page to prevent cheating). You can ask the AI to explain code concepts, debug errors, suggest improvements, or walk you through topics step by step. It is like having a coding tutor available 24/7.",
        code: "",
      },
      {
        heading: "The Tutorial Library",
        explanation:
          "You are here! The Tutorials page contains structured learning guides organized by category. Each tutorial breaks down code into small pieces with detailed explanations so you can understand exactly what every line does. Browse by category — HTML, CSS, JavaScript — and click Read Lesson to open a tutorial.",
        code: "",
      },
      {
        heading: "Tips for Success",
        explanation:
          "Start with the tutorials to learn concepts, then use the compiler to practice them hands-on. After each topic, take a quiz to test your understanding. Use the AI assistant whenever you get stuck. The best way to learn programming is by writing code — so don't just read the tutorials, type out every example yourself and experiment with changing things to see what happens. Happy coding!",
        code: "",
      },
    ],
  },
];

async function seedTutorials() {
  let created = 0;
  let updated = 0;
  for (const t of defaultTutorials) {
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
  return { created, updated };
}

// Question bank is stored in data/questions.json.
// Categories are bucketed by fixed qNum ranges so a category can be fetched
// by number range rather than string matching:
//   qNum   1 -  100  -> Python
//   qNum 101 -  200  -> Java
//   qNum 201 -  300  -> HTML
//   qNum 301 -  400  -> JavaScript

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
  console.log(`Tutorials: ${result.created} created, ${result.updated} updated, ${defaultTutorials.length - result.created - result.updated} unchanged`);

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
