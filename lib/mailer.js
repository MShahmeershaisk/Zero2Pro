const nodemailer = require("nodemailer");

// In development without SMTP credentials, log instead of sending.
const IS_PROD = process.env.NODE_ENV === "production";

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  const user = process.env.SMTP_EMAIL;
  const pass = process.env.SMTP_APP_PASSWORD;

  if (!user || !pass || user === "your-email@gmail.com") {
    console.warn("[mailer] SMTP not configured — emails will be logged to console.");
    return null;
  }

  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
  return transporter;
}

/**
 * Send a password-reset email.
 * In dev mode without SMTP config, the reset URL is logged to the console.
 */
async function sendResetEmail(email, resetUrl) {
  const transport = getTransporter();

  const mailOptions = {
    from: `"Zero to Pro" <${process.env.SMTP_EMAIL || "noreply@zerotopro.dev"}>`,
    to: email,
    subject: "Reset Your Password — Zero to Pro",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:24px;">
        <h2 style="color:#6366f1;">Password Reset Request</h2>
        <p>You requested a password reset for your Zero to Pro account.</p>
        <p>Click the button below to set a new password. This link expires in <strong>1 hour</strong>.</p>
        <a href="${resetUrl}" style="display:inline-block;background:#6366f1;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;margin:16px 0;">Reset Password</a>
        <p style="color:#888;font-size:13px;">If you didn't request this, you can safely ignore this email.</p>
      </div>
    `,
  };

  if (!transport) {
    // Dev mode: log the URL so the developer can test without real email
    console.log(`\n[DEV MAIL] Password reset for ${email}:\n${resetUrl}\n`);
    return true;
  }

  await transport.sendMail(mailOptions);
  return true;
}

module.exports = { sendResetEmail };
