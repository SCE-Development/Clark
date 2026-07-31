import { ApiResponse } from './ApiResponses';
import { BASE_API_URL } from '../Enums';
const TOO_MANY_ATTEMPTS = 429;

export async function verifyMembershipFromDb(token, confirmationCode) {
  let status = new ApiResponse();
  try {
    const url = new URL('/api/MembershipPayment/verifyMembership', BASE_API_URL);
    const res = await fetch(url.href, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ confirmationCode })
    });
    if (res.status == TOO_MANY_ATTEMPTS) {
      const data = await res.json();
      status.responseData = data;
      status.error = false;
    } else {
      status.error = !res.ok;
    }
  } catch (err) {
    status.error = true;
    status.responseData = err;
  }
  return status;
}
