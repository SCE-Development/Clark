import { ApiResponse } from './ApiResponses';
import { BASE_API_URL } from '../Enums';

export async function getHomeImage() {
  let status = new ApiResponse();
  try {
    const url = new URL('/api/Image/Homepage', BASE_API_URL);
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
