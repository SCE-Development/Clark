import { ApiResponse } from './ApiResponses';
import { BASE_API_URL } from '../Enums';

export async function incrementVisitCount(type) {
  let status = new ApiResponse();
  try {
    const url = new URL(`api/Visit/${type}`, BASE_API_URL);
    await fetch (url.href, {
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

export async function getVisitCount(type) {
  let status = new ApiResponse();
  try {
    const url = new URL(`api/Visit/${type}`, BASE_API_URL);
    const res = await fetch (url.href);
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
