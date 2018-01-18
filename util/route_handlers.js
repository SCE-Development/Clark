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



// BEGIN test
var smci = require("../smci/smci");
smci.api.getRoot(null, function (response, error) {
	if (error === null) {
		console.log("Test Result:", (typeof response !== "string") ? JSON.stringify(response) : response);
	} else {
		console.log("Test Result:", "ERROR");
	}
});
// smci.campaignFolders.createFolder("test_folder", function (response, error) {
// 	if (error === null) {
// 		console.log("Test Result:", (typeof response !== "string") ? JSON.stringify(response) : response);
// 	} else {
// 		console.log("Test Result:", "ERROR");
// 	}
// });
// smci.campaignFolders.getFullList(null, function (response, error) {
// 	if (error === null) {
// 		console.log("Test Result:", (typeof response !== "string") ? JSON.stringify(response) : response);
// 	} else {
// 		console.log("Test Result:", "ERROR");
// 	}
// });
// smci.campaignFolders.getFolder("0a21e44b5b", null, function (response, error) {
// 	if (error === null) {
// 		console.log("Test Result:", (typeof response !== "string") ? JSON.stringify(response) : response);
// 	} else {
// 		console.log("Test Result:", "ERROR");
// 	}
// });
// smci.campaignFolders.editFolder("0a21e44b5b", "test_folder_with_new_name", function (response, error) {
// 	if (error === null) {
// 		console.log("Test Result:", (typeof response !== "string") ? JSON.stringify(response) : response);
// 	} else {
// 		console.log("Test Result:", "ERROR");
// 	}
// });
// smci.campaignFolders.deleteFolder("0a21e44b5b", function (response, error) {
// 	if (error === null) {
// 		console.log("Test Result:", (typeof response !== "string") ? JSON.stringify(response) : response);
// 	} else {
// 		console.log("Test Result:", "ERROR");
// 	}
// });
console.log(`Test Completed`);
// END test



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
// END Handler Functions



module.exports = handle_map;
// END route_handlers.js 