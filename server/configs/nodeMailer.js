import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false
  }
});

const sendEmail = async ({ to, subject, body }) => {
  console.log(`[NodeMailer] Attempting to send email to: ${to} with subject: ${subject}`);
  console.log(`[NodeMailer] Sender: ${process.env.SENDER_EMAIL}`);
  try {
    const response = await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to,
      subject,
      html: body,
    })
    console.log(`[NodeMailer] Email sent successfully. MessageID: ${response.messageId}`);
    return response
  } catch (error) {
    console.error(`[NodeMailer] Error sending email:`, error);
    throw error;
  }
}

export default sendEmail;