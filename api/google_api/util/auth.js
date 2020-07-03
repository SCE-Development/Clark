const axios = require('axios');
const { GENERAL_API_URL } = require('../../config/config');

async function validateVerificationEmail(){
  let status = '';
  await axios
    .post(`${GENERAL_API_URL}api/Auth/sendVerificationEmail`)
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
    .post(`${GENERAL_API_URL}api/Auth/generateHashedId`, {email})
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
