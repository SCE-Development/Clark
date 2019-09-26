// PROJECT:   Core-v4
//  Name:    Rolando Javier
//  File:    core/app/routes/index.js
//  Date Created:  February 2, 2018
//  Last Modified:  February 12, 2018
//  Details:
//      This file contains logic to service all routes requested under the the "/core" endpoint
//  Dependencies:
//      ExpressJS 4.x
//      body-parser (NPM middleware req'd by ExpressJS 4.x to acquire POST data parameters: "npm install --save body-parser")

'use strict'

// Includes
const express = require('express')
const https = require('https')
const fs = require('fs')
const router = express.Router()
const settings = require('../../../../util/settings') // import server system settings
const dt = require(`${settings.util}/datetimes`) // import datetime utilities
const ef = require(`${settings.util}/error_formats`) // import error formatter
const crypt = require(`${settings.util}/cryptic`) // import custom sce crypto wrappers
const ssl = require(settings.security) // import https ssl credentials
const credentials = require(settings.credentials) // import server system credentials
const www = require(`${settings.util}/www`) // import custom https request wrappers
const logger = require(`${settings.util}/logger`) // import event log system

// Options
const options = {
  root: settings.root, // Server root directory (i.e. where server.js is located)
  dotfiles: 'deny',
  headers: {
    'x-timestamp': Date.now(),
    'x-sent': true
  }
}
const sslUserAgent = new https.Agent({
  port: settings.port,
  ca: fs.readFileSync(ssl.cert)
})

// BEGIN Core Routes
/*
 @endpoint /
 @parameter request - the web request object provided by express.js
 @parameter response - the web response object provided by express.js
 @returns n/a
 @details  This function serves the SCE core admin login portal on "/core" endpoint requests. Used on a GET request
*/
router.get('/', function (request, response) {
  const handlerTag = { src: 'adminPortalHandler' }
  logger.log(
    `Admin portal requested from client @ ip ${request.ip}`,
    handlerTag
  )

  response.set('Content-Type', 'text/html')
  response.sendFile('core/core.html', options, function (error) {
    if (error) {
      logger.log(error, handlerTag)
      response
        .send(ef.asCommonStr(ef.struct.coreErr, error))
        .status(500)
        .end()
    } else {
      logger.log(`Sent admin portal to ${settings.port}`, handlerTag)
      response.status(200).end()
    }
  })
})

/*
 @endpoint  /login
 @parameter  request - the web request object provided by express.js
 @parameter  response - the web response object provided by express.js
 @returns  On success: a code 200 with a redirection header and a session ID to validate all server operations during the session.
    On request failure: a code 500 and an error message detailing the error
    On credential validation failure: a code 499 and an error message detailing the error (i.e. a commonErrorObject from error_formats.js)
    On incorrect credentials: a code 200 and an error message detailing the error (i.e. a commonErrorObject from error_formats.js)
 @details  This function is used to submit credentials from the administrator login portal to the server for processing. The request body is expected to be a JSON object with the following format:
  {
   "user": ...,     // string
   "pwd": ...,      // string
   "sessionStorageSupport": ... // boolean
  }
 where "user" is the user's username string, "pwd" is the user's plain-text password, and "sessionStorageSupport" is a boolean signifying whether the client's browser supports modern sessionStorage technology (the preferred method replacement of cookies). With this information, this function determines if the user has the correct user-password combination, and that they also have access rights to SCE Core Admin Dashboard (i.e. is present in Core Access). This is done by performing a POST request to the "/core/login" endpoint. If login credentials are correct, the client is then passed a redirect url and a session id to use in all further server correspondence. Then, a redirection occurrs to the admin dashboard from the client side using the provided url and session id.
*/
router.post('/login', function (request, response) {
  const handlerTag = { src: 'adminLoginHandler' }
  const timestamp = new Date(Date.now()).toISOString()
  const sessionStorageSupported = request.body.sessionStorageSupport
  const match = {
    list: []
  }
  let sessionID = ''

  logger.log(
    `Submitting admin credentials from client @ ip ${request.ip}`,
    handlerTag
  )
  response.set('Content-Type', 'application/json')

  // BEGIN promises
  const grantCoreAccess = function (match, resolve, reject) {
    console.log(`GENERATED: ${JSON.stringify(match.list)}`)

    const memberUpdateBody = {
      accessToken: credentials.mdbi.accessToken,
      collection: 'Member',
      search: {
        memberID: {
          $eq: match.list[0].memberID
        }
      },
      update: {
        $set: {
          lastLogin: timestamp
        }
      }
    }
    const memberUpdateOptions = {
      hostname: 'localhost',
      path: '/mdbi/update/documents',
      method: 'POST',
      agent: sslUserAgent,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(JSON.stringify(memberUpdateBody))
      }
    }

    // Update member's last-login date here
    www.https.post(memberUpdateOptions, memberUpdateBody, function (
      reply,
      error
    ) {
      if (error) {
        // const errStr = ef.asCommonStr(ef.struct.httpsPostFail, error)

        logger.log(`Member lastLogin update failed: ${error}`, handlerTag)
        reject()
      } else {
        const redir = `https://${request.hostname}:${settings.port}/core/dashboard`

        // Give client their session id and client redirection headers here
        console.log(`UPDATED: ${JSON.stringify(match.list)}`)
        console.log(`Redirecting: ${redir}`)
        const sessionResponse = {
          sessionID: sessionID,
          username: match.list[0].userName,
          destination: redir
        }

        // Cross browser support
        if (!sessionStorageSupported) {
          response.set('Set-Cookie', `sessionID=${sessionID}`)
        }
        response
          .send(sessionResponse)
          .status(200)
          .end()
        resolve()
      }
    })
  }
  const generageSessionData = function (match, resolve, reject) {
    console.log(`CLEARED: ${JSON.stringify(match.list)}`)

    // Generate session id and session data here
    sessionID = crypt.hashSessionID(match.list[0].userName)
    const sessionDataBody = {
      accessToken: credentials.mdbi.accessToken,
      collection: 'SessionData',
      data: {
        sessionID: sessionID,
        memberID: match.list[0].memberID,
        loginTime: timestamp,
        lastActivity: timestamp,
        maxIdleTime: settings.sessionIdleTime
      }
    }
    const sessionRequestOptions = {
      hostname: 'localhost',
      path: '/mdbi/write',
      method: 'POST',
      agent: sslUserAgent,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(JSON.stringify(sessionDataBody))
      }
    }

    // Submit session id to mongodb here
    www.https.post(sessionRequestOptions, sessionDataBody, function (
      reply,
      error
    ) {
      if (error) {
        // report errors
        const errStr = ef.asCommonStr(ef.struct.httpsPostFail, error)

        logger.log(`SessionData insert failed: ${error}`, handlerTag)
        response
          .send(errStr)
          .status(500)
          .end()
        reject()
      } else {
        grantCoreAccess(match, resolve, reject)
      }
    })
  }
  const evaluateDbResults = function (match, resolve, reject) {
    // Evaluate the database search results
    // logger.log(`Probe2: ${reply}`, handlerTag); // debug
    if (match.list.length === 0) {
      // i.e. no match was found
      const errStr = ef.asCommonStr(ef.struct.adminInvalid)

      logger.log('Incorrect Credentials: Access Denied', handlerTag)
      response
        .send(errStr)
        .status(499)
        .end()
      reject()
    } else if (match.list.length > 1) {
      // i.e. multiple accounts were returned
      const errStr = ef.asCommonStr(ef.struct.adminAmbiguous)

      logger.log('FATAL ERR: Ambiguous identity!', handlerTag)
      response
        .send(errStr)
        .status(499)
        .end()
      reject()
    } else {
      // i.e. credentials returned one match
      generageSessionData(match, resolve, reject)
    }
  }
  const submitCredentials = new Promise(function (resolve, reject) {
    const requestBody = {
      accessToken: credentials.mdbi.accessToken,
      collection: 'CoreAccess',
      search: {
        userName: request.body.user,
        passWord: crypt.hashPwd(request.body.user, request.body.pwd)
      }
    }
    const queryOptions = {
      hostname: 'localhost',
      path: '/mdbi/search/documents',
      method: 'POST',
      agent: sslUserAgent,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(JSON.stringify(requestBody))
      }
    }

    // Submit credentials to mdbi/search/documents and find all matches
    www.https.post(queryOptions, requestBody, function (reply, error) {
      match.list = reply // is expected to be an array
      // const matchFound = false

      // logger.log(`${match.list}`, handlerTag);
      if (error) {
        // Report any error
        const errStr = ef.asCommonStr(ef.struct.httpsPostFail, error)

        logger.log(`A request error occurred: ${error}`, handlerTag)
        response
          .send(errStr)
          .status(500)
          .end()
        reject(new Error(error))
      } else if (!Array.isArray(match.list)) {
        logger.log(
          `Invalid value returned from mdbi/search/documents query: ${match.list}`,
          handlerTag
        )
        response
          .send(ef.asCommonStr(ef.struct.unexpectedValue, match.list))
          .status(500)
          .end()
        reject(new Error())
      } else {
        evaluateDbResults(match, resolve, reject)
      }
    })
  })
  // END promises

  // Submit credentials first
  submitCredentials
    .then(function (value) {
      // do nothing?
    })
    .catch(function (e) {
      console.log(e)
    })
})

/*
 @endpoint  /logout
 @parameter  request - the web request object provided by express.js. The request's body is expected to be a JSON object with the following parameters:
     "sessionID" - the session token string to logout with
     "userName" - the username string to logout with
     "sessionStorageSupport" - a boolean describing the client's support of a browser's sessionStorage
 @parameter  response - the web response object provided by express.js
 @returns  On success: a code 200
    On logout failure: a code 499 and an error message detailing the error (i.e. a commonErrorObject from error_formats.js)
 @details  This function is used to process a sessionID and username from the admin dashboard for logout of the given user. This is done by performing a POST request to the "/core/logout" endpoint and passing in the JSON object described above in the request parameter.
*/
router.post('/logout', function (request, response) {
  const handlerTag = { src: 'adminLogoutHandler' }
  const validBody =
    typeof request.body.userName === 'string' &&
    typeof request.body.sessionID === 'string' &&
    typeof request.body.sessionStorageSupport !== 'undefined'

  // Check for valid request body
  if (!validBody) {
    response.set('Content-Type', 'application/json')
    response
      .status(499)
      .send(ef.asCommonStr(ef.struct.invalidBody))
      .end()
  } else {
    // Acquire the sessionID and userName
    // const uname = (typeof request.body.userName !== 'string') ? null : request.body.userName
    const sid =
      typeof request.body.sessionID !== 'string' ? null : request.body.sessionID

    // Remove session data from db and log user out
    const queryCallback = function (reply, error) {
      const resultJSON = reply // is expected to be JSON

      if (error) {
        // report errors
        logger.log(`A request error occurred: ${error}`, handlerTag)
        response
          .send(ef.asCommonStr(ef.struct.coreErr, error))
          .status(500)
          .end()
      } else {
        // otherwise, log user out
        if (resultJSON.n > 1) {
          // More than one record was deleted!
          logger.log(
            `ERROR: ${resultJSON.n} session data was deleted!`,
            handlerTag
          )
          response
            .status(500)
            .send(ef.asCommonStr(ef.struct.coreErr))
            .end()
        } else {
          // all good; the client no longer has session data and can no longer interact with the Core. You can now signal the client to redirect to the core portal
          logger.log(
            `Logging out ${request.body.userName} (${request.body.sessionID})`,
            handlerTag
          )
          response.set('Content-Type', 'text/html')
          response
            .status(200)
            .send({ success: true, msg: 'The user has been logged out' })
            .end()
        }
      }
    }
    clearSession(credentials.mdbi.accessToken, sid, queryCallback)
  }
})

/*
 @endpoint  /dashboard
 @parameter  request - the web request object provided by express.js. The request's body is expected to be a JSON object with the following parameters:
     "sessionID" - the session token string from a successful login
 @parameter  response - the web response object provided by express.js
 @returns  On success: a code 200 and the admin dashboard html
    On failed admin dashboard send: a code 500 and JSON error-formatted details
    On expired token: a code 499 and the admin portal html
    On failed token validation: a code 500 and JSON error-formatted details
 @details  This function is used to serve all requests for the admin dashboard after a successful admin login.
*/
router.post('/dashboard', function (request, response) {
  const handlerTag = { src: 'adminDashboardHandler' }
  const sessionID =
    typeof request.body.sessionID !== 'undefined'
      ? request.body.sessionID
      : null
  // const verificationPostBody = {
  //   accessToken: credentials.mdbi.accessToken,
  //   collection: 'SessionData',
  //   search: {
  //     sessionID: sessionID
  //   }
  // }
  // const verificationPostOptions = {
  //   hostname: 'localhost',
  //   path: '/mdbi/search/documents',
  //   method: 'POST',
  //   agent: ssl_user_agent,
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Content-Length': Buffer.byteLength(JSON.stringify(verificationPostBody))
  //   }
  // }
  logger.log(
    `Admin dashboard request from client @ ip ${request.ip}`,
    handlerTag
  )

  // Verify session ID is valid; Check to make sure that the submitted sessionID is in the session database, and that it has not passed its masIdleTime since its last activity
  const verifySessionCallback = function (valid, error) {
    response.set('Content-Type', 'text/html')
    if (error || !valid) {
      const vErr = `Verification Error. Returning admin portal to ${settings.port}`
      const vInvalid = `Invalid Token. Returning admin portal to ${settings.port}`

      logger.log(`${error === null ? vInvalid : vErr}`, handlerTag)

      // Clear session data if token is invalid
      if (valid === false && sessionID !== null) {
        clearSession(credentials.mdbi.accessToken, sessionID, function (
          reply,
          err
        ) {
          if (err) {
            logger.log(`Failed to clear session: ${err}`, handlerTag)
          } else {
            logger.log('Session cleared successfully', handlerTag)
          }
        })
      }

      response.location(`https://${request.hostname}:${settings.port}/core/`)
      response.sendFile('core/core.html', options, function (error) {
        if (error) {
          logger.log(error, handlerTag)
          response
            .status(500)
            .send(ef.asCommonStr(ef.struct.coreErr, error))
            .end()
        } else {
          logger.log(
            `Verfication Error. Returning admin portal to ${settings.port}`
          )
          response.status(499).end()
        }
      })
    } else {
      // If the search returns a database entry, grant the user access
      // logger.log(JSON.stringify(reply), handlerTag); // debugs
      response.set('Content-Type', 'text/html')
      response.sendFile('core/dashboard.html', options, function (error) {
        if (error) {
          logger.log(error, handlerTag)
          response
            .status(500)
            .send(ef.asCommonStr(ef.struct.coreErr, error))
            .end()
        } else {
          logger.log(
            `Valid session token. Sent admin dashboard to ${settings.port}`,
            handlerTag
          )
          response.status(200).end()
        }
      })
    }
  }
  verifySession(credentials.mdbi.accessToken, sessionID, verifySessionCallback)
})

/*
 @endpoint  /dashboard/search/members
 @parameter  request - the web request object provided by express.js. The request body is expected to be a JSON object with the following parameters:
     "sessionID" - the client's session token
     "searchType" - a string defining the parameter search type
     "searchTerm" - the term to search for
     "options" - an optional JSON object containing options to customize the result set returned from the search. If specified, it may contain any of the following:
      "resultMax" - the maximum number of results to return (defaults to 100)
      "regexMode" - a boolean specifying whether or not to interpret the "searchTerm" as a regular expression
      "pageNumber" - the number of the result page to display
 @parameter  response - the web response object provided by express.js
 @returns  On success: a code 200 and a list (array) of returned search results, or null if no results were found
    On invalid or expired session token: a code 499 and an error format object
    On failure: a code 500 and JSON error-formatted details
 @details  This endpoint serves requests for member search queries through the sce core admin dashboard (which are performed via our custom AngularJS profiler component).
*/
router.post('/dashboard/search/members', function (request, response) {
  const handlerTag = { src: 'dashboardMemberSearchHandler' }
  const sessionID =
    typeof request.body.sessionID !== 'undefined'
      ? request.body.sessionID
      : null
  let isRegex = false
  let resultsPerPage = null
  let pageNum = null
  // logger.log(`This is the requested max results per page: ${resultsPerPage}`, handlerTag); // debug

  // Acquire options, if any
  if (typeof request.body.options !== 'undefined') {
    if (typeof request.body.options.resultMax === 'number') {
      resultsPerPage = request.body.options.resultMax
    }
    if (typeof request.body.options.pageNumber === 'number') {
      pageNum = request.body.options.pageNumber
    }
    if (typeof request.body.options.regexMode === 'boolean') {
      isRegex = request.body.options.regexMode
    }
  }

  const mdbiSearchCallback = function (reply, error) {
    // expects reply to be an array of the found matches
    if (error) {
      logger.log(`MDBI search failed: ${error}`, handlerTag)
      response
        .status(500)
        .send(ef.asCommonStr(ef.struct.coreErr, error))
        .end()
    } else if (reply === null) {
      logger.log('Search returned null', handlerTag)
      response
        .send(null)
        .status(200)
        .end()
    } else {
      // Send the found results to the client
      logger.log(
        `${reply.length} ${reply.length === 1 ? 'result' : 'results'} found`,
        handlerTag
      )
      if (reply.length === 0) {
        response
          .send(null)
          .status(200)
          .end()
      } else {
        response
          .send(reply)
          .status(200)
          .end()
      }
    }
  }

  const verificationCallback = function (valid, error) {
    response.set('Content-Type', 'application/json')
    if (error) {
      logger.log(`Error: ${error}`, handlerTag)
      response
        .send(ef.asCommonStr(ef.struct.coreErr, error))
        .status(500)
        .end()
    } else if (!valid) {
      logger.log('Error: Invalid session token', handlerTag)
      response
        .status(499)
        .send(ef.asCommonStr(ef.struct.expiredSession))
        .end()
    } else {
      let validFormat = true
      const searchPostBody = {
        accessToken: credentials.mdbi.accessToken,
        collection: 'Member',
        search: {}
      }
      const searchPostOptions = {
        hostname: 'localhost',
        path: '/mdbi/search/documents',
        method: 'POST',
        agent: sslUserAgent,
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(JSON.stringify(searchPostBody))
        }
      }

      // Determine the type of search to make
      logger.log(
        `Authorization verified. Now checking for matches to ${typeof request
          .body.searchTerm} ${request.body.searchTerm} (${
          pageNum === null ? 'unpaginated' : `page ${pageNum}`
        })...`,
        handlerTag
      )
      if (
        request.body.searchTerm === '' ||
        typeof request.body.searchTerm === 'undefined'
      ) {
        // If search term is null, search for everything
        searchPostBody.search = {}
      } else {
        // Determine how to format the search criteria, based on the search type
        let stype = 'invalid'
        switch (request.body.searchType) {
          case 'username': {
            stype = 'userName'
            break
          }
          case 'first name': {
            stype = 'firstName'
            break
          }
          case 'last name': {
            stype = 'lastName'
            break
          }
          case 'join date': {
            stype = 'joinDate'
            break
          }
          case 'email': {
            stype = 'email'
            break
          }
          case 'major': {
            stype = 'major'
            break
          }
          default: {
            logger.log(
              `Invalid search type "${request.body.searchType}"!`,
              handlerTag
            )
            validFormat = false
            break
          }
        }

        // Place search term in the search post body, based on any relevant search modifiers provided
        let objectToPlace = request.body.searchTerm
        if (isRegex) {
          objectToPlace = {
            $regex: request.body.searchTerm
          }
        }
        searchPostBody.search[stype] = objectToPlace
      }

      // Configure search with any provided options
      if (resultsPerPage !== null) {
        // Add results per page as a custom option
        searchPostBody.options = {
          limit: resultsPerPage
        }

        // Add page number as a custom option
        if (pageNum !== null) {
          searchPostBody.options.page = pageNum
        }
      }

      // Recalculate Content-Length header; the above options caused the body length to change!
      searchPostOptions.headers['Content-Length'] = Buffer.byteLength(
        JSON.stringify(searchPostBody)
      )

      // Execute MDBI search here...
      if (!validFormat) {
        logger.log('A formatting error occurred!', handlerTag)
        response
          .status(499)
          .send(ef.asCommonStr(ef.struct.invalidBody))
          .end()
      } else {
        // Search with MDBI here...
        www.https.post(
          searchPostOptions,
          searchPostBody,
          mdbiSearchCallback,
          handlerTag.src
        )
      }
    }
  }

  verifySession(credentials.mdbi.accessToken, sessionID, verificationCallback)
})

/*
 @endpoint  /dashboard/search/memberdata
 @parameter  request - the web request object provided by express.js. The request body is expected to be a JSON object with the following parameters:
     "sessionID" - the client's session token
     "memberID" - the member's ID number
 @parameter  response - the web response object provided by express.js
 @returns  On success: a code 200 and a JSON object of the requested member's membership data in the response body (see database schema for details on what data is provided in this object). If the memberID isn't associated with any data (i.e. the memberID is non-existent), the reponse body will be an empty JSON object
    On invalid or expired session token: a code 499 and an error format object in the response body detailing the expired session issue
    On invalid request body/undefined memberID: a code 499 and an error-formatted object in the response body detailing the issue
    On failure: a code 500 an JSON error-formatted details on the error
 @details  This endpoint serves POST requests for membership data search queries through the sce core admin dashboard (performed via our custom AngularJS profiler component).
*/
router.post('/dashboard/search/memberdata', function (request, response) {
  const handlerTag = { src: 'dashboardMemberDataSearchHandler' }
  const sessionID =
    typeof request.body.sessionID !== 'undefined'
      ? request.body.sessionID
      : null

  const mdbiSearchCallback = function (reply, error) {
    if (error) {
      logger.log(`MDBI search failed: ${error}`, handlerTag)
      response
        .status(500)
        .send(ef.asCommonStr(ef.struct.coreErr, error))
        .end()
    } else if (reply === null) {
      logger.log('Search returned null', handlerTag)
      response
        .send(null)
        .status(200)
        .end()
    } else {
      // Send results to client
      logger.log(
        `${reply.length} ${reply.length === 1 ? 'result' : 'results'} found`,
        handlerTag
      )
      if (reply.length === 0) {
        response
          .send(null)
          .status(200)
          .end()
      } else {
        response
          .send(reply)
          .status(200)
          .end()
      }
    }
  }

  const verificationCallback = function (valid, error) {
    response.set('Content-Type', 'application/json')
    if (error) {
      // Some unexpected error occurred...
      logger.log(`Error: ${error}`, handlerTag)
      response
        .send(ef.asCommonStr(ef.struct.coreErr, error))
        .status(500)
        .end()
    } else if (!valid) {
      // Session expired, let the client know it!
      logger.log('Error: Invalid session token', handlerTag)
      response
        .status(499)
        .send(ef.asCommonStr(ef.struct.expiredSession))
        .end()
    } else {
      // Verification succeeded. Now make sure the request body is properly formatted
      let mID = request.body.memberID
      let validID = true
      if (typeof mID === 'undefined') {
        // No memberID? Return an error
        logger.log('Error: Undefined memberID', handlerTag)
        response
          .status(499)
          .send(
            ef.asCommonStr(ef.struct.invalidBody, {
              parameter: 'memberID'
            })
          )
          .end()
        validID = false
      } else if (typeof mID !== 'number') {
        // Not a number? Try to convert it
        try {
          mID = Number.parseInt(mID, 10)
          if (Number.isNaN(mID)) {
            // Still can't convert it? Report conversion error
            response
              .status(499)
              .send(
                ef.asCommonStr(ef.struct.convertErr, {
                  parameter: 'memberID'
                })
              )
              .end()
            validID = false
          }
        } catch (err) {
          // Error? Report a code 500
          logger.log(
            `Error: Cannot convert ${request.body.memberID} to a number`,
            handlerTag
          )
          response
            .status(500)
            .send(ef.asCommonStr(ef.struct.coreErr, err))
            .end()
          validID = false
        }
      }

      // Only execute MDBI search if the id was valid or successfully converted
      if (validID) {
        const searchPostBody = {
          accessToken: credentials.mdbi.accessToken,
          collection: 'MemberDossier',
          search: {
            memberID: mID
          }
        }
        const searchPostOptions = {
          hostname: 'localhost',
          path: '/mdbi/search/documents',
          method: 'POST',
          agent: sslUserAgent,
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(JSON.stringify(searchPostBody))
          }
        }

        // All good, now to actually execute the mdbi search
        logger.log(
          `Authorization verified. Now acquiring membership data for ID ${typeof mID} ${mID}`,
          handlerTag
        )
        www.https.post(
          searchPostOptions,
          searchPostBody,
          mdbiSearchCallback,
          handlerTag.src
        )
      }
    }
  }

  verifySession(credentials.mdbi.accessToken, sessionID, verificationCallback)
})

/*
 @endpoint  /dashboard/search/dc
 @parameter  request - the web request object provided by express.js. the request body is expected to be a JSON object with the following parameters:
     "sessionID" - the client's session token
 @parameter  response - the web response object provided by express.js
 @returns  On success: a code 200 and the full list (array) of available doorcodes
    On invalid/expired session token: a code 499 and an error-formatted object in the response body detailing the expired session issue
    On failure: a code 500 and a JSON object detailing the issue
 @details  This endpoint serves POST requests for door code searches on the Member Profiler (i.e. the AngularJS profiler component)
*/
router.post('/dashboard/search/dc', function (request, response) {
  const handlerTag = { src: 'dashboardDoorCodeSearchHandler' }
  const sessionID =
    typeof request.body.sessionID !== 'undefined'
      ? request.body.sessionID
      : null

  const mdbiSearchCallback = function (reply, error) {
    if (error) {
      logger.log(`MDBI search failed: ${error}`, handlerTag)
      response
        .status(500)
        .send(ef.asCommonStr(ef.struct.coreErr, error))
        .end()
    } else if (reply === null) {
      logger.log('Search returned null', handlerTag)
      response
        .send(null)
        .status(200)
        .end()
    } else {
      // Send results to client
      logger.log(
        `${reply.length} ${reply.length === 1 ? 'result' : 'results'} found`,
        handlerTag
      )
      if (reply.length === 0) {
        response
          .send(null)
          .status(200)
          .end()
      } else {
        response
          .send(reply)
          .status(200)
          .end()
      }
    }
  }

  const verificationCallback = function (valid, error) {
    response.set('Content-Type', 'application/json')
    if (error) {
      // Some unexpected error occurred...
      logger.log(`Error: ${error}`, handlerTag)
      response
        .send(ef.asCommonStr(ef.struct.coreErr, error))
        .status(500)
        .end()
    } else if (!valid) {
      // Session expired, let the client know it!
      logger.log('Error: Invalid session token', handlerTag)
      response
        .status(499)
        .send(ef.asCommonStr(ef.struct.expiredSession))
        .end()
    } else {
      // Verification succeeded. Now search for the door codes
      const searchPostBody = {
        accessToken: credentials.mdbi.accessToken,
        collection: 'DoorCode',
        search: {
          dcID: {
            $gte: 0
          }
        }
      }
      const searchPostOptions = {
        hostname: 'localhost',
        path: '/mdbi/search/documents',
        method: 'POST',
        agent: sslUserAgent,
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(JSON.stringify(searchPostBody))
        }
      }

      // All good, now to actually execute the mdbi search
      logger.log(
        'Authorization verified. Now acquiring door code data',
        handlerTag
      )
      www.https.post(
        searchPostOptions,
        searchPostBody,
        mdbiSearchCallback,
        handlerTag.src
      )
    }
  }

  verifySession(credentials.mdbi.accessToken, sessionID, verificationCallback)
})

/*
 @endpoint  /dashboard/edit/dc
 @parameter  request - the web request object provided by express.js. The request body is expected to a JSON object with the following format:
     "sessionID" - the client's session token
     "username" - the username of the account to edit
     "doorcode" - the door code id number to use in the replacement
 @parameter  response - the web response object provided by express.js
 @returns  On success: a code 200
    On invalid/expired session token: a code 499 and an error-formatted object in the response body detailing the expired session issue
    On failure to edit door code: a code 499 and an error-formatted object in the response body detailing the issue
    On any other failure: a code 500 and a JSON object detailing the issue
 @details  This endpoint serves POST requests for door code edits on the Member Profiler (i.e. the AngularJS profiler component) when adding new members via the "Add Member" Modal
*/
router.post('/dashboard/edit/dc', function (request, response) {
  const handlerTag = { src: 'dashboardDoorCodeChangeHandler' }
  const sessionID =
    typeof request.body.sessionID !== 'undefined'
      ? request.body.sessionID
      : null
  const uname =
    typeof request.body.username !== 'undefined' ? request.body.username : null
  const dcode =
    typeof request.body.doorcode !== 'undefined' ? request.body.doorcode : null

  const mdbiUpdateCallback = function (reply, error) {
    if (error) {
      // Some MDBI error happened
      logger.log(`MDBI search failed: ${error}`, handlerTag)
      response
        .status(500)
        .send(ef.asCommonStr(ef.struct.coreErr, error))
        .end()
    } else if (reply.nModified < 1) {
      // The MDBI wasn't able to update any document at all
      const ineffectiveErr = ef.common(
        'USER_UNCHANGED',
        'The user was unaffected by the previous query',
        null,
        true
      )
      logger.log('Error: MDBI updated nothing!', handlerTag)
      response
        .status(499)
        .send(ineffectiveErr)
        .end()
    } else if (reply.nModified > 1) {
      // DANGER: The MDBI updated several documents
      const corruptionErr = ef.common(
        'MULTIUSER_CORRUPTION',
        'constious users were unintentionally affected by the previous query',
        null,
        true
      )
      logger.log('Error: MDBI updated more than one user!', handlerTag)
      response
        .status(499)
        .send(corruptionErr)
        .end()
    } else {
      // Send success here...
      logger.log('User door code update success', handlerTag)
      response
        .status(200)
        .send({ status: 'success' })
        .end()
    }
  }

  const mdbiSearchCallback = function (reply, error) {
    if (error) {
      // Some MDBI error happened
      logger.log(`MDBI search failed: ${error}`, handlerTag)
      response
        .status(500)
        .send(ef.asCommonStr(ef.struct.coreErr, error))
        .end()
    } else if (reply === null) {
      // Null result set
      logger.log('Search returned null', handlerTag)
      response
        .send(null)
        .status(200)
        .end()
    } else {
      // We got results, let's process them
      logger.log(
        `${reply.length} ${reply.length === 1 ? 'result' : 'results'} found`,
        handlerTag
      )
      if (reply.length <= 0) {
        // If no members are found, then the client entered a non-existent username (i.e. violated a foreign key/referential integrity constraint)
        const noMemFoundErr = ef.common(
          'USER_NOT_FOUND',
          'The entered username returned no results',
          null,
          true
        )
        logger.log(
          `Error: The username "${uname}" returned no results!`,
          handlerTag
        )
        response
          .status(499)
          .send(noMemFoundErr)
          .end()
      } else if (reply.length > 1) {
        // If more than one member was found, that's fatal; we can't decide whose door code to change. Do nothing, and return an error message to the client
        const ambibuityErr = ef.common(
          'USER_AMBIGUOUS',
          'Username is not unique',
          null,
          true
        )
        logger.log(
          `Error: The username "${uname}" returned multiple results!`,
          handlerTag
        )
        response
          .status(499)
          .send(ambibuityErr)
          .end()
      } else if (typeof reply[0].memberID === 'undefined') {
        // If the member ID is not defined, we cannot identify whose door code info to change. Return an error to the client
        logger.log('Error: The result memberID was undefined!', handlerTag)
        response
          .status(499)
          .send(
            ef.asCommonStr(ef.struct.unexpectedValue, {
              parameter: 'reply[0].memberID'
            })
          )
          .end()
      } else {
        const currentUser = reply[0]
        const updatePostBody = {
          accessToken: credentials.mdbi.accessToken,
          collection: 'MembershipData',
          search: {
            memberID: currentUser.memberID
          },
          update: {
            $set: {
              doorCodeID: dcode
            }
          }
        }
        const updatePostOptions = {
          hostname: 'localhost',
          path: '/mdbi/update/documents',
          method: 'POST',
          agent: sslUserAgent,
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(JSON.stringify(updatePostBody))
          }
        }

        // If there's only one user, then this must be the user to edit. Let's go ahead and update this user, now
        logger.log(`Updating member "${uname}"'s door code data`, handlerTag)
        www.https.post(
          updatePostOptions,
          updatePostBody,
          mdbiUpdateCallback,
          handlerTag.src
        )
      }
    }
  }

  const verificationCallback = function (valid, error) {
    response.set('Content-Type', 'application/json')
    if (error) {
      // Some unexpected error occurred...
      logger.log(`Error: ${error}`, handlerTag)
      response
        .send(ef.asCommonStr(ef.struct.coreErr, error))
        .status(500)
        .end()
    } else if (!valid) {
      // Session expired, let the client know it!
      logger.log('Error: Invalid session token', handlerTag)
      response
        .status(499)
        .send(ef.asCommonStr(ef.struct.expiredSession))
        .end()
    } else if (uname === null) {
      // No username!
      logger.log('Error: Undefined username', handlerTag)
      response
        .status(499)
        .send(ef.asCommonStr(ef.struct.invalidBody, { parameter: 'username' }))
        .end()
    } else if (dcode === null) {
      // No doorcode!
      logger.log('Error: Undefined doorcode', handlerTag)
      response
        .status(499)
        .send(ef.asCommonStr(ef.struct.invalidBody, { parameter: 'doorcode' }))
        .end()
    } else {
      // Verification succeeded. Now let's make sure that the member exists before we change things
      const searchPostBody = {
        accessToken: credentials.mdbi.accessToken,
        collection: 'Member',
        search: {
          userName: uname
        }
      }
      const searchPostOptions = {
        hostname: 'localhost',
        path: '/mdbi/search/documents',
        method: 'POST',
        agent: sslUserAgent,
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(JSON.stringify(searchPostBody))
        }
      }

      // All good, now to actually execute the mdbi search
      logger.log(
        `Authorization verified. Ensuring member "${uname}" exists`,
        handlerTag
      )
      www.https.post(
        searchPostOptions,
        searchPostBody,
        mdbiSearchCallback,
        handlerTag.src
      )
    }
  }

  verifySession(credentials.mdbi.accessToken, sessionID, verificationCallback)
})

/*
 @endpoint  /dashboard/edit/membershipstatus
 @parameter  request - the web request object provided by express.js. The request body is expected to be a JSON object with the following format:
     "sessionID" - the client's session token string
     "username" - the username string of the account whose membership status will be modified
     "status" - the boolean value to replace the memberhip status with
 @parameter  response - the web response object provided by express.js
 @returns  On success: a code 200
    On invalid/expired session token: a code 499 and an error-formatted object in the response body detailing the expired session token issue
    On any other failure: a code 500 and a JSON object detailing the issue
 @details  This endpoint serves POST requests for membership finalizing within the Membership Profiler (i.e. the AngularJS profiler component) when adding new members via the "Add Member" Modal
*/
router.post('/dashboard/edit/membershipstatus', function (request, response) {
  const handlerTag = { src: 'editMembershipStatus' }
  const sessionID =
    typeof request.body.sessionID !== 'undefined'
      ? request.body.sessionID
      : null
  const uname =
    typeof request.body.username !== 'undefined' ? request.body.username : null
  const memstatus =
    typeof request.body.status !== 'undefined' ? request.body.status : null

  const mdbiUpdateCallback = function (reply, error) {
    if (error) {
      // Some MDBI error happened
      logger.log(`MDBI search failed: ${error}`, handlerTag)
      response
        .status(500)
        .send(ef.asCommonStr(ef.struct.coreErr, error))
        .end()
    } else if (reply.nModified < 1) {
      // The MDBI wasn't able to update any document at all
      const ineffectiveErr = ef.common(
        'USER_UNCHANGED',
        'The user was unaffected by the previous query',
        null,
        true
      )
      logger.log('Error: MDBI updated nothing!', handlerTag)
      response
        .status(499)
        .send(ineffectiveErr)
        .end()
    } else if (reply.nModified > 1) {
      // DANGER: The MDBI updated several documents
      const corruptionErr = ef.common(
        'MULTIUSER_CORRUPTION',
        'constious users were unintentionally affected by the previous query',
        null,
        true
      )
      logger.log('Error: MDBI updated more than one user!', handlerTag)
      response
        .status(499)
        .send(corruptionErr)
        .end()
    } else {
      // Send success here...
      logger.log('User door code update success', handlerTag)
      response
        .status(200)
        .send({ status: 'success' })
        .end()
    }
  }

  const mdbiSearchCallback = function (reply, error) {
    if (error) {
      // Some MDBI error happened
      logger.log(`MDBI search failed: ${error}`, handlerTag)
      response
        .status(500)
        .send(ef.asCommonStr(ef.struct.coreErr, error))
        .end()
    } else if (reply === null) {
      // Null result set
      logger.log('Search returned null', handlerTag)
      response
        .send(null)
        .status(200)
        .end()
    } else {
      // We got results, let's process them
      logger.log(
        `${reply.length} ${reply.length === 1 ? 'result' : 'results'} found`,
        handlerTag
      )
      if (reply.length <= 0) {
        // If no members are found, then the client entered a non-existent username (i.e. violated a foreign key/referential integrity constraint)
        const noMemFoundErr = ef.common(
          'USER_NOT_FOUND',
          'The entered username returned no results',
          null,
          true
        )
        logger.log(
          `Error: The username "${uname}" returned no results!`,
          handlerTag
        )
        response
          .status(499)
          .send(noMemFoundErr)
          .end()
      } else if (reply.length > 1) {
        // If more than one member was found, that's fatal; we can't decide whose door code to change. Do nothing, and return an error message to the client
        const ambibuityErr = ef.common(
          'USER_AMBIGUOUS',
          'Username is not unique',
          null,
          true
        )
        logger.log(
          `Error: The username "${uname}" returned multiple results!`,
          handlerTag
        )
        response
          .status(499)
          .send(ambibuityErr)
          .end()
      } else if (typeof reply[0].memberID === 'undefined') {
        // If the member ID is not defined, we cannot identify whose door code info to change. Return an error to the client
        logger.log('Error: The result memberID was undefined!', handlerTag)
        response
          .status(499)
          .send(
            ef.asCommonStr(ef.struct.unexpectedValue, {
              parameter: 'reply[0].memberID'
            })
          )
          .end()
      } else {
        const currentUser = reply[0]
        const updatePostBody = {
          accessToken: credentials.mdbi.accessToken,
          collection: 'MembershipData',
          search: {
            memberID: currentUser.memberID
          },
          update: {
            $set: {
              membershipStatus: memstatus
            }
          }
        }
        const updatePostOptions = {
          hostname: 'localhost',
          path: '/mdbi/update/documents',
          method: 'POST',
          agent: sslUserAgent,
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(JSON.stringify(updatePostBody))
          }
        }

        // If there's only one user, then this must be the user to edit. Let's go ahead and update this user, now
        logger.log(`Updating member "${uname}"'s membership status`, handlerTag)
        www.https.post(
          updatePostOptions,
          updatePostBody,
          mdbiUpdateCallback,
          handlerTag.src
        )
      }
    }
  }

  const verificationCallback = function (valid, error) {
    response.set('Content-Type', 'application/json')
    if (error) {
      // Some unexpected error occurred...
      logger.log(`Error: ${error}`, handlerTag)
      response
        .send(ef.asCommonStr(ef.struct.coreErr, error))
        .status(500)
        .end()
    } else if (!valid) {
      // Session expired, let the client know it!
      logger.log('Error: Invalid session token', handlerTag)
      response
        .status(499)
        .send(ef.asCommonStr(ef.struct.expiredSession))
        .end()
    } else if (uname === null) {
      // No username!
      logger.log('Error: Undefined username', handlerTag)
      response
        .status(499)
        .send(ef.asCommonStr(ef.struct.invalidBody, { parameter: 'username' }))
        .end()
    } else if (memstatus === null) {
      // No membership status!
      logger.log('Error: Undefined status', handlerTag)
      response
        .status(499)
        .send(ef.asCommonStr(ef.struct.invalidBody, { parameter: 'status' }))
        .end()
    } else {
      // Verification succeeded. Now let's make sure that the member exists before we change things
      const searchPostBody = {
        accessToken: credentials.mdbi.accessToken,
        collection: 'Member',
        search: {
          userName: uname
        },
        options: {
          projection: {
            memberID: 1
          }
        }
      }
      const searchPostOptions = {
        hostname: 'localhost',
        path: '/mdbi/search/documents',
        method: 'POST',
        agent: sslUserAgent,
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(JSON.stringify(searchPostBody))
        }
      }

      // All good, now to actually execute the mdbi search
      logger.log(
        `Authorization verified. Ensuring member "${uname}" exists`,
        handlerTag
      )
      www.https.post(
        searchPostOptions,
        searchPostBody,
        mdbiSearchCallback,
        handlerTag.src
      )
    }
  }

  verifySession(credentials.mdbi.accessToken, sessionID, verificationCallback)
})

/*
 @endpoint  /dashboard/edit/memberfield
 @parameter  request - the web request object provided by express.js. The request body is expected to be a JSON object with the following format:
     "sessionID" - the client's session token string
     "username" - the username string of the account whose membership data will be modified
     "field" - a string representing the name of the data field to edit
     "value" - the value to replace it with
 @parameter  response - the web response object provided by express.js
 @returns  On success: a code 200
    On invalid/expired session token: a code 499 and an error-formatted object in the response body detailing the expired session token issue
    On illegal data modification request: a code 499 and an error-formatted object in the response body detailing the invalild operation
    On any other failure: a code 500 and a JSON object detailing the issue
 @details  This endpoint serves POST requests for modification of data within the Member collection, using the Membership Profiler (i.e. the AngularJS profiler component) when modifying members' data via the "Member Detail" Modal
*/
router.post('/dashboard/edit/memberfield', function (request, response) {
  const handlerTag = { src: 'editMemberField' }
  const sessionID =
    typeof request.body.sessionID !== 'undefined'
      ? request.body.sessionID
      : null
  const uname =
    typeof request.body.username !== 'undefined' ? request.body.username : null
  const field =
    typeof request.body.field !== 'undefined' ? request.body.field : null
  const newval =
    typeof request.body.value !== 'undefined' ? request.body.value : null
  const validFieldNames = ['firstName', 'middleInitial', 'lastName', 'major']

  response.set('Content-Type', 'application/json')

  const mdbiUpdateCallback = function (reply, error) {
    if (error) {
      // Some MDBI error happened
      logger.log(`MDBI search failed: ${error}`, handlerTag)
      response
        .status(500)
        .send(ef.asCommonStr(ef.struct.coreErr, error))
        .end()
    } else if (reply.nModified < 1) {
      // The MDBI wasn't able to update any document at all
      const ineffectiveErr = ef.common(
        'USER_UNCHANGED',
        'The user was unaffected by the previous query',
        null,
        true
      )
      logger.log('Error: MDBI updated nothing!', handlerTag)
      response
        .status(499)
        .send(ineffectiveErr)
        .end()
    } else if (reply.nModified > 1) {
      // DANGER: The MDBI updated several documents
      const corruptionErr = ef.common(
        'MULTIUSER_CORRUPTION',
        'constious users were unintentionally affected by the previous query',
        null,
        true
      )
      logger.log('Error: MDBI updated more than one user!', handlerTag)
      response
        .status(499)
        .send(corruptionErr)
        .end()
    } else {
      // Send success here...
      logger.log(`User ${field} update success`, handlerTag)
      response
        .status(200)
        .send({ status: 'success' })
        .end()
    }
  }

  const dataSafetyCheck = function (reply, error) {
    // Ensure that no critical fields are being modified via the dashboard
    if (!validFieldNames.includes(field)) {
      logger.log(
        `Rejecting unsafe modification of field "${field}"`,
        handlerTag
      )
      response
        .status(499)
        .send(
          ef.asCommonStr(
            ef.struct.illegalOperation,
            `Field "${field}" cannot be safely modified using this method`
          )
        )
        .end()
    } else {
      const currentUser = reply[0]
      const updatePostBody = {
        accessToken: credentials.mdbi.accessToken,
        collection: 'Member',
        search: {
          memberID: currentUser.memberID
        },
        update: {
          $set: {}
        }
      }
      const updatePostOptions = {
        hostname: 'localhost',
        path: '/mdbi/update/documents',
        method: 'POST',
        agent: sslUserAgent,
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': 0
        }
      }

      // If there's only one user, then this must be the user to edit. Let's go ahead and update this user, now
      updatePostBody.update.$set[field] = newval
      updatePostOptions.headers['Content-Length'] = Buffer.byteLength(
        JSON.stringify(updatePostBody)
      )
      logger.log(`Updating member "${uname}"'s ${field}`, handlerTag)
      www.https.post(
        updatePostOptions,
        updatePostBody,
        mdbiUpdateCallback,
        handlerTag.src
      )
    }
  }

  const mdbiSearchCallback = function (reply, error) {
    if (error) {
      // Some MDBI error happened
      logger.log(`MDBI search failed: ${error}`, handlerTag)
      response
        .status(500)
        .send(ef.asCommonStr(ef.struct.coreErr, error))
        .end()
    } else if (reply === null) {
      // Null result set
      logger.log('Search returned null', handlerTag)
      response
        .status(499)
        .send(
          ef.asCommonStr(
            ef.struct.unexpectedValue,
            `${uname} returned null set`
          )
        )
        .end()
    } else {
      logger.log(
        `${reply.length} ${reply.length === 1 ? 'result' : 'results'} found`,
        handlerTag
      )
      if (reply.length <= 0) {
        // If no members are found, then the client entered a non-existent username (i.e. violated a foreign key/referential integrity constraint)
        const noMemFoundErr = ef.common(
          'USER_NOT_FOUND',
          'The entered username returned no results',
          null,
          true
        )
        logger.log(
          `Error: The username "${uname}" returned no results!`,
          handlerTag
        )
        response
          .status(499)
          .send(noMemFoundErr)
          .end()
      } else if (reply.length > 1) {
        // If more than one member was found, that's fatal; we can't decide whose door code to change. Do nothing, and return an error message to the client
        const ambibuityErr = ef.common(
          'USER_AMBIGUOUS',
          'Username is not unique',
          null,
          true
        )
        logger.log(
          `Error: The username "${uname}" returned multiple results!`,
          handlerTag
        )
        response
          .status(499)
          .send(ambibuityErr)
          .end()
      } else if (typeof reply[0].memberID === 'undefined') {
        // If the member ID is not defined, we cannot identify whose door code info to change. Return an error to the client
        logger.log('Error: The result memberID was undefined!', handlerTag)
        response
          .status(499)
          .send(
            ef.asCommonStr(ef.struct.unexpectedValue, {
              parameter: 'reply[0].memberID'
            })
          )
          .end()
      } else {
        dataSafetyCheck(reply, error)
      }
    }
  }

  const verificationCallback = function (valid, error) {
    if (error) {
      // Some unexpected error occurred...
      logger.log(`Error: ${error}`, handlerTag)
      response
        .send(ef.asCommonStr(ef.struct.coreErr, error))
        .status(500)
        .end()
    } else if (!valid) {
      // Session expired, let the client know it!
      logger.log('Error: Invalid session token', handlerTag)
      response
        .status(499)
        .send(ef.asCommonStr(ef.struct.expiredSession))
        .end()
    } else if (uname === null) {
      // No username!
      logger.log('Error: Undefined username', handlerTag)
      response
        .status(499)
        .send(ef.asCommonStr(ef.struct.invalidBody, { parameter: 'username' }))
        .end()
    } else if (field === null) {
      // No field!
      logger.log(`Error: ${error}`, handlerTag)
      response
        .status(499)
        .send(ef.asCommonStr(ef.struct.invalidBody, { parameter: 'field' }))
        .end()
    } else if (newval === null) {
      // No value!
      logger.log(`Error: ${error}`, handlerTag)
      response
        .status(499)
        .send(ef.asCommonStr(ef.struct.invalidBody, { parameter: 'value' }))
        .end()
    } else {
      // Verification succeeded. Now let's make sure that the member exists before we change things
      const searchPostBody = {
        accessToken: credentials.mdbi.accessToken,
        collection: 'Member',
        search: {
          userName: uname
        },
        options: {
          projection: {
            memberID: 1
          }
        }
      }
      const searchPostOptions = {
        hostname: 'localhost',
        path: '/mdbi/search/documents',
        method: 'POST',
        agent: sslUserAgent,
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(JSON.stringify(searchPostBody))
        }
      }

      // All good, now to actually execute the mdbi search
      logger.log(
        `Authorization verified. Ensuring member "${uname}" exists`,
        handlerTag
      )
      www.https.post(
        searchPostOptions,
        searchPostBody,
        mdbiSearchCallback,
        handlerTag.src
      )
    }
  }

  verifySession(credentials.mdbi.accessToken, sessionID, verificationCallback)
})

/*
 @endpoint  /dashboard/edit/memberdates
 @parameter  request - the web request object provided by express.js. The request body is expected to be a JSON object with the following format:
     "sessionID" - the client's session token string
     "username" - the username string of the account whose membership date(s) will be modified
     "start" - (optional) a date object of the new start term value
     "end" - (optional) a date object of the new end term value
 @parameter  response - the web response object provided by express.js
 @returns  On success: a code 200, and an object with the following format:
     {
      "status": "success",
      "message": "some success message"
     }
    On invalid/expired session token: a code 499 and an error-formatted object in the response body detailing the expired session token issue
    On illegal or unsuccessful data modification: a code 499 and an error-formatted object in the response body detailing the invalid operation
    On any other failure: a code 500 and a JSON object detailing the issue
 @details  This endpoint serves POST requests for modification of Join Date, Start Term, and End Term date data within the Membership collection, using the Membership Profiler (i.e. the AngularJS profiler component) when modifying members' data via the "Member Detail" Modal
*/
router.post('/dashboard/edit/memberdates', function (request, response) {
  const handlerTag = { src: 'editMemberDates' }
  const sessionID =
    typeof request.body.sessionID !== 'undefined'
      ? request.body.sessionID
      : null
  const uname =
    typeof request.body.username !== 'undefined' ? request.body.username : null
  const startinfo =
    typeof request.body.start !== 'undefined' ? request.body.start : null
  const endinfo =
    typeof request.body.end !== 'undefined' ? request.body.end : null
  const someDataExists = startinfo || endinfo

  // Set the content type to json data
  response.set('Content-Type', 'application/json')

  const updateCallback = function (reply, error) {
    if (error) {
      logger.log(`An error occurred: ${error}`, handlerTag)
      response
        .status(499)
        .send(ef.asCommonStr(ef.struct.coreErr, error))
        .end()
    } else if (reply.nModified < 1 || reply.ok !== 1 || reply.n !== 1) {
      logger.log('Date modification unsuccessful', handlerTag)
      response
        .status(499)
        .send(ef.asCommonStr(ef.struct.coreErr, reply))
        .end()
    } else {
      logger.log('Date modification successful', handlerTag)
      response
        .status(200)
        .send({ status: 'success' })
        .end()
    }
  }

  const updateDates = function (memberData) {
    const updatePostBody = {
      accessToken: credentials.mdbi.accessToken,
      collection: 'MembershipData',
      search: {
        memberID: memberData.memberID
      },
      update: {
        $set: {}
      }
    }

    // Fill the $set data
    if (startinfo !== null) {
      updatePostBody.update.$set.startTerm = startinfo
    }
    if (endinfo !== null) {
      updatePostBody.update.$set.endTerm = endinfo
    }

    const updatePostOptions = {
      hostname: 'localhost',
      path: '/mdbi/update/documents',
      method: 'POST',
      agent: sslUserAgent,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(JSON.stringify(updatePostBody))
      }
    }

    if (someDataExists) {
      // Member search succeeded. Now to actually perform the update
      logger.log(`Updating member "${memberData.userName}"`, handlerTag)
      www.https.post(updatePostOptions, updatePostBody, updateCallback)
    } else {
      const returnval = {
        status: 'success',
        message: 'operation aborted due to lack of date data'
      }
      logger.log('No date data in post body; Aborting', handlerTag)
      response
        .status(200)
        .send(returnval)
        .end()
    }
  }

  const mdbiSearchCallback = function (reply, error) {
    if (error) {
      // Some MDBI error happened
      logger.log(`MDBI search failed: ${error}`, handlerTag)
      response
        .status(500)
        .send(ef.asCommonStr(ef.struct.coreErr, error))
        .end()
    } else if (reply === null) {
      // Null result set
      logger.log('Search returned null', handlerTag)
      response
        .status(499)
        .send(
          ef.asCommonStr(
            ef.struct.unexpectedValue,
            `${uname} returned null set`
          )
        )
        .end()
    } else {
      logger.log(
        `${reply.length} ${reply.length === 1 ? 'result' : 'results'} found`,
        handlerTag
      )
      if (reply.length <= 0) {
        // If no members are found, then the client entered a non-existent username (i.e. violated a foreign key/referential integrity constraint)
        const noMemFoundErr = ef.common(
          'USER_NOT_FOUND',
          'The entered username returned no results',
          null,
          true
        )
        logger.log(
          `Error: The username "${uname}" returned no results!`,
          handlerTag
        )
        response
          .status(499)
          .send(noMemFoundErr)
          .end()
      } else if (reply.length > 1) {
        // If more than one member was found, that's fatal; we can't decide whose door code to change. Do nothing, and return an error message to the client
        const ambibuityErr = ef.common(
          'USER_AMBIGUOUS',
          'Username is not unique',
          null,
          true
        )
        logger.log(
          `Error: The username "${uname}" returned multiple results!`,
          handlerTag
        )
        response
          .status(499)
          .send(ambibuityErr)
          .end()
      } else if (typeof reply[0].memberID === 'undefined') {
        // If the member ID is not defined, we cannot identify whose door code info to change. Return an error to the client
        logger.log('Error: The result memberID was undefined!', handlerTag)
        response
          .status(499)
          .send(
            ef.asCommonStr(ef.struct.unexpectedValue, {
              parameter: 'reply[0].memberID'
            })
          )
          .end()
      } else {
        updateDates(reply[0])
      }
    }
  }

  const verificationCallback = function (valid, error) {
    if (error) {
      // Some unexpected error occurred...
      logger.log(`Error: ${error}`, handlerTag)
      response
        .send(ef.asCommonStr(ef.struct.coreErr, error))
        .status(500)
        .end()
    } else if (!valid) {
      // Session expired, let the client know it!
      logger.log('Error: Invalid session token', handlerTag)
      response
        .status(499)
        .send(ef.asCommonStr(ef.struct.expiredSession))
        .end()
    } else if (uname === null) {
      // No username!
      logger.log('Error: Undefined username', handlerTag)
      response
        .status(499)
        .send(ef.asCommonStr(ef.struct.invalidBody, { parameter: 'username' }))
        .end()
    } else if (startinfo === null && endinfo === null) {
      // No data given!
      logger.log('Error: No data received', handlerTag)
      response
        .status(499)
        .send(
          ef.asCommonStr(ef.struct.invalidBody, { parameter: ['start', 'end'] })
        )
        .end()
    } else {
      // Verification succeeded. Now let's make sure that the member exists before we change things
      const searchPostBody = {
        accessToken: credentials.mdbi.accessToken,
        collection: 'Member',
        search: {
          userName: uname
        },
        options: {
          projection: {
            memberID: 1
          }
        }
      }
      const searchPostOptions = {
        hostname: 'localhost',
        path: '/mdbi/search/documents',
        method: 'POST',
        agent: sslUserAgent,
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(JSON.stringify(searchPostBody))
        }
      }

      // All good, now to actually execute the mdbi search
      logger.log(
        `Authorization verified. Ensuring member "${uname}" exists`,
        handlerTag
      )
      www.https.post(
        searchPostOptions,
        searchPostBody,
        mdbiSearchCallback,
        handlerTag.src
      )
    }
  }

  verifySession(credentials.mdbi.accessToken, sessionID, verificationCallback)
})

/*
 @endpoint  /dashboard/export/expiredcodes
 @parameter  request - the web request object provided by express.js. The request body is expected to be a JSON object with the following format:
     "sessionID" - the client's session token string
 @parameter  response - the web response object provided by express.js
 @returns  On success: a code 200, and a string of the success message
    On invalid/expired session token: a code 499 and an error-formatted object in the response body detailing the expired session token issue
    On insufficient permissions: a code 499 and an error-formatted object in the response body detailing the user's lack of permissions
    On any other failure: a code 500 and a JSON object detailing the issue
 @details  This endpoint serves POST requests that ask for an export of expired member doorcodes in the database. The request must be performed by a user who is logged in and is authorized to do so (STILL UNIMPLEMENTED), else this request fails
*/
router.post('/dashboard/export/expiredcodes', function (request, response) {
  const handlerTag = { src: 'exportExpiredCodes' }
  const sessionID =
    typeof request.body.sessionID !== 'undefined'
      ? request.body.sessionID
      : null

  response.set('Content-Type', 'application/json')

  const mdbiAggregateCallback = function (reply, error) {
    if (error) {
      logger.log(`Export failed: ${error}`, handlerTag)
      response
        .status(500)
        .send(ef.asCommonStr(ef.struct.coreErr, error))
        .end()
    } else {
      const list = reply
      const currentDate = new Date(Date.now())
      const dateStr = dt.niceDateStr(currentDate, '_')
      const timeStr = dt.niceTimeStr(currentDate, '_')
      const filename = `__code_export__${dateStr}_${timeStr}.json`

      try {
        logger.log(
          `Exporting ${list.length} expired member codes...`,
          handlerTag
        )
        fs.appendFile(
          `${settings.util}/exports/${filename}`,
          JSON.stringify(list),
          'utf8',
          function (error) {
            if (error) {
              logger.log(
                `Failed to export doorcodes to file ${filename}`,
                handlerTag
              )
              response
                .status(500)
                .send(ef.asCommonStr(ef.struct.coreErr, error))
                .end()
            } else {
              logger.log(`Export successful -> ${filename}`, handlerTag)
              response
                .status(200)
                .send({ status: 'success' })
                .end()
            }
          }
        )
      } catch (e) {
        logger.log(`Export error: ${e}`, handlerTag)
        response
          .status(500)
          .send(ef.asCommonStr(ef.struct.coreErr, e))
          .end()
      }
    }
  }

  const verificationCallback = function (valid, error) {
    if (error) {
      // Some unexpected error occurred...
      logger.log(`Error: ${error}`, handlerTag)
      response
        .send(ef.asCommonStr(ef.struct.coreErr, error))
        .status(500)
        .end()
    } else if (!valid) {
      // Session expired, let the client know it!
      logger.log('Error: Invalid session token', handlerTag)
      response
        .status(499)
        .send(ef.asCommonStr(ef.struct.expiredSession))
        .end()
    } else {
      // Verification succeeded. Now let's make sure that the member exists before we change things
      const aggPostBody = {
        accessToken: credentials.mdbi.accessToken,
        collection: 'MembershipData',
        pipeline: [
          {
            $match: {
              membershipStatus: false
            }
          },
          {
            $lookup: {
              from: 'DoorCode',
              localField: 'doorCodeID',
              foreignField: 'dcID',
              as: 'dc'
            }
          },
          {
            $replaceRoot: {
              newRoot: {
                code: '$dc.code',
                memberID: '$memberID'
              }
            }
          },
          {
            $unwind: '$code'
          },
          {
            $lookup: {
              from: 'Member',
              localField: 'memberID',
              foreignField: 'memberID',
              as: 'user'
            }
          },
          {
            $replaceRoot: {
              newRoot: {
                code: '$code',
                memberID: '$memberID',
                userName: '$user.userName'
              }
            }
          },
          {
            $unwind: '$userName'
          }
        ]
      }
      const aggPostOptions = {
        hostname: 'localhost',
        path: '/mdbi/search/aggregation',
        method: 'POST',
        agent: sslUserAgent,
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(JSON.stringify(aggPostBody))
        }
      }

      // All good, now to acquire the list of all door codes that are assigned to expired members
      logger.log(
        'Authorization verified. Acquiring codes of expired members',
        handlerTag
      )
      www.https.post(
        aggPostOptions,
        aggPostBody,
        mdbiAggregateCallback,
        handlerTag.src
      )
    }
  }

  verifySession(credentials.mdbi.accessToken, sessionID, verificationCallback)
})

/*
 @endpoint  /dashboard/search/officerlist
 @parameter  request - the web request object provided by express.js. The request body is expected to be a JSON object with the following format:
     "sessionID" - the client's session token string
     "currentUser" - the username of the current user, who will be excluded from the list
 @parameter  response - the web response object provided by express.js
 @returns  On success: a code 200, and a string of the success message
    On invalid body: a code 499 and an error-formatted invalidBody object
    On invalid/expired session token: a code 499 and an error-formatted object in the response body detailing the expired session token issue
    On issufficient permission: a code 499 and an error-formatted object in the response body detailing the user's lack of permissions
    On any other failure: a code 500 and a JSON object detailing the issue
 @details  This endpoint serves POST requests that ask for a full list of officers. The request must be performed by a user who is logged in and authorized to do so, else this request fails
*/
router.post('/dashboard/search/officerlist', function (request, response) {
  const handlerTag = { src: 'dashboardOfficerList' }
  const sessionID =
    typeof request.body.sessionID !== 'undefined'
      ? request.body.sessionID
      : null
  const currentUser =
    typeof request.body.currentUser !== 'undefined'
      ? request.body.currentUser
      : null

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
        const msg = 'Officer list request returned null'
        logger.log(
          'Error: null value returned in officer list request',
          handlerTag
        )
        response
          .status(499)
          .send(ef.asCommonStr(ef.struct.unexpectedValue, msg))
          .end()
      } else {
        response
          .status(200)
          .send(reply)
          .end()
      }
    }
  }

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
          .status(499)
          .send(ef.asCommonStr(ef.struct.adminUnauthorized))
          .end()
        break
      }
      case true: {
        const searchPostBody = {
          accessToken: credentials.mdbi.accessToken,
          collection: 'OfficerDossier',
          search: {
            $and: [
              {
                userName: {
                  $ne: currentUser // exclude the current user
                }
              },
              {
                level: {
                  $gt: 0 // i.e. not Admin level
                }
              }
            ]
          },
          options: {
            projection: {
              lastLogin: 0,
              email: 0
            }
          }
        }
        const searchPostOptions = {
          hostname: 'localhost',
          path: '/mdbi/search/documents',
          method: 'POST',
          agent: sslUserAgent,
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(JSON.stringify(searchPostBody))
          }
        }

        // All good, now to acquire the list of officers that aren't admins and arent the current user
        logger.log(
          'Authorization verified. Acquiring codes of expired members',
          handlerTag
        )
        www.https.post(
          searchPostOptions,
          searchPostBody,
          mdbiSearchCallback,
          handlerTag.src
        )
        break
      }
    }
  }

  const verificationCallback = function (valid, error) {
    if (error) {
      // Some unexpected error occurred...
      logger.log(`Error: ${error}`, handlerTag)
      response
        .send(ef.asCommonStr(ef.struct.coreErr, error))
        .status(500)
        .end()
    } else if (!valid) {
      // Session expired, let the client know it!
      logger.log('Error: Invalid session token', handlerTag)
      response
        .status(499)
        .send(ef.asCommonStr(ef.struct.expiredSession))
        .end()
    } else {
      // Verification succeeded. Now let's make sure that the current user has the appropriate capabiliities before we let them change things
      isCapable([3, 4], currentUser, capabilityCallback)
    }
  }

  if (currentUser === null) {
    response
      .status(499)
      .send(ef.asCommonStr(ef.struct.invalidBody, { parameter: 'currentUser' }))
      .end()
  } else {
    verifySession(credentials.mdbi.accessToken, sessionID, verificationCallback)
  }
})

/*
 @function  /dashboard/search/officerabilities
 @parameter  request - the web request object provided by express.js. The request body is expected to be a JSON object with the following:
     "sessionID" - the client's session token string
     "officerID" - the member ID of the officer in question
     "getInfo" - (optional) a boolean specifying whether to return all abilities with their descriptions
 @parameter  response - the web response object provided by express.js
 @returns  On success: a code 200, and the specified officer's ability list
    On invalid/expired session token: a code 499, and an error-formatted JSON object detailing the expired session issue
    On any other failure: a code 500, and a JSON object detailing the issue
*/
router.post('/dashboard/search/officerabilities', function (request, response) {
  const handlerTag = { src: 'dashboardOfficerAbilities' }
  const sessionID =
    typeof request.body.sessionID !== 'undefined'
      ? request.body.sessionID
      : null
  const officerID =
    typeof request.body.officerID !== 'undefined'
      ? request.body.officerID
      : null
  const getInfo =
    typeof request.body.getInfo !== 'undefined' ? request.body.getInfo : false

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
        const msg = 'Officer ability list request returned null'
        logger.log(
          'Error: null value returned in officer list request',
          handlerTag
        )
        response
          .status(499)
          .send(ef.asCommonStr(ef.struct.unexpectedValue, msg))
          .end()
      } else {
        response
          .status(200)
          .send(reply)
          .end()
      }
    }
  }

  const verificationCallback = function (valid, error) {
    if (error) {
      // Some unexpected error occurred...
      logger.log(`Error: ${error}`, handlerTag)
      response
        .send(ef.asCommonStr(ef.struct.coreErr, error))
        .status(500)
        .end()
    } else if (!valid) {
      // Session expired, let the client know it!
      logger.log('Error: Invalid session token', handlerTag)
      response
        .status(499)
        .send(ef.asCommonStr(ef.struct.expiredSession))
        .end()
    } else if (officerID === null) {
      // Invalid parameters with request
      logger.log('Error: No officerID provided', handlerTag)
      response
        .status(499)
        .send(ef.asCommonStr(ef.struct.invalidBody, { parameter: 'officerID' }))
        .end()
    } else {
      // Verification succeeded. Now let's find the associated officer's abilities
      let searchPostBody = {}

      // Determine relevant endpoint using the getInfo boolean
      if (getInfo === false) {
        searchPostBody = {
          accessToken: credentials.mdbi.accessToken,
          collection: 'OfficerDossier',
          search: {
            memberID: officerID
          },
          options: {
            projection: {
              abilities: 1
            }
          }
        }
      } else {
        searchPostBody = {
          accessToken: credentials.mdbi.accessToken,
          collection: 'OfficerDossier',
          pipeline: [
            {
              $match: {
                memberID: officerID
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
              $unwind: '$abilityInfo'
            },
            {
              $replaceRoot: {
                newRoot: {
                  abilityID: '$abilityInfo.abilityID',
                  abilityName: '$abilityInfo.abilityName',
                  abilityDescription: '$abilityInfo.abilityDescription'
                }
              }
            }
          ]
        }
      }

      const searchPostOptions = {
        hostname: 'localhost',
        path:
          getInfo === null
            ? '/mdbi/search/documents'
            : '/mdbi/search/aggregation',
        method: 'POST',
        agent: sslUserAgent,
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(JSON.stringify(searchPostBody))
        }
      }

      logger.log(
        `Authorization verified. Acquiring ability details for officer #${officerID}`,
        handlerTag
      )
      www.https.post(
        searchPostOptions,
        searchPostBody,
        mdbiSearchCallback,
        handlerTag.src
      )
    }
  }

  verifySession(credentials.mdbi.accessToken, sessionID, verificationCallback)
})

/*
 @function  /dashboard/edit/officerclearance
 @parameter  request - the web request object provided by express.js. The request body is expected to be a JSON object with the following:
     "sessionID" - the client's session token string
     "currentUser" - the username of the current user, who will be excluded from the list
     "officerID" - the member ID of the officer in question
     "level"  - (optional) the clearance level number to assign to this officer
 @parameter  response - the web response object provided by express.js
 @returns  On success: a code 200, and a success message
    On invalid/expired session token: a code 499, and an error-formatted JSON object detailing the expired session issue
    On any other failure: a code 500, and a JSON object detailing the issue
 @details  This endpoint serves POST requests that ask to modify the specified officer's clearance level. Since a single user (i.e. officer) may only have one clearance level at a time, the level parameter will entirely replace the specified user's clearance level, or remove it if no level is specified
*/
router.post('/dashboard/edit/officerclearance', function (request, response) {
  const handlerTag = { src: 'dashboardOfficerClearance' }
  const sessionID =
    typeof request.body.sessionID !== 'undefined'
      ? request.body.sessionID
      : null
  const currentUser =
    typeof request.body.currentUser !== 'undefined'
      ? request.body.currentUser
      : null
  const officerID =
    typeof request.body.officerID !== 'undefined'
      ? request.body.officerID
      : null
  const level =
    typeof request.body.level !== 'undefined' ? request.body.level : -1

  const mdbiUpdateCallback = function (reply, error) {
    if (error) {
      // Some MDBI error happened
      logger.log(`MDBI search failed: ${error}`, handlerTag)
      response
        .status(500)
        .send(ef.asCommonStr(ef.struct.coreErr, error))
        .end()
    } else if (reply.nModified < 1) {
      // The MDBI wasn't able to update any document at all
      const ineffectiveErr = ef.common(
        'USER_UNCHANGED',
        'The user was unaffected by the previous query',
        null,
        true
      )
      logger.log('Error: MDBI updated nothing!', handlerTag)
      response
        .status(499)
        .send(ineffectiveErr)
        .end()
    } else if (reply.nModified > 1) {
      // DANGER: The MDBI updated several documents
      const corruptionErr = ef.common(
        'MULTIUSER_CORRUPTION',
        'constious users were unintentionally affected by the previous query',
        null,
        true
      )
      logger.log('Error: MDBI updated more than one user!', handlerTag)
      response
        .status(499)
        .send(corruptionErr)
        .end()
    } else {
      // Send success here...
      logger.log('User door code update success', handlerTag)
      response
        .status(200)
        .send({ status: 'success' })
        .end()
    }
  }

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
          .status(499)
          .send(ef.asCommonStr(ef.struct.adminUnauthorized))
          .end()
        break
      }
      case true: {
        const updatePostBody = {
          accessToken: credentials.mdbi.accessToken,
          collection: 'MembershipData',
          search: {
            memberID: officerID
          },
          update: {
            $set: {
              level: level
            }
          }
        }
        const updatePostOptions = {
          hostname: 'localhost',
          path: '/mdbi/update/documents',
          method: 'POST',
          agent: sslUserAgent,
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(JSON.stringify(updatePostBody))
          }
        }

        // All good, now to modify the clearance level of the specified officer
        logger.log(
          'Authorization verified. Processing clearance level change',
          handlerTag
        )
        www.https.post(
          updatePostOptions,
          updatePostBody,
          mdbiUpdateCallback,
          handlerTag.src
        )
        break
      }
    }
  }

  const verificationCallback = function (valid, error) {
    if (error) {
      // Some unexpected error occurred...
      logger.log(`Error: ${error}`, handlerTag)
      response
        .send(ef.asCommonStr(ef.struct.coreErr, error))
        .status(500)
        .end()
    } else if (!valid) {
      // Session expired, let the client know it!
      logger.log('Error: Invalid session token', handlerTag)
      response
        .status(499)
        .send(ef.asCommonStr(ef.struct.expiredSession))
        .end()
    } else if (officerID === null) {
      // Invalid parameters with request
      logger.log('Error: No officerID provided', handlerTag)
      response
        .status(499)
        .send(ef.asCommonStr(ef.struct.invalidBody, { parameter: 'officerID' }))
        .end()
    } else {
      // Verification succeeded; let's make sure the request issuer is qualified to edit the officer
      isCapable([8, 9], currentUser, capabilityCallback)
    }
  }

  verifySession(credentials.mdbi.accessToken, sessionID, verificationCallback)
})

/*
 @function  /dashboard/search/clearancelevels
 @parameter  request - the web request object provided by express.js. The request body is expected to be a JSON object with the following:
     "sessionID" - the client's session token string
     "currentUser" - the username of the current user, used to ensure that only authorized users can search clearance levels
     "search" - (optional) a string used to search for a clearance level (search by name)
 @parameter  response - the web response object provided by express.js
 @returns On success: a code 200, and a full list of clearance levels (or a list of those matching the search query)
    On unauthorized action: a code 200, and an error-formatted object detailing the authorization issue
    On invalid/expired session token: a code 499, and an error-formatted JSON object detailing the expired session issue
    On any other failure: a code 500, and a JSON object detailing the issue
 @details  This endpoint serves POST requests that ask for a full list of clearance levels used in the system.
*/
router.post('/dashboard/search/clearancelevels', function (request, response) {
  const handlerTag = { src: 'dashboardClearanceLevelList' }
  const sessionID =
    typeof request.body.sessionID !== 'undefined'
      ? request.body.sessionID
      : null
  const currentUser =
    typeof request.body.currentUser !== 'undefined'
      ? request.body.currentUser
      : null
  // const search = (typeof request.body.level !== 'undefined') ? request.body.search : null

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
          'Error: null value returned in clearance level list request',
          handlerTag
        )
        response
          .status(499)
          .send(ef.asCommonStr(ef.struct.unexpectedValue, msg))
          .end()
      } else {
        response
          .status(200)
          .send(reply)
          .end()
      }
    }
  }

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
          .status(499)
          .send(ef.asCommonStr(ef.struct.adminUnauthorized))
          .end()
        break
      }
      case true: {
        // Capability Verification succeeded. Now let's get a full list of clearance levels
        const searchPostBody = {
          accessToken: credentials.mdbi.accessToken,
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
          agent: sslUserAgent,
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(JSON.stringify(searchPostBody))
          }
        }

        logger.log(
          'Authorization verified. Acquiring clearance level list...',
          handlerTag
        )
        www.https.post(
          searchPostOptions,
          searchPostBody,
          mdbiSearchCallback,
          handlerTag.src
        )
        break
      }
    }
  }

  const verificationCallback = function (valid, error) {
    if (error) {
      // Some unexpected error occurred...
      logger.log(`Error: ${error}`, handlerTag)
      response
        .send(ef.asCommonStr(ef.struct.coreErr, error))
        .status(500)
        .end()
    } else if (!valid) {
      // Session expired, let the client know it!
      logger.log('Error: Invalid session token', handlerTag)
      response
        .status(499)
        .send(ef.asCommonStr(ef.struct.expiredSession))
        .end()
    } else {
      // Verification succeeded; let's make sure the request issuer is qualified to edit abilities
      isCapable([5, 6, 7], currentUser, capabilityCallback)
    }
  }

  verifySession(credentials.mdbi.accessToken, sessionID, verificationCallback)
})

/*
 @endpoint  /ability/getAll
 @parameter  request - the web request object provided by express.js. The request body is expected to be a JSON object with the following:
     "sessionID" - the client's session token string
     "currentUser" - the username of the current user, used to ensure that only authorized users can search clearance levels
 @parameter  response - the web response object provided by express.js
 @returns  On success: a code 200, and a full list of abilities assignable to clearance levels
    On unauthorized action: a code 200, and an error-formatted object detailing the authorization issue
    On invalid/expired session token: a code 499, and an error-formatted JSON object detailing the expired session issue
    On any other failure: a code 500, and a JSON object detailing the issue
 @details  This endpoint serves GET requests that ask for a full list of abilities assignable to clearance levels
*/
router.get('/ability/getAll', function (request, response) {
  const handlerTag = { src: 'dashboard/abilities/getAll' }
  const sessionID =
    typeof request.query.sessionID !== 'undefined'
      ? request.query.sessionID
      : null
  const currentUser =
    typeof request.query.currentUser !== 'undefined'
      ? request.query.currentUser
      : null

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
          .status(499)
          .send(ef.asCommonStr(ef.struct.unexpectedValue, msg))
          .end()
      } else {
        response
          .status(200)
          .send(reply)
          .end()
      }
    }
  }

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
          .status(499)
          .send(ef.asCommonStr(ef.struct.adminUnauthorized))
          .end()
        break
      }
      case true: {
        // Capability Verification succeeded. Now let's get a full list of abilities
        const searchPostBody = {
          accessToken: credentials.mdbi.accessToken,
          collection: 'Ability',
          pipeline: [
            {
              $match: {
                abilityID: {
                  $ne: -1
                }
              }
            }
          ]
        }

        const searchPostOptions = {
          hostname: 'localhost',
          path: '/mdbi/search/aggregation',
          method: 'POST',
          agent: sslUserAgent,
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(JSON.stringify(searchPostBody))
          }
        }

        logger.log(
          'Authorization verified. Acquiring available ability list...',
          handlerTag
        )
        www.https.post(
          searchPostOptions,
          searchPostBody,
          mdbiSearchCallback,
          handlerTag.src
        )
        break
      }
    }
  }

  const verificationCallback = function (valid, error) {
    if (error) {
      // Some unexpected error occurred...
      logger.log(`Error: ${error}`, handlerTag)
      response
        .send(ef.asCommonStr(ef.struct.coreErr, error))
        .status(500)
        .end()
    } else if (!valid) {
      // Session expired, let the client know it!
      logger.log('Error: Invalid session token', handlerTag)
      response
        .status(499)
        .send(ef.asCommonStr(ef.struct.expiredSession))
        .end()
    } else {
      // Verification succeeded; let's make sure the request issuer is qualified to edit abilities
      isCapable([5, 6, 7], currentUser, capabilityCallback)
    }
  }

  verifySession(credentials.mdbi.accessToken, sessionID, verificationCallback)
})

/*
 @function  /dashboard
 @parameter  request - the web request object provided by express.js
 @parameter  response - the web response object provided by express.js
 @returns  On success: gives the client an error page and a code 200
    On failure: gives the client an error message and a code 500
 @details  This function handles the odd case where using the url bar to enter or refresh the dashboard causes unexpected behavior. Since the dashboard requires a POST request to acquire the session ID securely, this route is used to explicitly deny access by GET request.
*/
router.get('/dashboard', function (request, response) {
  const handlerTag = { src: 'generalError' }

  logger.log(
    `General error occurred. Sending error page to client @ ip ${request.ip}`,
    handlerTag
  )
  response.set('Content-Type', 'text/html')
  response.sendFile('home/genErr.html', options, function (error) {
    if (error) {
      logger.log(error, handlerTag)
      response
        .status(500)
        .send(ef.asCommonStr(ef.struct.coreErr, error))
        .end()
    } else {
      logger.log(`Sent genErr.html to ${settings.port}`, handlerTag)
      response.status(200).end()
    }
  })
})
// END Core Routes

// BEGIN Error Handling Routes
/*
 @endpoint  NOTFOUND (404)
 @parameter  n/a
 @returns  n/a
 @details  This function handles any endpoint requests that do not exist under the "/test" endpoint
*/
router.use(function (request, response) {
  const handlerTag = { src: '/core/NOTFOUND' }
  logger.log(
    `Non-existent endpoint "${request.path}" requested from client @ ip ${request.ip}`,
    handlerTag
  )
  response
    .status(404)
    .json({
      status: 404,
      subapp: 'core',
      err: 'Non-Existent Endpoint'
    })
    .end()
})

/*
 @endpoint  ERROR (for any other errors)
 @parameter  n/a
 @returns  n/a
 @details  This function sends an error status (500) if an error occurred forcing the other methods to not run.
*/
router.use(function (err, request, response) {
  // const handlerTag = { src: '/core/ERROR' }
  logger.log(`Error occurred with request from client @ ip ${request.ip}`)
  response
    .status(500)
    .json({
      status: 500,
      subapp: 'core',
      err: err.message
    })
    .end()
})
// END Error Handling Routes

// BEGIN Utility Functions
/*
 @function  verifySession
 @parameter  token - the database access token
 @parameter  sessionID - the session token string to verify
 @parameter  callback - a callback to run after the verification operation is completed. It is passed 2 arguments:
     "valid" - If no validation error occurred, this value is true for a valid token, false otherwise. If a validation error occurred, this value is null.
     "error" - If no validation error occurred, this value is null. Otherwise, it contains a stringified JSON object describing the error (i.e. as given by error_formats.js)
 @returns  n/a
 @details  This function wraps the session ID verification routine into a single function call, allowing callbacks to process the operation result.
*/
function verifySession (token, sessionID, callbk) {
  const handlerTag = { src: 'verifySession' }
  const verificationPostBody = {
    accessToken: token,
    collection: 'SessionData',
    search: {
      sessionID: sessionID
    }
  }
  const verificationPostOptions = {
    hostname: 'localhost',
    path: '/mdbi/search/documents',
    method: 'POST',
    agent: sslUserAgent,
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(JSON.stringify(verificationPostBody))
    }
  }

  // Check to make sure that the submitted sessionID is in the session database, and that it has not passed its maxIdleTime since its last activity
  www.https.post(verificationPostOptions, verificationPostBody, function (
    reply,
    error
  ) {
    logger.log(
      `${reply.length} ${reply.length === 1 ? 'result' : 'results'} found`,
      handlerTag
    )
    const existingSession = reply[0]
    const validResult =
      typeof existingSession === 'object' &&
      typeof existingSession.maxIdleTime === 'number' &&
      typeof existingSession.lastActivity === 'string'
    const lastActiveTimestamp = new Date(
      validResult ? existingSession.lastActivity : Date.now()
    )

    // Determine remaining idle time
    lastActiveTimestamp.setMinutes(
      lastActiveTimestamp.getMinutes() +
        (validResult ? existingSession.maxIdleTime : 0)
    )
    const tokenExpired = dt.hasPassed(lastActiveTimestamp)
    if (validResult && !tokenExpired) {
      callbk(true, null)
    } else if (!validResult) {
      callbk(null, ef.asCommonStr(ef.struct.unexpectedValue))
    } else if (tokenExpired) {
      callbk(false, null)
    } else if (error) {
      callbk(null, ef.asCommonStr(ef.struct.coreErr, error))
    }
  })
}

/*
 @function  clearSession
 @parameter  token - the database access token
 @parameter  sessionID - the session token of the user whose session data will be cleared
 @parameter  callback - a required callback function to run after attempting to clear the specified user's session data. It is passed two arguments:
     reply - if the operation was understood by the MongoDB server, this is a JSON object detailing the success of the operation
     error - if there was no error, this parameter is "null"; otherwise, it is an object detailing the error that occurred
 @returns  n/a
 @details  This function is useful for removing a user's session data from the database when their token becomes invalid, or when the session manager is used to manually log them out.
*/
function clearSession (token, sessionID, callback) {
  // const handlerTag = { src: 'clearSession' }
  const removalPostBody = {
    accessToken: credentials.mdbi.accessToken,
    collection: 'SessionData',
    search: {
      sessionID: sessionID
    }
  }
  const removalPostOptions = {
    hostname: 'localhost',
    path: '/mdbi/delete/document',
    method: 'POST',
    agent: sslUserAgent,
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(JSON.stringify(removalPostBody))
    }
  }

  www.https.post(removalPostOptions, removalPostBody, callback)
}

/*
 @function  isCapable
 @parameter  abilityList - an array of ability ID numbers to check for
 @parameter  userID - the ID number or username of the user whose abilities will be checked
 @parameter  callback - a required callback function to run after the capability check is executed. It is passed the following parameters:
     result - On a successfully fulfilled match condition, this value is true. If the match condition was not fulfilled, this value is false. On an error or unexpected response, this value is -1.
 @parameter  matchMode - (optional) a number controlling what kind of comparison will be performed. The following are valid match modes:
     0 - Full match: (default) user must have ALL abilities in the list
     1 - Loose match: user must have AT LEAST ONE ability in the list
     2 - Excluded match: user must NOT HAVE ANY of the abilities in the list
 @returns  n/a
 @details  This function is useful for determining if a user has the correct permissions for a specific feature.
*/
function isCapable (abilityList, userID, callbk, matchMode = 0) {
  const handlerTag = { src: 'isCapable' }
  let status = false
  const checkPostBody = {
    accessToken: credentials.mdbi.accessToken,
    collection: 'OfficerDossier',
    search: {
      abilities: null
    }
  }
  const checkPostOptions = {
    hostname: 'localhost',
    path: '/mdbi/search/documents',
    method: 'POST',
    agent: sslUserAgent,
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': 0
    }
  }

  // Modify post body depending on user ID or username usage
  if (typeof userID === 'string') {
    checkPostBody.search.userName = userID
  } else if (typeof userID === 'number') {
    checkPostBody.search.memberID = userID
  }

  // Modify mdbi query based on match mode
  switch (matchMode) {
    case 0: {
      // Full Match Mode
      checkPostBody.search.abilities = {
        $all: abilityList
      }
      break
    }
    case 1: {
      // Loose Match Mode
      checkPostBody.search.abilities = {
        $in: abilityList
      }
      break
    }
    case 2: {
      // Excluded Match Mode
      checkPostBody.search.abilities = {
        $nin: abilityList
      }
      break
    }
    default: {
      status = -1
      break
    }
  }

  // Finalize content length calculation
  checkPostOptions.headers['Content-Length'] = Buffer.byteLength(
    JSON.stringify(checkPostBody)
  )

  // Run database query if nothing went wrong
  if (status !== -1) {
    www.https.post(checkPostOptions, checkPostBody, function (reply, error) {
      logger.log(
        `${reply.length} ${reply.length === 1 ? 'result' : 'results'} found`,
        handlerTag
      )
      if (error) {
        callbk(-1)
      } else if (reply.length !== 1) {
        callbk(false)
      } else {
        callbk(true)
      }
    })
  } else {
    callbk(-1)
  }
}
// END Utility Functions

module.exports = router
// END core/app/routes/index.js
