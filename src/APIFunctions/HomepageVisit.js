import { ApiResponse } from './ApiResponses';
import { BASE_API_URL } from '../Enums';

export async function incrementVisitCount() {
  let status = new ApiResponse();
  try {
    await fetch (BASE_API_URL + 'api/Homepage/visit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (res.ok) {
      status.responseData = result;
    } else {
      status.error = true;
    }
  } catch (err) {
    status.responseData = err;
    status.error = true;
  }
  return status;
}

export async function getVisitCount() {
  let status = new ApiResponse();
  try {
    const res = await fetch (BASE_API_URL + 'api/Homepage/count');
    if (res.ok) {
      const result = await res.json();
      status.responseData = result;
    } else {
      status.error = true;
    }
  } catch (err) {
    status.responseData = err;
    status.error = true;
  }
  return status;
}
