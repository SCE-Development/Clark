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
}

/**
 * Restore sinon's stub, function returned to its original state
 */
function restoreTokenMock() {
  checkifTokenValidMock.restore();
  decodeTokenValidMock.restore();
}

/**
 * Reset sinon-stub's call, reset onCall-function back to the beginning
 */
function resetTokenMock() {
  checkifTokenValidMock.reset();
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
  returnValue,
  data = {},
) {
  checkifTokenValidMock.returns(returnValue);
  if (returnValue) {
    decodeTokenValidMock.returns(data);
  } else {
    decodeTokenValidMock.returns(null);
  }
}

module.exports = {
  setTokenStatus, resetTokenMock, restoreTokenMock, initializeTokenMock
};
