import { ApiResponse } from './ApiResponses';

export function getSCEventsBaseUrl() {
  return (
    (typeof process !== 'undefined' && process.env.REACT_APP_SCEVENTS_URL) ||
    'http://localhost:8002'
  );
}

function eventsUrl(path) {
  const base = getSCEventsBaseUrl().replace(/\/$/, '');
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${base}${p}`;
}

async function readBodyAsJsonOrText(res) {
  const text = await res.text();
  if (!text) {
    return null;
  }
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export async function getAllSCEvents() {
  const status = new ApiResponse();
  try {
    const res = await fetch(eventsUrl('/events/'));
    status.responseData = await readBodyAsJsonOrText(res);
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
    status.responseData = await readBodyAsJsonOrText(res);
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
    const url = eventsUrl('/events/');
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventBody),
    });
    status.statusCode = res.status;
    const body = await readBodyAsJsonOrText(res);
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
