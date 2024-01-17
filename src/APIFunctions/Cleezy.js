import axios from 'axios';
import { ApiResponse } from './ApiResponses';

let PERIPHERAL_API_URL = process.env.REACT_APP_PERIPHERAL_API_URL
  || 'http://localhost:8081/peripheralapi';

export async function getAllUrls(token, page, search) {
  let status = new ApiResponse();
  let params = { token, page };
  if (search !== undefined) {
    params.search = search;
  }
  await axios
    .get(PERIPHERAL_API_URL + '/Cleezy/list', {
      params: params
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

export async function createUrl(url, alias = null, token) {
  let status = new ApiResponse();
  const urlToAdd = { url, alias };
  try {
    const response = await axios
      .post(PERIPHERAL_API_URL + '/Cleezy/createUrl', { token, ...urlToAdd });
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
  await axios
    .post(PERIPHERAL_API_URL + '/Cleezy/deleteUrl', { token, ...alias })
    .catch(err => {
      status.responseData = err;
      status.error = true;
    });
  return status;
}
