import axios from 'axios';
import { ApiResponse } from './ApiResponses';
import { BASE_API_URL } from '../Enums';

export async function getAllLogs(page, token) {
  const status = new ApiResponse();
  const url = new URL('/api/AuditLog/getAuditLogs', BASE_API_URL);

  if (page) {
    url.searchParams.append('page', page);
  }

  try {
    const res = await axios.get(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    status.responseData = res.data;
  } catch (err) {
    status.responseData = err;
    status.error = true;
  }

  return status;
}
