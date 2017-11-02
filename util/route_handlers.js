// PROJECT: 		MEANserver
// Name: 			Rolando Javier
// File: 			route_handlers.js
// Date Created: 	October 26, 2017
// Last Modified: 	October 26, 2017
// Details:
//				 	This file abstracts all route handler functions to be used by server.js. The server.js file
//				 	takes these and places them to their desired endpoints. This frees up the server code from
//				 	the clutter introduced by placing all route handlers in server.js
// Dependencies:
// 					JQuery
// 					ExpressJS

"use strict"

var settings = require("./settings");

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

// MongoDB client
var mongo = require("mongodb").MongoClient;
mongo.connect("mongodb://localhost:27017/testdb", function (err, db) {
	console.log((err) ? "Could not connect to Mongo" : "Connected to Mongo");
	console.log(err);
});



// BEGIN Handler Functions
/*	
	@function	rootHandler
	@parameter	request - the web request object provided by express.js
	@parameter	response - the web response object provided by express.js
	@returns	n/a
	@details 	This function handles all requests for the server root (i.e. "/"). Used on a GET request
*/
handle_map.rootHandler = function (request, response) {			// GET request on root dir (login page-> index.html)
	response.set("Content-Type", "text/html");
	response.sendFile("index.html", options, function (error) {
		if (error) {
			console.log(error);
			response.status(500).end();
		} else {
			console.log(`Sent index.html to ${settings.port}`);
			response.end();
		}
	});
};

/*
	@function	loginHandler
	@parameter	request - the web request object provided by express.js
	@parameter	response - the web response object provided by express.js
	@returns	n/a
	@details 	This function handles login endpoint requests (i.e. for login). Used on a POST request
*/
handle_map.loginHandler = function (request, response) {			// POST request: RESTful login
	console.log(`Login request ${request.params.id} from ${request.ip}`);
	console.log(request);
	response.set("Content-Type", "text/javascript");
	response.sendFile("js/index.js", options, function (error) {
		if (error) {
			console.log(error);
			response.status(500).end();
		} else {
			console.log(`Login successful for client on ${settings.port}`);
			response.end();
		}
	});
};
/* END Handler Functions */



module.exports = handle_map;
// END route_handlers.js 