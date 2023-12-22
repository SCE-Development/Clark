'use server';

import { NextResponse } from 'next/server';

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
