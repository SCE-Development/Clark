import axios from 'axios';
import { ApiResponse } from './ApiResponses';

export async function createOfficer(newOfficer, token){
  let status = new ApiResponse();
  await axios
    .post('api/officerManager/submit', {token, ...newOfficer})
    .then(res => {
      status.responseData = res.data;
    })
    .catch(() => {
      status.error = true;
    });
  return status;
}

export async function deleteOfficer(officerToDelete, token){
  let status = new ApiResponse();
  await axios
    .post('api/officerManager/delete', {token, email: officerToDelete.email})
    .then(res => {
      status.responseData = res.data;
    })
    .catch(() => {
      status.error = true;
    });
  return status;
}

export async function getAllOfficers(){
  let status = new ApiResponse();
  await axios
    .post('api/officerManager/getOfficers')
    .then(res => {
      status.responseData = res.data;
    })
    .catch(err => {
      status.responseData = err;
      status.error = true;
    });
  return status;
}

export async function getOfficer(email, token){
  let status = new ApiResponse();
  await axios
    .post('api/officerManager/getOfficers', {token, email})
    .then(res => {
      status.responseData = res.data;
    })
    .catch(err => {
      status.responseData = err;
      status.error = true;
    });
  return status;
}

export async function editOfficer(officerToUpdate, token){
  let status = new ApiResponse();
  await axios
    .post('api/officerManager/edit', {token, ...officerToUpdate})
    .then(res => {
      status.responseData = res.data;
    })
    .catch(() => {
      status.error = true;
    });
  return status;
}
