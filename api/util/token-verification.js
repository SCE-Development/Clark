const axios = require('axios');
const membershipState = require('./constants').MEMBERSHIP_STATE;

/**
 * Checks if the given token is valid
 * @param {Object} token 
 * @returns {Boolean} true if valid token else false
 */
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

/**
 * 
 * @param {Object} request 
 * @returns {Boolean} true if a token was sent with request else false
 */
function checkIfTokenSent(request) {
  return request.body.token !== undefined;
}

module.exports = { verifyToken, checkIfTokenSent };