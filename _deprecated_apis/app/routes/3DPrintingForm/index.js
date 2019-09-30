// PROJECT: Core-v4
// Name: Thai Quach
// File: 3DPF API
// Date Created: 4/20/2019
// Last Modified: 4/20/2019
// Details:
// This file contains routing logic to service all routes requested under the the
// "[endpoint]" endpoint (a.k.a. the [moduleName] Module)
// Dependencies:
// [Dependencies]

'use strict'

// Includes (include as many as you need; the bare essentials are included here)
const express = require('express')
// const https = require('https')
// const fs = require('fs')
const router = express.Router()
const settings = require('../../../../util/settings') // import server system settings
const al = require(`${settings.util}/api_legend.js`) // import API Documentation Module
// let au = require(`${settings.util}/api_util.js`) // import API Utility Functions
// let dt = require(`${settings.util}/datetimes`); // import datetime utilities
const ef = require(`${settings.util}/error_formats`) // import error formatter
// let crypt = require(`${settings.util}/cryptic`) // import custom sce crypto wrappers
// const ssl = require(settings.security) // import https ssl credentials
const credentials = require(settings.credentials) // import server system credentials
const www = require(`${settings.util}/www`) // import custom https request wrappers
const logger = require(`${settings.util}/logger`) // import event log system
const rf = require(`${settings.util}/response_formats`) // import response formatter
// let db = require('mongodb')

// Required Endpoint Options
// let options = {
//   root: settings.root, // Server root directory (i.e. where server.js is located)
//   dotfiles: 'deny',
//   headers: {
//     'x-timestamp': Date.now(),
//     'x-sent': true
//   }
// }

// const sslUserAgent = new https.Agent({
//   port: settings.port,
//   ca: fs.readFileSync(ssl.cert)
// })

// Example API Documentation Arguments

const api = al.createLegend(
  '3D Printing Form',
  'API for the 3D Printing Form',
  router // reference to the router object
)
const apiInfo = {
  args: {},
  rval: {}
}

// BEGIN [Module] Routes

// Example API route
apiInfo.args.example = [
  {
    name: 'API argument #1',
    type: '~string', // "~" = optional
    desc: 'An optional string argument for this API'
  }
]
apiInfo.rval.example = [
  {
    condition: 'On success',
    desc: 'This function returns true'
  },
  {
    condition: 'On failure',
    desc: 'This function returns false'
  }
]

// api routing for POST request
api.register(
  'Submit',
  'POST',
  '/submit',
  'This endpoint recieve 3D printing forms' +
    'and registers the requests in the database at PrintingForm3D collection.',
  apiInfo.args.submit,
  apiInfo.rval.submit,
  function (request, response) {
    // src:  api / api folder name / register's parameter
    const handlerTag = { src: '(get) /api/3DPrintingForm/submit' }
    response.set('Content-Type', 'application/json')

    // Attempt to process 3D form's information
    try {
      const body = request.body
      // let requiredFields = [
      //   'name',
      //   'color',
      //   'projectType',
      //   'projectLink',
      //   'projectContact',
      //   'projectComments'
      // ]

      // Commit application to PrintingForm3D database
      const requestBody = {
        accessToken: credentials.mdbi.accessToken,
        collection: 'PrintingFormFor3DPrinting',

        // Left : Right
        // Left: from 3D Printing Form schema
        // Right: api
        data: {
          name: body.name,
          color: body.color,
          projectType: body.projectType,
          projectLink: body.url,
          projectContact: body.contact,
          projectComments: body.comment,
          progress: body.progress,
          date: body.date
        }
      }

      // Post Request, followed git documentation
      const requestOptions = {
        hostname: 'localhost',
        path: '/mdbi/write',
        method: 'POST',
        // agent: sslUserAgent,
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(JSON.stringify(requestBody))
        }
      }

      // Response
      www.https.post(requestOptions, requestBody, function (reply, error) {
        // Check for errors
        if (error) {
          // Report error
          const errStr = ef.asCommonStr(ef.struct.httpsPostFail, error)
          logger.log(errStr, handlerTag)
          response
            .status(500)
            .send(errStr)
            .end()
        } else {
          // Send response back
          const data = rf.asCommonStr(
            true,
            'Your application has been submitted. We will contact you when ready.'
          )
          logger.log('Successfully Submit Printing Form', handlerTag)
          response
            .status(200)
            .send(data)
            .end()
        }
      })
    } catch (exception) {
      // Report exception
      const errStr = ef.asCommonStr(ef.struct.coreErr, { exception: exception })
      logger.log(errStr, handlerTag)
      response
        .status(500)
        .send(errStr)
        .end()
    }
  }
)

// END [Module] Routes

/// ///////GET Request
api.register(
  'Get 3D Printing Info',
  'GET',
  '/GetForm',
  'This endpoint send back the 3D Printing Form in json.',
  apiInfo.args.D3A,
  apiInfo.rval.D3R,
  function (request, response) {
    const handlerTag = { src: '(get) /api/3DPrintingForm/GetForm' }
    response.set('Content-Type', 'application/json')

    try {
      const requestBody = {
        accessToken: credentials.mdbi.accessToken,
        collection: 'PrintingFormFor3DPrinting'
      }
      const requestOptions = {
        hostname: 'localhost',
        path: '/mdbi/search/documents',
        method: 'POST',
        // agent: sslUserAgent,
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(JSON.stringify(requestBody))
        }
      }
      www.https.post(requestOptions, requestBody, function (reply, error) {
        // Check for errors
        if (error) {
          // Report error
          const errStr = ef.asCommonStr(ef.struct.httpsPostFail, error)
          logger.log(errStr, handlerTag)
          response
            .status(500)
            .send(errStr)
            .end()
        } else {
          // Send response back
          // let data = "ok?"
          response
            .status(200)
            .send(reply)
            .end()
        }
      })
    } catch (exception) {
      // Report exception
      const errStr = ef.asCommonStr(ef.struct.coreErr, { exception: exception })
      logger.log(errStr, handlerTag)
      response
        .status(500)
        .send(errStr)
        .end()
    }
  }
)

/// ///////DELETE Request
api.register(
  'Get 3D Printing Info',
  'DELETE',
  '/Delete3DForm',
  'This endpoint delete the data in mongo.',
  function (request, response) {
    const handlerTag = { src: '(get) /api/3DPrintingForm/Delete3DForm' }
    response.set('Content-Type', 'application/json')

    try {
      // Initiate a search for the given username in the user database
      const requestBody = {
        accessToken: credentials.mdbi.accessToken,
        collection: 'PrintingFormFor3DPrinting',
        search: { _id: '5d7d72c5c022f81c18710447' }
      }
      const requestOptions = {
        hostname: 'localhost',
        path: '/mdbi/delete/document',
        method: 'DELETE',
        // agent: sslUserAgent,
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(JSON.stringify(requestBody))
        }
      }
      www.https.post(requestOptions, requestBody, function (reply, error) {
        // Check for errors
        if (error) {
          // Report error
          const errStr = ef.asCommonStr(ef.struct.httpsPostFail, error)
          logger.log(errStr, handlerTag)
          response
            .status(500)
            .send(errStr)
            .end()
        } else {
          // Send response back
          // let data = "ok?"
          response
            .status(200)
            .send(reply)
            .end()
        }
      })
    } catch (exception) {
      // Report exception
      const errStr = ef.asCommonStr(ef.struct.coreErr, { exception: exception })
      logger.log(errStr, handlerTag)
      response
        .status(500)
        .send(errStr)
        .end()
    }
  }
)

module.exports = router
// END [filename]
