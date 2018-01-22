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



// Container (Singleton)
const www = {
	// Module Configuration Functions/Settings
	"config": {
		"logVerbosely": false
	},

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
	@function 	config.verbose
	@parameter 	n/a
	@returns 	n/a
	@details 	This function forces verbose logging of all transactions, INCLUDING web request content
	@warning 	Due to the sensitivity of material that can be exchanged through web requests, this method will make all web transactions insecure, since reponses will be recorded in the logger log files. Use this function only for debugging purposes!
*/
www.config.verbose = function () {
	www.config.logVerbosely = true;
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
	@parameter 	(Optional) handlerName - a string used to indicate the function issuing the request. See the logger.log() "src" option for more details on this parameter
	@returns 	n/a
	@details 	This function performs a GET request using the NodeJS https.get() api, customized for use with the server.js MEANserver
*/
www.https.get = function (options, callback, handlerName) {
	var loggerOptions = (typeof handlerName === "string") ? {"src": handlerName} : {"src": "www/https.get"};
	var responseData = null;	// will fill as data is received
	var responseError = null;

	// Perform parameter checks
	if (typeof callback !== "function") {
		logger.log("Callback is not a function!", loggerOptions);
	} else {
		// Perform GET request
		https.get(options, function (response) {
			response.setEncoding("utf8");
			response.on("data", function (data) {
				logger.log("A response was returned...", loggerOptions);
				
				// Verbose logging
				if (www.config.logVerbosely) {
					logger.log(`Raw Data: ${data.toString()}`,loggerOptions);
				}

				// Handle acquisition of partial data
				if (responseData === null) {
					responseData = data;
				} else {
					responseData += data;
				}
			});
			response.on("end", function () {
				logger.log(`Response ended with code ${response.statusCode}...`, loggerOptions);

				// Data Conversion to JSON
				try {
					responseData = JSON.parse(responseData);
				} catch (e) {
					logger.log(`JSON parsing failed: ${e}`, loggerOptions);
					responseError = e;
				}

				// Pass to callback
				if (typeof callback === "function") {
					callback((responseData === null) ? response : responseData, responseError);
				}
			});
		}).on("error", function (err) {
			logger.log(`HTTPS GET failed: ${err}`, loggerOptions);
			callback(null, err);
		}).end();
	}
};

/*
	@function 	https.post
	@parameter 	options - the JSON object expected by the NodeJS https.request() api
	@parameter 	requestBody - the reqeust body to send with the request. If no request body is to be sent, "null" can be passed instead.
	@parameter 	callback - a callback function to run after the request is issued. It is passed two arguments:
					"response" - the response object resulting from the request
					"error" - any error(s) that occurred while processing the request
				The values of the "error" and "response" arguments vary depending on the result of the request.
				On success: "error" is null, and "response" is the JSON response object returned from the request.
				On failure: "error" is the object returned by the NodeJS https.request() function's "error" event, and "response" is null.
	@parameter 	(Optional) handlerName - a string used to indicate the function issuing the request. See the logger.log() "src" option for more details on this parameter
	@returns 	n/a
	@details 	This function performs a POST request using the NodeJS https.request() api, customized for use with the server.js MEANserver
*/
www.https.post = function (options, requestBody, callback, handlerName) {
	var loggerOptions = (typeof handlerName === "string") ? {"src": handlerName} : {"src": "www/https.post"};
	var responseData = null;
	var responseError = null;

	var requestObj = https.request(options, function (response) {
		response.setEncoding("utf8");
		response.on("data", function (data) {
			logger.log("A response was returned...", loggerOptions);
			
			// Verbose logging
			if (www.config.logVerbosely) {
				logger.log(`Raw Data: ${data.toString()}`, loggerOptions);
			}

			// RFC7231: expect response data on code 200
			// Handle acquisition of partial data
			if (responseData === null) {
				responseData = data;
			} else {
				responseData += data;
			}
		});
		response.on("end", function () {
			logger.log(`Response ended with code ${response.statusCode}...`, loggerOptions);

			// Data Conversion to JSON
			try {
				// console.log(responseData);	// debug
				responseData = JSON.parse(responseData);
			} catch (e) {
				logger.log(`JSON parsing failed: ${e}`, loggerOptions);
				responseError = e;
			}

			// Pass to callback
			if (typeof callback === "function") {
				callback((responseData === null) ? response : responseData, responseError);
			}
		});
	});
	requestObj.on("error", function (err) {
		logger.log(`HTTPS POST failed: ${err}`, handlerName);
		if (typeof callback === "function") {
			callback(null, err);
		}
	});
	if (typeof requestBody !== null) {
		requestObj.write(JSON.stringify(requestBody));
	}
	requestObj.end();
};

/*
	@function 	https.patch
	@parameter 	options - the JSON object expected by the NodeJS https.request() api
	@parameter 	requestBody - the reqeust body to send with the request. If no request body is to be sent, "null" can be passed instead.
	@parameter 	callback - a callback function to run after the request is issued. It is passed two arguments:
					"response" - the response object resulting from the request
					"error" - any error(s) that occurred while processing the request
				The values of the "error" and "response" arguments vary depending on the result of the request.
				On success: "error" is null, and "response" is the JSON response object returned from the request.
				On failure: "error" is the object returned by the NodeJS https.request() function's "error" event, and "response" is null.
	@parameter 	(Optional) handlerName - a string used to indicate the function issuing the request. See the logger.log() "src" option for more details on this parameter
	@returns 	n/a
	@details 	This function performs a PATCH request using the NodeJS https.request() api, customized for use with the server.js MEANserver
*/
www.https.patch = function (options, requestBody, callback, handlerName) {
	var loggerOptions = (typeof handlerName === "string") ? {"src": handlerName} : {"src": "www/https.patch"};
	var responseData = null;
	var responseError = null;

	var requestObj = https.request(options, function (response) {
		response.setEncoding("utf8");
		response.on("data", function (data) {
			logger.log("A response was returned...", loggerOptions);

			// Verbose logging
			if (www.config.logVerbosely) {
				logger.log(`Raw Data: ${data.toString()}`,loggerOptions);
			}

			// Handle acquisition of partial data
			if (responseData === null) {
				responseData = data;
			} else {
				responseData += data;
			}
		});
		response.on("end", function () {
			logger.log(`Response ended with code ${response.statusCode}...`, loggerOptions);
			
			// Data Conversion to JSON
			try {
				responseData = JSON.parse(responseData);
			} catch (e) {
				logger.log(`JSON parsing failed: ${e}`, loggerOptions);
				responseError = e;
			}

			// Pass to callback
			if (typeof callback === "function") {
				callback((responseData === null) ? response : responseData, responseError);
			}
		});
	});
	requestObj.on("error", function (err) {
		logger.log(`HTTPS PATCH failed: ${err}`, loggerOptions);
		if (typeof callback === "function") {
			callback(null, err);
		}
	});
	if (typeof requestBody !== null) {
		requestObj.write(JSON.stringify(requestBody));
	}
	requestObj.end();
};

/*
	@function 	https.delete
	@parameter 	options - the JSON object expected by the NodeJS https.request() api
	@parameter 	callback - a callback function to run after the request is issued. It is passed two arguments:
					"response" - the response object resulting from the request
					"error" - any error(s) that occurred while processing the request
				The values of the "error" and "response" arguments vary depending on the result of the request.
				On success: "error" is null, and "response" is the JSON response object returned from the request. This can take any of the three forms associated with the 200/202/204 status codes described in the DELETE description in RFC7231 Section 4.3.
				On failure: "error" is the object returned by the NodeJS https.request() function's "error" event, and "response" is null.
	@parameter 	(Optional) handlerName - a string used to indicate the function issuing the request. See the logger.log() "src" option for more details on this parameter
	@returns 	n/a
	@details 	This function performs a DELETE request using the NodeJS https.request() api, customized for use with the server.js MEANserver
*/
www.https.delete = function (options, callback, handlerName) {
	var loggerOptions = (typeof handlerName === "string") ? {"src": handlerName} : {"src": "www/https.delete"};
	var responseData = null;
	var responseError = null;

	var requestObj = https.request(options, function (response) {
		response.setEncoding("utf8");
		response.on("data", function (data) {
			logger.log("A response was returned...", loggerOptions);

			// Verbose logging
			if (www.config.logVerbosely) {
				logger.log(`Raw Data: ${data.toString()}`,loggerOptions);
			}

			// RFC7231: expect response data on code 200
			// Handle acquisition of partial data
			if (responseData === null) {
				responseData = data;
			} else {
				responseData += data;
			}
		});
		response.on("end", function () {
			logger.log(`Response ended with code ${response.statusCode}...`, loggerOptions);

			// Data Conversion to JSON
			try {
				responseData = JSON.parse(responseData);
			} catch (e) {
				logger.log(`JSON parsing failed: ${e}`, loggerOptions);
				responseError = e;
			}

			// Pass to callback
			if (typeof callback === "function") {
				callback((responseData === null) ? response : responseData, responseError);
			}
		});
	});
	requestObj.on("error", function (err) {
		logger.log(`HTTPS DELETE failed: ${err}`, loggerOptions);
		if (typeof callback === "function") {
			callback(null, err);
		}
	});
	requestObj.end();
};
// END Member Functions

module.exports = www;
// END www.js
