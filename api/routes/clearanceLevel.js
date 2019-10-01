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

// router.post('/getAll', (req, res) => {
//   if (req.body.username) {
//     console.log(req.body.username)
//     res.sendStatus(200)
//   } else {
//     res.status(409).send({ message: 'unknown...' })
//   }
// })

// router.post('/search', (req, res) => {
//   if (req.body.username) {
//     console.log(req.body.username)
//     res.sendStatus(200)
//   } else {
//     res.status(409).send({ message: 'unknown...' })
//   }
// })

// @endpoint  (GET) /getAll
// @description  This endpoint is used to request a full list of clearance levels assignable to
//     users
// @parameters  (object) request  The web request object provided by express.js. The
//           request body is expected to be a JSON object with the
//           following members:
//      (string) sessionID  The client's session token string
//      (string) currentUser The client user's username
//     (object) response  The web response object provided by express.js
// @returns   On success: a code 200, and a full list of clearance levels assignable to
//        users
//     On unauthorized action: a code 200, and an error-formatted object detailing
//        the authorization issue.
//     On invalid/expired session token: a code 200, and an error-formatted object
//        detailing the expired session issue
//     On any other failure: a code 500, and an error-formatted object detailing the
//        issue
const settings = require('../../util/settings') // import server system settings
const al = require(`${settings.util}/../_deprecated_util/api_legend.js`) // import API Documentation Module
const au = require(`${settings.util}/../_deprecated_util/api_util.js`) // import API Utility Functions
const ef = require(`${settings.util}/error_formats`) // import error formatter
const rf = require(`${settings.util}/../_deprecated_util/response_formats`) // import response formatter
const logger = require(`${settings.util}/logger`) // import event log system
const www = require(`${settings.util}/../_deprecated_util/www`) // import custom https request wrappers
const api = al.createLegend(
  'Clearance Level',
  'This API provides control over clearance levels',
  router // reference to the router object
)
const apiInfo = {
  args: {},
  rval: {}
}
apiInfo.args.getAll = [
  {
    name: 'request.sessionID',
    type: 'string',
    desc: "The client's session token string"
  },
  {
    name: 'request.currentUser',
    type: 'string',
    desc: "The client user's username"
  }
]
apiInfo.rval.getAll = [
  {
    condition: 'On success',
    desc: 'a code 200, and a full list of clearance levels assignable to users'
  },
  {
    condition: 'On unauthorized action',
    desc:
      'a code 200, and an error-formatted object detailing the authorization issue'
  },
  {
    condition: 'On invalid/expired session token',
    desc:
      'a code 200, and an error-formatted object detailing the expired session issue'
  },
  {
    condition: 'On any other failure',
    desc: 'a code 500, and an error-formatted object detailing the issue'
  }
]
api.register(
  'GetAll',
  'GET',
  '/getAll',
  'Gets a full list of clearance levels assignable to users',
  apiInfo.args.getAll,
  apiInfo.rval.getAll,
  function (request, response) {
    const handlerTag = { src: '(get) /api/clearanceLevel/getAll' }
    const sessionID =
      typeof request.query.sessionID !== 'undefined'
        ? request.query.sessionID
        : null
    const currentUser =
      typeof request.query.currentUser !== 'undefined'
        ? request.query.currentUser
        : null

    // Set the content type to be json
    response.set('Content-Type', 'application/json')

    // Define a callback to evaluate the MDBI search results
    const mdbiSearchCallback = function (reply, error) {
      if (error) {
        // Some MDBI error happened
        logger.log(`MDBI search failed: ${error}`, handlerTag)
        response
          .status(500)
          .send(ef.asCommonStr(ef.struct.coreErr, error))
          .end()
      } else {
        logger.log(
          `${reply.length} ${reply.length === 1 ? 'result' : 'results'} found`,
          handlerTag
        )
        if (reply === null) {
          // If a null value is returned, this is unexpected
          const msg = 'Clearance level list request returned null'
          logger.log(
            'Error: null value returned in available ability list request',
            handlerTag
          )
          response
            .status(500)
            .send(ef.asCommonStr(ef.struct.unexpectedValue, msg))
            .end()
        } else {
          response
            .status(200)
            .send(rf.asCommonStr(true, reply))
            .end()
        }
      }
    }

    // Define a callback to evaluate the results of the capability check
    const capabilityCallback = function (resultOfCheck) {
      switch (resultOfCheck) {
        case -1: {
          logger.log('Permissions check is incomplete', handlerTag)
          response
            .status(500)
            .send(ef.asCommonStr(ef.struct.coreErr))
            .end()
          break
        }
        case false: {
          logger.log(
            `User ${currentUser} not permitted to perform officer management operation`,
            handlerTag
          )
          response
            .status(200)
            .send(ef.asCommonStr(ef.struct.adminUnauthorized))
            .end()
          break
        }
        case true: {
          // Capability Verification succeeded. Now let's get a full list of clearance levels
          const searchPostBody = {
            // accessToken: credentials.mdbi.accessToken,
            collection: 'ClearanceLevel',
            pipeline: [
              {
                $match: {
                  cID: {
                    $ne: -1
                  }
                }
              },
              {
                $lookup: {
                  from: 'Ability',
                  localField: 'abilities',
                  foreignField: 'abilityID',
                  as: 'abilityInfo'
                }
              },
              {
                $replaceRoot: {
                  newRoot: {
                    cID: '$cID',
                    levelName: '$levelName',
                    abilities: '$abilityInfo'
                  }
                }
              }
            ]
          }

          const searchPostOptions = {
            hostname: 'localhost',
            path: '/mdbi/search/aggregation',
            method: 'POST',
            // agent: sslUserAgent,
            headers: {
              'Content-Type': 'application/json',
              'Content-Length': Buffer.byteLength(
                JSON.stringify(searchPostBody)
              )
            }
          }

          logger.log(
            'Authorization verified. Acquiring available clearance level list...',
            handlerTag
          )
          www.http.post(
            searchPostOptions,
            searchPostBody,
            mdbiSearchCallback,
            handlerTag.src
          )
          break
        }
      }
    }

    // Define a callback to evaluate the results of the session verification
    const verificationCallback = function (valid, error) {
      if (error) {
        // Some unexpected error occurred...
        logger.log(`Error: ${error}`, handlerTag)
        response
          .status(500)
          .send(error)
          .end()
      } else if (!valid) {
        // Session expired, let the client know it!
        logger.log('Error: Invalid session token', handlerTag)
        response
          .status(200)
          .send(ef.asCommonStr(ef.struct.expiredSession))
          .end()
      } else {
        // Verification succeeded; let's make sure the request issuer is qualified to edit abilities
        au.isCapable([5, 6, 7], currentUser, capabilityCallback)
      }
    }

    // Run queries
    au.verifySession(
      // credentials.mdbi.accessToken,
      sessionID,
      verificationCallback
    )
  }
)

// @endpoint  (GET) /search
// @description  This endpoint is used to search for a list of clearance levels using the given
//     search term and type
// @parameters  (object) request  The web request object provided by express.js. The
//           request body is expected to be a JSON object with the
//           following members:
//       (string) sessionID  The client's session token string
//       (string) currentUser The client user's username
//       (string) search   The term to search for. If search type is
//             'levelName', regular expressions are supported
//       (string) type   The search type. Valid search types include
//             "cID", "levelName", "abilityID"
//     (object) response  The web response object provided by express.js
// @returns   On success: a code 200, and the set of clearance levels satisfying the search
//     On unauthorized action: a code 200, and an error-formatted object detailing
//        the authorization issue.
//     On invalid/expired session token: a code 200, and an error-formatted object
//        detailing the expired session issue
//     On any other failure: a code 500, and an error-formatted object detailing the
//        issue.
apiInfo.args.search = [
  {
    name: 'request.sessionID',
    type: 'string',
    desc: "The client's session token string"
  },
  {
    name: 'request.currentUser',
    type: 'string',
    desc: "The client user's username"
  },
  {
    name: 'request.search',
    type: 'string',
    desc:
      "The term to search for. If search type is 'levelName', regular expressions are" +
      ' supported'
  },
  {
    name: 'request.type',
    type: 'string',
    desc:
      "The search type. Valid search types include 'cID', 'levelName', 'abilityID'"
  }
]
apiInfo.rval.search = [
  {
    condition: 'On success',
    desc: 'a code 200, and the set of clearance levels satisfying the search'
  },
  {
    condition: 'On unauthorized action',
    desc:
      'a code 200, and an error-formatted object detailing the authorization issue'
  },
  {
    condition: 'On invalid/expired session token',
    desc:
      'a code 200, and an error-formatted object detailing the expired session issue'
  },
  {
    condition: 'On any other failure',
    desc: 'a code 500, and an error-formatted object detailing the issue'
  }
]
api.register(
  'Search',
  'GET',
  '/search',
  'Gets any clearance levels that match the search',
  apiInfo.args.search,
  apiInfo.rval.search,
  function (request, response) {
    // Initialize API
    const handlerTag = { src: '(get) /api/clearanceLevel/getAll' }
    const sessionID =
      typeof request.query.sessionID !== 'undefined'
        ? request.query.sessionID
        : null
    const currentUser =
      typeof request.query.currentUser !== 'undefined'
        ? request.query.currentUser
        : null
    const search =
      typeof request.query.search !== 'undefined' ? request.query.search : null
    const type =
      typeof request.query.type !== 'undefined' ? request.query.type : null

    // Set the content type to be json
    response.set('Content-Type', 'application/json')

    // Verify Session
    au.verifySession('', sessionID, function (valid, error) {
      // Check for errors
      if (error) {
        // If an unexpected error occurred, respond with error
        logger.log(`Error: ${error}`, handlerTag)
        response
          .status(500)
          .send(ef.asCommonStr(ef.struct.coreErr, error))
          .end()
      } else if (!valid) {
        // Else if the session is expired, let the client know it
        logger.log('Error: Invalid session token', handlerTag)
        response
          .status(500)
          .send(ef.asCommonStr(ef.struct.expiredSession))
          .end()
      } else {
        // Else if verification succeeded, check if the user's permissions allow them to add,
        // edit, and delete clearance levels
        au.isCapable([14, 15, 16], currentUser, capabilityCallback)
      }
    })

    // Check capabilities
    const capabilityCallback = function (result) {
      // Determine the result of the permission check
      switch (result) {
        case -1: {
          // If the permissions check was inconclusive, prevent further action and throw
          // an error.
          logger.log('Permissions check is incomplete', handlerTag)
          response
            .status(500)
            .send(ef.asCommonStr(ef.struct.coreErr))
            .end()
          break
        }

        case false: {
          // If capabilities are insufficient, notify client of insufficient permissions
          logger.log(
            `User ${currentUser} not permitted to perform clearance level management
     operation`,
            handlerTag
          )
          response
            .status(500)
            .send(ef.asCommonStr(ef.struct.adminUnauthorized))
            .end()
          break
        }

        case true: {
          // If capabilities are adequate, Search for the clearance levels with the given
          // search criteria
          searchClearanceLevels()
        }
      }
    }

    // Search Clearance Levels
    const searchClearanceLevels = function () {
      // Create status constiables
      let invalidType = false

      // Determine how to fomulate pipeline query based on search type
      let pipeline = []
      const matchQuery = {
        $match: {}
      }
      const lookupQuery = {
        $lookup: {
          from: 'Ability',
          localField: 'abilities',
          foreignField: 'abilityID',
          as: 'abilityInfo'
        }
      }
      const replaceRootQuery = {
        $replaceRoot: {
          newRoot: {
            cID: '$cID',
            levelName: '$levelName',
            abilities: '$abilityInfo'
          }
        }
      }
      switch (type) {
        case 'cID': {
          matchQuery.$match.$and = [
            {
              cID: { $ne: -1 }
            },
            {
              cID: { $eq: search }
            }
          ]
          pipeline = [matchQuery, lookupQuery, replaceRootQuery]
          break
        }
        case 'levelName': {
          matchQuery.$match.$and = [
            {
              cID: { $ne: -1 }
            },
            {
              levelName: {
                $regex: search
              }
            }
          ]
          pipeline = [matchQuery, lookupQuery, replaceRootQuery]
          break
        }
        case 'abilityID': {
          matchQuery.$match.cID = {
            $ne: -1
          }
          replaceRootQuery.$replaceRoot.newRoot.abilityFound = {
            $setIsSubset: [[Number.parseInt(search)], '$abilities']
          }
          const filterQuery = {
            $match: {
              abilityFound: true
            }
          }
          pipeline = [matchQuery, lookupQuery, replaceRootQuery, filterQuery]
          break
        }
        default: {
          // Type is invalid
          invalidType = true
          break
        }
      }

      // Check if the type was invalid
      if (invalidType) {
        // Log an error message
        const emsg = `Search type "${type}" is not valid`
        logger.log(emsg, handlerTag)

        // Respond with an error
        response
          .status(200)
          .send(ef.asCommonStr(ef.struct.unexpectedValue, emsg))
          .end()
      } else {
        // Use aggregation to acquire the matching clearance level entries in the database
        const searchPostBody = {
          // accessToken: credentials.mdbi.accessToken,
          collection: 'ClearanceLevel',
          pipeline: pipeline
        }
        const searchPostOptions = {
          hostname: 'localhost',
          path: '/mdbi/search/aggregation',
          method: 'POST',
          // agent: sslUserAgent,
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(JSON.stringify(searchPostBody))
          }
        }

        // Attempt to acquire the list of clearance levels that match the search
        logger.log(
          'Authorization verified. Searching clearance levels...',
          handlerTag
        )
        www.http.post(
          searchPostOptions,
          searchPostBody,
          mdbiSearchCallback,
          handlerTag.src
        )

        // // DEBUG
        // response.status( 200 ).send(
        //  rf.asCommonStr( true, {
        //   "search": typeof search + " " + search,
        //   "type": typeof type + " " + type,
        //   "test": "Hello World"
        //  } )
        // ).end();
      }
    }

    // Evaluate results from the search
    const mdbiSearchCallback = function (reply, error) {
      if (error) {
        // Some MDBI error happened
        logger.log(`MDBI search failed: ${error}`, handlerTag)
        response
          .status(500)
          .send(ef.asCommonStr(ef.struct.coreErr, error))
          .end()
      } else {
        logger.log(
          `${reply.length} ${reply.length === 1 ? 'result' : 'results'} found`,
          handlerTag
        )
        if (reply === null) {
          // If a null value is returned, this is unexpected
          const msg = 'Clearance level list request returned null'
          logger.log(
            'Error: null value returned in available ability list request',
            handlerTag
          )
          response
            .status(200)
            .send(ef.asCommonStr(ef.struct.unexpectedValue, msg))
            .end()
        } else {
          response
            .status(200)
            .send(rf.asCommonStr(true, reply))
            .end()
        }
      }
    }
  }
)

module.exports = router
