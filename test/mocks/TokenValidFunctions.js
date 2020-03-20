const TokenFunctions = require('../../api/util/token-functions');
const sinon = require('sinon');

const checkifTokenValidMock = sinon.stub(TokenFunctions, 'checkIfTokenValid');

/**
 * Restore sinon's stub, function returned to its original state
 */
function restoreMock() {
  checkifTokenValidMock.restore();
}

/**
 * Reset sinon-stub's call, reset onCall-function back to the beginning
 */
function resetMock() {
  checkifTokenValidMock.reset();
}

/**
 *
 * @param {any} returnValue: value to be return back 
 *                           by the function 'checkIfTokenValid'
 * @returns return parameter (above)
 */
function setTokenStatus(returnValue) {
  checkifTokenValidMock.onCall(0).returns(returnValue);
}

module.exports = { setTokenStatus, resetMock, restoreMock };
