const nodemailer = require("nodemailer");
exports.emailSend = async (sendMailOption) => {
  let transport = nodemailer.createTransport({
    host: process.env.NODEMAILER_HOST,
    port: process.env.NODEMAILER_PORT,
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASS,
    },
  });
  await transport.sendMail(sendMailOption);
};
