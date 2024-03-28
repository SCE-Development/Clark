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
      status.responseData = err;
      status.error = true;
    });
  return status;
}

export async function createDessert(newDessert, token) {
    let status = new ApiResponse();
    await axios.post(DESSERT_API_URL + '/Dessert/createDessert',
      { ...newDessert, token }).catch(err => {
        status.error = true;
        status.responseData = err;
      });
    return status;
}
  
export async function editDessert(dessertToUpdate, token) {
    let status = new ApiResponse();
    const dessertToEdit = {
        id: dessertToUpdate._id,
        title: dessertToUpdate.title,
        description: dessertToUpdate.description,
        rating: dessertToUpdate.rating
    };
    await axios.post(DESSERT_API_URL + '/Dessert/editDessert',
      { token, ...dessertToEdit }).then(err => {
        status.responseData = res.data;
      }).catch(() => {
        status.error = true;
      });
    return status;
}

export async function deleteDessert(dessertToDelete, token) {
    let status = new ApiResponse();
    await axios
        .post(DESSERT_API_URL + '/dessert/deleteDessert',
            { token, id: dessertToDelete._id})
        .then(res => {
            status.responseData = des.data;
        })
        .catch(() => {
            status.error = true;
        });
    return status;
}