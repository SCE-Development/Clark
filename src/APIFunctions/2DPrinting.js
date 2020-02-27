import axios from 'axios';
import { apiUrl } from '../config/config';
import { PrintApiResponse } from './ApiResponses';

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
 * @param {Object} data         Encoded file
 * @returns {PrintApiResponse}  Containing information for if
 *                              the page is printing
 */
export async function printPage(data) {
  let status = new PrintApiResponse();
  await axios.post(`${apiUrl}/api/print/submit`, data).catch(() => {
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
export async function getPagesPrinted(email, token, totalPages, copies) {
  let status = new PrintApiResponse();
  await axios
    .post(`${apiUrl}/api/user/getPagesPrintedCount`, {
      email,
      token
    })
    .then(res => {
      status.canPrint = copies * totalPages.size + res.data <= 30;
      status.remainingPages = 30 - res.data;
    })
    .catch(() => {
      status.error = true;
    });
  return status;
}
