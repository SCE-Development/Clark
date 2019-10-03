// PROJECT:   Core-v4
//  Name:    Rolando Javier
//  File:    home/app/app.js
//  Date Created:  April 10, 2018
//  Last Modified:  April 10, 2018
//  Details:
//      This file contains the SCE Home sub-app used by the public to acquire information about SCE, register for officership or membership, or nagvigate to other public features. It is used by the main app in server.js
//  Dependencies:
//      ExpressJS 4.x
//      body-parser (NPM middleware req'd by ExpressJS 4.x to acquire POST data parameters: "npm install --save body-parser")

'use strict'

// Includes
const express = require('express')
const settings = require('../../../util/settings') // import server system settings
const logger = require(`${settings.util}/logger`) // import event log system
const bodyParser = require('body-parser') // import POST request data parser
const routes = require('./routes') // import SCE Core routes

// Globals
const handlerTag = { src: 'homeRouter' }

// Test Page App
logger.log('Initializing SCE Home...', handlerTag)
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

// Test Page Route
app.use('/', routes) // serves the MongoDB Test Interface page

module.exports = app
// END core/app/app.js
