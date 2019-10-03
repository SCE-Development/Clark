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
const Member = require('../models/Member.js')

const { INTERNAL_SERVER_ERROR, OK, NOT_FOUND } = {
  INTERNAL_SERVER_ERROR: 500,
  OK: 200,
  NOT_FOUND: 404
}

// Login
router.post('/login', function (req, res) {
  Member.findOne(
    {
      username: req.body.username.toLowerCase()
    },
    function (error, user) {
      if (error) {
        // Bad Request
        logger.log('User API bad request: ', error)
        return res.status(400).send({ message: 'Bad Request.' })
      }

      if (!user) {
        // Unauthorized if the username does not match any records in the database
        logger.log("User/pass doesn't match our records: ", user)
        res
          .status(401)
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
            // Update the Member record w/ the last login date
            Member.updateOne(
              { email: req.body.email },
              { lastLogin: Date.now },
              function (error, result) {
                if (error) return res.sendStatus(INTERNAL_SERVER_ERROR)

                if (result.nModified < 1) {
                  return res
                    .status(NOT_FOUND)
                    .send({ message: `${req.body.email} not found.` })
                }
              }
            )

            const token = jwt.sign(user.toJSON(), config.secretKey, jwtOptions)
            res.status(200).send({ token: 'JWT ' + token })
          } else {
            // Unauthorized
            logger.log("User/pass doesn't match our records: ", user)
            res.status(401).send({
              message: 'Username or password does not match our records.'
            })
          }
        })
      }
    }
  )
})

// Register a member
router.post('/register', function (req, res) {
  // Strip JWT from the token
  const token = req.body.token.replace(/^JWT\s/, '')

  jwt.verify(token, config.secretKey, function (error, decoded) {
    if (error) {
      // Unauthorized
      res.sendStatus(401)
    } else {
      // Ok
      if (req.body.username && req.body.password) {
        const newUser = new Member({
          username: req.body.username.toLowerCase(),
          password: req.body.password,
          memberID: req.body.memberID || '',
          firstName: req.body.firstName,
          middleInitial: req.body.middleInitial || '',
          lastName: req.body.lastName,
          email: req.body.email,
          major: req.body.major || ''
        })

        const testPassword = testPasswordStrength(req.body.password)

        if (!testPassword.success) {
          // Bad Request
          return res.status(400).send({ message: testPassword.message })
        }

        newUser.save(function (error) {
          if (error) {
            // Confict
            res.status(409).send({ message: 'Username already exists.' })
          } else {
            // Ok
            res.sendStatus(200)
          }
        })
      }
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
      res.sendStatus(401)
    } else {
      // Ok
      // Delete a user
      Member.deleteOne({ email: req.body.email }, function (error, member) {
        if (error) return res.sendStatus(INTERNAL_SERVER_ERROR)

        if (member.n < 1) {
          res.status(NOT_FOUND).send({ message: 'Member not found.' })
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
      res.sendStatus(401)
    } else {
      // Ok
      // Build this out to search for a user
      // res.status(200).send(decoded.username)
      Member.findOne({ email: req.body.email }, function (error, result) {
        if (error) return res.sendStatus(INTERNAL_SERVER_ERROR)

        if (!result) {
          return res
            .status(NOT_FOUND)
            .send({ message: `${req.body.email} not found.` })
        }

        return res.status(OK).send({ message: `Member: ${result}.` })
      })
    }
  })
})

// Edit/Update a member record
router.post('/edit', (req, res) => {
  // Strip JWT from the token
  const token = req.body.token.replace(/^JWT\s/, '')
  const query = { email: req.body.email }
  const member = {
    ...req.body
  }

  jwt.verify(token, config.secretKey, function (error, decoded) {
    if (error) {
      // Unauthorized
      res.sendStatus(401)
    } else {
      // Ok
      // Build this out to search for a user
      Member.updateOne(query, { ...member }, function (error, result) {
        if (error) return res.sendStatus(INTERNAL_SERVER_ERROR)

        if (result.nModified < 1) {
          return res
            .status(NOT_FOUND)
            .send({ message: `${req.body.email} not found.` })
        }

        return res
          .status(OK)
          .send({ message: `${req.body.email} was updated.` })
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
      res.sendStatus(401)
    } else {
      // Ok
      res.sendStatus(200)
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
