import { ApiResponse } from './ApiResponses';

const OCCUPANCY_URL = 'http://192.168.69.188/json/devices/';

export async function getOccupancyDevices() {
  let status = new ApiResponse();
  try {
    const response = await fetch(OCCUPANCY_URL, { method: 'GET' });
    const data = await response.json().catch(() => null);
    status.responseData = data;
    if (!response.ok) {
      status.error = true;
    }
  } catch (err) {
    status.responseData = err;
    status.error = true;
  }
  return status;
}
