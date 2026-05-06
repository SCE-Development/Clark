import { ApiResponse } from './ApiResponses';

const RADAR_API_BASE = 'http://192.168.69.180:5055/';

export async function getHealth() {
  let status = new ApiResponse();
  const url = new URL('/health', RADAR_API_BASE);
  try {
    const res = await fetch(url.href, { method: 'GET' });
    if (res.ok) {
      status.responseData = await res.json();
    } else {
      status.error = true;
    }
  } catch (err) {
    status.error = true;
    status.responseData = err.message || err;
  }
  return status;
}

export async function getDashboardCurrent(limit) {
  let status = new ApiResponse();
  const url = new URL('/dashboard/current', RADAR_API_BASE);
  if (limit != null) url.searchParams.set('limit', limit);
  try {
    const res = await fetch(url.href, { method: 'GET' });
    if (res.ok) {
      status.responseData = await res.json();
    } else {
      status.error = true;
    }
  } catch (err) {
    status.error = true;
    status.responseData = err.message || err;
  }
  return status;
}

export async function getPresenceLatest() {
  let status = new ApiResponse();
  const url = new URL('/presence/latest', RADAR_API_BASE);
  try {
    const res = await fetch(url.href, { method: 'GET' });
    if (res.ok) {
      status.responseData = await res.json();
    } else {
      status.error = true;
    }
  } catch (err) {
    status.error = true;
    status.responseData = err.message || err;
  }
  return status;
}

export async function getPresenceHistory(params = {}) {
  let status = new ApiResponse();
  const url = new URL('/presence/history', RADAR_API_BASE);
  if (params.startDate) url.searchParams.set('startDate', params.startDate);
  if (params.endDate) url.searchParams.set('endDate', params.endDate);
  if (params.limit) url.searchParams.set('limit', params.limit);
  try {
    const res = await fetch(url.href, { method: 'GET' });
    if (res.ok) {
      status.responseData = await res.json();
    } else {
      status.error = true;
    }
  } catch (err) {
    status.error = true;
    status.responseData = err.message || err;
  }
  return status;
}

export async function getDiscoveredDevices() {
  let status = new ApiResponse();
  const url = new URL('/devices/discovered', RADAR_API_BASE);
  try {
    const res = await fetch(url.href, { method: 'GET' });
    if (res.ok) {
      status.responseData = await res.json();
    } else {
      status.error = true;
    }
  } catch (err) {
    status.error = true;
    status.responseData = err.message || err;
  }
  return status;
}

export async function getManagedDevices() {
  let status = new ApiResponse();
  const url = new URL('/devices/managed', RADAR_API_BASE);
  try {
    const res = await fetch(url.href, { method: 'GET' });
    if (res.ok) {
      status.responseData = await res.json();
    } else {
      status.error = true;
    }
  } catch (err) {
    status.error = true;
    status.responseData = err.message || err;
  }
  return status;
}

export async function upsertManagedDevice(device) {
  let status = new ApiResponse();
  const url = new URL('/devices/managed', RADAR_API_BASE);
  try {
    const res = await fetch(url.href, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(device),
    });
    if (res.ok) {
      status.responseData = await res.json();
    } else {
      status.error = true;
    }
  } catch (err) {
    status.error = true;
    status.responseData = err.message || err;
  }
  return status;
}

export async function removePairedDevice(deviceId) {
  let status = new ApiResponse();
  const url = new URL('/pair/remove', RADAR_API_BASE);
  try {
    const res = await fetch(url.href, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deviceId }),
    });
    if (res.ok) {
      status.responseData = await res.json();
    } else {
      status.error = true;
    }
  } catch (err) {
    status.error = true;
    status.responseData = err.message || err;
  }
  return status;
}

export async function getPairCandidates() {
  let status = new ApiResponse();
  const url = new URL('/pair/candidates', RADAR_API_BASE);
  try {
    const res = await fetch(url.href, { method: 'GET' });
    if (res.ok) {
      status.responseData = await res.json();
    } else {
      status.error = true;
    }
  } catch (err) {
    status.error = true;
    status.responseData = err.message || err;
  }
  return status;
}

export async function pairFinalize(data) {
  let status = new ApiResponse();
  const url = new URL('/pair/finalize', RADAR_API_BASE);
  try {
    const res = await fetch(url.href, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      status.responseData = await res.json();
    } else {
      status.error = true;
    }
  } catch (err) {
    status.error = true;
    status.responseData = err.message || err;
  }
  return status;
}

export async function enrollStart() {
  let status = new ApiResponse();
  const url = new URL('/enroll/start', RADAR_API_BASE);
  try {
    const res = await fetch(url.href, { method: 'GET' });
    if (res.ok) {
      status.responseData = await res.json();
    } else {
      status.error = true;
    }
  } catch (err) {
    status.error = true;
    status.responseData = err.message || err;
  }
  return status;
}

export async function enrollCancel() {
  let status = new ApiResponse();
  const url = new URL('/enroll/cancel', RADAR_API_BASE);
  try {
    const res = await fetch(url.href, { method: 'GET' });
    if (res.ok) {
      status.responseData = await res.json();
    } else {
      status.error = true;
    }
  } catch (err) {
    status.error = true;
    status.responseData = err.message || err;
  }
  return status;
}

export async function updateFilter(filterData) {
  let status = new ApiResponse();
  const url = new URL('/espresense/filter', RADAR_API_BASE);
  try {
    const res = await fetch(url.href, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(filterData),
    });
    if (res.ok) {
      status.responseData = await res.json();
    } else {
      status.error = true;
    }
  } catch (err) {
    status.error = true;
    status.responseData = err.message || err;
  }
  return status;
}

export async function getDebugFingerprints() {
  let status = new ApiResponse();
  const url = new URL('/debug/fingerprints', RADAR_API_BASE);
  try {
    const res = await fetch(url.href, { method: 'GET' });
    if (res.ok) {
      status.responseData = await res.json();
    } else {
      status.error = true;
    }
  } catch (err) {
    status.error = true;
    status.responseData = err.message || err;
  }
  return status;
}
