import axios from 'axios';
import { ApiResponse } from './ApiResponses';
import { MAILER_API_URL } from '../config/config.json';

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
    .post(MAILER_API_URL + '/api/Mailer/sendVerificationEmail', {
      recipientEmail: email,
      recipientName: firstName,
    })
    .then((response) => {
      status.responseData = response;
    })
    .catch((error) => {
      status.error = true;
      status.responseData = error;
    });
  return status;
}

/**
 * Invoke the gmail API to send an email blast to specified users.
 * @param {Array} emailList - String array of user email addresses
 * @param {string} subject - The subject of the email
 * @param {string} content - The contents of the email
 * @returns {ApiResponse} Containing any error information related to the
 * request
 */
export async function sendBlastEmail(emailList, subject, content) {
  let status = new ApiResponse();
  await axios
    .post(MAILER_API_URL + '/api/Mailer/sendBlastEmail', {
      recipientEmail: emailList,
      blastSubject: subject,
      blastContent: content,
    })
    .then((response) => {
      status.responseData = response;
    })
    .catch((error) => {
      status.error = true;
      status.responseData = error;
    });
  return status;
}
