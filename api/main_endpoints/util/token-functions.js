const jwt = require('jsonwebtoken');
const { secretKey, DISCORD_PRINTING_KEY } = require('../../config/config.json');
const passport = require('passport');
const membershipState = require('../../util/constants').MEMBERSHIP_STATE;

require('./passport')(passport);


/**
 * Check if the request body contains a token
 * @param {object} request the HTTP request from the client
 * @returns {boolean} if the token exists in the request body
 */
function checkIfTokenSent(request) {
  return request.body.token !== undefined;
}

/**
* @param {object} request the HTTP request from the client
*/
function decodeToken(request){
  const token = request.body.token;
  const userToken = token.replace(/^JWT\s/, '');
  let decodedResponse = {};
  jwt.verify(userToken, secretKey, function(error, decoded) {
    if (!error && decoded) {
      decodedResponse = decoded;
    }
  });
  return decodedResponse;
}

/**
 * Checks if the request token is valid and returns either a valid response
 * or undefined
 * @param {object} request the HTTP request from the client
 * @param {number} accessLevel the minimum access level to consider the token valid
 * @param {boolean} returnDecoded optional parameter to return the decoded
 * response to the user
 * @returns {boolean} whether the user token is valid or not
 */
function checkIfTokenValid(request, accessLevel = membershipState.NON_MEMBER) {
  let decoded = decodeToken(request);
  let response = decoded && decoded.accessLevel >= accessLevel;
  return response;
}

module.exports = {
  checkIfTokenSent,
  checkIfTokenValid,
  decodeToken
};
