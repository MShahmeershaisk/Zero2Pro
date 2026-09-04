function landing(req, res) {
  res.render("home/index", {
    title: "DevHub - Learn & Practice Coding",
  });
}

module.exports = {
  landing,
};