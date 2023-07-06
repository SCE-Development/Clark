const axios = require('axios')

const MAILER_API_URL = process.env.MAILER_API_URL
    || 'http://localhost:8082/cloudapi'
console.log('mailer url: ' + MAILER_API_URL)
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

module.exports = {sendUnsubscribeEmail}