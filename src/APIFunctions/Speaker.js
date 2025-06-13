import { ApiResponse } from './ApiResponses';
import { BASE_API_URL } from '../Enums';


export async function queued(token) {
  let status = new ApiResponse();
  const url = new URL('/api/Speaker/queued', BASE_API_URL);
  try {
    const res = await fetch(url.href, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }
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

export async function addUrl(urlToAdd, token) {
  let status = new ApiResponse();
  const url = new URL('/api/Speaker/stream', BASE_API_URL);
  try {
    const res = await fetch(url.href, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        url: urlToAdd
      })
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

export async function skip(token) {
  let status = new ApiResponse();
  const url = new URL('/api/Speaker/skip', BASE_API_URL);
  try {
    const res = await fetch(url.href, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }
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

export async function pause(token) {
  let status = new ApiResponse();
  const url = new URL('/api/Speaker/pause', BASE_API_URL);
  try {
    const res = await fetch(url.rhef, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }
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

export async function resume(token) {
  let status = new ApiResponse();
  const url = new URL('/api/Speaker/resume', BASE_API_URL);
  try {
    const res = await fetch(url.href, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }
    });
    if (res.ok) {
      const result = await res.json();
      status.responseData = result;
    } else {
      status.error = true;
    }
  } catch (err) {
    status.error = true;
    status.responseData = error;
  }
  return status;
}

export async function setVolume(volumeToSet, token) {
  let status = new ApiResponse();
  const url = new URL('/api/Speaker/volume', BASE_API_URL);
  try {
    const res = await fetch(url.href, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        volume: volumeToSet
      })
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

export async function rewind(token) {
  let status = new ApiResponse();
  const url = new URL('/api/Speaker/rewind', BASE_API_URL);
  try {
    const res = await fetch(url.href, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }
    });
    if (res.ok) {
      const result = await res.json();
      status.responseData = result;
    } else {
      status.error = true;
    }
  } catch (err) {
    status.error = true;
    status.responseData = error;
  }
  return status;
}

export async function forward(token) {
  let status = new ApiResponse();
  const url = new URL('/api/Speaker/forward', BASE_API_URL);
  try {
    const res = await fetch(url.href, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }
    });
    if (res.ok) {
      const result = await res.json();
      status.responseData = result;
    } else {
      status.error = true;
    }
  } catch (err) {
    status.error = true;
    status.responseData = error;
  }
  return status;
}
