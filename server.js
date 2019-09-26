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
const https = require('https')
const fs = require('fs')
const bodyParser = require('body-parser') // import POST request data parser
const settings = require('./util/settings') // import server system settings
const ssl = require(settings.security) // import https ssl certifications
const logger = require(`${settings.util}/logger`) // import event log system
// const handles = require(`${settings.util}/route_handlers`) // import URI endpoint handlers
let port = process.argv[2] // allow custom ports

/* Globals */
const handlerTag = { src: 'server' }
const sslSettings = {
  key: fs.readFileSync(ssl.prvkey),
  cert: fs.readFileSync(ssl.cert),
  passphrase: ssl.passphrase,
  requestCert: false,
  rejectUnauthorized: false
}

/* Initialize logging */
logger.log('Initializing...', handlerTag)

/* Create server instance */
const express = require('express')
const cors = require('cors')
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
// app.use(express.static(`${settings.root}/home`));  // location of html files
// app.use(express.static(`${settings.root}/home/css`)); // location of css files
// app.use(express.static(`${settings.root}/home/js`)); // location of js files
// app.use(express.static(`${settings.root}/core`));  // location of admin portal html
// app.use(express.static(`${settings.root}/core/css`)); // location of admin portal css
// app.use(express.static(`${settings.root}/core/js`)); // location of admin portal js
// app.use(express.static(`${settings.root}/core/components/profiler`)); // location of admin portal profiler component js
// app.use(express.static(`${settings.root}/core/components/doorcoder`)); // location of admin portal doorcoder component js
// app.use(express.static(`${settings.root}/core/components/membership_manager`)); // location of admin portal membership_manager component js
// app.use(express.static(`${settings.root}/../files`));   // added files folder to hold images and other media

/* Define Main Server Routes (RESTful)

 To create a new endpoint:
  - Select a URI to associate as the new endpoint (i.e. "routePath")
  - Define a handler function in util/route_handlers.js in a similar fashion the the others (i.e. "handlerFunc")
  - Place an app request here (i.e. "app.post([routePath], [handlerFunc])")
*/
logger.log('Routing server endpoints...', handlerTag)
const homeApp = require('./public/home/app/app.js')
app.use('/home', homeApp) // GET request of the main login page

/* Initialize SCE Core API sub-app */
const apiApp = require('./api/app/app.js')
app.use('/api', apiApp)

/* Initialize SCE Core Admin sub-app */
const coreAdminApp = require('./public/core/app/app.js')
app.use('/core', coreAdminApp)

/* Initialize MongoDB Test Page sub-app (will remove in production version) */
const testPageApp = require('./test/app')
app.use('/test', testPageApp) // use a subapp to handle test page requests via the "/test" endpoint

/* Initialize MongoDB Interface sub-app */
const mdbiApp = require('./mdbi/app')
app.use('/mdbi', mdbiApp) // use a subapp to handle database requests via the "/mdbi" endpoint

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
// app.listen(port, function () {
//  logger.log(`Now listening on port ${port}`, handlerTag);
// });
const server = https.createServer(sslSettings, app)
server.listen(port, function () {
  logger.log(`Now listening on port ${port}`, handlerTag)
})
// END server.js
