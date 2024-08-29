const nodemailer = require("nodemailer");
// const { options } = require("../app");

const sendEmail = async (to, subject, message) => {
  //1 transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  //2 email options
  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: to,
    subject: subject,
    html: message,
    // html:
  };
  //3 send the email
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    console.log("Error sending email:", error);
    return { success: false, message: "Error sending email" };
  }
};

module.exports = sendEmail;
