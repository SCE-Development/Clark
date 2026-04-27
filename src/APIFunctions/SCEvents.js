import { ApiResponse } from './ApiResponses';

const SCEVENTS_API_URL = 'http://localhost:8002';
export async function getAllSCEvents() {
  const status = new ApiResponse();
  try {
    const res = await fetch(`${SCEVENTS_API_URL}/events/`);
    const result = await res.json();
    status.responseData = result;
    if (!res.ok) {
      status.error = true;
    }
  } catch (err) {
    status.responseData = err;
    status.error = true;
  }
  return status;
}

export async function getEventByID(id) {
  const status = new ApiResponse();
  try {
    const res = await fetch(`${SCEVENTS_API_URL}/events/${id}`);
    const result = await res.json();
    status.responseData = result;
    if (!res.ok) {
      status.error = true;
    }
  } catch (err) {
    status.error = true;
    status.responseData = err;
  }
  return status;
}

export async function getEventAttendanceSummary(id, token) {
  const status = new ApiResponse();
  try {
    const res = await fetch(`${SCEVENTS_API_URL}/events/${id}/attendance`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const result = await res.json();
    status.responseData = result;
    if (!res.ok) {
      status.error = true;
    }
  } catch (err) {
    status.error = true;
    status.responseData = err;
  }
  return status;
}

export async function createSCEvent(token, eventBody) {
  const status = new ApiResponse();
  try {
    const res = await fetch(`${SCEVENTS_API_URL}/events/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(eventBody),
    });
    const body = await res.json();
    status.responseData = body;
    if (!res.ok) {
      status.error = true;
    }
  } catch (err) {
    status.error = true;
    status.responseData = err;
  }
  return status;
}

export async function updateSCEvent(id, token, eventUpdates) {
  const status = new ApiResponse();
  try {
    const res = await fetch(`${SCEVENTS_API_URL}/events/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(eventUpdates),
    });
    const body = await res.json();
    status.responseData = body;
    if (!res.ok) {
      status.error = true;
    }
  } catch (err) {
    status.error = true;
    status.responseData = err;
  }
  return status;
}

export async function registerForSCEvent(eventId, token, payload) {
  const status = new ApiResponse();

  try {
    const res = await fetch(`${SCEVENTS_API_URL}/events/${eventId}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const body = await res.json();
    status.responseData = body;

    if (!res.ok) {
      status.error = true;
    }
  } catch (err) {
    status.error = true;
    status.responseData = err;
  }

  return status;
}
