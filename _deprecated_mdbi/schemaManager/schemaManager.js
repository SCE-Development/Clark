// PROJECT:   RJS
//  Name:    Rolando Javier
//  File:    schemaManager.js
//  Date Created:  December ?, 2018
//  Last Modified:  December ?, 2018
//  Details:
//      This file contains software that provides constious functions and utilities for
//     the MDBI to manage collection schemas, enforce collection schema conformity
//     and manage the presence of MongoDB views.
//  Dependencies:
//      MongoDB v3.4+

'use strict' // allow use of JS Classes

// Includes
const fs = require('fs')
const settings = require('../../util/settings.js')
const logger = require(`${settings.util}/logger`)
const CollectionSchema = require('./class/mdbiCollectionSchema.js')

// BEGIN schema definition documentation
// @config   schema_config.json
// @description  This file contains a JSON object that configures constious settings for the
//     schema manager, including the default location to look for schemas, and ?
// @members   (object) config  A JSON object that contains configuration settings. It may
//          contain any of the following members:
//       (string) path  The path to the directory containing schema
//            description files. This path is must be a valid
//            path relative to the config file, itself
//     (~array) ignore  An array containing the names of schema description files
//          to ignore when loading schemas
// @note   See "mdbiCollectionSchema.js" for documentation describing how to format
//     schema description files
// @example
//     {
//      "config": {
//       "path": "./schemas"
//      },
//      "ignore": [ "schemaA.json" ]
//     }
// END schema definition documentation

// BEGIN class schemaManager
// @class   schemaManager
// @description  This class serves as a means for the MDBI (and virtually any other module) to
//     load schemas into memory for representation, modification, and creation
// @ctor args  (~string) path  A string representing a path to a directory containing a
//          schema_config.json file. If omitted, this defaults to the
//          same directory containing this file
class schemaManager {
  // ctor
  constructor (path = __dirname) {
    // Store the config file path here
    this.configFileDir = path

    // Store the config object here
    this.config = {}

    // Store list of loaded schema definitions here
    this.loaded = {}

    // Store the loaded schemas' mdbiCollectionSchema objects here
    this.schema = {}

    // TODO: Determine how to support MongoDB database views using the schema manager
  }
}

// @function  load()
// @description  This function searches in the designated schema directory (configured by the
//     "schema_config.json" file) for schema definition json files. Any files that
//     are found will have their schema definitions (see documentation located in
//     "class/mdbiCollectionSchema.js") loaded into memory, except for schema files
//     listed to be ignored (see schema_config.json documentation above).
// @parameters  n/a
// @returns   n/a
schemaManager.prototype.load = function () {
  // Set handler tag
  const handlerTag = { src: 'schemaManager.load()' }

  // Execute and catch any errors
  try {
    // Create a place to store a message of the result of the load
    let msg = 'Load Result:\n'

    // Load configuration file at the specified path
    logger.log(
      `Loading schema config "${this.configFileDir}/schema_config.json"...`,
      handlerTag
    )
    const obj = JSON.parse(
      fs.readFileSync(`${this.configFileDir}/schema_config.json`, {
        encoding: 'utf8'
      })
    )
    this.config = typeof obj.config === 'undefined' ? {} : obj.config
    this.ignore = typeof obj.ignore === 'undefined' ? [] : obj.ignore

    // Then, acquire schema definition filenames from the specified path
    logger.log(
      `Loading schema descriptions from "${this.configFileDir}/${this.config.path}"...`,
      handlerTag
    )
    if (this.config.path) {
      // Acquire schema definition filenames
      let schemaFilenames = []
      schemaFilenames = fs.readdirSync(
        `${this.configFileDir}/${this.config.path}`,
        {
          encoding: 'utf8'
        }
      )
      logger.log(`Found files ${schemaFilenames}...`, handlerTag)

      // Traverse the list of ignores
      this.ignore.forEach(function (fileToIgnore) {
        // Check if this file is in the schema filename list
        if (schemaFilenames.includes(fileToIgnore)) {
          // If it is, remove it from the files to load
          logger.log(`Ignoreing ${fileToIgnore}...`, handlerTag)
          schemaFilenames.splice(schemaFilenames.indexOf(fileToIgnore), 1)
        }
      })

      // Traverse the list of schema definition files
      const me = this
      schemaFilenames.forEach(function (filename) {
        // Execute and catch any errors
        try {
          // Load the individual file's json schema definition
          const schema = JSON.parse(
            fs.readFileSync(
              `${me.configFileDir}/${me.config.path}/${filename}`,
              {
                encoding: 'utf8'
              }
            )
          )

          // Store the schema definition in memory
          me.loaded[schema.name] = schema

          // Create a new mdbiCollectionSchema object and store it in the schema list
          me.schema[schema.name] = new CollectionSchema(schema)

          // Update the result message
          msg += `${filename} load success\n`
        } catch (error) {
          // Append to the message the name of the schema file that failed to load, and
          // the reason it failed
          msg += `${filename} load failure: ${error}\n`
        }
      })

      // Log results
      logger.log(msg, handlerTag)
    } else {
      // Log error, but do not stop server execution
      logger.log(
        `Error: No path specified in config file "${this.configFileDir}/schema_config.json"`,
        handlerTag
      )
    }
  } catch (error) {
    // Log error
    logger.log(`Error: ${error}`, handlerTag)
  }
}

// @function  getSchemaDefinition()
// @description  This function gets the schema definition JSON with the given schema name
// @parameters  (string) name  The name of the schema to request
// @returns   (object) schemaDef If the schema was loaded, this function returns the loaded
//          schema JSON object. Otherwise, an empty object is returned
schemaManager.prototype.getSchemaDefinition = function (name) {
  // console.log( "TEST:", this.loaded[name] );
  return typeof this.loaded[name] === 'undefined' ? {} : this.loaded[name]
}

// @function  getSchemaDefinitions()
// @description  This function gets all collection schema definition JSONs that have been
//     successfully loaded
// @parameters  n/a
// @returns   (object) schemaDefs A JSON object whose keys are schema names and whose values
//          are collection schema objects
schemaManager.prototype.getSchemaDefinitions = function () {
  return this.loaded
}

// @function  getSchema()
// @description  This function retrieves the mdbiCollectionSchema object of the given name
// @parameters  (string) name  The name of the schema object to acquire
// @returns   (object) schemaObj The mdbiCollectionSchema object of the given "name", or an
//          empty object if the schema "name" did not exist or load
schemaManager.prototype.getSchema = function (name) {
  return typeof this.schema[name] === 'undefined' ? {} : this.schema[name]
}

// @function  getSchemas()
// @description  This function retrieves the mdbiCollectionSchema objects of all loaded schemas
// @parameters  n/a
// @returns   (object) schemaObjs A JSON object whose keys are schema names and whose values
//          are mdbiCollectionSchema objects that have been loaded
schemaManager.prototype.getSchemas = function (name) {
  return this.schema
}

// @function  getSchemaNames()
// @description  This function retrieves the names of all loaded schemas
// @parameters  n/a
// @returns   (array) names  An array of strings representing the names of loaded
//          schemas
schemaManager.prototype.getSchemaNames = function () {
  // Traverse through all loaded schemas
  const names = []
  const me = this
  Object.keys(this.schema).forEach(function (key) {
    // Record the name of this loaded schema object
    names.push(me.schema[key].name)
  })

  // Return array of loaded schema names
  return names
}

// @function  getPpks()
// @description  This function retrieves the preferred primary keys of all loaded schemas
// @parameters  n/a
// @returns   (object) ppks  A JSON object whose keys are schema names and whose values
//          are the ppk of their corresponding schema
schemaManager.prototype.getPpks = function () {
  // Traverse through the list of schema objects
  const ppks = {}
  const me = this
  Object.keys(this.schema).forEach(function (schemaName) {
    ppks[schemaName] = me.schema[schemaName].ppk
  })

  // Return list
  return ppks
}

// @function  checkConformity()
// @description  This function checks the conformity of a JSON object to the schema name. This
//     function does this by forwarding the conformity check to the appropriate mdbi
//     collection schema object's "checkConformity()" function.
// @parameters  (string) name  The name of the schema to call
//     (object) item  The JSON object to check
// @returns   (boolean) conforms A boolean representing whether "item" conforms to the
//          "schema". If the schema doesn't exist, or if it failed to
//          load, this defaults to false
schemaManager.prototype.checkConformity = function (name, item) {
  // Check if the schema exists; check conformity
  let conforms = false
  if (typeof this.schema[name] !== 'undefined') {
    conforms = this.schema[name].checkConformity(item)
  }

  // Return the result
  return conforms
}
// END class schemaManager

module.exports = schemaManager
// END schemaManager.js
