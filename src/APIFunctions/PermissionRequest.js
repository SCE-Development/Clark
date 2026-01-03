import { ApiResponse } from './ApiResponses';
import { BASE_API_URL } from '../Enums';

export async function getPermissionRequest(type, token) {
  const status = new ApiResponse();
  const url = new URL('/api/PermissionRequest/get', BASE_API_URL);
  url.searchParams.append('type', type);

  try {
    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      const data = await res.json();
      status.responseData = data;
    } else if (res.status === 404) {
      status.responseData = null;
    } else {
      status.error = true;
    }
  } catch (err) {
    status.responseData = err;
    status.error = true;
  }

  return status;
}

export async function createPermissionRequest(type, token) {
  const status = new ApiResponse();
  const url = new URL('/api/PermissionRequest/create', BASE_API_URL);

  try {
    const res = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ type }),
    });

    if (res.ok) {
      const data = await res.json();
      status.responseData = data;
    } else {
      status.error = true;
    }
  } catch (err) {
    status.responseData = err;
    status.error = true;
  }

  return status;
}

