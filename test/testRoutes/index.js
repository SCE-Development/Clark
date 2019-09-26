// PROJECT:   MEANserver
// Name:    Rolando Javier
// File:    test/testRoutes/index.js
// Date Created:  January 9, 2018
// Last Modified:  January 9, 2018
// Details:
//      This file abstracts all Test Page routes and places them into a ExpressJS router to be used by the test page subapp (accessed under the "/test" endpoint from server.js) in test/app.js.
// Dependencies:
//      JQuery v1.12.4
//      ExpressJS 4.x
//      body-parser (NPM middleware req'd by ExpressJS 4.x to acquire POST data parameters: "npm install --save body-parser")

'use strict'

// Includes
const express = require('express')
const router = express.Router()
const settings = require('../../util/settings') // import server system settings
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

// BEGIN Test Routes
/*
 @endpoint /
 @parameter request - the web request object provided by express.js
 @parameter response - the web response object provided by express.js
 @returns n/a
 @details  This function serves the test page for all "/test" endpoint requests. Used on a GET request
*/
router.get('/', function (request, response) {
  const handlerTag = { src: '/test/' }
  logger.log(`Test page requested from ip ${request.ip}`, handlerTag)
  logger.log(request.toString(), handlerTag)
  response.set('Content-Type', 'text/html') // forces the browser to interpret the file as an interactive webpage
  response.sendFile('home/test.html', options, function (error) {
    if (error) {
      logger.log(error, handlerTag)
      response.status(500).end()
    } else {
      logger.log(
        `Test Handler passed to client @ ip ${request.ip} on port ${settings.port}`,
        handlerTag
      )
      response.end()
    }
  })
})
// END Test Routes

// BEGIN Error Handling Routes
/*
 @endpoint  NOTFOUND (404)
 @parameter  n/a
 @returns  n/a
 @details  This function handles any endpoint requests that do not exist under the "/test" endpoint
*/
router.use(function (request, response) {
  const handlerTag = { src: '/test/NOTFOUND' }
  logger.log(
    `Non-existent endpoint "${request.path}" requested from client @ ip ${request.ip}`,
    handlerTag
  )
  response.status(404).json({
    status: 404,
    subapp: 'test',
    err: 'Non-Existent Endpoint'
  })
})

/*
 @endpoint  ERROR (for any other errors)
 @parameter  n/a
 @returns  n/a
 @details  This function sends an error status (500) if an error occurred forcing the other methods to not run.
*/
router.use(function (err, request, response) {
  // const handlerTag = { src: '/test/ERROR' }
  logger.log(`Error occurred with request from client @ ip ${request.ip}`)
  response.status(500).json({
    status: 500,
    subapp: 'test',
    err: err.message
  })
})
// END Error Handling Routes

module.exports = router
// END test/testRoutes/index.js
