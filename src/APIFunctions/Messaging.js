import axios from 'axios';
import { ApiResponse } from './ApiResponses';

let GENERAL_API_URL = process.env.REACT_APP_GENERAL_API_URL
  || 'http://localhost:8080/api';

export async function sendMessage(id, apiKey, message) {
  let status = new ApiResponse();
  const roomId = id || 'general';
  await axios
    .post(GENERAL_API_URL + '/messages/send', { apiKey, message, id: roomId })
    .then(res => {
      status.responseData = res.data;
    })
    .catch(err => {
      status.error = true;
      status.responseData = err;
    });
  return status;
}

export async function connectToRoom(room, apiKey, onMessage, onError) {
  const eventSource = new EventSource(`${GENERAL_API_URL}/messages/listen?id=${encodeURIComponent(room)}&apiKey=${encodeURIComponent(apiKey)}`);

  eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data);
    onMessage(data);
  };

  eventSource.onerror = (event) => {
    onError(event);
  };

  return eventSource;
}

