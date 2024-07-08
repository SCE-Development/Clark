import axios from 'axios';
import {
  PrintApiResponse,
  ApiResponse
} from './ApiResponses';

let GENERAL_API_URL = process.env.REACT_APP_GENERAL_API_URL
  || 'http://localhost:8080/api';
let PERIPHERAL_API_URL = process.env.REACT_APP_PERIPHERAL_API_URL
  || 'http://localhost:8081/peripheralapi';

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
  await axios.get(PERIPHERAL_API_URL + '/Printer/healthCheck')
    .then(res => {
      status.reponseData = res.data;
    })
    .catch(err => {
      status.responseData = err;
      status.error = true;
    });
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

/**
 * Print the page
 * @param {Object} data - Encoded file and its configurations
 * @param {String|undefined} data.raw - Encoded file
 * @param {Number|undefined} data.copies - Number of copies
 * @param {String|undefined} data.sides - Sides to print:
 * one-sided or two-sided
 * @param {String|undefined} data.pageRanges - Pages to print:
 * 1-2, 5, 7-10
 * @returns {ApiResponse} - Containing information for if
 * the page successfully printed
 */
export async function printPage(data, token) {
  let status = new ApiResponse();
  await axios.post(PERIPHERAL_API_URL + '/Printer/sendPrintRequest',
    {...data, email, token})
    .then(response => {
      status.responseData = response.data.message;
    })
    .catch(() => {
      status.error = true;
    });
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
  await axios
    .post(GENERAL_API_URL + '/user/getPagesPrintedCount', {
      email,
      token
    })
    .then(res => {
      status.pagesUsed = res.data;
    })
    .catch(() => {
      status.error = true;
    });
  return status;
}
