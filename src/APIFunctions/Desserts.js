import axios from 'axios';
import { ApiResponse } from './ApiResponses';

let ANIMAL_API_URL = 'http://localhost:8084/dessert_api';

export async function getAllDesserts() {
  let status = new ApiResponse();
  await axios
    .get(ANIMAL_API_URL + '/Dessert/getDesserts')
    .then(res => {
      status.responseData = res.data;
    })
    .catch(err => {
      status.responseData = err;
      status.error = true;
    });
  return status;
}

export async function createDessert(newDessert, token) {
    let status = new ApiResponse();
    await axios.post(ANIMAL_API_URL + '/Dessert/createDessert',
      { ...newDessert, token }).catch(err => {
        status.error = true;
        status.responseData = err;
      });
    return status;
}

export async function editDessert(dessert, token) {
    let status = new ApiResponse();
    await axios.post(ANIMAL_API_URL + '/Dessert/editDessert',
      { ...dessert, token }).catch(err => {
        status.error = true;
        status.responseData = err;
      });
    return status;
}

export async function deleteDessert(dessertId, token) {
    let status = new ApiResponse();
    console.log(dessertId);
    console.log(token);
    await axios.post(ANIMAL_API_URL + '/Dessert/deleteDessert',
      {_id: dessertId, token }).catch(err => {
        status.error = true;
        status.responseData = err;
      });
    return status;
}