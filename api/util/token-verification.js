const axios = require('axios');
const membershipState = require('./constants').MEMBERSHIP_STATE;
const { DISCORD_COREV4_KEY } = require('../config/config.json');
// If we are in a docker/prod environment, we can't rely on localhost
// to route the request to the Auth API so we use the name of
// the container instead,
const MAIN_ENDPOINT_URL = process.env.MAIN_ENDPOINT_URL || 'localhost:8080';

/**
 * Checks if the given token is valid
 * @param {Object} token
 * @returns {Boolean} true if valid token else false
 */
async function verifyToken(token) {
  let valid = false;
  await axios
    .post(`http://${MAIN_ENDPOINT_URL}/api/Auth/verify`, { token })
    .then((res) => {
      valid = res && res.data.accessLevel >= membershipState.OFFICER;
    })
    .catch(() => {});
  return valid;
}

/**
 * Checks if token was sent
 * @param {Object} request
 * @returns {Boolean} true if a token was found in request else false
 */
function checkIfTokenSent(request) {
  return request.body.token !== undefined;
}

/**
 * Checks API key value and return true or false depending on if it matches
 * @param {String} apiKey
 * @returns {boolean} whether the api key was valid or not
 */
function checkDiscordKey(apiKey) {
  return apiKey === DISCORD_COREV4_KEY;
}

module.exports = { verifyToken, checkIfTokenSent, checkDiscordKey };
