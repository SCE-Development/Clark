// PROJECT: 		MEANserver
// Name: 			Rolando Javier
// File: 			route_handlers.js
// Date Created: 	October 26, 2017
// Last Modified: 	January 9, 2018
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
var settings = require("./settings");				// import server system settings
var logger = require(`${settings.util}/logger`);	// import event log system
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



// BEGIN Handler Functions
/*	
	@function	rootHandler
	@parameter	request - the web request object provided by express.js
	@parameter	response - the web response object provided by express.js
	@returns	n/a
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
			response.status(500).end();
		} else {
			logger.log(`Sent index.html to ${settings.port}`, handlerTag);
			response.status(200).end();
		}
	});
};

/*
	@function 	adminPortalHandler
	@parameter	request - the web request object provided by express.js
	@parameter	response - the web response object provided by express.js
	@returns	n/a
	@details 	This function handles all requests for the admin portal (i.e. "/core"). Used on a GET request
*/
handle_map.adminPortalHandler = function (request, response) {
	var handlerTag = {"src": "adminPortalHandler"};
	logger.log(`Admin portal requested from client @ ip ${request.ip}`, handlerTag);

	response.set("Content-Type", "text/html");
	response.sendFile("core.html", options, function (error) {
		if (error) {
			logger.log(error, handlerTag);
			response.status(500).end();
		} else {
			logger.log(`Sent admin portal to ${settings.port}`, handlerTag);
			response.status(200).end();
		}
	});
};

/*
	@function 	adminLoginHandler
	@parameter 	request - the web request object provided by express.js
	@parameter 	response - the web response object provided by express.js
	@returns 	On success: a code 200 with a redirection header and a session ID to validate all server operations during the session. On failure: a code 500 an error message detailing the error
	@details 	This function is used to submit credentials from the administrator login portal to the server for processing. If login credentials are correct, the client is then passed a session id to use in all further server correspondence. Then, a redirection occurrs to the admin dashboard
*/
handle_map.adminLoginHandler = function (request, response) {
	console.log(`Request: ${(typeof request.body === "object") ? JSON.stringify(request.body) : request.body}`);
	response.status(200).send("ok").end();
	return;

	var handlerTag = {"src": "adminLoginHandler"};
	var options = {
		"hostname": "localhost",
		"path": "/mdbi",
		"method": "POST",
		"headers": {
			"Content-Type": "application/json",
			"Content-Length": Buffer.byteLength(JSON.stringify(request.body))
		}
	};

	logger.log(`Submitting admin credentials from client @ ip ${request.ip}`, handlerTag);
	response.set("Content-Type", "application/json");
	www.https.post(options, request.body, function (reply, error) {
		var msg = (typeof reply === "object") ? JSON.stringify(reply) : reply;
		if (error) {
			logger.log(`An error occurred: ${error}`, handlerTag);
			response.status(500).send(error).end();
		} else {
			logger.log(`Reply: ${msg}`, handlerTag);
			response.status(200).end();
		}
	}, handlerTag.src);
};
// END Handler Functions



module.exports = handle_map;
// END route_handlers.js 