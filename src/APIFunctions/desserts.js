import axios from 'axios';
import { ApiResponse } from './ApiResponses';

let DESSERT_API_URL = 'http://localhost:8084/dessert_api';

export async function createDessert(newDessert, token) {
  let status = new ApiResponse();
  await axios.post(
    DESSERT_API_URL + '/Dessert/createDessert',
    newDessert,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  ).catch(err => {
    status.error = true;
    status.responseData = err;
  });
  return status;
}

export async function getAllDesserts() {
  let status = new ApiResponse();
  await axios
    .get(DESSERT_API_URL + '/Dessert/getDesserts')
    .then(res => {
      status.responseData = res.data;
    })
    .catch(err => {
      status.responseData = err;
      status.error = true;
    });
  return status;
}
