import { ApiResponse } from './ApiResponses';
import config from '../config/config.json';

const SCEVENTS_API_URL = config.SCEvents?.BASE_URL || '/api/scevents';

async function handleResponse(res, status) {
  const contentType = res.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    try {
      const result = await res.json();
      status.responseData = result;
    } catch (e) {
      status.error = true;
      status.responseData = { error: 'Failed to parse server response as JSON' };
    }
  } else {
    status.error = true;
    const text = await res.text();
    status.responseData = { error: text || `Server returned status ${res.status} without a body` };
  }
  if (!res.ok) {
    status.error = true;
  }
  return status;
}

export async function getAllSCEvents(token, { startDate, endDate } = {}) {
  const status = new ApiResponse();
  try {
    const headers = token
      ? { Authorization: `Bearer ${token}` }
      : {};

    const url = new URL(`${SCEVENTS_API_URL}/events/`, window.location.origin);
    if (startDate && endDate) {
      url.searchParams.set('startDate', startDate);
      url.searchParams.set('endDate', endDate);
    }

    const res = await fetch(url.pathname + url.search, {
      headers,
    });

    return await handleResponse(res, status);
  } catch (err) {
    status.responseData = { error: err?.message || 'Failed to connect to SCEvents API' };
    status.error = true;
  }
  return status;
}

export async function getEventByID(id, token) {
  const status = new ApiResponse();
  try {
    const headers = token
      ? { Authorization: `Bearer ${token}` }
      : {};

    const res = await fetch(`${SCEVENTS_API_URL}/events/${id}`, {
      headers,
    });

    return await handleResponse(res, status);
  } catch (err) {
    status.error = true;
    status.responseData = { error: err?.message || 'Failed to connect to SCEvents API' };
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
    return await handleResponse(res, status);
  } catch (err) {
    status.error = true;
    status.responseData = { error: err?.message || 'Failed to connect to SCEvents API' };
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
    return await handleResponse(res, status);
  } catch (err) {
    status.error = true;
    status.responseData = { error: err?.message || 'Failed to connect to SCEvents API' };
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
    return await handleResponse(res, status);
  } catch (err) {
    status.error = true;
    status.responseData = { error: err?.message || 'Failed to connect to SCEvents API' };
  }
  return status;
}

export async function getEventRegistrations(eventId, token, { limit = 50, offset = 0 } = {}) {
  const status = new ApiResponse();
  try {
    const url = new URL(`${SCEVENTS_API_URL}/events/${eventId}/registrations`);
    url.searchParams.set('limit', String(limit));
    url.searchParams.set('offset', String(offset));

    const res = await fetch(url.href, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return await handleResponse(res, status);
  } catch (err) {
    status.error = true;
    status.responseData = { error: err?.message || 'Failed to connect to SCEvents API' };
  }
  return status;
}

export async function getEventRegistrationByRequestId(eventId, requestId, token) {
  const status = new ApiResponse();
  try {
    const res = await fetch(`${SCEVENTS_API_URL}/events/${eventId}/registrations/${requestId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return await handleResponse(res, status);
  } catch (err) {
    status.error = true;
    status.responseData = { error: err?.message || 'Failed to connect to SCEvents API' };
  }
  return status;
}

export async function registerForEvent(eventId, token, payload) {
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
    return await handleResponse(res, status);
  } catch (err) {
    status.error = true;
    status.responseData = { error: err?.message || 'Failed to connect to SCEvents API' };
  }
  return status;
}


export async function getMyEventRegistrationState(eventId, token) {
  const status = new ApiResponse();
  try {
    const res = await fetch(`${SCEVENTS_API_URL}/events/${eventId}/registration/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return await handleResponse(res, status);
  } catch (err) {
    status.error = true;
    status.responseData = { error: err?.message || 'Failed to connect to SCEvents API' };
  }
  return status;
}

export async function joinWaitlistForSCEvent(eventId, token) {
  const status = new ApiResponse();

  try {
    const res = await fetch(`${SCEVENTS_API_URL}/events/${eventId}/waitlist`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return await handleResponse(res, status);
  } catch (err) {
    status.error = true;
    status.responseData = err;
  }

  return status;
}

