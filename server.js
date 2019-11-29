// PROJECT:   MEANserver
// Name:    Rolando Javier
// File:    server.js
// Date Created:  October 17, 2017
// Last Modified:  January 9, 2018
// Details:
//      This file comprises the MEAN Stack server to be used in PROJECT: Core-v4 (based on the server from PROJECT: SkillMatch and PROJECT: MEANserver)
// Dependencies:
//      NodeJS v6.9.1
//      ExpressJS 4.16.2
//      body-parser (NPM middleware req'd by ExpressJS 4.x to acquire POST data parameters: "npm install --save body-parser")

'use strict'

/* NodeJS+ExpressJS Server */
const http = require('http')
const bodyParser = require('body-parser') // import POST request data parser
const settings = require('./util/settings') // import server system settings
const logger = require(`${settings.util}/logger`) // import event log system
let port = process.argv[2] // allow custom ports

// Configure Mongoose
const mongoose = require('mongoose')
mongoose.Promise = require('bluebird')
const express = require('express')
const cors = require('cors')

/* Globals */
const handlerTag = { src: 'server' }

// Ensure a test database is ran when running End-to-End tests
const testEnv = process.env.NODE_ENV === 'test'
const database = testEnv ? 'sce_core_test' : 'sce_core'

/* Initialize logging */

class Server {
  constructor () {
    logger.log('Initializing...', handlerTag)
    this.mongoose = mongoose
    this.mongoose
      .connect(`mongodb://localhost/${database}`, {
        promiseLibrary: require('bluebird'),
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
      })
      .then(() => {
        console.log('MongoDB Connection Successful')
        console.log()
      })
      .catch(error => console.error(error))

    /* Create server instance */
    const app = express()
    app.locals.title = 'Core v4'
    app.locals.email = 'test@test.com'

    app.use(cors()) // use CORS policy

    /* Define logs to ignore */
    logger.ignore([
      'bodyParser.json.Reviver',
      'delintRequestBody',
      'error_formats.common'
    ])

    /* Define Static Asset Locations (i.e. includes/js/css/img files) */
    logger.log('Preparing static assets...', handlerTag)
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
    app.use(express.static(settings.root)) // server root

    /* Define Main Server Routes (RESTful)

     To create a new endpoint:
      - Select a URI to associate as the new endpoint (i.e. "routePath")
      - Define a handler function in util/route_handlers.js in a similar fashion the the others (i.e. "handlerFunc")
      - Place an app request here (i.e. "app.post([routePath], [handlerFunc])")
    */
    // logger.log('Routing server endpoints...', handlerTag)
    // const homeApp = require('./src/home/app/app.js')
    // app.use('/home', homeApp) // GET request of the main login page

    // Initialize the routes
    require('./api/index.js').forEach(route => {
      app.use(`/api/${route}`, require(`./api/routes/${route}`))
    })

    /* Initialize SCE Core Admin sub-app */
    // const coreAdminApp = require('./public/core/app/app.js')
    // app.use('/core', coreAdminApp)

    /*
     Main Server Routine - Listen for requests on specified port
    */
    if (!port) {
      logger.log(`Using default port ${settings.port}`, handlerTag)
      port = settings.port
    } else {
      logger.log(`Using custom port ${port}`, handlerTag)
      settings.port = port
    }
    this.server = http.createServer(app)
    this.server.listen(port, function () {
      logger.log(`Now listening on port ${port}`, handlerTag)
    })
  }

  getServerInstance () {
    return this.server
  }

  closeConnection () {
    this.server.close()
    this.mongoose.connection.close()
  }
}

// END server.js

module.exports = { Server }
