// Zero to Pro Compiler — Monaco Editor integration
// Loads Monaco via CDN, wires language selector, run/clear, output + previews.

// Default starting code per language
const PLACEHOLDERS = {
  python: "print('Hello World')",
  java:
    "public class Main {\n" +
    "  public static void main(String[] args) {\n" +
    "    System.out.println(\"Hello World\");\n" +
    "  }\n" +
    "}",
  javascript: "console.log('Hello World');",
  html: "<h1>Hello World</h1>",
  css: "body {\n  font-family: Arial, sans-serif;\n  background: #f0f4ff;\n}\n\nh1 {\n  color: #4f46e5;\n}\n\nbutton {\n  background: #4f46e5;\n  color: #fff;\n  border: none;\n  padding: 10px 18px;\n  border-radius: 8px;\n}",
  php: "<?php\n// PHP example\n$name = \"Zero to Pro\";\necho \"Hello from \" . $name . \"!\";\n?>",
  cpp: "#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << \"Hello from C++!\" << endl;\n    return 0;\n}",
  react:
    "function App() {\n" +
    "  return <h1 style={{ color: 'indigo' }}>Hello React!</h1>;\n" +
    "}\n\n" +
    "ReactDOM.createRoot(document.getElementById('root')).render(<App />);",
  bootstrap:
    '<div class="container py-5 text-center">\n' +
    '  <span class="badge text-bg-primary mb-2">Zero to Pro</span>\n' +
    '  <h1 class="fw-bold">Bootstrap Demo</h1>\n' +
    '  <button class="btn btn-success mt-3">Click Me</button>\n' +
    "</div>",
  general: "",
};

// Map our select values to Monaco language ids
const MONACO_LANG = {
  python: "python",
  java: "java",
  javascript: "javascript",
  html: "html",
  css: "css",
  php: "php",
  cpp: "cpp",
  react: "javascript",
  bootstrap: "html",
  general: "plaintext",
};

// These languages run as a live browser preview (no backend call)
const PREVIEW_LANGS = new Set(["html", "css", "bootstrap", "react"]);

let editor = null;

// Configure Monaco's AMD loader to fetch from the CDN
require.config({ paths: { vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs" } });

function initMonaco(initialLang, initialValue) {
  require(["vs/editor/editor.main"], function () {
    editor = monaco.editor.create(document.getElementById("editor"), {
      value: initialValue,
      language: MONACO_LANG[initialLang] || "python",
      theme: "vs-dark",
      automaticLayout: true,
      fontSize: 14,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      tabSize: 4,
      lineNumbers: "on",
      wordWrap: "on",
    });

    // After editor loads, wire everything that depends on it
    wireEvents();
    updateUIForLanguage(initialLang);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const langSelect = document.getElementById("langSelect");
  const initialLang = langSelect ? langSelect.value.toLowerCase().trim() : "python";

  // Start Monaco with the initial language placeholder.
  // "Select Language" selected hoga to empty editor aata hai — Python code nahi.
  initMonaco(initialLang, initialLang ? (PLACEHOLDERS[initialLang] || "") : "");
});

function wireEvents() {
  const langSelect = document.getElementById("langSelect");
  const stdinWrapper = document.getElementById("stdinWrapper");
  const stdinInput = document.getElementById("stdinInput");
  const runBtn = document.getElementById("runBtn");
  const clearBtn = document.getElementById("clearBtn");
  const output = document.getElementById("output");
  const previewFrame = document.getElementById("previewFrame");
  const fixAI = document.getElementById("fixAIBtn");
  let lastDebugPrompt = "";
  let lastDebugLang = "";

  // Language choose hone tak Run disabled rehta hai
  if (runBtn) runBtn.disabled = true;

  function langDisplayName(lang) {
    const names = {
      javascript: "JavaScript",
      html: "HTML",
      css: "CSS",
      php: "PHP",
      cpp: "C++",
      react: "React",
      bootstrap: "Bootstrap",
      general: "General",
    };
    return names[lang] || lang.charAt(0).toUpperCase() + lang.slice(1);
  }

  function buildDebugPrompt(langName, code, errorOutput) {
    return (
      "Mujhe compiler par program error de raha hai. Language: " + langName + ".\n\n" +
      "Mera code:\n---\n" + code + "\n---\n\n" +
      "Compiler error:\n---\n" + (errorOutput || "(No output)") + "\n---\n\n" +
      "Is error ka sahi fix batayein. Sahi code likh kar dein (poora program) aur chota sa bata dein ke kya galti thi."
    );
  }

  // Compiler run ke baad error aaya to AI khud open ho kar fix batata hai.
  // AI sirf code + language + error READ karta hai — koi write access nahi.
  function handleRunResult(lang, code, data) {
    if (fixAI) fixAI.classList.add("hidden");

    if (data && data.success === false) {
      lastDebugPrompt = buildDebugPrompt(langDisplayName(lang), code, data.output);
      lastDebugLang = lang;

      if (window.ZTP_SIGNED_IN) {
        if (window.ZTPAI && typeof window.ZTPAI.ask === "function") {
          window.ZTPAI.ask(lastDebugPrompt); // auto-open + auto-send
        }
      }
      if (fixAI) fixAI.classList.remove("hidden");
    }
  }

  if (fixAI) {
    fixAI.addEventListener("click", () => {
      if (!window.ZTP_SIGNED_IN) {
        window.location.href = "/login";
        return;
      }
      if (window.ZTPAI && typeof window.ZTPAI.ask === "function" && lastDebugPrompt) {
        window.ZTPAI.ask(lastDebugPrompt);
      }
    });
  }

  function renderPreview(html) {
    if (!previewFrame) return;
    const doc = previewFrame.contentDocument || previewFrame.contentWindow.document;
    doc.open();
    doc.write(html);
    doc.close();
  }

  // Kaunsi language live-preview (browser) mein chalti hai, uska HTML build karo
  function buildPreviewDoc(lang, code) {
    if (lang === "html") return code;
    if (lang === "css") {
      return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>CSS Preview</title>
<style>${code}</style>
</head>
<body>
  <main style="max-width:640px;margin:auto;padding:2rem 1rem">
    <h1>CSS Live Preview</h1>
    <p>Apna CSS yahan apply hote hue dekho — heading, text, aur button sab is CSS se style hote hain.</p>
    <button>Click Me</button>
  </main>
</body>
</html>`;
    }
    if (lang === "bootstrap") {
      return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Bootstrap Preview</title>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">
  ${code}
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>`;
    }
    if (lang === "react") {
      return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>React Preview</title>
<style>#root{font-family:Arial,sans-serif;padding:1rem}#root h1{color:#4338ca}</style>
</head>
<body>
<div id="root"></div>
<script src="https://unpkg.com/react@18/umd/react.production.min.js"><\/script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"><\/script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"><\/script>
<script type="text/babel" data-presets="react">
${code}
<\/script>
</body>
</html>`;
    }
    return code;
  }

  if (runBtn) {
    runBtn.addEventListener("click", async () => {
      const selectedLang = langSelect ? langSelect.value.toLowerCase().trim() : "python";
      const code = editor ? editor.getValue() : "";

      // Pehle language select karna zaroori hai
      if (!selectedLang) {
        output.textContent = "Pehle language select karein (Select Language dropdown se).";
        return;
      }

      if (!code.trim()) {
        if (PREVIEW_LANGS.has(selectedLang)) {
          renderPreview("<p style=\"font-family:sans-serif\">Please write some code first.</p>");
        } else {
          output.textContent = "Please write some code first.";
        }
        return;
      }

      // General — concept category, code language nahi
      if (selectedLang === "general") {
        output.style.display = "block";
        previewFrame.style.display = "none";
        output.textContent = "General ek tutorial/concept category hai, ek programming language nahi. Upar se koi language select karein (JavaScript, HTML, C++, PHP, etc.) aur code likhein.";
        return;
      }

      // Browser preview languages — koi backend call nahi
      if (PREVIEW_LANGS.has(selectedLang)) {
        output.style.display = "none";
        previewFrame.style.display = "block";
        renderPreview(buildPreviewDoc(selectedLang, code));
        return;
      }

      output.style.display = "block";
      previewFrame.style.display = "none";
      output.textContent = "Running...";
      runBtn.disabled = true;

      try {
        const res = await fetch("/api/run", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            language: selectedLang,
            code: code,
            stdin: stdinInput ? stdinInput.value : "",
          }),
        });

        const data = await res.json();
        output.textContent = data.output;
        handleRunResult(selectedLang, code, data);
      } catch (err) {
        output.textContent = "Error: " + err.message;
      } finally {
        runBtn.disabled = false;
      }
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      if (!editor) return;
      const lang = langSelect ? langSelect.value.toLowerCase().trim() : "python";
      editor.setValue(PLACEHOLDERS[lang] || "");
      if (output) output.textContent = "";
      if (stdinInput) stdinInput.value = "";
      if (stdinWrapper) stdinWrapper.style.display = "none";
      // Preview languages par preview reset karo (fairly empty demo)
      const isPreview = PREVIEW_LANGS.has(lang);
      if (previewFrame) {
        if (isPreview) {
          previewFrame.style.display = "block";
          renderPreview(buildPreviewDoc(lang, PLACEHOLDERS[lang] || ""));
        } else {
          previewFrame.style.display = "none";
        }
      }
      if (output) output.style.display = isPreview ? "none" : "block";
    });
  }

  // Check whether the code uses an input function, and show the input box if so
  function checkInputRequirement() {
    if (!langSelect || !stdinWrapper || !editor) return;
    const lang = langSelect.value.toLowerCase().trim();
    const code = editor.getValue();

    let needsInput = false;

    if (lang === "python") {
      needsInput = /\binput\s*\(/.test(code);
    } else if (lang === "java") {
      needsInput = /\b(Scanner|System\.in|BufferedReader|Console)\b/.test(code);
    } else if (lang === "javascript") {
      needsInput = /\b(readline|process\.stdin)\b/.test(code);
    } else if (lang === "php") {
      needsInput = /\b(fgets\s*\(|readline\s*\()/.test(code);
    } else if (lang === "cpp") {
      needsInput = /\bcin\s*>>|std::cin|getline\s*\(\s*cin/.test(code);
    }

    if (needsInput) {
      stdinWrapper.style.display = "block";
    } else {
      stdinWrapper.style.display = "none";
      if (stdinInput) stdinInput.value = "";
    }
  }

  function updateUIForLanguage(lang) {
    const selectedLang = lang || (langSelect ? langSelect.value.toLowerCase().trim() : "python");
    if (!editor) return;

    // Keep the editor value if the user has typed something in this language;
    // otherwise reset to the placeholder
    if (PREVIEW_LANGS.has(selectedLang)) {
      if (output) output.style.display = "none";
      if (previewFrame) {
        previewFrame.style.display = "block";
        // Language change par placeholder/current code ka preview turant dikha do
        renderPreview(buildPreviewDoc(selectedLang, editor.getValue() || PLACEHOLDERS[selectedLang] || ""));
      }
    } else {
      if (output) output.style.display = "block";
      if (previewFrame) previewFrame.style.display = "none";
    }

    checkInputRequirement();
  }

  if (langSelect) {
    langSelect.addEventListener("change", () => {
      const lang = langSelect.value.toLowerCase().trim();
      // Set the Monaco language mode and swap in the placeholder for that language
      if (editor) {
        monaco.editor.setModelLanguage(editor.getModel(), MONACO_LANG[lang] || "python");
        editor.setValue(PLACEHOLDERS[lang] || "");
      }
      updateUIForLanguage(lang);
      // Language select karne par hi Run enabled hota hai
      if (runBtn) runBtn.disabled = !lang;
    });
  }

  if (editor) {
    editor.onDidChangeModelContent(checkInputRequirement);
  }
}