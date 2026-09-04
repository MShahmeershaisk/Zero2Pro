// Har language ke liye starting placeholder code — pehle yeh object hi
// missing tha, isi wajah se page load hote hi ek error aa rahi thi aur
// us error ki wajah se neeche wala runBtn click listener kabhi register
// hi nahi ho pa raha tha (Run button kaam nahi kar raha tha).
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

document.addEventListener("DOMContentLoaded", () => {
  const langSelect = document.getElementById("langSelect");
  const codeInput = document.getElementById("codeInput");
  const stdinWrapper = document.getElementById("stdinWrapper");
  const stdinInput = document.getElementById("stdinInput");
  const runBtn = document.getElementById("runBtn");
  const output = document.getElementById("output");
  const previewFrame = document.getElementById("previewFrame");

  function renderPreview(html) {
    if (!previewFrame) return;
    const doc = previewFrame.contentDocument || previewFrame.contentWindow.document;
    doc.open();
    doc.write(html);
    doc.close();
  }

  // Run button ka listener sabse pehle register karte hain, taake agar
  // neeche kisi aur cheez (placeholder/UI setup) mein kabhi error aaye
  // bhi, tab bhi Run button kaam karta rahe.
  if (runBtn) {
    runBtn.addEventListener("click", async () => {
      const selectedLang = langSelect ? langSelect.value.toLowerCase().trim() : "python";
      const code = codeInput.value;

      if (!code.trim()) {
        if (selectedLang === "html") {
          renderPreview("<p>Pehle kuch code likho.</p>");
        } else {
          output.textContent = "Pehle kuch code likho.";
        }
        return;
      }

      if (selectedLang === "html") {
        renderPreview(code);
        return;
      }

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

  // Code ke andar check karo ki input function maujood hai ya nahi
  function checkInputRequirement() {
    if (!langSelect || !stdinWrapper) return;
    const lang = langSelect.value.toLowerCase().trim();
    const code = codeInput.value;

    let needsInput = false;

    if (lang === "python") {
      needsInput = /\binput\s*\(/.test(code);
    } else if (lang === "java") {
      needsInput = /\b(Scanner|System\.in|BufferedReader|Console)\b/.test(code);
    } else if (lang === "javascript") {
      needsInput = /\b(readline|process\.stdin)\b/.test(code);
    }

    // Dynamic visibility toggling
    if (needsInput) {
      stdinWrapper.style.display = "block";
    } else {
      stdinWrapper.style.display = "none";
      if (stdinInput) stdinInput.value = ""; // Auto reset input value
    }
  }

  function updateUIForLanguage() {
    if (!langSelect) return;
    const lang = langSelect.value.toLowerCase().trim();

    codeInput.value = PLACEHOLDERS[lang] || "";

    checkInputRequirement();

    if (output && previewFrame) {
      if (lang === "html") {
        output.style.display = "none";
        previewFrame.style.display = "block";
      } else {
        output.style.display = "block";
        previewFrame.style.display = "none";
      }
    }
  }

  if (langSelect) {
    langSelect.addEventListener("change", updateUIForLanguage);
  }

  if (codeInput) {
    // Typing ya paste karne par real-time check karo
    codeInput.addEventListener("input", checkInputRequirement);
  }

  updateUIForLanguage();
});