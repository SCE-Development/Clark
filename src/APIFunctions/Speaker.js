import axios from 'axios';
import { ApiResponse } from './ApiResponses';

let PERIPHERAL_API_URL = process.env.REACT_APP_PERIPHERAL_API_URL
  || 'http://localhost:8081/peripheralapi';


export async function queued(token) {
  let status = new ApiResponse();
  // await axios
  //   .get(PERIPHERAL_API_URL + '/Speaker/queued', { params: { token } })
  //   .then(res => {
  //     status.responseData = res.data.queue;
  //   })
  //   .catch(err => {
  //     status.responseData = err;
  //     status.error = true;
  //   });
  status.responseData = [
    {
      title: 'animation memes || (w.timestamps + credist in desc)',
      url: 'https://www.youtube.com/watch?v=MsTuFY6jTxw',
      thumbnail: 'https://i.ytimg.com/vi/MsTuFY6jTxw/maxresdefault.jpg?sqp=-oaymwEmCIAKENAF8quKqQMa8AEB-AHoCYAC0AWKAgwIABABGH8gGygqMA8=&rs=AOn4CLDMpHhVVelTEyiPG9GY54XDy-StWzA'
    },
    {
      title: 'Animations Memes Songs pt.2 (Sped up/Nightcore)',
      url: 'https://www.youtube.com/watch?v=igYlPyEJMm4',
      thumbnail: 'https://i.ytimg.com/vi/igYlPyEJMm4/maxresdefault.jpg?sqp=-oaymwEmCIAKENAF8quKqQMa8AEB-AH-CYAC0AWKAgwIABABGH8gVygfMA8=&rs=AOn4CLArXF7ZZ8mwA6eyty_phswZOzO3y-A'
    },
    {
      title: 'animation memes audios pt.4',
      url: 'https://www.youtube.com/watch?v=d44RNQCovq0',
      thumbnail: 'https://i.ytimg.com/vi/d44RNQCovq0/maxresdefault.jpg?sqp=-oaymwEmCIAKENAF8quKqQMa8AEB-AHoCYAC0AWKAgwIABABGGUgSShFMA8=&rs=AOn4CLDKUwWRRBPfigoTsBL2k59hjdmk6Pg'
    }
  ];
  return status;
}

export async function addUrl(url, token) {
  let status = new ApiResponse();
  await axios
    .post(PERIPHERAL_API_URL + '/Speaker/stream', {token, url})
    .then(res => {
      status = res.data;
    })
    .catch(err => {
      status.responseData = err;
      status.error = true;
    });
  return status;
}

export async function setVolume(volume, token) {
  let status = new ApiResponse();
  await axios
    .post(PERIPHERAL_API_URL + '/Speaker/volume', {token, volume})
    .then(res => {
      status = res.data;
    })
    .catch(err => {
      status.responseData = err;
      status.error = true;
    });
}

export async function skip(token) {
  let status = new ApiResponse();
  await axios
    .post(PERIPHERAL_API_URL + '/Speaker/skip', {token})
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
  await axios
    .post(PERIPHERAL_API_URL + '/Speaker/pause', {token})
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
  await axios
    .post(PERIPHERAL_API_URL + '/Speaker/resume', {token})
    .then(res => {
      status = res.data;
    })
    .catch(err => {
      status.responseData = err;
      status.error = true;
    });
  return status;
}
