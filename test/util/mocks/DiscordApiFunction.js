const TokenValidation = require('../../../api/util/token-verification');
const sinon = require('sinon');

let discordApiKeyMock = null;

/**
 * Initialize the stub to be used in other functions.
 */
function initializeDiscordAPIMock() {
  discordApiKeyMock = sinon.stub(TokenValidation, 'checkDiscordKey');
}

/**
 * Restore sinon's stub, function returned to its original state
 */
function restoreDiscordAPIMock() {
  discordApiKeyMock.restore();
}

/**
 * Reset sinon-stub's call, reset onCall-function back to the beginning
 */
function resetDiscordAPIMock() {
  discordApiKeyMock.reset();
}

/**
 *
 * @param {any} returnValue: value to be return back
   *                           by the function 'checkIfTokenValid'
   * @returns return parameter (above)
   */
function setDiscordAPIStatus(returnValue) {
  if (returnValue) {
    discordApiKeyMock.returns(true);
  } else {
    discordApiKeyMock.returns(false);
  }
}

module.exports = {
  setDiscordAPIStatus,
  resetDiscordAPIMock,
  restoreDiscordAPIMock,
  initializeDiscordAPIMock
};
