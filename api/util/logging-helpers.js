const ErrorLog = require('../models/ErrorLog');
const SignLog = require('../models/SignLog');

/**
 * Add a new error by calling on the ErrorLog API.
 * @param {Object} newError - The error that is to be added
 * @param {(string|undefined)} errorToAdd.userEmail - The email of the user
 *                                                  who has sent this error
 * @param {(string|undefined)} errorToAdd.errorTime- The time the error occured
 * @param {string} errorToAdd.apiEndpoint - The location of the error
 * @param {string} errorToAdd.errordescription - The description of the error
 * @returns {Promise<boolean>} - Whether the save was successul or not
 */
async function addErrorLog(errorToAdd) {
  const newError = new ErrorLog({
    userEmail: errorToAdd.userEmail,
    errorTime: errorToAdd.errorTime,
    apiEndpoint: errorToAdd.apiEndpoint,
    errorDescription: errorToAdd.errorDescription
  });
  return new Promise((resolve, reject) => {
    newError.save(function(error) {
      if (error) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
}

/**
 * Add a log to the SignLog MongoDB collection
 * @param {Object} signRequest An object containing information about the
 * request some of the sign.
 * @returns {boolean} If the save was successful or not.
 */
async function addSignLog(signRequest) {
  const newSign = new SignLog({
    signText: signRequest.signText,
    firstName: signRequest.firstName,
    email: signRequest.email,
    timeOfPosting: signRequest.timeOfPosting
  });

  return new Promise((resolve, reject) => {
    newSign.save(function(error) {
      if (error) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
}

module.exports = { addErrorLog, addSignLog };
