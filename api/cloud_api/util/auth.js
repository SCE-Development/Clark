const axios = require('axios');

const GENERAL_API_URL = process.env.GENERAL_API_URL || 'http://localhost:8080/api';
async function validateVerificationEmail(){
  let status = '';
  await axios
    .post(`${GENERAL_API_URL}/Auth/sendVerificationEmail`)
    .then(res =>{
      status = res.data;
    })
    .catch(err => {
      status = err.data;
    });
  return status;
}

async function generateHashedId(email){
  let hashedId = '';
  await axios
    .post(`${GENERAL_API_URL}/Auth/generateHashedId`, {email})
    .then(res =>{
      hashedId = res.data.hashedId;
    })
    .catch(err => {
      hashedId = null;
    });
  return hashedId;
}

module.exports = {
  generateHashedId,
  validateVerificationEmail
};
