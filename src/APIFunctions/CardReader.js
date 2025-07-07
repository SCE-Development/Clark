import { ApiResponse } from './ApiResponses';
import { BASE_API_URL } from '../Enums';

export async function getAllCardsFromDb({
  token,
  page = null,
}) {
  let status = new ApiResponse();
  try {
    const url = new URL('/api/OfficeAccessCard/getAllCards', BASE_API_URL);
    const res = await fetch(url.href, {
      method: 'POST',
      body: JSON.stringify({
        page,
      }),
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
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

export async function deleteCardFromDb(token, cardBytes) {
  let status = new ApiResponse();
  try {
    const url = new URL('/api/OfficeAccessCard/delete', BASE_API_URL);
    const res = await fetch(url.href, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cardBytes, }),
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
