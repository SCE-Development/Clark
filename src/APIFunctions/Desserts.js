import axios from 'axios';
import { ApiResponse } from './ApiResponses';

let DESSERT_API_URL = 'http://localhost:8084/dessert_api';

export async function getAllDesserts() {
  let status = new ApiResponse();
  await axios
    .get(DESSERT_API_URL + '/Dessert/getDesserts')
    .then(res => {
      status.responseData = res.data;
    })
    .catch(err => {
      status.responseDataData = err;
      status.error = true;
    });
  return status;
}

export async function createDessert(newDessert) {
  let status = new ApiResponse();
  await axios.post(DESSERT_API_URL + '/Dessert/createDessert',
    { ...newDessert }).catch(err => {
    status.error = true;
    status.responseData = err;
  });
  return status;
}

export async function editDessert(dessert) {
  let status = new ApiResponse();
  await axios.post(DESSERT_API_URL + '/Dessert/editDessert',
    { ...dessert }).catch(err => {
    status.error = true;
    status.resposneData = err;
  });
  return status;
}

export async function deleteDessert(dessert) {
  let status = new ApiResponse();
  await axios.post(DESSERT_API_URL + '/Dessert/deleteDessert',
    { ...dessert }).catch(err => {
    status.error = true;
    status.responseData = err;
  });
  return status;
}


