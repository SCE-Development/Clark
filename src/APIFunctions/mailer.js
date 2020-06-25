import axios from 'axios';
import { MAILER_API_URL } from '../config/config';
import { ApiResponse } from './ApiResponses';

/**
 * Invoke the gmail API to send an email to verify a user.
 * @param {string} email - The user's email
 * @param {string} firstName - The user's first name
 * @returns {ApiResponse} Containing any error information related to the
 * request
 */
export async function sendVerificationEmail(email, firstName) {
  let status = new ApiResponse();
  await axios
    .post(MAILER_API_URL + '/api/mailer/sendVerificationEmail', {
      recipientEmail: email,
      recipientName: firstName
    })
    .catch(error => {
      status.error = true;
      status.responseData = error;
    });
  return status;
}
