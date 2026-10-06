const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendContactEmail = async ({ name, email, subject, message }) => {
  const { data, error } = await resend.emails.send({
    from: "Portfolio <onboarding@resend.dev>",
    to: [process.env.EMAIL_USER],
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

  if (error) {
    console.error("Resend email error:", error);
    throw new Error("Failed to send email");
  }

  console.log("Email sent successfully:", data.id);

  return data;
};

module.exports = sendContactEmail;