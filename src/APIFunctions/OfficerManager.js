import axios from 'axios';
import { ApiResponse } from './ApiResponses';

function create(newOfficer){
    let status = new ApiResponse();
    const officerToAdd = {
        email: newOfficer.email,
        facebook: newOfficer.facebook,
        github: newOfficer.github, 
        linkedin: newOfficer.linkedin, 
        team: newOfficer.team,
        quote: newOfficer.quote,
        pictureUrl: newOfficer.pictureUrl
    };
  await axios
    .post('api/officerManager/submit', {officerToAdd})
    .then(res => {
      status.responseData = res.data;
    })
    .catch(() => {
      status.error = true;
    });
  return status;
}

function deleteOfficer(email){
    await axios
    .post('api/officerManager/delete', {email})
    .then(res => {
        status.responseData = res.data;
    })
    .catch(() => {
        status.error = true;
    });
    return status;
}

function editOfficer(email, data)