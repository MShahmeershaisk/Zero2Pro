const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");

const tempDir = path.join(__dirname, "..", "temp");
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

// Capture the output of large programs completely (the default Node limit is
// only 200KB — larger output used to throw an error).
const EXEC_OPTIONS = {
  timeout: 30000, // 30s — for long compilation/execution
  maxBuffer: 20 * 1024 * 1024, // 20MB of output allowed
  windowsHide: true,
};

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

// Languages that run as a live browser preview need nothing from the server.
// (CSS/Bootstrap/React/HTML are rendered client-side.)
const PREVIEW_LANGS = new Set(["html", "css", "bootstrap", "react"]);

// Check whether a command is installed on the system (try both where/which)
function findBinary(cmd) {
  const checkCmd = process.platform === "win32" ? `where ${cmd}` : `which ${cmd}`;
  try {
    const result = require("child_process").execSync(checkCmd, { stdio: ["ignore", "pipe", "ignore"] }).toString();
    return result.trim().split(/\r?\n/)[0] || null;
  } catch (e) {
    return null;
  }
}

// If the binary is not on PATH, scan common install locations.
// XAMPP/WAMP/Laragon (PHP) and MinGW/MSYS2/CodeBlocks/Dev-C++ (g++) —
// these are common places on Windows where PATH is not set.
function findInCommonLocations(cmd) {
  const candidates = [];
  if (cmd === "php") {
    candidates.push(
      "C:\\xampp\\php\\php.exe",
      "C:\\laragon\\bin\\php"
    );
    // WAMP versioned dirs: C:\wamp64\bin\php\php8.x.x\php.exe
    for (const base of ["C:\\wamp64\\bin\\php", "C:\\wamp\\bin\\php", "C:\\laragon\\bin\\php"]) {
      try {
        if (fs.existsSync(base)) {
          const dirs = fs.readdirSync(base)
            .filter((d) => /^php\d+/.test(d))
            .sort();
          const latest = dirs[dirs.length - 1];
          if (latest) candidates.push(path.join(base, latest, "php.exe"));
        }
      } catch (e) { /* ignore */ }
    }
  } else if (cmd === "g++") {
    candidates.push(
      "C:\\MinGW\\bin\\g++.exe",
      "C:\\msys64\\mingw64\\bin\\g++.exe",
      "C:\\TDM-GCC-64\\bin\\g++.exe",
      "C:\\Program Files\\CodeBlocks\\MinGW\\bin\\g++.exe",
      "C:\\Program Files (x86)\\CodeBlocks\\MinGW\\bin\\g++.exe",
      "C:\\Program Files\\mingw-w64\\x86_64-*-mingw32-gcc-*\bin\\g++.exe",
      "C:\\Program Files (x86)\\Dev-Cpp\\MinGW64\\bin\\g++.exe",
      "C:\\Program Files (x86)\\Dev-Cpp\\MinGW\\bin\\g++.exe"
    );
  }
  for (const cand of candidates) {
    try {
      if (fs.existsSync(cand)) return cand;
    } catch (e) { /* ignore */ }
  }
  return null;
}

// For PHP / C++ — check first whether the binary exists
const PHP_BIN = findBinary("php") || findInCommonLocations("php");
const GPP_BIN = findBinary("g++") || findInCommonLocations("g++");
if (PHP_BIN) console.log("Compiler: PHP found at " + PHP_BIN);
else console.warn("Compiler: 'php' binary not found — PHP runs will return a friendly message.");
if (GPP_BIN) console.log("Compiler: C++ (g++) found at " + GPP_BIN);
else console.warn("Compiler: 'g++' binary not found — C++ runs will return a friendly message.");

// Security Check: Block external library imports
function checkForbiddenLibraries(lang, code) {
  if (lang === "python") {
    // Python Built-in modules list (allowed ones)
    const allowedModules = [
      "math", "random", "time", "datetime", "sys", "os",
      "re", "json", "string", "collections", "itertools", "functools",
    ];

    // Find all imported packages
    const importMatches = [
      ...code.matchAll(/^\s*(?:import|from)\s+([a-zA-Z0-9_]+)/gm),
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
      ...code.matchAll(/^\s*import\s+([^;]+);/gm),
    ];

    for (const match of importMatches) {
      const imp = match[1].trim();
      if (!imp.startsWith("java.") && !imp.startsWith("javax.")) {
        return `Security Error: External library import '${imp}' is not allowed!`;
      }
    }
  } else if (lang === "javascript") {
    // Node.js built-in modules list (allowed ones).
    // Deliberately excludes fs / child_process / vm / net / dgram / http — the
    // dangerous modules that would give code filesystem or network access.
    const allowedModules = [
      "assert", "buffer", "crypto", "events", "path", "querystring",
      "readline", "string_decoder", "url", "util",
    ];

    // Catch both require("x") and ES-module import statements
    const requireMatches = [
      ...code.matchAll(/require\(\s*["']([^"']+)["']\s*\)/g),
    ];
    const importMatches = [
      ...code.matchAll(/^\s*import\s+(?:[\w*{}\s,]+\s+from\s+)?["']([^"']+)["']/gm),
    ];

    for (const match of [...requireMatches, ...importMatches]) {
      const mod = match[1];
      if (!allowedModules.includes(mod)) {
        return `Security Error: External library '${mod}' is not allowed in this compiler! Only pure standard logic is supported.`;
      }
    }
  } else if (lang === "php") {
    // Block dangerous functions — stop server command execution
    if (/\b(?:system|shell_exec|passthru|exec|popen|proc_open)\s*\(/.test(code)) {
      return "Security Error: system/exec/shell_exec are not allowed in this compiler!";
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
    } else if (lang === "php") {
      if (!PHP_BIN) {
        return resolve({
          success: false,
          output: "PHP compiler (php CLI) is not installed on this server. To run PHP, install XAMPP/WAMP, or ask me to integrate an online compiler (Piston/Judge0).",
        });
      }
      mainFilePath = path.join(tempDir, `script_${timestamp}.php`);
      filesToClean.push(mainFilePath);
      fs.writeFileSync(mainFilePath, code);
      command = `${PHP_BIN} -f "${mainFilePath}"`;
    } else if (lang === "cpp") {
      if (!GPP_BIN) {
        return resolve({
          success: false,
          output: "C++ compiler (g++) is not installed on this server yet, so C++ cannot run right now. Let me know if you want a local install (XAMPP/g++) or an online compiler (Piston/Judge0).",
        });
      }
      const cppRunDir = path.join(tempDir, `cpp_${timestamp}`);
      if (!fs.existsSync(cppRunDir)) fs.mkdirSync(cppRunDir);
      const srcFile = path.join(cppRunDir, "main.cpp");
      const binFile = path.join(cppRunDir, process.platform === "win32" ? "program.exe" : "program");
      filesToClean.push(cppRunDir);
      fs.writeFileSync(srcFile, code);
      command = `${GPP_BIN} -O2 -std=c++17 "${srcFile}" -o "${binFile}" && "${binFile}"`;
    } else if (PREVIEW_LANGS.has(lang)) {
      return resolve({
        success: false,
        output: `${lang} runs as a live preview in the browser — just use the Run Code button (no backend execution needed).`,
      });
    } else {
      return resolve({
        success: false,
        output: `'${lang}' execution is not supported yet. Supported languages: Python, Java, JavaScript, CSS, HTML, PHP, C++, React, Bootstrap.`,
      });
    }

    const childProcess = exec(command, EXEC_OPTIONS, (error, stdout, stderr) => {
      cleanupFiles(filesToClean);
      if (error) {
        // Make big-output errors (like maxBuffer) friendly too
        if (error.killed) {
          return resolve({ success: false, output: "Error: Code execution timed out (30s limit). Check for an input loop or an infinite program!" });
        }
        if (error.message && /maxBuffer/.test(error.message)) {
          return resolve({ success: false, output: "Error: Output is too large (20MB limit). Print less output." });
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
  } else if (lang === "cpp" || lang === "c++" || lang === "c") {
    lang = "cpp";
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