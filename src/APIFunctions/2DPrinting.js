import axios from 'axios'

/**
 * Return an array similar to python's range() function
 * @param {Number} start
 * @param {Number} end
 */
export const range = (start, end) => {
  const length = end - start
  return Array.from({ length }, (_, i) => start + i)
}

/**
 * Returns an array of numbers from pages
 * @param {string} pages    String containing array of pages
 * @param {Number} maxPages Number of pages in the document
 */
export function parseRange (pages, maxPages) {
  var result = new Set()
  var pagesFromCommaSplit = pages.split(',')
  pagesFromCommaSplit.forEach(element => {
    const pagesFromDashSplit = element.split('-')
    const arr = range(
      Number(pagesFromDashSplit[0]),
      Number(pagesFromDashSplit[pagesFromDashSplit.length - 1]) + 1
    )
    arr.forEach(element => {
      result.add(element)
    })
  })
  result.delete(0)
  result.forEach(element => {
    if (element > maxPages) result.delete(element)
  })
  if (result.size === 0) {
    var arr = new Set(range(1, maxPages + 1))
    return arr
  }
  return result
}

/**
 * Print the page
 * @param {Object} data   Encoded file
 */
export async function printPage (data) {
  let pagesPrinted = false
  await axios
    .post('/api/print/submit', data)
    .then(() => {
      pagesPrinted = true
    })
    .catch(() => {
      pagesPrinted = false
    })
  return pagesPrinted
}

/**
 * Return the number of pages the current user has printed
 * @param {string} email            email of the current user
 * @param {string} token            token of the current user
 * @param {Set(Number)} totalPages  set of all pages to be printed
 * @param {Number} copies           number of copies to be printed
 */
export async function getPagesPrinted (email, token, totalPages, copies) {
  var result = []
  await axios
    .post('api/user/getPagesPrintedCount', {
      email,
      token
    })
    .then(res => {
      result.push(copies * totalPages.size + res.data <= 30)
      result.push(30 - res.data)
      result.push(totalPages)
    })
    .catch(() => {
      return [false, 0, 0]
    })
  return result
}
