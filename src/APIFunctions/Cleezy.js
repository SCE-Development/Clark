import axios from 'axios';
import { ApiResponse } from './ApiResponses';

import { BASE_API_URL } from '../Enums';


export async function getAllUrls({
  token, page, search, sortColumn, sortOrder
}) {
  let status = new ApiResponse();
  const url = new URL('/api/Cleezy/list', BASE_API_URL);
  await axios
    .get(url.href, {
      params: {
        token,
        page,
        ...(search !== undefined && { search }),
        sortColumn,
        sortOrder
      },
    })
    .then(res => {
      status.responseData = res.data;
    })
    .catch(err => {
      status.responseData = err;
      status.error = true;
    });
  return status;
}

export async function createUrl(url, alias = null, expirationDate = null, token) {
  let status = new ApiResponse();
  const urlToAdd = { url, alias, epoch_expiration: expirationDate };

  console.log('Request payload:', {
    token,
    ...urlToAdd
  });


  try {
    console.log(expirationDate);
    console.log(urlToAdd);
    const url = new URL('/api/Cleezy/createUrl', BASE_API_URL);
    const response = await axios
      .post(url.href, { token, ...urlToAdd });
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
    .post(url.href, { token, ...alias })
    .catch(err => {
      status.responseData = err;
      status.error = true;
    });
  return status;
}
