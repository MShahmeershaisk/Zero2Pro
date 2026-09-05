function landing(req, res) {
  res.render("home/index", {
    title: "Zero to Pro - Learn & Practice Coding",
  });
}

module.exports = {
  landing,
};