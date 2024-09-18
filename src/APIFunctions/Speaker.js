import axios from 'axios';
import { ApiResponse } from './ApiResponses';
import { BASE_API_URL } from '../Enums';


export async function queued(token) {
  let status = new ApiResponse();
  const url = new URL('/api/Speaker/queued', BASE_API_URL);
  await axios
    .get(url.href, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
    )
    .then(res => {
      status.responseData = res.data.queue;
    })
    .catch(err => {
      status.responseData = err;
      status.error = true;
    });
  return status;
}

export async function currentlyPlaying(token) {
  let status = new ApiResponse();
  const url = new URL('/api/Speaker/currentlyPlaying', BASE_API_URL);

  await axios
    .get(url.href, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
    )
    .then(res => {
      status.responseData = res.data.current;
    })
    .catch(err => {
      status.responseData = err;
      status.error = true;
    });

  return status;
}

export async function addUrl(urlToAdd, token) {
  let status = new ApiResponse();
  const url = new URL('/api/Speaker/stream', BASE_API_URL);
  await axios
    .post(url.href, {
      url: urlToAdd
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
    )
    .then(res => {
      status = res.data;
    })
    .catch(err => {
      status.responseData = err;
      status.error = true;
    });
  return status;
}

export async function skip(token) {
  let status = new ApiResponse();
  const url = new URL('/api/Speaker/skip', BASE_API_URL);
  await axios
    .post(url.href, {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
    )
    .then(res => {
      status = res.data;
    })
    .catch(err => {
      status.responseData = err;
      status.error = true;
    });
  return status;
}

export async function pause(token) {
  let status = new ApiResponse();
  const url = new URL('/api/Speaker/pause', BASE_API_URL);
  await axios
    .post(url.href, {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
    )
    .then(res => {
      status = res.data;
    })
    .catch(err => {
      status.responseData = err;
      status.error = true;
    });
  return status;
}

export async function resume(token) {
  let status = new ApiResponse();
  const url = new URL('/api/Speaker/resume', BASE_API_URL);
  await axios
    .post(url.href, {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
    )
    .then(res => {
      status = res.data;
    })
    .catch(err => {
      status.responseData = err;
      status.error = true;
    });
  return status;
}

export async function setVolume(volumeToSet, token) {
  let status = new ApiResponse();
  const url = new URL('/api/Speaker/volume', BASE_API_URL);
  await axios
    .post(url.href, {
      volume: volumeToSet
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
    )
    .then(res => {
      status = res.data;
    })
    .catch(err => {
      status.responseData = err;
      status.error = true;
    });
}

export async function rewind(token) {
  let status = new ApiResponse();
  const url = new URL('/api/Speaker/rewind', BASE_API_URL);
  await axios
    .post(url.href, {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
    )
    .then(res => {
      status = res.data;
    })
    .catch(err => {
      status.responseData = err;
      status.error = true;
    });
  return status;
}

export async function forward(token) {
  let status = new ApiResponse();
  const url = new URL('/api/Speaker/forward', BASE_API_URL);
  await axios
    .post(url.href, {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
    )
    .then(res => {
      status = res.data;
    })
    .catch(err => {
      status.responseData = err;
      status.error = true;
    });
  return status;
}
