const ejs = require("ejs");
const fs = require("fs");

const data = {
  user: { name: "Shahmeer Ali", email: "shahmeer@example.com" },
  error: null,
  certificates: [
    { category: "HTML", testTitle: "HTML Basics: Elements & Structure", percentage: 92, certId: "ZTP-HTML-2026-0001", earnedAt: new Date("2026-08-15") },
    { category: "CSS", testTitle: "CSS Flexbox & Grid", percentage: 84, certId: "ZTP-CSS-2026-0002", earnedAt: new Date("2026-08-20") },
    { category: "JavaScript", testTitle: "JavaScript Fundamentals", percentage: 88, certId: "ZTP-JS-2026-0003", earnedAt: new Date("2026-09-01") },
    { category: "PHP", testTitle: "PHP Forms & MySQL Basics", percentage: 81, certId: "ZTP-PHP-2026-0004", earnedAt: new Date("2026-06-25") },
    { category: "C++", testTitle: "C++ Basics: Syntax & Variables", percentage: 78, certId: "ZTP-CPP-2026-0005", earnedAt: new Date("2026-05-20") },
    { category: "React", testTitle: "React State & Props", percentage: 95, certId: "ZTP-REACT-2026-0006", earnedAt: new Date("2026-07-10") },
    { category: "Bootstrap", testTitle: "Bootstrap 5 Basics & Grid", percentage: 90, certId: "ZTP-BS-2026-0007", earnedAt: new Date("2026-04-12") },
    { category: "General", testTitle: "Zero to Pro Certification Test", percentage: 76, certId: "ZTP-GEN-2026-0008", earnedAt: new Date("2026-03-02") },
  ],
};

ejs.renderFile(
  "views/certificates/certificates.ejs",
  data,
  { views: ["views"] },
  (err, html) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    fs.writeFileSync("_preview.html", html);
    console.log("Preview written to _preview.html (" + html.length + " bytes)");
  }
);
