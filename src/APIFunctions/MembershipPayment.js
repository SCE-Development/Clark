import { ApiResponse } from './ApiResponses';
import { BASE_API_URL } from '../Enums';

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
    if (res.ok) {
      const result = await res.json();
      status.responseData = result;
    } else {
      status.error = true;
    }
  } catch (err) {
    status.error = true;
    status.responseData = err;
  }
  return status;
}
