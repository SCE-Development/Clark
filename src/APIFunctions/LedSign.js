import axios from 'axios';
import { ApiResponse } from './ApiResponses';
import dataAPI from './CountAPI';

let config = require('../config/config.json');
let LOGGING_API_URL = process.env.NODE_ENV === 'production' ?
  config.LOGGING_API_URL_PROD : config.LOGGING_API_URL;
let RPC_API_URL = process.env.NODE_ENV === 'production' ?
  config.RPC_API_URL_PROD : config.RPC_API_URL;

/**
 * Checks to see if the sign is accepting requests. This is done
 * before any requests to update the sign can be made.
 * @param {string} officerName The name of the officer requesting the sign
 * @returns {ApiResponse} ApiResponse Object containing the response data
 */
export async function healthCheck(officerName) {
  let status = new ApiResponse();
  await axios
    .post(RPC_API_URL + '/LedSign/healthCheck', { officerName })
    .then(res => {
      status.responseData = res.data;
    })
    .catch(err => {
      status.responseData = err;
      status.error = true;
    });

  if (status.error = true) {
    dataAPI('healthCheck', true);
  }
  else {
    dataAPI('healthCheck', false);
  }
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
    .get(LOGGING_API_URL+'/SignLog/getSignLogs')
    .then(res => {
      result.responseData = res.data;
    })
    .catch(err => {
      result.responseData = err;
      result.error = true;
    });

  if (status.error = true) {
    dataAPI('getAllSignLogs', true);
  }
  else {
    dataAPI('getAllSignLogs', false);
  }
  return result;
}

/**
 * Update the text of the sign.
 * @param {Object} signData - An object containing all of the sign data (text,
 * colors, etc.) sent to the RPC client.
 * @returns {ApiResponse} Containing any error information related to the
 * request
 */
export async function updateSignText(signData) {
  let status = new ApiResponse();
  await axios
    .post(RPC_API_URL + '/LedSign/updateSignText', { ...signData })
    .then(res => {
      status = res.data;
    })
    .catch(err => {
      status.responseData = err;
      status.error = true;
    });

  if (status.error = true) {
    dataAPI('updateSignText', true);
  }
  else {
    dataAPI('updateSignText', false);
  }
  return status;
}
