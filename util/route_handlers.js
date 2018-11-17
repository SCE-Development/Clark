// PROJECT: 		MEANserver
// Name: 			Rolando Javier
// File: 			route_handlers.js
// Date Created: 	October 26, 2017
// Last Modified: 	February 28, 2018
// Details:
//				 	This file abstracts all MAIN route handler functions to be used by server.js. The server.js file
//				 	takes these and places them to their desired endpoints. This frees up the server code from
//				 	the clutter introduced by placing all route handlers in server.js. All functions defined here
// 					are written to service requests for their corresponding endpoints (defined in server.js)
// Dependencies:
// 					JQuery v1.12.4
// 					ExpressJS 4.x
// 					body-parser (NPM middleware req'd by ExpressJS 4.x to acquire POST data parameters: "npm install --save body-parser")

"use strict"

// Includes
var fs = require("fs");
var https = require("https");
var crypt = require("./cryptic");					// import custom sce crypto wrappers
var settings = require("./settings");				// import server system settings
var dt = require("./datetimes");					// import datetime utilities
var ef = require("./error_formats");				// import error formatter
var logger = require(`${settings.util}/logger`);	// import event log system
var ssl = require(settings.security);				// import https ssl credentials
var www = require(`${settings.util}/www`);			// import custom https request wrappers
var assert = require("assert");

// Containers
var handle_map = {};		// A map of all endpoint handlers

// ExpressJS transaction options
var options = {
	root: settings.root,	// Server root directory (i.e. where server.js is located)
	dotfiles: "deny",
	headers: {
		"x-timestamp": Date.now(),
		"x-sent": true
	}
};

// Misc settings
// www.config.silence();
var ssl_user_agent = new https.Agent({
	"port": settings.port,
	"ca": fs.readFileSync(ssl.cert)
});



// BEGIN Handler Functions
/*
	@function 	generalError
	@parameter 	request - the web request object provided by express.js
	@parameter 	response - the web response object provided by express.js
	@returns 	On success: gives the client an error page and a code 200
				On failure: gives the client an error message and a code 500
	@details 	This function handles all general errors that occur
*/
handle_map.generalError = function (request, response) {
	var handlerTag = {"src": "generalError"};
	
	logger.log(`General error occurred. Sending error page to client @ ip ${request.ip}`, handlerTag);
	response.set("Content-Type", "text/html");
	response.sendFile("home/genErr.html", options, function (error) {
		if (error) {
			logger.log(error, handlerTag);
			response.status(500).send(ef.asCommonStr(ef.struct.coreErr, error)).end();
		} else {
			logger.log(`Sent genErr.html to ${settings.port}`, handlerTag);
			response.status(200).end();
		}
	});
};

/*	
	@function	rootHandler
	@parameter	request - the web request object provided by express.js
	@parameter	response - the web response object provided by express.js
	@returns	On success: gives the client the index.html page and a code 200
				On failure: gives the client a commonErrorObject and a code 500
	@details 	This function handles all requests for the server root (i.e. "/"). Used on a GET request
*/
handle_map.rootHandler = function (request, response) {			// GET request on root dir (login page-> index.html)
	var handlerTag = {"src": "rootHandler"};
	logger.log(`Server root requested from client @ ip ${request.ip}`, handlerTag);
	logger.log(request.toString(), handlerTag);
	response.set("Content-Type", "text/html");
	response.sendFile("index.html", options, function (error) {
		if (error) {
			logger.log(error, handlerTag);
			response.status(500).send(ef.asCommonStr(ef.struct.coreErr, error)).end();
		} else {
			logger.log(`Sent index.html to ${settings.port}`, handlerTag);
			response.status(200).end();
		}
	});
};
// END Handler Functions



module.exports = handle_map;
// END route_handlers.js 