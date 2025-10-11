const jwt = require('jsonwebtoken');
const { secretKey, DISCORD_PRINTING_KEY } = require('../../config/config.json');
const passport = require('passport');
const membershipState = require('../../util/constants').MEMBERSHIP_STATE;

require('./passport')(passport);

const { UNAUTHORIZED, OK, FORBIDDEN } = require('../../util/constants').STATUS_CODES;
const logger = require('../../util/logger');

class SceStatusOrToken {
  constructor() {
    this.token = null;
    this.status = null;
  }
}

/**
* @param {object} request the HTTP request from the client
*/
async function decodeToken(request, requiredAccessLevel = membershipState.NON_MEMBER) {
  const decodedResponse = new SceStatusOrToken();
  let token = null;

  try {
    if (request.headers.authorization && request.headers.authorization.startsWith('Bearer ')) {
      token = request.headers.authorization.split('Bearer ')[1];
    } else if (request.query && request.query.token) {
      token = request.query.token;
    }

    if (!token) {
      decodedResponse.status = UNAUTHORIZED;
      return decodedResponse;
    }

    const userToken = token.replace(/^JWT\s/, '');
    const decoded = await new Promise((resolve, reject) => {
      jwt.verify(userToken, secretKey, (error, payload) => {
        if (error || !payload) {
          return reject(error || new Error('Token verification failed.'));
        }
        resolve(payload);
      });
    });

    const hasRequiredAccess = decoded.accessLevel >= requiredAccessLevel;

    decodedResponse.status = hasRequiredAccess ? OK : FORBIDDEN;
    decodedResponse.token = decoded;
    
    return decodedResponse;

  } catch (err) {
    logger.error('Token validation failed:', err);
    decodedResponse.status = FORBIDDEN;
    
    return decodedResponse;
  }
}



module.exports = {
  decodeToken,
};
