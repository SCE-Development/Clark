const TokenFunctions = require(
  '../../../api/main_endpoints/util/token-functions');
const TokenValidation = require('../../../api/util/token-verification');
const { MEMBERSHIP_STATE } = require('../../../api/util/constants');
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
}

/**
 * Restore sinon's stub, function returned to its original state
 */
function restoreTokenMock() {
  checkifTokenValidMock.restore();
  decodeTokenValidMock.restore();
  verifyTokenMock.restore();
}

/**
 * Reset sinon-stub's call, reset onCall-function back to the beginning
 */
function resetTokenMock() {
  checkifTokenValidMock.reset();
  decodeTokenValidMock.reset();
  verifyTokenMock.reset();
}

/**
 *
 * @param {any} returnValue: value to be return back
 *                           by the function 'checkIfTokenValid'
 * @returns return parameter (above)
 */
function setTokenStatus(returnValue, accessLevel = MEMBERSHIP_STATE.ADMIN) {
  checkifTokenValidMock.returns(returnValue);
  if (returnValue) {
    decodeTokenValidMock.returns({ accessLevel });
    verifyTokenMock.returns(true);
  } else {
    decodeTokenValidMock.returns(null);
    verifyTokenMock.returns(false);
  }
}

module.exports = {
  setTokenStatus, resetTokenMock, restoreTokenMock, initializeTokenMock
};
