// DevHub Compiler — Monaco Editor integration
// Loads Monaco via CDN, wires language selector, run/clear, output + HTML preview.

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
};

// Map our select values to Monaco language ids
const MONACO_LANG = {
  python: "python",
  java: "java",
  javascript: "javascript",
  html: "html",
};

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

  // Start Monaco with the initial language placeholder
  initMonaco(initialLang, PLACEHOLDERS[initialLang] || "");
});

function wireEvents() {
  const langSelect = document.getElementById("langSelect");
  const stdinWrapper = document.getElementById("stdinWrapper");
  const stdinInput = document.getElementById("stdinInput");
  const runBtn = document.getElementById("runBtn");
  const clearBtn = document.getElementById("clearBtn");
  const output = document.getElementById("output");
  const previewFrame = document.getElementById("previewFrame");

  function renderPreview(html) {
    if (!previewFrame) return;
    const doc = previewFrame.contentDocument || previewFrame.contentWindow.document;
    doc.open();
    doc.write(html);
    doc.close();
  }

  if (runBtn) {
    runBtn.addEventListener("click", async () => {
      const selectedLang = langSelect ? langSelect.value.toLowerCase().trim() : "python";
      const code = editor ? editor.getValue() : "";

      if (!code.trim()) {
        if (selectedLang === "html") {
          renderPreview("<p>Please write some code first.</p>");
        } else {
          output.textContent = "Please write some code first.";
        }
        return;
      }

      if (selectedLang === "html") {
        output.style.display = "none";
        previewFrame.style.display = "block";
        renderPreview(code);
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
      if (previewFrame) previewFrame.style.display = "none";
      if (output) output.style.display = "block";
      if (stdinInput) stdinInput.value = "";
      if (stdinWrapper) stdinWrapper.style.display = "none";
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
    if (selectedLang === "html") {
      if (output) output.style.display = "none";
      if (previewFrame) previewFrame.style.display = "block";
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
    });
  }

  if (editor) {
    editor.onDidChangeModelContent(checkInputRequirement);
  }
}
