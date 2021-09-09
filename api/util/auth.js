const axios = require('axios');

async function validateVerificationEmail(){
  let status = '';
  await axios
    .post('/api/Auth/sendVerificationEmail')
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
    .post('/api/Auth/generateHashedId', { email })
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
