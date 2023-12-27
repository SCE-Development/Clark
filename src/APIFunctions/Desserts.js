import axios from 'axios';
import { ApiResponse } from './ApiResponses';

let DESSERT_API_URL = 'http://localhost:8080/api';

export async function getAllDesserts() {
  let status = new ApiResponse();
  await axios
    .get(DESSERT_API_URL + '/Dessert/getDesserts')
    .then((res) => {
      status.responseData = res.data;
    })
    .catch((err) => {
      status.responseData = err;
      status.error = true;
    });
  return status;
}

export async function createDessert(newDessert, token) {
  let status = new ApiResponse();
  await axios
    .post(DESSERT_API_URL + '/Dessert/createDessert', { ...newDessert, token })
    .catch((err) => {
      status.error = true;
      status.responseData = err;
    });
  return status;
}

export async function deleteDessert(_id, token) {
  let status = new ApiResponse();
  await axios
    .post(DESSERT_API_URL + '/Dessert/deleteDessert', { _id, token })
    .catch((err) => {
      status.error = true;
      status.responseData = err;
    });
  return status;
}

export async function editDessert(editedDessert, token) {
  let status = new ApiResponse();
  await axios
    .post(DESSERT_API_URL + '/Dessert/editDessert', { ...editedDessert, token })
    .catch((err) => {
      status.error = true;
      status.responseData = err;
    });
  return status;
}
