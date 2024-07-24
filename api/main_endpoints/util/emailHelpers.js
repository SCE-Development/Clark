const axios = require('axios');

const MAILER_API_URL = process.env.MAILER_API_URL
  || 'http://localhost:8082/cloudapi';

async function sendUnsubscribeEmail(users) {
  let status;
  await axios
    .post(`${MAILER_API_URL}/Mailer/sendUnsubscribeEmail`, { users })
    .then(res => {
      status = res.data;
    })
    .catch(err => {
      status = err.data;
    });
  return status;
}

async function sendPasswordReset(resetToken, email) {
  return new Promise((resolve) => {
    axios
      .post(`${MAILER_API_URL}/Mailer/sendPasswordReset`, {
        resetToken: resetToken,
        recipientEmail: email
      })
      .then(() => resolve(true))
      .catch(() => resolve(false));
  });
}

module.exports = { sendUnsubscribeEmail, sendPasswordReset };
