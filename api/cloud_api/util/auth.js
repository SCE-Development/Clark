const axios = require('axios');
const {
  GENERAL_API_URL,
  GENERAL_API_URL_PROD
} = require('../../config/config.json');

async function validateVerificationEmail(){
  let status = '';
  await axios
    .post(`${process.env.NODE_ENV === 'production' ?
      GENERAL_API_URL_PROD : GENERAL_API_URL}/Auth/sendVerificationEmail`)
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
    .post(`${process.env.NODE_ENV === 'production' ?
      GENERAL_API_URL_PROD : GENERAL_API_URL}/Auth/generateHashedId`, {email})
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
