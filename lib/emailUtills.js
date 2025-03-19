import nodemailer from "nodemailer";
export async function sendEmail(emailTo, emailText, emailSubject) {
  const transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const mailOptions = {
    from: `Polling App ${process.env.SMTP_USERNAME}`,
    to: emailTo,
    subject: emailSubject,
    html: emailText,
  };

  return await transport.sendMail(mailOptions);
}
