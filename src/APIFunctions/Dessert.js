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

// admin requests
export async function createDessert(newDessert, token) {
    let status = new ApiResponse();
    await axios.post(DESSERT_API_URL + "/Dessert/createDessert", newDessert, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    }).catch(err => {
        status.error = true;
    })

    return status
}

export async function editDessert(dessertToChange, token) {
    let status = new ApiResponse();
    await axios.post(DESSERT_API_URL + "/Dessert/editDessert", dessertToChange, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    }).catch(err => {
        status.error = true;
    })

    return status
}

export async function deleteDessert(dessertToDelete, token) {
    let status = new ApiResponse();
    await axios.post(DESSERT_API_URL + "/Dessert/deleteDessert", dessertToDelete, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    }).catch(err => {
        status.error = true;
    })

    return status
}


