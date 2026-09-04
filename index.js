require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const path = require("path");
const cors = require("cors");

const homeRoutes = require("./routes/homeRoutes");
const compilerRoutes = require("./routes/compilerRoutes");
const testRoutes = require("./routes/testRoutes");
const authRoutes = require("./routes/authRoutes");
const aiRoutes = require("./routes/aiRoutes");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// ---------- Middleware ----------
app.use(cors());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    },
  })
);

// User ko har page par available karo (navbar ke liye)
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// ---------- MongoDB Connect ----------
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/quiz_database";
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// ---------- Model ----------
// Sawal "Test" collection ke andar embedded hote hain (seed.js dekhein),
// isliye yahan ek alag "Question" model banane ki zaroorat nahi.
const Test = require("./models/test");

// ---------- API Endpoint to Fetch Questions by Category ----------
app.get("/api/questions", async (req, res) => {
  try {
    const { category } = req.query;

    // Test collection ke andar se embedded questions nikalein
    const pipeline = [
      { $unwind: "$questions" },
      ...(category ? [{ $match: { "questions.category": category } }] : []),
      { $sample: { size: 10 } },
      {
        $project: {
          _id: "$questions._id",
          question: "$questions.questionText",
          options: "$questions.options",
          correctAnswer: "$questions.correctAnswerIndex",
          category: "$questions.category",
        },
      },
    ];

    const questions = await Test.aggregate(pipeline);

    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Questions fetch karne mein error aaya.", 
      error: error.message 
    });
  }
});

// ---------- Existing Routes ----------
app.use("/", homeRoutes);
app.use("/", compilerRoutes);
app.use("/", testRoutes);
app.use("/", authRoutes);
app.use("/", aiRoutes);
app.use("/", adminRoutes);
app.use("/", userRoutes);

// ---------- 404 Handler ----------
app.use((req, res) => {
  res.status(404).render("errors/404");
});

// ---------- Global Error Handler ----------
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).render("errors/500");
});

// ---------- Start Server ----------
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});