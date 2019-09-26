// PROJECT:   Core-v4
//  Name:    Rolando Javier
//  File:    response_formats.js
//  Date Created:  September 8, 2018
//  Last Modified:  September 8, 2018
//  Details:
//      This file contains a general response packet format for HTTP status codes that
//     are not 5XX codes. New APIs should strive to use this response packet as much
//     as possible
//  Dependencies:
//      JavaScript ECMAScript 6

'use strict'

// Include
const settings = require('./settings')
const logger = require(`${settings.util}/logger`)

// Container (Singleton)
const responseFormats = {}

// BEGIN Members

// @member   templates
// @description  This object houses global response templates that standardize the way response
//     messages are sent back to clients.
responseFormats.templates = {
  // @template  general
  // @description  This template represents a basic response object used to respond to every
  //     result code. This is the default response template
  // @members   (boolean) success  A boolean representing the success of an operation
  //     (date) timestamp  A timestamp date object representing the time at
  //           which the response was sent
  //     (object) content  An object containing any data, messages, errors,
  //           etc. that an API endpoint wishes to send to a
  //           client.
  general: {
    success: false,
    timestamp: null,
    content: {}
  }
}

// END Members

// BEGIN Member Functions

// @function  asCommonStr()
// @description  This function generates a JSON string representation of a given template, or
//     the general template if none is specified.
// @parameters  (boolean) success   A boolean representing the success of an operation
//     (object) content   An object containing any data, messages, errors,
//            etc. that an API endpoint wishes to send to a
//            client.
//     (~string) templateName  The name of a template to send. Defaults to
//            "general".
//     (~object) misc    Any extra parameters to add to the response (in
//            case you use a template other than general). Data
//            given in this object is placed as the value of the
//            corresponding key from the selected template (if
//            the key exists in the template); otherwise, they
//            are added as members of the template's "misc"
//            object
responseFormats.asCommonStr = function (
  success,
  content,
  templateName = 'general',
  misc = {}
) {
  const handlerTag = { src: 'response_formats.asCommonStr' }
  let template = responseFormats.templates[templateName]

  // Check that the template name exists
  if (!Object.keys(this.templates).includes(templateName)) {
    logger.log(`Error: Unknown template "${templateName}"`, handlerTag)
  }

  // Generate a timestamp
  template.timestamp = new Date(Date.now())

  // Append the content to the response
  template.content = content

  // Append the success status to the reponse
  template.success = success

  // If there are any miscellaneous arguments
  const miscKeys = Object.keys(misc)
  const templateKeys = Object.keys(template)
  if (miscKeys.length > 0) {
    // Define the "misc" property only if it doesn't already exist
    template.misc = {}

    // Overwrite any members of "misc" to the template's root level IF and ONLY IF the member
    // key already exists in the template's root
    miscKeys.forEach(function (key) {
      // If key exists in the set of keys for the given template
      if (templateKeys.contains(key)) {
        // Overwrite the template key with the given value
        template[key] = misc[key]
      } else {
        // Else if the key doesn't exist at the template's root level, place it in misc
        template.misc[key] = misc[key]
      }
    })
  }

  // Attempt to stringify the JSON
  try {
    template = JSON.stringify(template)
  } catch (exception) {
    logger.log(`Error: Failed to stringify: ${exception}`, handlerTag)
  }

  return template
}

// END Member Functions

Object.freeze(responseFormats)
module.exports = responseFormats
// END response_formats.js
