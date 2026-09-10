const Contact = require("../models/contact");

// ---------- User Chat Page ----------

// Render the chat page — admin sees ALL messages, users see only their own
async function getChatPage(req, res) {
  try {
    const user = req.session.user;
    const isAdmin = user.role === "admin";

    // Admin sees everything; regular users see only their own messages
    const query = isAdmin
      ? {}
      : { $or: [{ email: user.email }, { memberId: user.id }] };

    const messages = await Contact.find(query)
      .sort({ updatedAt: -1 })
      .lean();

    res.render("chat/chat", {
      messages,
      activeMessage: null,
      success: req.session.flash?.success || null,
      error: req.session.flash?.error || null,
    });
    delete req.session.flash;
  } catch (err) {
    console.error("Chat page error:", err);
    req.session.flash = { error: "Failed to load messages." };
    res.redirect("/");
  }
}

// AJAX: get all messages (admin = all, user = own only)
async function getMessages(req, res) {
  try {
    const user = req.session.user;
    const isAdmin = user.role === "admin";

    const query = isAdmin
      ? {}
      : { $or: [{ email: user.email }, { memberId: user.id }] };

    const messages = await Contact.find(query)
      .sort({ updatedAt: -1 })
      .lean();

    res.json({ success: true, messages });
  } catch (err) {
    console.error("Chat messages API error:", err);
    res.status(500).json({ success: false, message: "Failed to load messages." });
  }
}

// AJAX: get a single conversation (admin can view any, user only own)
async function getConversation(req, res) {
  try {
    const user = req.session.user;
    const isAdmin = user.role === "admin";
    const msg = await Contact.findById(req.params.id).lean();
    if (!msg) {
      return res.status(404).json({ success: false, message: "Message not found." });
    }
    // Non-admin can only view their own conversation
    if (!isAdmin && msg.email !== user.email && msg.memberId !== user.id) {
      return res.status(403).json({ success: false, message: "Access denied." });
    }
    res.json({ success: true, message: msg });
  } catch (err) {
    console.error("Get conversation error:", err);
    res.status(500).json({ success: false, message: "Failed to load conversation." });
  }
}

// Reply to a message thread (admin can reply to any, user only own)
async function sendReply(req, res) {
  try {
    const user = req.session.user;
    const isAdmin = user.role === "admin";
    const { message } = req.body;
    const msgId = req.params.id;

    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: "Reply cannot be empty." });
    }

    const msg = await Contact.findById(msgId);
    if (!msg) {
      return res.status(404).json({ success: false, message: "Message not found." });
    }
    // Non-admin can only reply to their own conversation
    if (!isAdmin && msg.email !== user.email && msg.memberId !== user.id) {
      return res.status(403).json({ success: false, message: "Access denied." });
    }

    msg.replies.push({
      sender: isAdmin ? "admin" : "user",
      senderName: user.name,
      message: message.trim(),
    });
    msg.status = isAdmin ? "read" : "pending"; // admin reply = read, user reply = pending
    await msg.save();

    res.json({ success: true, reply: msg.replies[msg.replies.length - 1] });
  } catch (err) {
    console.error("Send reply error:", err);
    res.status(500).json({ success: false, message: "Failed to send reply." });
  }
}

// User sends a new message from the chat page (quick message)
async function sendNewMessage(req, res) {
  try {
    const user = req.session.user;
    const { subject, message } = req.body;

    if (!subject || !subject.trim()) {
      return res.status(400).json({ success: false, message: "Subject is required." });
    }
    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: "Message cannot be empty." });
    }

    const newMsg = await Contact.create({
      name: user.name,
      email: user.email,
      memberId: user.id,
      subject: subject.trim(),
      message: message.trim(),
    });

    res.json({ success: true, message: newMsg });
  } catch (err) {
    console.error("Send new message error:", err);
    res.status(500).json({ success: false, message: "Failed to send message." });
  }
}

module.exports = {
  getChatPage,
  getMessages,
  getConversation,
  sendReply,
  sendNewMessage,
};
