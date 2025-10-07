const jwt = require('jsonwebtoken');
const { secretKey, DISCORD_PRINTING_KEY } = require('../../config/config.json');
const passport = require('passport');
const membershipState = require('../../util/constants').MEMBERSHIP_STATE;

require('./passport')(passport);

const { SceStatusOrToken } = require('../../util/token-verification.js');
const { UNAUTHORIZED, OK, FORBIDDEN } = require('../../util/constants').STATUS_CODES;
const logger = require('../../util/logger');

/**
* @param {object} request the HTTP request from the client
*/
function decodeToken(request, accessLevel = membershipState.NON_MEMBER) {
  return new Promise((resolve) => {
    try {
      let decodedResponse = new SceStatusOrToken();
      let token = null;
      if (request.headers.authorization && request.headers.authorization.length) {
        token = request.headers.authorization.split('Bearer ')[1];
      } else if (request.query.token) {
        token = request.query.token;
      } else {
        decodedResponse.status = UNAUTHORIZED;
        return resolve(decodedResponse);
      }
      const userToken = token.replace(/^JWT\s/, '');
      jwt.verify(userToken, secretKey, function(error, decoded) {
        if (!error && decoded) {
          decodedResponse.status = decoded.accessLevel >= accessLevel ? OK : FORBIDDEN;
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

module.exports = {
  decodeToken,
};
