import { ApiResponse } from './ApiResponses';
import { BASE_API_URL } from '../Enums';

export async function getAllUsers(token) {
  let status = new ApiResponse();
  try {
    const url = new URL('/api/LedMatrix/getAllUsers', BASE_API_URL);
    const res = await fetch(url.href, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
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

export async function addUser(userData, token) {
  let status = new ApiResponse();
  try {
    const url = new URL('/api/LedMatrix/addUser', BASE_API_URL);
    const res = await fetch(url.href, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
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

export async function deleteUser(username, token) {
  let status = new ApiResponse();
  try {
    const url = new URL('/api/LedMatrix/deleteUser', BASE_API_URL);
    const res = await fetch(url.href, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username }),
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

export async function updateUser(oldUser, newUser, token) { // both user objects are in the format { firstName, lastName, username }
  let status = new ApiResponse();
  try {
    const url = new URL('/api/LedMatrix/updateUser', BASE_API_URL);
    const res = await fetch(url.href, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        oldUser,
        newUser,
      })
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
