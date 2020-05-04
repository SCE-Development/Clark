const ErrorLog = require('../models/ErrorLog');

/**
 * Add a new error.
 * @param {Object} newError - The error that is to be added
 * @param {(string|undefined)} errorToAdd.userEmail - The email of the user
 *                                                  who has sent this error
 * @param {(string|undefined)} errorToAdd.errorTime- The time the error occured
 * @param {string} errorToAdd.apiEndpoint - The location of the error
 * @param {string} errorToAdd.errordescription - The description of the error
 */
async function addErrorLog(errorToAdd){
  let errorSaved = true;
  const newError = new ErrorLog({
    userEmail: errorToAdd.userEmail,
    errorTime: errorToAdd.errorTime,
    apiEndpoint:errorToAdd.apiEndpoint,
    errorDescription: errorToAdd.errorDescription
  });
  await newError.save()
    .catch(_ => {
      errorSaved = false;
    });
  return errorSaved;
}

module.exports = {addErrorLog};
