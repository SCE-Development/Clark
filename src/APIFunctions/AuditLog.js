import axios from 'axios';
import { ApiResponse } from './ApiResponses';
import { BASE_API_URL } from '../Enums';

export async function getAllLogs() {
  let status = new ApiResponse();
  await axios
    .get(BASE_API_URL + '/api/AuditLog/getAuditLogs')
    .then(res => {
      status.responseData = res.data;
    })
    .catch(err => {
      status.responseData = err;
      status.error = true;
    });
  return status;
}
