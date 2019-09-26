// PROJECT:   Core-v4
//  Name:    Rolando Javier
//  File:    route_autoloader.js
//  Date Created:  September 11, 2018
//  Last Modified:  September 11, 2018
//  Details:
//      This file contains a convenient route autoloader for both APIs and web apps
//     within this project. Its primary use is to enable the loading of sub-apps
//     without the need for modification of core server files, enabling drag and drop
//     of API skeletons for automatic routing. Its intended use case is invocation
//     within the server.js file, and any other app.js file
//  Dependencies:
//     NodeJS v6.9.1
//      ExpressJS 4.x
//      body-parser (NPM middleware req'd by ExpressJS 4.x to acquire POST data parameters: "npm install --save body-parser")

'use strict'

// Includes
// const express = require('express')
const settings = require('./settings.js')
const ef = require(`${settings.util}/error_formats`)
const logger = require(`${settings.util}/logger`)
const fs = require('fs')

// Globals
// n/a

// Container
const autoloader = {}

// BEGIN autoloader logic

// @function  load
// @description  This function loads API routes. It has a contextual use and can be used in
//     two ways:
//      1.) If "routes" argument is omitted, this function searches the "dir"
//       directory for the first "/routes" folder and creates routes for each
//       "index.js" within the "/routes" folder. These routes would be assigned
//       to a parent route whose name matches its direct parent directory's
//       name. For example, if the route_autoloader is launched from
//       "/api/app/app.js" and finds the routing file "/api/app/routes/user/
//       index.js", it will map the file's routes to a parent URL path
//       "/api/user", a merger of both the app.js file's parent directory and
//       the index.js file's parent directory.
//      2.) If "routes" argument is given, this function uses the argument to
//       determine where the router files (i.e. "index.js" files) are found,
//       as well the parent URL path they will map to.
// @parameters  (object) app   The ExpressJS app object to map endpoints to. This
//           type of object is returned from a call to express().
//     (mixed) routes   1.) If "routes" is a string, it is assumed to be a
//           path to the directory containing "/routes" directory.
//           `.) If "routes" is a JSON array, it shall house the
//           collection of routes that will be mounted onto the
//           provided ExpressJS app object. Each member is an
//           object representing a set of routes to map to the
//           provided application. Each array member is an object
//           taking all of the following members:
//       (string) endpoint  The name of the route enpoint to associate
//             with the provided index file
//       (string) indexPath  The relative path to the desired "index.js"
//             router file which houses the endpoints for
//             this route
// @returns   (object) result   A JSON object representing the result of the auto-
//           loading operation. It has the following members
//       (number) total   The total number of modules that were loaded
//             successfully
//       (array) unloaded  An array of API routes that were not loaded
//             (i.e. the intended API route URL paths)
autoloader.load = function (app, routes) {
  const handlerTag = { src: 'route_autoloader.load' }

  // Perform different logic based on this function's use context
  switch (typeof routes) {
    // If specific routes were defined
    case 'object': {
      // Check if it's an array
      if (Array.isArray(routes)) {
        // If it's an array, simply load with the given directories
        routes.forEach(function (route) {
          autoloader.linkSingle(app, route.endpoint, route.indexPath)
        })
      } else {
        // If not, throw an error
        const msg = ef.asCommonStr(ef.struct.coreErr, {
          msg: "Autoloader cannot load an object unless it's an Array"
        })
        logger.log(msg, handlerTag)
        throw msg
      }
      break
    }

    // If a routes path string was defined
    case 'string': {
      // First, search the current directory for a "routes" folder
      const dirs = fs.readdirSync(routes)
      if (dirs.indexOf('routes') === -1) {
        // If the "routes directory" is not found, throw an error
        const msg = ef.asCommonStr(ef.struct.coreErr, {
          msg: 'Autoloader failed to find path for routes'
        })
        logger.log(msg, handlerTag)
        throw msg
      } else {
        // Otherwise, proceed to link routes to paths
        this.linkRoutes(app, `${routes}/routes`)
      }
      break
    }

    // If not one of the other types
    default: {
      // Throw an error
      const msg = ef.asCommonStr(ef.struct.coreErr, {
        msg: `Invalid argument type "${typeof routes}" in parameter "routes"`
      })
      logger.log(msg, handlerTag)
      throw msg
    }
  }
}

// @function  linkRoutes
// @description  This function links routes with index files located inside the given "/routes"
//     directory's sub-folders. If the directory contains a "autoloader_ignore.json"
//     file, it will ignore the directories specified in that file when routing.
// @parameters  (object) app  The ExpressJS app object to map endpoints to. This type of
//          object is returned from a call to express().
//     (string) path  A string denoting the path of the nearest "/routes"
//          directory. This is where the function begins its search
//          for "index.js" file directories
// @returns   (object) result  An object representing the outcome of the routing. It has
//          the following members:
//       (boolean) success A boolean representing the success of the routing
//            operation
//       (array) loaded  An array of obsjects representing all routes that
//            have been successfully linked
//       (array) failed  An array of objects representing all routes that
//            failed to link
autoloader.linkRoutes = function (app, path) {
  const handlerTag = { src: 'route_autoloader.linkRoutes' }

  // Begin by reading the directory names within the given "/routes" directory "path"
  const dirs = fs.readdirSync(path)
  let dirsToIgnore = false

  // Also acquire the list of directories to ignore, if any
  logger.log(`Linking routes in path "${path}"`, handlerTag)
  if (dirs.indexOf('autoloader_ignore.json') !== -1) {
    // Remove the autoloader file from the dir list
    // dirs.splice( dirs.indexOf( "autoloader_ignore.json" ), 1 );

    // Place a try-catch block to catch errors
    try {
      // If there is a "autoloader_ignore.json" file, load its contents
      const ignoreFile = fs.readFileSync(`${path}/autoloader_ignore.json`, {
        encoding: 'utf8'
      })

      // Store its contents in an array by converting to JSON
      dirsToIgnore = JSON.parse(ignoreFile).ignore
      logger.log('Ignoring "' + JSON.stringify(dirsToIgnore) + '"', handlerTag)
    } catch (exception) {
      // If something went wrong, throw an error
      const msg = ef.asCommonStr(ef.struct.coreErr, {
        exception: exception
      })
      logger.log(msg, handlerTag)
      throw msg
    }
  }

  // Filter out the dirs to ignore, if any
  if (Array.isArray(dirsToIgnore) && dirsToIgnore.length > 0) {
    // Traverse the dirs array in search of any directories to ignore
    dirs.forEach(function (dir, index) {
      // If the current dir is in the directories to ignore
      if (dirsToIgnore.indexOf(dir) !== -1) {
        // Remove it from the dir list
        dirs.splice(index, 1)
      }
    })
  }

  // Ensure that the only contents in the dir array are the names of directories (not files)
  dirs.forEach(function (element, index) {
    // Get information about this element
    const info = fs.statSync(`${path}/${element}`)

    // If this element is not a directory
    if (!info.isDirectory()) {
      // Remove it from dirs
      dirs.splice(index, 1)
    }
  })

  // Load each index file with its parent directory name as the endpoint name
  // logger.log( "dirs: " + JSON.stringify( dirs ), handlerTag ); // debug
  dirs.forEach(function (dir) {
    app.use(`/${dir}`, require(`${path}/${dir}/index.js`))
  })
}

// @function  linkSingle
// @description  This function links a single route explicitly, instead of searching for routes
//     within a specified directory. This funciton is useful for directly mapping a
//     route to a custom endpoint name instead of the default behavior where the
//     autoloader assumes the endpoint name is the name of an "index.js" file's
//     parent directory
// @parameters  (object) app  The ExpressJS app object to map endpoints to. This type of
//          object is returned from a call to express().
//     (string) endpoint The name of the route enpoint to associate with the
//          provided index file
//     (string) indexPath The path to the "index.js" whose routes will be linked to
//          the specified endpoint
// @returns   (object) result  A JSON object representing the outcome of the routing. It
//          has the following members:
//       (boolean) success A boolean representing the success of the routing
//            operation
//       (~object) response An error object if any error or exception occurred
//            Otherwise, a response object
autoloader.linkSingle = function (app, endpoint, indexPath) {
  const handlerTag = { src: 'route_autoloader.linkSingle' }
  let success = false
  let response = {}
  try {
    // Acquire the routes defined in the index file.
    logger.log(`Requiring route index "${indexPath}"`, handlerTag)
    const routes = require(indexPath)

    // Route the specified index path to the provided endpoint
    app.use(endpoint, routes)

    // Set a successful response
    success = true
    response.msg = 'Linked "' + indexPath + '" to endpoint "' + endpoint + '"'
    logger.log(response.msg, handlerTag)
  } catch (exception) {
    // If an exception occurred, return the exception
    response = JSON.parse(
      ef.asCommonStr(ef.struct.coreErr, {
        exception: exception
      })
    )
    logger.log(
      'Unable to route index "' +
        indexPath +
        '": ' +
        JSON.stringify(response.eobj.exception),
      handlerTag
    )
  }

  return {
    success: success,
    response: response
  }
}

// END autoloader logic

module.exports = autoloader
// END route_autoloader.js
