const jwt = require('jsonwebtoken')
const config = require('../../api/config/config')
const passport = require('passport')
require('../../api/config/passport')(passport)

/**
 * Check if the request body contains a token
 * @param {object} request the HTTP request from the client
 * @returns {boolean} if the token exists in the request body
 */
function checkIfTokenSent (request) {
  return request.body.token !== undefined
}

/**
 * Checks if the request token is valid and returns either a valid response
 * or undefined
 * @param {object} request the HTTP request from the client
 * @param {boolean} returnDecoded optional parameter to return the decoded
 * response to the user
 * @returns {object} the decoded response from jwt.verify
 */
function checkIfTokenValid (request) {
  const userToken = request.body.token.replace(/^JWT\s/, '')
  let decodedResponse
  jwt.verify(userToken, config.secretKey, function (error, decoded) {
    decodedResponse = !error && decoded
  })
  return decodedResponse
}

module.exports = {
  checkIfTokenSent,
  checkIfTokenValid
}
