const TokenFunctions = require(
  '../../../api/main_endpoints/util/token-functions');
const sinon = require('sinon');
const { OK, FORBIDDEN, UNAUTHORIZED } = require('../../../api/util/constants').STATUS_CODES;

let decodeTokenValidMock = null;

/**
 * Initialize the stub to be used in other functions.
 */
function initializeTokenMock() {
  decodeTokenValidMock = sinon.stub(TokenFunctions, 'decodeToken');
}

/**
 * Restore sinon's stub, function returned to its original state
 */
function restoreTokenMock() {
  decodeTokenValidMock.restore();
}

/**
 * Reset sinon-stub's call, reset onCall-function back to the beginning
 */
function resetTokenMock() {
  decodeTokenValidMock.reset();
}

/**
 *
 * @param {boolean|null} isSuccessful:
 *    if true, token is valid (status OK),
 *    if false, token is invalid (status UNAUTHORIZED),
 *    if null, token is FORBIDDEN
 *         
 * @param {Object} data: optional value that will be the result
 *                       of the decoded token value
 * @returns configured mock response
 */
function setTokenStatus(
  isSuccessful,
  data = {},
) {
  let status;
  let tokenPayload;
  
  if (isSuccessful === true) {
    status = OK;
    tokenPayload = data;
  } else if (isSuccessful === false) {
    status = UNAUTHORIZED;
    tokenPayload = null;
  } else {
    status = FORBIDDEN;
    tokenPayload = data;
  }

  decodeTokenValidMock.returns(
    Promise.resolve({
      status: status,
      token: tokenPayload,
    })
  );
}

module.exports = {
  setTokenStatus, resetTokenMock, restoreTokenMock, initializeTokenMock
};
