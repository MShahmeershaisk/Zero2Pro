# Zero to Pro

A full-stack learning platform with interactive tutorials, coding exercises, quizzes with certificates, a live code compiler, and an AI-powered help assistant.

## Features

- **Tutorials** — Step-by-step guided lessons with code snippets for multiple languages.
- **Exercises** — Language-based quizzes that issue a certificate on passing.
- **Compiler** — Run real code in the browser (C++, PHP, JavaScript, HTML/CSS, Bootstrap, React) with output and preview panels.
- **Certificates** — Earn a branded certificate after passing a quiz.
- **AI Assistant** — Built-in chat widget that answers questions while you learn.
- **Admin Panel** — Manage users and tutorials.
- **Light / Dark theme** — Persisted per user.

## Tech Stack

- **Backend:** Node.js, Express.js 5, MongoDB (Mongoose)
- **Frontend:** EJS, Tailwind CSS, Monaco Editor
- **Auth:** express-session + bcryptjs
- **PDF:** pdfkit

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env   # set MONGO_URI and SESSION_SECRET

# 3. Seed the database (optional, first run)
node seed.js

# 4. Start the server
npm start
```

Visit `http://localhost:3000`.

> The compiler runs PHP through a local XAMPP install and C++ through g++.
> Install XAMPP (PHP) and MinGW/MSYS2 (g++) and they are auto-detected.

## Project Structure

```
├── controllers/     # Request handlers (MVC)
├── models/          # Mongoose schemas
├── routes/          # Express route definitions
├── views/           # EJS templates (partials, pages)
├── public/          # Static assets (JS, CSS)
├── logo/            # Brand and partner images
├── seed-data/       # Question data for seeding
└── index.js         # Application entry point
```

## License

Private project.
