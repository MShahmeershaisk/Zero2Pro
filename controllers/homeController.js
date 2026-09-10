function landing(req, res) {
  res.render("home/index", {
    title: "Zero to Pro - Learn & Practice Coding",
    meta: {
      description: "Master coding with Zero to Pro — free interactive tutorials in HTML, CSS, JavaScript, Python, React, C++ and more. Take quizzes, earn certificates, and use our live AI-powered compiler.",
      keywords: "learn coding free, coding tutorials, programming exercises, coding certificates, online code compiler, AI coding tutor, HTML tutorial, CSS tutorial, JavaScript tutorial, Python tutorial, React tutorial, C++ tutorial, web development course",
      ogImage: "/logo/brand-logo.png",
      ogUrl: "https://zerotopro.dev",
    },
  });
}

module.exports = {
  landing,
};