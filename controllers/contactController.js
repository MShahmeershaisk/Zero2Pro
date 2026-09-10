const Contact = require("../models/contact");

// ---------- Public ----------

function getContactPage(req, res) {
  // Pre-fill from session if logged in
  const user = req.session.user || null;
  res.render("contact/contact", {
    user,
    filledName: user ? user.name : "",
    filledEmail: user ? user.email : "",
    filledMemberId: user ? user.id : "",
    success: req.session.flash?.success || null,
    error: req.session.flash?.error || null,
  });
  delete req.session.flash;
}

async function submitContact(req, res) {
  try {
    const { name, email, memberId, subject, message } = req.body;

    if (!name || !name.trim()) {
      req.session.flash = { error: "Name is required." };
      return res.redirect("/contact");
    }
    if (!email || !email.trim()) {
      req.session.flash = { error: "Email is required." };
      return res.redirect("/contact");
    }
    if (!subject) {
      req.session.flash = { error: "Please select a subject." };
      return res.redirect("/contact");
    }
    if (!message || !message.trim()) {
      req.session.flash = { error: "Please describe your issue." };
      return res.redirect("/contact");
    }

    await Contact.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      memberId: (memberId || "").trim(),
      subject,
      message: message.trim(),
    });

    req.session.flash = { success: "Your message has been sent! We'll get back to you soon." };
    res.redirect("/contact");
  } catch (err) {
    console.error("Contact submit error:", err);
    req.session.flash = { error: "Something went wrong. Please try again." };
    res.redirect("/contact");
  }
}

// ---------- Admin ----------

// Admin replies to a user message
async function adminReply(req, res) {
  try {
    const { message } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: "Reply cannot be empty." });
    }

    const msg = await Contact.findById(req.params.id);
    if (!msg) {
      return res.status(404).json({ success: false, message: "Message not found." });
    }

    msg.replies.push({
      sender: "admin",
      senderName: "Admin",
      message: message.trim(),
    });
    msg.status = "read"; // auto-mark as read when admin replies
    await msg.save();

    res.json({ success: true, reply: msg.replies[msg.replies.length - 1] });
  } catch (err) {
    console.error("Admin reply error:", err);
    res.status(500).json({ success: false, message: "Failed to send reply." });
  }
}

module.exports = {
  getContactPage,
  submitContact,
  adminReply,
};
