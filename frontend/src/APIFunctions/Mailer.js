import { ApiResponse } from './ApiResponses';
import { BASE_API_URL } from '../Enums';

/**
 * Invoke the gmail API to send an email to verify a user.
 * @param {string} email - The user's email
 * @param {string} firstName - The user's first name
 * @returns {ApiResponse} Containing any error information related to the
 * request
 */
export async function sendVerificationEmail(email, token) {
  let status = new ApiResponse();
  const url = new URL('/api/Auth/resendVerificationEmail', BASE_API_URL);
  try {
    const res = await fetch(url.href, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        email,
      }),
    });
    if (res.ok) {
      status.responseData = true;
    } else {
      status.error = true;
    }
  } catch(error) {
    status.error = true;
    status.responseData = error;
  }
  return status;
}

/**
 * Invoke the gmail API to send an email to password reset a user.
 * @param {string} email - The user's email
 * @returns {ApiResponse} Containing any error information related to the
 * request
 */
export async function sendPasswordReset(email, captchaToken) {
  let status = new ApiResponse();
  const url = new URL('/api/Auth/sendPasswordReset', BASE_API_URL);
  try {
    const res = await fetch(url.href, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        captchaToken,
      }),
    });
    if (!res.ok) {
      status.error = true;
    }
  } catch(error) {
    status.error = error;
  }
  return status;
}
