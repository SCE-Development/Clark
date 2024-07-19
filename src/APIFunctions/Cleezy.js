import axios from 'axios';
import { ApiResponse } from './ApiResponses';

import { BASE_API_URL } from '../Enums';


export async function getAllUrls({
  token, page, search, sortColumn, sortOrder
}) {
  let status = new ApiResponse();
  const url = new URL('/api/Cleezy/list', BASE_API_URL);
  await axios
    .get(
      url.href, {
        params: {
          page,
          ...(search !== undefined && { search }),
          sortColumn,
          sortOrder
        }, headers: {
          'Authorization': `Bearer ${token}`
        }
      },
    )
    .then(res => {
      status.responseData = res.data;
    })
    .catch(err => {
      status.responseData = err;
      status.error = true;
    });
  return status;
}

export async function createUrl(url, alias = null, token) {
  let status = new ApiResponse();
  const urlToAdd = { url, alias };
  try {
    const url = new URL('/api/Cleezy/createUrl', BASE_API_URL);
    const response = await axios
      .post(
        url.href,
        urlToAdd,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
    const data = response.data;
    status.responseData = data;
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
  await axios
    .post(
      url.href,
      alias,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
    .catch(err => {
      status.responseData = err;
      status.error = true;
    });
  return status;
}
