//	PROJECT: 		Core-v4
// 	Name: 			Rolando Javier
// 	File: 			error_formats.js
// 	Date Created: 	January 27, 2018
// 	Last Modified: 	February 12, 2018
// 	Details:
// 					This file contains a variety of error message formatting functions intended to "standardize" error handling across the entire Core-v4 project. Each one returns an error message or object, depending on the use-case (i.e. the error associated with the type of error message). By explicitly defining the format of error messages to be passed throughout the server, error messages will conform to a known structure both internally in the server and externally between the server and client(s).
// 	Dependencies:
// 					NodeJS v8.9.1 or above

"use strict";

// Includes
var settings = require("./settings");
var logger = require(`${settings.util}/logger`);



// Container (Singleton)
const error_formats = {};



// BEGIN members
/*
	@member 	struct
	@details 	This object is an alternate form to the error_formats.types member, and is intended for use with error_formats.asCommonStr().
*/
error_formats.struct = {
	"adminAmbiguous": {
		"name": "ADMIN_AMBIGUOUS",
		"msg": "Admin identity ambiguous"
	},
	"adminInvalid": {
		"name": "ADMIN_INVALID",
		"msg": "Invalid Admin Credentials"
	},
	"adminUnauthorized": {
		"name": "ADMIN_UNAUTHORIZED",
		"msg": "You Lack Authorization"
	},
	"coreErr": {
		"name": "CORE_ERROR",
		"msg": "An internal server error occurred"
	},
	"httpsDeleteFail": {
		"name": "HTTPS_DELETE_FAIL",
		"msg": "HTTPS DELETE failed"
	},
	"httpsGetFail": {
		"name": "HTTPS_GET_FAIL",
		"msg": "HTTPS GET failed"
	},
	"httpsPatchFail": {
		"name": "HTTPS_PATCH_FAIL",
		"msg": "HTTPS PATCH failed"
	},
	"httpsPostFail": {
		"name": "HTTPS_POST_FAIL",
		"msg": "HTTPS POST failed"
	},
	"httpsPutFail": {
		"name": "HTTPS_PUT_FAIL",
		"msg": "HTTPS PUT failed"
	},
	"invalidBody": {
		"name": "INVALID_BODY",
		"msg": "The submitted request body is invalid, incomplete, or incorrectly formatted"
	},
	"mdbiAccessDenied": {
		"name": "MDBI_ACCESS_DENIED",
		"msg": "You do not have access rights to the MDBI system"
	},
	"unexpectedValue": {
		"name": "UNEXPECTED_VAL",
		"msg": "An unexpected value was received"
	},
	"unknown": {
		"name": "UNKNOWN_ERROR",
		"msg": "An unknown error occurred"
	}
};

/*
	@member 	types
	@details 	This object contains a list of error messages attributed to common errors that occur with the server. Whenever possible, refrain from entering your own error type in error_formats.common() and use one of these, instead.
	@note 		This member will be deprecated soon
*/
error_formats.types = {
	"adminInvalid": "Invalid Admin Credentials",
	"coreErr": "Core v4 error",
	"httpsDeleteFail": "HTTPS DELETE failed",
	"httpsGetFail": "HTTPS GET failed",
	"httpsPatchFail": "HTTPS PATCH failed",
	"httpsPostFail": "HTTPS POST failed",
	"httpsPutFail": "HTTPS PUT failed",
	"unknown": "Unknown error"
};
// END members



// BEGIN member functions
/*
	@function 	asCommonStr
	@parameter 	typeObj - an object corresponding to one of error_formats.struct's members
	@parameter 	(optional) error - an error object or string to pass to the receiver
	@returns 	A string representation of the object returned from error_formats.common().
	@details 	This function is a short-hand form for "error_formats.common(type, msg, obj, true)". The key difference is that it directly uses objects from the error_formats.struct object instead of the error_formats.types object.
	@note 		If you want to relay an error that is not listed within error_formats.struct, use error_formats.common() instead.
*/
error_formats.asCommonStr = function (typeObj, error = null) {
	return error_formats.common(typeObj.name, typeObj.msg, error, true);
};

/*
	@function 	common
	@parameter 	type - a string defining the type of error
	@parameter	(optional) msg - a string message to relay to the receiver
	@parameter 	(optional) obj - an object to pass to the receiver. This is usually where you'd pass any internal error objects received from the system (i.e. JSON parse errors, any error objects returned from an external api like MailChimp, etc.)
	@parameter 	(optional) stringify - if true, will return the common error object as a JSON-stringified string
	@returns 	An object with the following format:
					{
						"etype": "error type",
						"emsg": "error message or description",
						"eobj": {
							// an error object
						}
					}
	@details 	This function returns a common error object as defined above. Used for all errors that are local to the server or are general/uncategorized.
*/
error_formats.common = function (type, msg = null, obj = null, stringify = false) {
	var handlerTag = {"src": "error_formats.common"};
	var commonErrorObject = null;

	// Format object
	if (typeof type === "string") {
		commonErrorObject = {
			"etype": type
		};
	}
	if (typeof msg === "string" && msg !== null) {
		commonErrorObject.emsg = msg;
	}
	if (obj !== null) {
		commonErrorObject.eobj = obj;
	}

	// Stringify object
	if (stringify) {
		try {
			commonErrorObject = JSON.stringify(commonErrorObject);
		} catch (e) {
			logger.log(`Failed to stringify: ${e}`, handlerTag);
		}
	}

	// BEGIN debug
	logger.log(`returning ${typeof commonErrorObject} ${commonErrorObject}`, handlerTag);
	// END debug
	return commonErrorObject;
}
// END member functions



Object.freeze(error_formats);



module.exports = error_formats;

// END error_formats.js
