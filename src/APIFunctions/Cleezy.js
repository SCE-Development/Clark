import { ApiResponse } from './ApiResponses';

import { BASE_API_URL } from '../Enums';


export async function getAllUrls({
  token, page, search, sortColumn, sortOrder
}) {
  let status = new ApiResponse();
  const url = new URL('/api/Cleezy/list', BASE_API_URL);
  try {
    const res = await fetch(url.href, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      params: {
        page,
        ...(search !== undefined && { search }),
        sortColumn,
        sortOrder
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

export async function createUrl(url, alias = null, token) {
  let status = new ApiResponse();
  const urlToAdd = { url, alias };
  const url = new URL('/api/Cleezy/createUrl', BASE_API_URL);
  try {
    const res = await fetch(url.href, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(urlToAdd)
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

export async function deleteUrl(aliasIn, token) {
  let status = new ApiResponse();
  const alias = { 'alias': aliasIn };
  const url = new URL('/api/Cleezy/deleteUrl', BASE_API_URL);
  try {
    const res = await fetch(url.href, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });
  } catch (err) {
    status.error = true;
    status.responseData = err;
  }
  return status;
}
