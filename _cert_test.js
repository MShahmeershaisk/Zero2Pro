require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/user");

const BASE = "http://localhost:3001";
const EMAIL = "cert-test@example.com";
const PASS = "TestPass123!";

async function main() {
  await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/crud");

  // Create/reuse a test user with one certificate per language
  const user = await User.findOne({ email: EMAIL });
  const u = user || new User({ name: "Shahmeer Ali", email: EMAIL });
  u.password = PASS;
  u.certificates = [
    { category: "HTML", testTitle: "HTML Basics: Elements & Structure", percentage: 92, certId: "ZTP-HTML-2026-0001", earnedAt: new Date("2026-08-15") },
    { category: "CSS", testTitle: "CSS Flexbox & Grid", percentage: 84, certId: "ZTP-CSS-2026-0002", earnedAt: new Date("2026-08-20") },
    { category: "JavaScript", testTitle: "JavaScript Fundamentals", percentage: 88, certId: "ZTP-JS-2026-0003", earnedAt: new Date("2026-09-01") },
    { category: "PHP", testTitle: "PHP Forms & MySQL Basics", percentage: 81, certId: "ZTP-PHP-2026-0004", earnedAt: new Date("2026-06-25") },
    { category: "C++", testTitle: "C++ Basics: Syntax & Variables", percentage: 78, certId: "ZTP-CPP-2026-0005", earnedAt: new Date("2026-05-20") },
    { category: "React", testTitle: "React State & Props", percentage: 95, certId: "ZTP-REACT-2026-0006", earnedAt: new Date("2026-07-10") },
    { category: "Bootstrap", testTitle: "Bootstrap 5 Basics & Grid", percentage: 90, certId: "ZTP-BS-2026-0007", earnedAt: new Date("2026-04-12") },
    { category: "General", testTitle: "Zero to Pro Certification Test", percentage: 76, certId: "ZTP-GEN-2026-0008", earnedAt: new Date("2026-03-02") },
  ];
  await u.save();

  // Log in over HTTP and capture the session cookie
  const loginRes = await fetch(BASE + "/login", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ email: EMAIL, password: PASS }),
    redirect: "manual",
  });
  const setCookie = loginRes.headers.get("set-cookie");
  const sid = setCookie ? setCookie.split(";")[0] : "";
  if (!sid) throw new Error("No session cookie returned from login");

  // Fetch the certificates page with the session
  const certRes = await fetch(BASE + "/certificates", { headers: { Cookie: sid }, redirect: "manual" });
  console.log("GET /certificates ->", certRes.status);
  const html = await certRes.text();

  const checks = {
    "HTML logo (/logo/html5.png)": html.includes("/logo/html5.png"),
    "CSS logo (/logo/css3.png)": html.includes("/logo/css3.png"),
    "JavaScript logo": html.includes("/logo/javascript.png"),
    "PHP logo": html.includes("/logo/php.png"),
    "C++ logo": html.includes("/logo/cpp.png"),
    "React logo": html.includes("/logo/react.png"),
    "Bootstrap logo": html.includes("/logo/bootstrap.png"),
    "Great Vibes (name script font)": html.includes("Great+Vibes"),
    "Playfair Display font": html.includes("Playfair"),
    "gradient border frame": html.includes("linear-gradient(135deg"),
    "cert-inner class": html.includes("cert-inner"),
    "score pill badge": html.includes("cert-score"),
    "user name rendered": html.includes("Shahmeer Ali"),
    "old emoji icons GONE (no 🌐/⚛️/🐘/⚙️)":
      !html.includes("🌐") && !html.includes("⚛️") && !html.includes("🐘") && !html.includes("⚙️") && !html.includes("🎨") && !html.includes("⚡") && !html.includes("📐") && !html.includes("🏆"),
    "8 certificate cards": (html.match(/certificate-card/g) || []).length >= 8,
  };
  let pass = 0;
  for (const [k, v] of Object.entries(checks)) {
    console.log((v ? "PASS" : "FAIL") + "  " + k);
    if (v) pass++;
  }
  console.log(`\n${pass}/${Object.keys(checks).length} checks passed`);

  // Verify the logo assets are actually served
  const logos = ["/logo/html5.png", "/logo/css3.png", "/logo/javascript.png", "/logo/php.png", "/logo/cpp.png", "/logo/react.png", "/logo/bootstrap.png", "/logo/badge.png"];
  for (const p of logos) {
    const r = await fetch(BASE + p);
    if (r.status !== 200) console.log("LOGO MISSING ->", r.status, p);
  }
  console.log("Logo asset check done (missing ones listed above, if any).");

  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
