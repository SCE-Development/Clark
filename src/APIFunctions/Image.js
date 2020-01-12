/**
 * Checks if the given url is a valid link to an image.
 * @param {string} url A URL to an image
 * @returns {Promise} which will be resolved or rejected 
 * if the url is valid or not
 */
export async function validateImageURL(url) {
  return new Promise((resolve, reject) => {
    let img = new Image()
    img.onload = () => resolve(img.height)
    img.onerror = reject
    img.src = url
  })
}
