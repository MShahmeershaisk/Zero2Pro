const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");

const tempDir = path.join(__dirname, "..", "temp");
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

function cleanupFiles(files) {
  files.forEach((file) => {
    if (file && fs.existsSync(file)) {
      try {
        if (fs.lstatSync(file).isDirectory()) {
          fs.rmSync(file, { recursive: true, force: true });
        } else {
          fs.unlinkSync(file);
        }
      } catch (e) {
        console.error("Cleanup error:", e);
      }
    }
  });
}

// Security Check: Block external library imports
function checkForbiddenLibraries(lang, code) {
  if (lang === "python") {
    // Python Built-in modules list (allowed ones)
    const allowedModules = [
      "math", "random", "time", "datetime", "sys", "os", 
      "re", "json", "string", "collections", "itertools", "functools"
    ];

    // Find all imported packages
    const importMatches = [
      ...code.matchAll(/^\s*(?:import|from)\s+([a-zA-Z0-9_]+)/gm)
    ];

    for (const match of importMatches) {
      const mod = match[1];
      if (!allowedModules.includes(mod)) {
        return `Security Error: External library '${mod}' is not allowed in this compiler! Only pure standard logic is supported.`;
      }
    }
  } else if (lang === "java") {
    // Block third-party non-standard java imports
    const importMatches = [
      ...code.matchAll(/^\s*import\s+([^;]+);/gm)
    ];

    for (const match of importMatches) {
      const imp = match[1].trim();
      if (!imp.startsWith("java.") && !imp.startsWith("javax.")) {
        return `Security Error: External library import '${imp}' is not allowed!`;
      }
    }
  } else if (lang === "javascript") {
    // Node.js built-in modules list (allowed ones)
    const allowedModules = [
      "assert", "buffer", "crypto", "events", "path", "querystring",
      "readline", "string_decoder", "url", "util", "math"
    ];

    // Catch both require("x") and ES-module import statements
    const requireMatches = [
      ...code.matchAll(/require\(\s*["']([^"']+)["']\s*\)/g)
    ];
    const importMatches = [
      ...code.matchAll(/^\s*import\s+(?:[\w*{}\s,]+\s+from\s+)?["']([^"']+)["']/gm)
    ];

    for (const match of [...requireMatches, ...importMatches]) {
      const mod = match[1];
      if (!allowedModules.includes(mod)) {
        return `Security Error: External library '${mod}' is not allowed in this compiler! Only pure standard logic is supported.`;
      }
    }
  }
  return null;
}

function runLocalCode(lang, code, stdin = "") {
  return new Promise((resolve) => {
    // Library Restriction Validation
    const forbiddenError = checkForbiddenLibraries(lang, code);
    if (forbiddenError) {
      return resolve({ success: false, output: forbiddenError });
    }

    const timestamp = Date.now();
    let command = "";
    let mainFilePath = "";
    let filesToClean = [];

    if (lang === "python") {
      mainFilePath = path.join(tempDir, `script_${timestamp}.py`);
      filesToClean.push(mainFilePath);
      fs.writeFileSync(mainFilePath, code);
      const pyCmd = process.platform === "win32" ? "python" : "python3";
      command = `${pyCmd} -u "${mainFilePath}"`;
    } else if (lang === "java") {
      const classNameMatch = code.match(/public\s+class\s+([A-Za-z0-9_]+)/);
      const className = classNameMatch ? classNameMatch[1] : "Main";
      const javaRunDir = path.join(tempDir, `java_${timestamp}`);
      if (!fs.existsSync(javaRunDir)) fs.mkdirSync(javaRunDir);
      mainFilePath = path.join(javaRunDir, `${className}.java`);
      filesToClean.push(javaRunDir);
      fs.writeFileSync(mainFilePath, code);
      command = `javac "${mainFilePath}" && java -cp "${javaRunDir}" ${className}`;
    } else if (lang === "javascript") {
      mainFilePath = path.join(tempDir, `script_${timestamp}.js`);
      filesToClean.push(mainFilePath);
      fs.writeFileSync(mainFilePath, code);
      command = `node "${mainFilePath}"`;
    } else {
      return resolve({ success: false, output: `Unsupported language: ${lang}` });
    }

    const childProcess = exec(command, { timeout: 15000 }, (error, stdout, stderr) => {
      cleanupFiles(filesToClean);
      if (error) {
        if (error.killed) {
          return resolve({ success: false, output: "Error: Code execution timed out (15s limit). Check your inputs!" });
        }
        return resolve({ success: false, output: stderr || error.message });
      }
      resolve({ success: true, output: stdout.trim() || "(No output)" });
    });

    if (childProcess.stdin) {
      if (stdin) {
        childProcess.stdin.write(stdin + "\n");
      }
      childProcess.stdin.end();
    }
  });
}

function showCompiler(req, res) {
  res.render("compiler/compiler");
}

async function runCode(req, res) {
  let { code, language, stdin } = req.body;

  if (!code || typeof code !== "string") {
    return res.status(400).json({ success: false, output: "No code provided" });
  }

  let lang = (language || "").toLowerCase().trim();
  if (!lang) {
    lang = "python";
  } else if (lang === "js") {
    lang = "javascript";
  }

  const input = typeof stdin === "string" ? stdin : "";

  try {
    const result = await runLocalCode(lang, code, input);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, output: "Server error: " + err.message });
  }
}

module.exports = {
  showCompiler,
  runCode,
};