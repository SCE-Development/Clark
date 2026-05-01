import { ApiResponse } from './ApiResponses';
import config from '../config/config.json';

const SCEVENTS_API_URL = config.SCEvents?.BASE_URL || '/api/scevents';

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

    const res = await fetch(url.href, {
      headers,
    });

    const result = await res.json();
    status.responseData = result;
    if (!res.ok) {
      status.error = true;
    }
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

    const url = new URL(`${SCEVENTS_API_URL}/events/${id}`, window.location.origin);
    const res = await fetch(url.href, {
      headers,
    });

    const result = await res.json();
    status.responseData = result;
    if (!res.ok) {
      status.error = true;
    }
  } catch (err) {
    status.error = true;
    status.responseData = { error: err?.message || 'Failed to connect to SCEvents API' };
  }
  return status;
}

export async function getEventAttendanceSummary(id, token) {
  const status = new ApiResponse();
  try {
    const url = new URL(`${SCEVENTS_API_URL}/events/${id}/attendance`, window.location.origin);
    const res = await fetch(url.href, {
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
    status.responseData = { error: err?.message || 'Failed to connect to SCEvents API' };
  }
  return status;
}

export async function createSCEvent(token, eventBody) {
  const status = new ApiResponse();
  try {
    const url = new URL(`${SCEVENTS_API_URL}/events/`, window.location.origin);
    const res = await fetch(url.href, {
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
    status.responseData = { error: err?.message || 'Failed to connect to SCEvents API' };
  }
  return status;
}

export async function updateSCEvent(id, token, eventUpdates) {
  const status = new ApiResponse();
  try {
    const url = new URL(`${SCEVENTS_API_URL}/events/${id}`, window.location.origin);
    const res = await fetch(url.href, {
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
    status.responseData = { error: err?.message || 'Failed to connect to SCEvents API' };
  }
  return status;
}

export async function deleteSCEvent(id, token) {
  const status = new ApiResponse();
  try {
    const res = await fetch(`${SCEVENTS_API_URL}/events/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    let body;
    try {
      body = await res.json();
    } catch {
      body = {};
    }
    status.responseData = body;
    if (!res.ok) {
      status.error = true;
    }
  } catch (err) {
    status.error = true;
    status.responseData = { error: err?.message || 'Failed to connect to SCEvents API' };
  }
  return status;
}

export async function getEventRegistrations(eventId, token, { limit = 50, offset = 0 } = {}) {
  const status = new ApiResponse();
  try {
    const url = new URL(`${SCEVENTS_API_URL}/events/${eventId}/registrations`, window.location.origin);
    url.searchParams.set('limit', String(limit));
    url.searchParams.set('offset', String(offset));

    const res = await fetch(url.href, {
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
    status.responseData = { error: err?.message || 'Failed to connect to SCEvents API' };
  }
  return status;
}

export async function getEventRegistrationByRequestId(eventId, requestId, token) {
  const status = new ApiResponse();
  try {
    const url = new URL(`${SCEVENTS_API_URL}/events/${eventId}/registrations/${requestId}`, window.location.origin);
    const res = await fetch(url.href, {
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
    status.responseData = { error: err?.message || 'Failed to connect to SCEvents API' };
  }
  return status;
}

export async function registerForEvent(eventId, token, payload) {
  const status = new ApiResponse();
  try {
    const url = new URL(`${SCEVENTS_API_URL}/events/${eventId}/register`, window.location.origin);
    const res = await fetch(url.href, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    const result = await res.json();
    status.responseData = result;
    if (!res.ok) {
      status.error = true;
    }
  } catch (err) {
    status.error = true;
    status.responseData = { error: err?.message || 'Failed to connect to SCEvents API' };
  }
  return status;
}


export async function getMyEventRegistrationState(eventId, token) {
  const status = new ApiResponse();
  try {
    const url = new URL(`${SCEVENTS_API_URL}/events/${eventId}/registration/me`, window.location.origin);
    const res = await fetch(url.href, {
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
    status.responseData = { error: err?.message || 'Failed to connect to SCEvents API' };
  }
  return status;
}

export async function joinWaitlistForSCEvent(eventId, token) {
  const status = new ApiResponse();

  try {
    const url = new URL(`${SCEVENTS_API_URL}/events/${eventId}/waitlist`, window.location.origin);
    const res = await fetch(url.href, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
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
