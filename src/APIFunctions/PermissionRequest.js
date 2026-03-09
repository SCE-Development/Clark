import { ApiResponse } from './ApiResponses';
import { BASE_API_URL } from '../Enums';

export async function getPermissionRequests(type, token) {
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

    const data = await res.json();

    if (res.ok) {
      status.responseData = data;
      status.error = false;
      return status;
    }
    status.error = true;
    if (res.status === 409) {
      // user already has a pending/approved request.
      status.responseData = data;
    }
  } catch (err) {
    status.responseData = err;
    status.error = true;
  }

  return status;
}

export async function approvePermissionRequest(type, id, token) {
  const status = new ApiResponse();
  const url = new URL('/api/PermissionRequest/approve', BASE_API_URL);
  try {
    const res = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ type, _id: id }),
    });
    status.error = !res.ok;
  } catch (err) {
    status.error = true;
  }
  return status;
}

export async function deletePermissionRequest(id, token) {
  const status = new ApiResponse();
  const url = new URL('/api/PermissionRequest/delete', BASE_API_URL);
  try {
    const res = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ _id: id }),
    });
    status.error = !res.ok;
  } catch (err) {
    status.error = true;
  }
  return status;
}
