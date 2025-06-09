import { ApiResponse } from './ApiResponses';
import { BASE_API_URL } from '../Enums';

export async function sendMessage(id, token, message) {
  let status = new ApiResponse();
  const roomId = id || 'general';
  const url = new URL('/api/messages/send', BASE_API_URL);
  try {
    const res = await fetch(url.href, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        message,
        id: roomId,
      }),
    });
    if (res.ok) {
      const result = await res.json();
      status.responseData = result;
    } else {
      status.error = true;
    }
  } catch(err) {
    status.error = true;
    status.responseData = error;
  }
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

