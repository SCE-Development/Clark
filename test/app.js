// PROJECT: 		MEANserver
// Name: 			Rolando Javier
// File: 			test/app.js
// Date Created: 	January 9, 2018
// Last Modified: 	January 9, 2018
// Details:
//				 	This file contains the Test Page sub-app that serves the MongoDB Test Interface Page. It is used by the main app in server.js.
// Dependencies:
// 					JQuery v1.12.4
// 					ExpressJS 4.x
// 					body-parser (NPM middleware req'd by ExpressJS 4.x to acquire POST data parameters: "npm install --save body-parser")

"use strict"

// Includes
var express = require("express");
var settings = require("../util/settings");			// import server system settings
var logger = require(`${settings.util}/logger`);	// import event log system
var bodyParser = require("body-parser");			// import POST request data parser
var testRoutes = require("./testRoutes");			// import mongodb test system routes

// Globals
var handlerTag = {"src": "testRouter"};



// Test Page App
logger.log(`Initializing test page...`, handlerTag);
var app = express();
app.use(bodyParser.json({			// support JSON-encoded request bodies
	strict: true
}));
app.use(bodyParser.urlencoded({		// support URL-encoded request bodies
	extended: true
}));



// Test Page Route
app.use("/", testRoutes);	// serves the MongoDB Test Interface page



module.exports = app;
// END test/app.js
