// PROJECT:   Core-v4
//  Name:    R. Javier
//  File:    api/routes/membershipApplication/index.js
//  Date Created:  March 17, 2019
//  Last Modified:  March 17, 2019
//  Details:
//      This file contains routing logic to service all routes requested under the the
//                  "/memberApplication" endpoint (a.k.a. the Membership Application Module)
//     which is publicly exposed to allow applications from the public facing site.
//  Dependencies:
//      JavaScript ECMAscript 6

// TODO:
// Build out rest of login to include tracking last login
// Remove "Username" in favor of email?
// "ClearanceLevel" or access level implementation

'use strict'

// Includes (include as many as you need; the bare essentials are included here)
const express = require('express')
const router = express.Router()
const passport = require('passport')
require('../config/passport')(passport)
const settings = require('../../util/settings')
const logger = require(`${settings.util}/logger`)
const jwt = require('jsonwebtoken')
const config = require('../config/config')
const User = require('../models/User.js')

const { OK, NOT_FOUND, UNAUTHORIZED, BAD_REQUEST, CONFLICT } = {
  OK: 200,
  NOT_FOUND: 404,
  UNAUTHORIZED: 401,
  BAD_REQUEST: 400,
  CONFLICT: 409
}

// Login
router.post('/login', function (req, res) {
  User.findOne(
    {
      email: req.body.email.toLowerCase()
    },
    function (error, user) {
      if (error) {
        // Bad Request
        logger.log('User API bad request: ', error)
        return res.status(BAD_REQUEST).send({ message: 'Bad Request.' })
      }

      if (!user) {
        // Unauthorized if the username does not match any records in the database
        logger.log("User/pass doesn't match our records: ", req.body.email)
        res
          .status(UNAUTHORIZED)
          .send({ message: 'Username or password does not match our records.' })
      } else {
        // Check if password matches database
        user.comparePassword(req.body.password, function (error, isMatch) {
          if (isMatch && !error) {
            // If the username and password matches the database, assign and
            // return a jwt token
            const jwtOptions = {
              expiresIn: '2h'
            }

            const token = jwt.sign(user.toJSON(), config.secretKey, jwtOptions)
            res.status(OK).send({ token: 'JWT ' + token })
          } else {
            // Unauthorized
            logger.log("User/pass doesn't match our records: ", user)
            res.status(UNAUTHORIZED).send({
              message: 'Username or password does not match our records.'
            })
          }
        })
      }
    }
  )
})

router.post('/checkIfUserExists', (req, res) => {
  User.findOne(
    {
      email: req.body.email.toLowerCase()
    },
    function (error, user) {
      if (error) {
        // Bad Request
        logger.log(`User /user/checkIfUserExists error: ${error}`)
        return res.status(BAD_REQUEST).send({ message: 'Bad Request.' })
      }

      if (!user) {
        // Member username does not exist
        res.sendStatus(OK)
      } else {
        // User username does exist
        res.sendStatus(CONFLICT)
      }
    }
  )
})

// Register a member
router.post('/register', function (req, res) {
  // Ok
  if (req.body.email && req.body.password) {
    const newUser = new User({
      password: req.body.password,
      firstName: req.body.firstName,
      middleInitial: req.body.middleInitial || '',
      lastName: req.body.lastName,
      email: req.body.email,
      major: req.body.major || ''
    })

    const testPassword = testPasswordStrength(req.body.password)

    if (!testPassword.success) {
      // Bad Request
      return res.status(BAD_REQUEST).send({ message: testPassword.message })
    }

    newUser.save(function (error) {
      if (error) {
        // Confict
        res.status(CONFLICT).send({ message: 'Username already exists.' })
      } else {
        // Ok
        res.sendStatus(OK)
      }
    })
  }
})

router.post('/getUserAccessLevel', (req, res) => {
  const token = req.body.token.replace(/^JWT\s/, '')

  jwt.verify(token, config.secretKey, function (error, decoded) {
    if (error) {
      // Unauthorized
      res.sendStatus(UNAUTHORIZED)
    } else {
      User.findOne(
        {
          email: req.body.email.toLowerCase()
        },
        function (error, user) {
          if (error) {
            // Bad Request
            logger.log(`User /user/checkIfUserExists error: ${error}`)
            return res.status(BAD_REQUEST).send({ message: 'Bad Request.' })
          }

          if (!user) {
            // Member username does not exist
            res.sendStatus(OK)
          } else {
            // User username does exist
            res.status(OK).send({ accessLevel: user.accessLevel })
          }
        }
      )
    }
  })
})

// Delete a member
router.post('/delete', (req, res) => {
  // Strip JWT from the token
  const token = req.body.token.replace(/^JWT\s/, '')

  jwt.verify(token, config.secretKey, function (error, decoded) {
    if (error) {
      // Unauthorized
      res.sendStatus(UNAUTHORIZED)
    } else {
      // Ok
      // Delete a user
      User.deleteOne({ email: req.body.email }, function (error, user) {
        // if (error) return res.sendStatus(INTERNAL_SERVER_ERROR)
        if (error) res.status(400).send({ message: 'Bad Request.' })

        if (user.n < 1) {
          res.status(NOT_FOUND).send({ message: 'User not found.' })
        } else {
          res.status(OK).send({ message: `${req.body.email} was deleted.` })
        }
      })
    }
  })
})

// Search for a member
router.post('/search', function (req, res) {
  // Strip JWT from the token
  const token = req.body.token.replace(/^JWT\s/, '')

  jwt.verify(token, config.secretKey, function (error, decoded) {
    if (error) {
      // Unauthorized
      res.sendStatus(UNAUTHORIZED)
    } else {
      // Ok
      // Build this out to search for a user
      // res.status(200).send(decoded.username)
      User.findOne({ email: req.body.email }, function (error, result) {
        // if (error) return res.sendStatus(INTERNAL_SERVER_ERROR)
        if (error) res.status(400).send({ message: 'Bad Request.' })

        if (!result) {
          return res
            .status(NOT_FOUND)
            .send({ message: `${req.body.email} not found.` })
        }

        return res.status(OK).send({ message: `User: ${result}.` })
      })
    }
  })
})

// Edit/Update a member record
router.post('/edit', (req, res) => {
  // Strip JWT from the token
  const token = req.body.token.replace(/^JWT\s/, '')
  const query = { email: req.body.queryEmail }
  const user = {
    ...req.body
  }

  // Remove the auth token from the form getting edited
  delete user.queryEmail
  delete user.token

  jwt.verify(token, config.secretKey, function (error, decoded) {
    if (error) {
      // Unauthorized
      res.sendStatus(UNAUTHORIZED)
    } else {
      // Ok
      // Build this out to search for a user
      User.updateOne(query, { ...user }, function (error, result) {
        // if (error) return res.sendStatus(INTERNAL_SERVER_ERROR)
        if (error) res.status(400).send({ message: 'Bad Request.' })

        if (result.nModified < 1) {
          return res
            .status(NOT_FOUND)
            .send({ message: `${req.body.queryEmail} not found.` })
        }

        return res
          .status(OK)
          .send({ message: `${req.body.queryEmail} was updated.` })
      })
    }
  })
})

// Verifies the users session if they have an active jwtToken.
// Used on the inital load of root '/'
router.post('/verify', function (req, res) {
  // Strip JWT from the token
  const token = req.body.token.replace(/^JWT\s/, '')

  jwt.verify(token, config.secretKey, function (error, decoded) {
    if (error) {
      // Unauthorized
      res.sendStatus(UNAUTHORIZED)
    } else {
      // Ok
      res.sendStatus(OK)
    }
  })
})

// Helpers
function testPasswordStrength (password) {
  const passwordStrength = config.passwordStrength || 'strong'
  /* eslint-disable */
  const strongRegex = new RegExp(
    '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})'
  )
  const strongMessage =
    'Invalid password. Requires 1 uppercase, 1 lowercase, 1 number and 1 special character: !@#$%^&'

  const mediumRegex = new RegExp(
    '^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})'
  )
  const mediumMessage =
    'invalid password. Requires 1 uppercase or lowercase and 1 number'
  /* eslint-enable */

  // test the password against the strong regex & return true if it passes
  if (passwordStrength === 'strong') {
    return { success: strongRegex.test(password), message: strongMessage }
  }

  // allow unrestricted passwords if strength is set to weak
  if (passwordStrength === 'weak') {
    return { success: true, message: '' }
  }

  // test medium password by default
  return { success: mediumRegex.test(password), message: mediumMessage }
}

module.exports = router
