
import { ApiResponse } from './ApiResponses';

import { BASE_API_URL } from '../Enums';


export async function getAllUrls({
  token, page, search, sortColumn, sortOrder
}) {
  let status = new ApiResponse();
  const url = new URL('/api/Cleezy/list', BASE_API_URL);
  if (page) url.searchParams.set('page', page);
  if (search !== null) url.searchParams.set('search', search);
  if (sortColumn) url.searchParams.set('sortColumn', sortColumn);
  if (sortOrder) url.searchParams.set('sortOrder', sortOrder);
  try {
    const res = await fetch(url.href, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (res.ok) {
      const result = await res.json();
      status.responseData = result;
    } else {
      status.error = true;
    }
  } catch(err) {
    status.error = true;
    status.responseData = err;
  }
  return status;
}

export async function createUrl(url, alias = null, expiresAt = null, token) {
  let status = new ApiResponse();
  const urlToAdd = { url, alias, expiresAt };
  try {
    const url = new URL('/api/Cleezy/createUrl', BASE_API_URL);
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
  } catch(err) {
    status.error = true;
    status.responseData = err.response?.data?.error || err.message || 'Unknown error';
  }
  return status;
}

export async function deleteUrl(aliasIn, token) {
  let status = new ApiResponse();
  const alias = { 'alias': aliasIn };
  const url = new URL('/api/Cleezy/deleteUrl', BASE_API_URL);
  try {
    const res = await fetch(url.href, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(alias)
    });
    if (!res.ok) {
      status.error = true;
    }
  } catch(err) {
    status.error = true;
    status.responseData = err;
  }
  return status;
}
