const { LOGGING_API_URL } = require('../config/config');
const axios = require('axios');

/**
 * Add a new error by calling on the ErrorLog API.
 * @param {Object} newError - The error that is to be added
 * @param {(string|undefined)} errorToAdd.userEmail - The email of the user
 *                                                  who has sent this error
 * @param {(string|undefined)} errorToAdd.errorTime- The time the error occured
 * @param {string} errorToAdd.apiEndpoint - The location of the error
 * @param {string} errorToAdd.errordescription - The description of the error
 * @returns {boolean} - Whether the save was successul or not
 */
async function addErrorLog(errorToAdd) {
  let errorSaved = true;
  await axios.post(LOGGING_API_URL + '/api/ErrorLog/addErrorLog',
    { ...errorToAdd })
    .catch(err => {
      errorSaved = false;
    });
  return errorSaved;
}

/**
 * Add a log to the SignLog MongoDB collection
 * @param {Object} signRequest An object containing information about the
 * request some of the sign.
 * @returns {boolean} If the save was successful or not.
 */
async function addSignLog(signRequest) {
  let saveSuccessful = true;
  await axios.post(LOGGING_API_URL + 'api/SignLog/addSignLog', {
    signText: signRequest.text,
    firstName: signRequest.firstName,
    email: signRequest.email
  }).catch(err => {
    saveSuccessful = false;
  });
  return saveSuccessful;
}

module.exports = { addErrorLog, addSignLog };
