// import nodemailer
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false, // Brevo uses STARTTLS on port 587
  auth: {
    user: process.env.SMTP_USER, // Your Brevo login email
    pass: process.env.SMTP_PASS, // Your Brevo SMTP key (NOT your password)
  },
});

// Optional: check connection at startup
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ SMTP connection failed:", error);
  } else {
    console.log("✅ SMTP connection successful");
  }
});

module.exports = transporter;
