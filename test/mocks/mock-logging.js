const sinon = require('sinon');
const loggingHelpers = require('../../api/util/logging-helpers');
const SignLog = require('../../api/models/SignLog');
let signLogStub = null;

/**
 * This function is a stub for the addSignLog defined in
 * api/util/logging-helpers.js. We stub the function as the original addSignLog
 * uses axios.post, which won't work when we run API tests.
 * @param {Object} signRequest An object containing information about the
 * request some of the sign.
 * @returns {boolean} If the save was successful or not.
 */
async function addSignLogStub(signRequest) {
  return new Promise((resolve, reject) => {
    const newSignLog = new SignLog({
      signText: signRequest.text,
      firstName: signRequest.firstName,
      email: signRequest.email
    });
    newSignLog.save(function(error) {
      if (error) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
}

/**
 * Initialize stubbing all the logging functions defined in
 * api/util/logging-helpers.js. For now only addSignLog is stubbed.
 */
function initializeLoggingMocks() {
  signLogStub = sinon.stub(loggingHelpers, 'addSignLog');
  signLogStub.callsFake(addSignLogStub);
}

/**
 * Restore or un-stub all of the logging functions.
 */
function restoreLoggingMocks() {
  signLogStub.restore();
}

module.exports = { initializeLoggingMocks, restoreLoggingMocks };
