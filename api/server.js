'use strict'
const http = require('http')
const bodyParser = require('body-parser') // import POST request data parser
const settings = require('./util/settings') // import server system settings
const logger = require(`${settings.util}/logger`) // import event log system
let port = process.argv[2] // allow custom ports

const mailer = require('./mailer/mailer')

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
const TESTING_PORT = 5001
const databaseUrl = process.env.DOCKER ? 'db:27017' : 'localhost'

class Server {
  constructor () {
    this.mongoose = mongoose
    this.app = express()
    this.app.locals.title = 'Core v4'
    this.app.locals.email = 'test@test.com'

    this.app.use(cors())

    /* Define logs to ignore */
    logger.ignore([
      'bodyParser.json.Reviver',
      'delintRequestBody',
      'error_formats.common'
    ])

    /* Define Static Asset Locations (i.e. includes/js/css/img files) */
    logger.log('Preparing static assets...', handlerTag)
    this.app.use(
      bodyParser.json({
        // support JSON-encoded request bodies
        limit: '50mb',
        strict: true
      })
    )
    this.app.use(
      bodyParser.urlencoded({
        // support URL-encoded request bodies
        limit: '50mb',
        extended: true
      })
    )
    this.app.use(express.static(settings.root))
    // Initialize the routes
    require('./index.js').forEach(route => {
      this.app.use(`/api/${route}`, require(`./routes/${route}`))
    })

    // Initialize the mailer routes
    this.app.post('/api/mailer', (req, res) => {
      mailer
        .send({ ...req.body })
        .then(() => {
          res.sendStatus(200)
        })
        .catch(error => {
          console.log(error)
        })
    })

    // Main Server Routine - Listen for requests on specified port
    if (!port) {
      logger.log(`Using default port ${settings.port}`, handlerTag)
      port = testEnv ? TESTING_PORT : port = settings.port 
    } else {
      logger.log(`Using custom port ${port}`, handlerTag)
      settings.port = port
    }
  }

  openConnection () {
    logger.log('Initializing...', handlerTag)
    this.mongoose = mongoose
    this.mongoose
      .connect(`mongodb://${databaseUrl}/${database}`, {
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
    this.server = http.createServer(this.app)
    this.server.listen(port, function () {
      logger.log(`Now listening on port ${port}`, handlerTag)
    })
  }

  getServerInstance () {
    return this.server
  }

  closeConnection (done) {
    this.server.close()
    this.mongoose.connection.close(done)
  }
}

// This if statement checks if the module was require()'d or if it was run
// by node server.js. If we are not requiring it and are running it from the
// command line, we create a server instance and start listening for requests.
if (typeof module !== 'undefined' && !module.parent) {
  const server = new Server()
  server.openConnection()
}
// END server.js

module.exports = { Server }
