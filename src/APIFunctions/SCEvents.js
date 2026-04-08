import { ApiResponse } from './ApiResponses';

const SCEVENTS_BASE =
  (typeof process !== 'undefined' && process.env.REACT_APP_SCEVENTS_URL) ||
  'http://localhost:8002';

function eventsUrl(path) {
  const base = SCEVENTS_BASE.replace(/\/$/, '');
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${base}${p}`;
}

export async function getAllSCEvents() {
  const status = new ApiResponse();
  try {
    const res = await fetch(eventsUrl('/events/'));
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
    const res = await fetch(eventsUrl(`/events/${id}`));
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

export async function createSCEvent(eventBody) {
  const status = new ApiResponse();
  status.statusCode = null;
  try {
    const res = await fetch(eventsUrl('/events/'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventBody),
    });
    status.statusCode = res.status;
    const body = await res.json();
    if (res.ok) {
      status.responseData = body;
    } else {
      status.error = true;
      status.responseData = body;
    }
  } catch (err) {
    status.error = true;
    status.responseData =
      err && typeof err.message === 'string' ? err.message : String(err);
    status.networkError = true;
  }
  return status;
}
