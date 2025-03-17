import axios from 'axios';
import { ApiResponse } from './ApiResponses';
import { BASE_API_URL } from '../Enums';

export async function sendMessage(id, token, message) {
  let status = new ApiResponse();
  const roomId = id || 'general';

  const url = new URL('/api/messages/send', BASE_API_URL);

  await axios
    .post(url.href,
      { message, id: roomId },
      {
        headers: {
          'authorization' : 'Bearer ' + token
        }
      })
    .then(res => {
      status.responseData = res.data;
    })
    .catch(err => {
      status.error = true;
      status.responseData = err;
    });
  return status;
}

export async function connectToRoom(room, token, onMessage, onError) {
  const url = new URL('/api/messages/listen', BASE_API_URL);
  url.searchParams.append('id', room);
  url.searchParams.append('token', token);
  const eventSource = new EventSource(url.href);

  eventSource.onmessage = (event) => {
    let parsedMessage = JSON.parse(event.data);

    onMessage(parsedMessage);
  };

  eventSource.onerror = (event) => {
    onError(event);
  };

  return eventSource;
}

