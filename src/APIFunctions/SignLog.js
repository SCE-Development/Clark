import axios from 'axios'

/**
 * Retrieve all signs.
 * @returns {Object[]} an array of all sign logs.
 */
export async function getAllSignLogs () {
  let allSignLogs = []
  await axios
    .get('api/SignLog/getSignLogs')
    .then(res => {
      allSignLogs = res.data
    })
    .catch(err => {
      allSignLogs = err
    })
  return allSignLogs
}

/**
 * Add a sign logs.
 * @param {Object} newSign - The sign that is to be added
 * @param {string|undefined} newSign.firstName - The first name of the user who posted the sign
 * @param {string|undefined} newSign.timeOfPosting- The time the sign was posted
 * @param {string} newSign.signTitle - The sign that was posted
 * @param {(string)} newSign.email - The email of the person that posted the sign
 */

export async function addSignLog (newSign) {
  let signCreated = true

  await axios.post('api/SignLog/addSignLog', { ...newSign }).catch(() => {
    signCreated = false
  })
  return signCreated
}
