import axios from 'axios';
import { ApiResponse } from './ApiResponses';
import { BASE_API_URL } from '../Enums';


/**
 * Checks to see if the sign is accepting requests. This is done
 * before any requests to update the sign can be made.
 * @param {string} officerName The name of the officer requesting the sign
 * @returns {ApiResponse} ApiResponse Object containing the response data
 */
export async function healthCheck(officerName) {
  let status = new ApiResponse();
  const url = new URL('/peripheralapi/LedSign/healthCheck', BASE_API_URL);
  await axios
    .get(url.href, { officerName })
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
 * Update the text of the sign.
 * @param {Object} signData - An object containing all of the sign data (text,
 * colors, etc.).
 * @returns {ApiResponse} Containing any error information related to the
 * request
 */
export async function updateSignText(signData, token) {
  let status = new ApiResponse();
  const url = new URL('/peripheralapi/LedSign/updateSignText', BASE_API_URL);
  await axios
    .post(url.href,
      { token, ...signData })
    .then(res => {
      status.responseData = res.data;
    })
    .catch(err => {
      status.responseData = err;
      status.error = true;
    });
  return status;
}
