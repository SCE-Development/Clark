import axios from 'axios';
import { ApiResponse } from './ApiResponses';
import { BASE_API_URL } from '../Enums';

export async function getAllLogs(page, actionFilter, firstNameFilter, lastNameFilter, token) {
  const status = new ApiResponse();
  const url = new URL('/api/AuditLog/getAuditLogs', BASE_API_URL);

  if (page) {
    url.searchParams.append('page', page);
  }

  if (Array.isArray(actionFilter) && actionFilter.length > 0) {
    url.searchParams.append('action', actionFilter.join(','));
  }

  if (firstNameFilter) {
    url.searchParams.append('firstName', firstNameFilter);
  }

  if (lastNameFilter) {
    url.searchParams.append('lastName', lastNameFilter);
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
