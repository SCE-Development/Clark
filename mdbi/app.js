// PROJECT:   MEANserver
//  Name:    Rolando Javier
//  File:    mdbi/app.js
//  Date Created:  January 9, 2018
//  Last Modified:  January 9, 2018
//  Details:
//      This file abstracts all MongoDB API Wrappers into a sub-app accessible via the "/mdbi" endpoint (see server.js). It is used by the main app in server.js and can be used by all other sub-apps, if necessary. This abstraction makes the system more modular by isolating all database access functions into one expressjs application, and will allow further extension of this system if necessary.
//  Dependencies:
//      ExpressJS 4.x
//      body-parser (NPM middleware req'd by ExpressJS 4.x to acquire POST data parameters: "npm install --save body-parser")

'use strict'

// Includes
const express = require('express')
const bodyParser = require('body-parser') // import POST request data parser
const settings = require('../util/settings') // import server system settings
const logger = require(`${settings.util}/logger`) // import event log system
const mdbiRoutes = require('./mdbiRoutes') // import MDBI API Wrapper router

// Globals
const handlerTag = { src: 'mdbiRouter' }

// MDBI App
logger.log('Initializing MDBI...', handlerTag)
const app = express()
app.use(
  bodyParser.json({
    // support JSON-encoded request bodies
    strict: true
  })
)
app.use(
  bodyParser.urlencoded({
    // support URL-encoded request bodies
    extended: true
  })
)

// MDBI Route
app.use('/', mdbiRoutes)

module.exports = app
// END mdbi/app.js
