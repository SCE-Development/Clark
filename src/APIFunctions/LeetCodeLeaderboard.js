import { ApiResponse } from './ApiResponses';
import { BASE_API_URL } from '../Enums';

export async function getAllUsers(token) {
  let status = new ApiResponse();
  try {
    const url = new URL('/api/LeetCodeLeaderboard/getAllUsers', BASE_API_URL);
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
    const url = new URL('/api/LeetCodeLeaderboard/addUser', BASE_API_URL);
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
    const url = new URL('/api/LeetCodeLeaderboard/deleteUser', BASE_API_URL);
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

export async function checkIfUserExists(username, token) {
  let status = new ApiResponse();
  try {
    const url = new URL('/api/LeetCodeLeaderboard/checkIfUserExists', BASE_API_URL);
    const res = await fetch(url.href, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
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
