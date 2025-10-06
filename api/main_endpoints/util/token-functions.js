const jwt = require('jsonwebtoken');
const { secretKey, DISCORD_PRINTING_KEY } = require('../../config/config.json');
const passport = require('passport');
const membershipState = require('../../util/constants').MEMBERSHIP_STATE;

require('./passport')(passport);

const { SceStatusOrToken } = require('../../util/token-verification.js');
const { UNAUTHORIZED, OK, FORBIDDEN } = require('../../util/constants').STATUS_CODES;


/**
 * Check if the request body contains a token
 * @param {object} request the HTTP request from the client
 * @returns {boolean} if the token exists in the request body
 */
function checkIfTokenSent(request) {
  try {
    return !!request.headers.authorization;
  } catch(_) {
    return false;
  }
}

/**
* @param {object} request the HTTP request from the client
*/
function decodeToken(request) {
  return new Promise((resolve, reject) => {
    try {
      let decodedResponse = new SceStatusOrToken();
      if (!request.headers.authorization || !request.headers.authorization.length) {
        decodedResponse.status = UNAUTHORIZED;
        return resolve(decodedResponse);
      }
      const token = request.headers.authorization.split('Bearer ')[1];
      const userToken = token.replace(/^JWT\s/, '');
      jwt.verify(userToken, secretKey, function(error, decoded) {
        if (!error && decoded) {
          decodedResponse.status = OK;
          decodedResponse.token = decoded;
          return resolve(decodedResponse);
        }
        decodedResponse.status = FORBIDDEN;
        return resolve(decodedResponse);
      });
    } catch (err) {
      logger.error('unable to decode token', err);
      decodedResponse.status = UNAUTHORIZED;
      return resolve(decodedResponse);
    }
  });
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
  if (decoded === null) {
    return false;
  }
  return decoded && decoded.accessLevel >= accessLevel;
}

module.exports = {
  checkIfTokenSent,
  checkIfTokenValid,
  decodeToken,
};
