import { ApiResponse } from './ApiResponses';
import { BASE_API_URL } from '../Enums';

export async function getPermissionRequest(type, token) {
  const status = new ApiResponse();
  const url = new URL('/api/PermissionRequest/', BASE_API_URL);
  url.searchParams.append('type', type);

  try {
    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    status.error = !res.ok;
    if (res.ok) {
      const data = await res.json();
      status.responseData = data;
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

    status.error = !!res.ok;
    if (res.ok || res.status === 409) {
      // Backend sends 200 with no body on success, so fetch the created request
      const existingRequest = await getPermissionRequest(type, token);
      status.responseData = existingRequest.responseData;
    }
  } catch (err) {
    status.responseData = err;
    status.error = true;
  }

  return status;
}
