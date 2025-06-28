import { ApiResponse } from './ApiResponses';
import { BASE_API_URL } from '../Enums';

export async function getCardsFromDb(token) {
  let status = new ApiResponse();
  try {
    const url = new URL('/api/OfficeAccessCard/getAllCards', BASE_API_URL);
    const res = await fetch(url.href, {
      headers: {
        'Authorization': `Bearer ${token}`
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
    url.searchParams.append('cardBytes', cardBytes);
    const res = await fetch(url.href, {
      headers: {
        'Authorization': `Bearer ${token}`
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
}
