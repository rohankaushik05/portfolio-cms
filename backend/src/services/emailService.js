const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

const sendContactEmail = async ({ name, email, subject, message }) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    replyTo: email,
    subject: `Portfolio Contact: ${subject}`,
    text: `
New contact message from your portfolio.

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}
    `,
  });
};

module.exports = sendContactEmail;