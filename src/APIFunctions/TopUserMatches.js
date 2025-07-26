import { UserApiResponse } from './ApiResponses';
import { BASE_API_URL, membershipState, userFilterType } from '../Enums';

/**
 * Queries the database for the top 5 users matching the query.
 * @param {string} token The jwt token for verification
 * @returns {UserApiResponse} Containing any error information or the array of
 * users.
 */
export async function getTopUserMatches({
  token,
  query
}) {
  const url = new URL('/api/User/topUserMatches', BASE_API_URL);
  const status = new UserApiResponse();

  try {
    const res = await fetch(url.href, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ query, sort: 'firstName', order: 'asc' })
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
