//	PROJECT: 		MEANserver
// 	Name: 			Rolando Javier
// 	File: 			www.js
// 	Date Created: 	January 15, 2018
// 	Last Modified: 	January 15, 2018
// 	Details:
// 					This file contains functions that perform custom outgoing web requests using the NodeJS https module. Used by server.js and any of its modules/sub-apps that need to perform an outgoing web request. Examples include: smci.js
//	Note: 			This file works in conjunction with logger.js to log various events that occur when using these APIs
// 	Dependencies:
// 					NodeJS v8.9.1
"use strict"

// Includes
var https = require("https");
var logger = require("./logger");		// import event log system



// Container
const www = {
	// Module Configuration Functions/Settings
	"config": {},

	// HTTPS request wrappers
	"https": {}
};



// BEGIN Member Functions
/*
	@function 	config.silence
	@parameter 	n/a
	@returns 	n/a
	@details 	This function silences all logger logs coming from this module
*/
www.config.silence = function () {
	logger.logToConsole = false;
}



/*
	@function 	https.get
	@parameter 	options - the JSON object expected by the NodeJS https.get() api
	@parameter 	callback - a callback function to run after the request is issued. It is passed two arguments:
					"response" - the response object resulting from the request
					"error" - any error(s) that occurred while processing the request
				The values of the "error" and "response" arguments vary depending on the result of the request.
				On success: "error" is null, and "response" is a JSON response object returned from the request.
				On failure: "error" is the object returned by the NodeJS https.get() function's "error" event, and "response" is null.
	@parameter 	(Optional) handlerTag - a string used to indicate the function issuing the request. See the logger.log() "src" option for more details on this parameter
	@returns 	n/a
	@details 	This function performs a GET request using the NodeJS https.get(), but customized for use with the server.js MEANserver
*/
www.https.get = function (options, callback, handlerTag) {
	var loggerOptions = (typeof handlerTag === "string") ? {"src": handlerTag} : {"src": "www/https.get"};

	// Perform parameter checks
	if (typeof callback !== "function") {
		logger.log("Callback is not a function!", loggerOptions);
	} else {
		// Perform GET request
		https.get(options, function (response) {
			response.setEncoding("utf8");
			response.on("data", function (data) {
				logger.log("A response was returned...", loggerOptions);
				try {
					callback(JSON.parse(data.toString()), null);
				} catch (e) {
					logger.log(`JSON parsing failed: ${e}`, loggerOptions);
					callback(null, e);
				}
			});
			response.on("end", function () {
				logger.log(`Response ended with code ${response.statusCode}...`, loggerOptions);
			});
		}).on("error", function (err) {
			logger.log(`HTTPS GET failed: ${err}`, loggerOptions);
			callback(null, err);
		}).end();
	}
}
// END Member Functions

module.exports = www;
// END www.js
