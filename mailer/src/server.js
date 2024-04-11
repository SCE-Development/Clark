const express = require("express");
const oauth2 = require("./v1/oauth2");
const mail = require("./v1/mail");
const { Config } = require("./config");
const path = require("path");
const { Google } = require("./google");

const app = express();
app.use("/v1/oauth2", oauth2);
app.use("/v1/mail", mail);

Google.auth.loadToken();

app.listen(Config.PORT, () => {
    console.info(Config.BASE_URL);
    console.info(`${new URL("v1/oauth2/google/authenticate", Config.BASE_URL).href}`);
    console.info(`${new URL("v1/oauth2/github/authenticate", Config.BASE_URL).href}`);
    console.info(`${new URL("v1/mail/send-verification-email", Config.BASE_URL).href}`);
});

// const transporter = nodemailer.createTransport({
//     service: "Gmail",
//     host: "smtp.gmail.com",
//     port: 465,
//     secure: true,
//     auth: {
//       user: secret.EMAIL,
//       pass: secret.APP_PASSWORD,
//     },
// });

// const mailOptions = {
//     from: secret.EMAIL,
//     to: "tyranitarplayzMC@gmail.com",
//     subject: "Hello from Nodemailer",
//     text: "This is a test email sent using Nodemailer.",
//     html: `<html>
//         <h2>html?</h2>
//         <a href="https://google.com">google!</a>
//     </html>`
// };

//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       console.error("Error sending email: ", error);
//     } else {
//       console.log("Email sent: ", info.response);
//     }
//   });