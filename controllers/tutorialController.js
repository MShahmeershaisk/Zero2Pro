const Home = require("../models/home");

async function dashboard(req, res) {
  const tutorials = await Home.find().sort({ createdAt: -1 });
  res.render("tutorial/dashboard", { tutorials });
}

async function addTutorial(req, res) {
  const { title, description, content, category } = req.body;
  await Home.create({ title, description, content, category });
  res.redirect("/home");
}

async function deleteTutorial(req, res) {
  await Home.findByIdAndDelete(req.params.id);
  res.redirect("/home");
}

async function editTutorial(req, res) {
  const { title, description, content, category } = req.body;
  await Home.findByIdAndUpdate(req.params.id, { title, description, content, category });
  res.redirect("/home");
}

module.exports = {
  dashboard,
  addTutorial,
  deleteTutorial,
  editTutorial,
};
