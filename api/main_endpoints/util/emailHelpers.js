const axios = require('axios')

const MAILER_API_URL = process.env.MAILER_API_URL
    || 'http://localhost:8082/cloudapi'

async function sendUnsubscribeEmail(users){
    let status
    await axios
      .post(`${MAILER_API_URL}/Mailer/sendUnsubscribeEmail`, {users})
      .then(res =>{
      status = res.data;
      })
      .catch(err => {
        status = err.data;
      });
    return status
}

async function sendVerificationEmail(name, email){
    let status
    await axios
      .post(`${MAILER_API_URL}/Mailer/sendVerificationEmail`, {
        recipientName: name,
        recipientEmail: email
      })
      .then(res =>{
      status = res.data;
      })
      .catch(err => {
        status = err.data;
      });
    return status
}

module.exports = {sendUnsubscribeEmail, sendVerificationEmail}
