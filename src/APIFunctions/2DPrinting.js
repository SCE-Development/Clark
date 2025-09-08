import {
  PrintApiResponse,
  ApiResponse
} from './ApiResponses';

import { BASE_API_URL } from '../Enums';

/**
 * Return an array similar to python's range() function
 * @param {Number} start
 * @param {Number} end
 */
export const range = (start, end) => {
  const length = end - start;
  return Array.from({ length }, (_, i) => start + i);
};

/**
 * Checks to see if the printer is available to accept requests!
 */
export async function healthCheck() {
  let status = new ApiResponse();
  const url = new URL('/api/Printer/healthCheck', BASE_API_URL);
  try {
    const res = await fetch(url.href);
    status.error = !res.ok;
  } catch (err) {
    status.responseData = err;
    status.error = true;
  }
  return status;
}

/**
 * Returns an array of numbers from pages
 * @param {string} pages    String containing array of pages
 * @param {Number} maxPages Number of pages in the document
 */
export function parseRange(pages, maxPages) {
  let result = new Set();
  let pagesFromCommaSplit = pages.split(',');
  pagesFromCommaSplit.forEach(element => {
    const pagesFromDashSplit = element.split('-');
    const arr = range(
      Number(pagesFromDashSplit[0]),
      Number(pagesFromDashSplit[pagesFromDashSplit.length - 1]) + 1
    );
    arr.forEach(element => {
      result.add(element);
    });
  });
  result.delete(0);
  result.forEach(element => {
    if (element > maxPages) result.delete(element);
  });
  if (result.size === 0) {
    let arr = new Set(range(1, maxPages + 1));
    return arr;
  }
  return result;
}

export async function getPrintStatus(printId, token) {
  const url = new URL('/api/Printer/status/', BASE_API_URL);

  const response = await fetch(url.href + `?id=${printId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    },
    method: 'GET',
  });

  const json = await response.json();
  const status = json.status;

  return status;
}

/**
 * Print the page
 * @param {Object} data - PDF File and its configurations
 * @param {String|undefined} data.file - PDF file
 * @param {Number|undefined} data.copies - Number of copies
 * @param {String|undefined} data.sides - Sides to print:
 * one-sided or two-sided
 * @param {string} token            token of the current user
 * @param {String|undefined} data.pageRanges - Pages to print:
 * 1-2, 5, 7-10
 * @returns {ApiResponse} - Containing information for if
 * the page successfully printed
 */
export async function printPage(data, token) {
  let status = new ApiResponse();
  const url = new URL('/api/Printer/sendPrintRequest', BASE_API_URL);

  const pdf = data.get('file');
  const sides = data.get('sides');
  const copies = data.get('copies');
  const id = crypto.randomUUID();
  const CHUNK_SIZE = 1024 * 1024 * 0.5; // 0.5 MB ------- SENT DATA **CANNOT** EXCEED 1 MB
  const totalChunks = Math.ceil(pdf.size / CHUNK_SIZE);

  for (let i = 0; i < totalChunks; i++) {
    let chunkData = new FormData();
    let chunkStart = i * CHUNK_SIZE;
    let chunk = pdf.slice(chunkStart, chunkStart + CHUNK_SIZE);
    let isLastChunk = i === totalChunks - 1;

    chunkData.append('chunk', chunk, id + '_' + i + '.CHUNK');
    chunkData.append('totalChunks', totalChunks);
    chunkData.append('chunkIdx', i);

    if (isLastChunk) {
      chunkData.append('id', id);
      chunkData.append('sides', sides);
      chunkData.append('copies', copies);
    }

    try {
      const res = await fetch(url.href, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: chunkData
      });

      if (isLastChunk) {
        status.responseData = await res.json();
      }
    } catch (err) {
      status.responseData = err;
      status.error = true;
      return status;
    }
  }

  return status;
}

/**
 * Return the number of pages the current user has printed
 * @param {string} email            email of the current user
 * @param {string} token            token of the current user
 * @param {Set(Number)} totalPages  set of all pages to be printed
 * @param {Number} copies           number of copies to be printed
 * @returns {PrintApiResponse}      Returns if user can print, number of pages
 *                                  user can print, and total pages left
 */
export async function getPagesPrinted(email, token) {
  let status = new PrintApiResponse();
  const url = new URL('/api/user/getPagesPrintedCount', BASE_API_URL);
  try {
    const res = await fetch(url.href, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    });
    if (res.ok) {
      const response = await res.json();
      status.pagesUsed = response;
    } else {
      status.error = true;
    }
  } catch (err) {
    status.responseData = err;
    status.error = true;
  }
  return status;
}
