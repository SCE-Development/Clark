const User = require('../models/User.js')
const bcrypt = require('bcryptjs')

/*
 * This file contains the methods necessary to encrypt a User's unique _id
 * to be utilized in at least an email verification link and to compare that
 * hashed ID to the unique users _id with the intention to ensure it's that associated
 * user utilizing the link
 */

/* Abstract: Returns a hashed ID based on the
 * unique _id found in the Users schema
 * @param email     string
 * @return          string
 */
function generateHashedId (email) {
  return new Promise((resolve, reject) => {
    // Find a user in the DB
    User.findOne({ email: email }, function (error, result) {
      // Return an error if there's a problem (e.g. email is null)
      if (error) {
        reject(new Error('Bad request'))
      }

      // If no user found, return an error
      if (!result) {
        reject(new Error('User not found'))
      }

      // Use the unique _id from the User schema
      let hashedId = String(result._id)
      // Generate a salt and created a hashed value of the _id using
      // bcrypts library
      bcrypt.genSalt(10, function (error, salt) {
        if (error) {
          // return new Error('Bcrypt failed')
          reject(new Error('Bcrypt failed'))
        }

        bcrypt.hash(hashedId, salt, null, function (error, hash) {
          if (error) {
            reject(new Error('Bcrypt failed'))
          }

          hashedId = hash
          resolve(hashedId)
        })
      })
    })
  })
}

/* Abstract: Returns a boolean if a hashed ID passed in
 * matches the _id found in the User schema
 * @param email     string
 * @param hashedId  string
 * @return          boolean
 */
async function validateVerificationEmail (email, hashedId) {
  // Find the user in the DB
  let verifucationSucessful = false
  await User.findOne({ email: email }, async function (error, result) {
    // Return an error if there's a problem (e.g. email is null)
    if (error) {
      return new Error('Bad request')
    }

    // Return an error if there is no user found
    if (!result) {
      return new Error('User not found')
    }

    // Compare the hashed parameter with the resultant _id value
    await bcrypt.compare(String(result._id), hashedId, async function (
      error,
      isMatch
    ) {
      // Return an error if the ID's do not match
      if (error) {
        return new Error("Id and hashedId's do not match")
      }
      verifucationSucessful = isMatch
    })
  })
  return verifucationSucessful
}

module.exports = {
  generateHashedId: generateHashedId,
  validateVerificationEmail: validateVerificationEmail
}
