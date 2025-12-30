import { ApiResponse } from './ApiResponses';
import { BASE_API_URL } from '../Enums';

export async function getHomeImageUrl() {
    let status = new ApiResponse();
    try {
        console.log(BASE_API_URL + 'api/Homepage/image');
        const res = await fetch (BASE_API_URL + 'api/Homepage/image');
        if (res.ok) {
            const result = await res.text();
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