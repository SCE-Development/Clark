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
 * @param {any} returnValue: value to be return back
 *                           by the function 'checkIfTokenValid'
 * @param {Object} data: optional value that will be the result
 *                       of the decoded token value
 * @returns return parameter (above)
 */
function setTokenStatus(
  isSuccessful,
  data = {},
) {
  const status = isSuccessful ? OK : UNAUTHORIZED;
  const tokenPayload = isSuccessful ? data : null;

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
