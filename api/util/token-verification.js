const axios = require('axios');
const membershipState = require('./constants').MEMBERSHIP_STATE;

async function verifyToken(token) {
  let valid = false;
  await axios
    .post('http://localhost:8080/api/Auth/verify', { token })
    .then(res => {
      valid = res && res.accessLevel >= membershipState.OFFICER;
    })
    .catch(() => { });
  return valid;
}

function checkIfTokenSent(request) {
  return request.body.token !== undefined;
}

module.exports = { verifyToken, checkIfTokenSent };