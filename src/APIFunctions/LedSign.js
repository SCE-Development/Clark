import axios from 'axios';
import { ApiResponse } from './ApiResponses';
let config = require('../config/config.json');
let PERIPHERAL_API_URL = process.env.NODE_ENV === 'production' ?
  config.PERIPHERAL_API_URL_PROD : config.PERIPHERAL_API_URL;

/**
 * Checks to see if the sign is accepting requests. This is done
 * before any requests to update the sign can be made.
 * @param {string} officerName The name of the officer requesting the sign
 * @returns {ApiResponse} ApiResponse Object containing the response data
 */
export async function healthCheck(officerName) {
  let status = new ApiResponse();
  await axios
    .get(PERIPHERAL_API_URL + '/LedSign/healthCheck', { officerName })
    .then(res => {
      status.responseData = res.data;
    })
    .catch(err => {
      status.responseData = err;
      status.error = true;
    });
  return status;
}

/**
 * Retrieve all sign logs.
 * @returns {ApiResponse} Containing any error information related to the
 * request.
 */
export async function getAllSignLogs() {
  let result = new ApiResponse();
  await axios
    .get(PERIPHERAL_API_URL + '/SignLog/getSignLogs')
    .then(res => {
      result.responseData = res.data;
    })
    .catch(err => {
      result.responseData = err;
      result.error = true;
    });
  return result;
}

/**
 * Update the text of the sign.
 * @param {Object} signData - An object containing all of the sign data (text,
 * colors, etc.).
 * @returns {ApiResponse} Containing any error information related to the
 * request
 */
export async function updateSignText(signData, token) {
  let status = new ApiResponse();
  await axios
    .post(PERIPHERAL_API_URL + '/LedSign/updateSignText',
    { token, ...signData })
    .then(res => {
      status = res.data;
    })
    .catch(err => {
      status.responseData = err;
      status.error = true;
    });
  return status;
}
