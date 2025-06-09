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
  const url = new URL('/api/LedSign/healthCheck', BASE_API_URL);
  try {
    const res = await fetch(url.href, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Officer-Name': officerName
      }
    });
    if (res.ok) {
      const result = await res.json();
      status.responseData = result;
    } else {
      status.error = true;
    }
  } catch(err) {
    status.responseData = err;
    status.error = true;
  }
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
  const url = new URL('/api/LedSign/updateSignText', BASE_API_URL);
  try {
    const res = await fetch(url.href, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(signData)
    });
    if (res.ok) {
      const result = await res.json();
      status.responseData = result;
    } else {
      status.error = true;
    }
  } catch(err) {
    status.responseData = err;
    status.error = true;
  }
  return status;
}
