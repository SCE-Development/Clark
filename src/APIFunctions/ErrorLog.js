import axios from 'axios';
import { ApiResponse } from './ApiResponses';
let config = require('../config/config.json');
let PERIPHERAL_API_URL = process.env.NODE_ENV === 'production' ?
  config.PERIPHERAL_API_URL_PROD : config.PERIPHERAL_API_URL;

/**
 * Retrieve all errors.
 * @returns {ApiResponse} containing the logs or error information
 */
export async function getAllErrorLogs() {
  let status = new ApiResponse();
  await axios
    .get(PERIPHERAL_API_URL + '/ErrorLog/getErrorLogs')
    .then(res => {
      status.responseData = res.data;
    })
    .catch(err => {
      status.responseData = err.data;
      status.error = true;
    });
  return status;
}

/**
 * Add a new error.
 * @param {Object} newError - The error that is to be added
 * @param {(string|undefined)} newError.userEmail - The email of the user
 *                                                  who has sent this error
 * @param {(string|undefined)} newError.errorTime- The time the error occured
 * @param {string} newError.apiEndpoint - The location of the error
 * @param {string} newError.errordescription - The description of the error
 */
export async function addErrorLog(newError) {
  let status = new ApiResponse();
  await axios.post(PERIPHERAL_API_URL + '/ErrorLog/addErrorLog',
    { ...newError }).catch(err => {
    status.error = true;
    status.responseData = err;
  });
  return status;
}
