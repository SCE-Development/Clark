'use server';

import { NextResponse } from 'next/server';

const { Cleezy } = require('../../config/config.json');
const { ENABLED } = true;
// ENABLED = true;

let PERIPHERAL_API_URL = process.env.REACT_APP_PERIPHERAL_API_URL
  || 'http://localhost:8000';

let CLEEZY_URL = 'http://localhost:8000';

export async function getAllUrls() {
    try {
        const response = await fetch(CLEEZY_URL + '/list');
        const data = await response.json();
        console.log(data);
        return { responseData: data };
      } catch (err) {
        console.error('/listAll had an error', err);
        if (err.response && err.response.data) {
          return NextResponse.json({ error: err.response.data });
        } else {
          return NextResponse.json({ error: 'Failed to list URLs' });
        }
      }
}

// export async function createUrl(url, alias = null, token) {
//   let status = new ApiResponse();
//   const urlToAdd = { url, alias };
//   try {
//     const response = await axios
//       .post(PERIPHERAL_API_URL + '/Cleezy/createUrl', { token, ...urlToAdd });
//     const data = response.data;
//     status.responseData = data;
//   } catch (err) {
//     status.error = true;
//     status.responseData = err;
//   }
//   return status;
// }

// export async function deleteUrl(aliasIn, token) {
//   let status = new ApiResponse();
//   const alias = { 'alias': aliasIn };
//   await axios
//     .post(PERIPHERAL_API_URL + '/Cleezy/deleteUrl', { token, ...alias })
//     .catch(err => {
//       status.responseData = err;
//       status.error = true;
//     });
//   return status;
// }
