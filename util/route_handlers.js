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
var fs = require("fs");
var https = require("https");
var crypt = require("./cryptic");					// import custom sce crypto wrappers
var settings = require("./settings");				// import server system settings
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

/*
	@function 	adminPortalHandler
	@parameter	request - the web request object provided by express.js
	@parameter	response - the web response object provided by express.js
	@returns	On success: gives the client core.html and a code 200
				On failure: gices the 
	@details 	This function handles all requests for the admin portal (i.e. "/core"). Used on a GET request
*/
handle_map.adminPortalHandler = function (request, response) {
	var handlerTag = {"src": "adminPortalHandler"};
	logger.log(`Admin portal requested from client @ ip ${request.ip}`, handlerTag);

	response.set("Content-Type", "text/html");
	response.sendFile("core/core.html", options, function (error) {
		if (error) {
			logger.log(error, handlerTag);
			response.status(500).send(ef.asCommonStr(ef.struct.coreErr, error)).end();
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
	@returns 	On success: a code 200 with a redirection header and a session ID to validate all server operations during the session.
				On request failure: a code 500 and an error message detailing the error
				On credential validation failure: a code 499 and an error message detailing the error (i.e. a commonErrorObject from error_formats.js)
				On incorrect credentials: a code 200 and an error message detailing the error (i.e. a commonErrorObject from error_formats.js)
	@details 	This function is used to submit credentials from the administrator login portal to the server for processing. If login credentials are correct, the client is then passed a session id to use in all further server correspondence. Then, a redirection occurrs to the admin dashboard
*/
handle_map.adminLoginHandler = function (request, response) {
	var handlerTag = {"src": "adminLoginHandler"};
	var requestBody = {
		"collection": "Member",
		"search": {
			"userName": request.body.user,
			"passWord": crypt.hashPwd(request.body.user, request.body.pwd)
		}
	};
	var options = {
		"hostname": "localhost",
		"path": "/mdbi/search/documents",
		"method": "POST",
		"agent": ssl_user_agent,
		"headers": {
			"Content-Type": "application/json",
			"Content-Length": Buffer.byteLength(JSON.stringify(requestBody))
		}
	};

	// BEGIN debug
	// logger.log(`Probe: ${(typeof requestBody === "object") ? JSON.stringify(requestBody) : requestBody}`, handlerTag);
	// response.status(200).send("ok").end();
	// return;
	// END debug

	logger.log(`Submitting admin credentials from client @ ip ${request.ip}`, handlerTag);
	response.set("Content-Type", "application/json");

	// Submit credentials to mdbi/search/documents and find all matches
	www.https.post(options, requestBody, function (reply, error) {
		var matchList = reply;	// is expected to be an array
		var matchFound = false;

		logger.log(`${matchList}`, handlerTag);
		if (error) {
			// Report any error
			var errStr = ef.asCommonStr(ef.struct.httpsPostFail, error);

			logger.log(`A request error occurred: ${error}`, handlerTag);
			response.send(errStr).status(500).end();
		} else {
			// Evaluate the database search results
			// logger.log(`Probe2: ${reply}`, handlerTag);	// debug
			if (matchList.length === 0) {	// i.e. no match was found
				var errStr = ef.asCommonStr(ef.struct.adminInvalid);
				
				logger.log(`Incorrect credentials`, handlerTag);
				response.send(errStr).status(499).end();
			} else if (matchList.length > 1) {	// i.e. multiple accounts were returned
				var errStr = ef.asCommonStr(ef.struct.adminAmbiguous);

				logger.log(`FATAL ERR: Ambiguous identity!`, handlerTag);
				response.send(errStr).status(499).end();
			} else {	// i.e. credentials returned one match
				// generate session id here
				var sessionID = crypt.hashSessionID(requestBody.search.userName);
				// submit session id to mongodb here
				// pass session id and client redirection headers here
				response.send(JSON.stringify({"sessionID": sessionID})).status(200).end();
			}
		}
	}, handlerTag.src);
};
// END Handler Functions



module.exports = handle_map;
// END route_handlers.js 