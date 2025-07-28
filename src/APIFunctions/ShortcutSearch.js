import { UserApiResponse } from './ApiResponses';
import { BASE_API_URL } from '../Enums';

/**
 * Queries the database for all users.
 * @param {string} token The jwt token for verification
 * @param {string} query The search query to filter users by name or email.
 * @returns {UserApiResponse} Containing any error information or the array of
 * users.
 */
export async function searchAllUsers({
  token,
  query = null
}) {
  const url = new URL('/api/ShortcutSearch/', BASE_API_URL);

  let status = new UserApiResponse();
  try {
    const res = await fetch(url.href, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        query
      }),
    });
    if (res.ok) {
      const result = await res.json();
      status.responseData = result;
    } else {
      status.error = true;
    }
  } catch(err) {
    status.error = true;
  }
  return status;
}
