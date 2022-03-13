const { axios } = require('axios');
const membershipState = require('../../util/constants').MEMBERSHIP_STATE;

async function verifyToken(token) {
  let valid = false;
  await axios
    .post('http://localhost:8080/Auth/verify', { token })
    .then(res => {
      valid = res && res.accessLevel >= membershipState.OFFICER;
    })
    .catch(() => { });
  return valid;
}

module.exports = { verifyToken };