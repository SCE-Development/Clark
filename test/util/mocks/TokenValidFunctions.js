const TokenFunctions = require(
  '../../../api/main_endpoints/util/token-functions');
const TokenValidation = require('../../../api/util/token-verification');
const sinon = require('sinon');

let checkifTokenValidMock = null;
let decodeTokenValidMock = null;

/**
 * Initialize the stub to be used in other functions.
 */
function initializeTokenMock() {
  checkifTokenValidMock = sinon.stub(TokenFunctions, 'checkIfTokenValid');
  decodeTokenValidMock = sinon.stub(TokenFunctions, 'decodeToken');
  verifyTokenMock = sinon.stub(TokenValidation, 'verifyToken');
  discordApiKeyMock = sinon.stub(TokenFunctions, 'checkDiscordKey');
}

/**
 * Restore sinon's stub, function returned to its original state
 */
function restoreTokenMock() {
  checkifTokenValidMock.restore();
  decodeTokenValidMock.restore();
  verifyTokenMock.restore();
  discordApiKeyMock.restore();
}

/**
 * Reset sinon-stub's call, reset onCall-function back to the beginning
 */
function resetTokenMock() {
  checkifTokenValidMock.reset();
  decodeTokenValidMock.reset();
  verifyTokenMock.reset();
  discordApiKeyMock.reset();
}

/**
 *
 * @param {any} returnValue: value to be return back
 *                           by the function 'checkIfTokenValid'
 * @returns return parameter (above)
 */
function setTokenStatus(returnValue) {
  checkifTokenValidMock.returns(returnValue);
  if (returnValue) {
    decodeTokenValidMock.returns({accessLevel: 10});
    verifyTokenMock.returns(true);
    discordApiKeyMock.returns(true);
  } else {
    decodeTokenValidMock.returns(null);
    verifyTokenMock.returns(false);
    discordApiKeyMock.returns(false);
  }
}

module.exports = {
  setTokenStatus, resetTokenMock, restoreTokenMock, initializeTokenMock
};
