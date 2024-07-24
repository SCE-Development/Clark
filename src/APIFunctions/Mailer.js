import axios from 'axios';
import { ApiResponse } from './ApiResponses';
import { BASE_API_URL } from '../Enums';

/**
 * Invoke the gmail API to send an email to password reset a user.
 * @param {string} email - The user's email
 * @returns {ApiResponse} Containing any error information related to the
 * request
 */
export async function sendPasswordReset(email, captchaToken) {
  let status = new ApiResponse();
  const url = new URL('/cloudapi/Auth/sendPasswordReset', BASE_API_URL);
  await axios
    .post(url.href, {
      email,
      captchaToken,
    })
    .then((response) => {
      status.responseData = response;
    })
    .catch((error) => {
      status.error = error;
    });
  return status;
}
