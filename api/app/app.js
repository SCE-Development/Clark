//	PROJECT: 		Core-v4
// 	Name: 			Rolando Javier
// 	File: 			api/app/app.js
// 	Date Created: 	February 2, 2018
// 	Last Modified: 	February 2, 2018
// 	Details:
// 					This file contains the SCE Core Admin sub-app used by SCE officers and administrators to perform administrative tasks with SCE. It is used by the main app in server.js
// 	Dependencies:
// 					ExpressJS 4.x
// 					body-parser (NPM middleware req'd by ExpressJS 4.x to acquire POST data parameters: "npm install --save body-parser")

"use strict"

// Includes
var express = require( "express" );
var settings = require( "../../util/settings" );	// import server system settings
var logger = require( `${settings.util}/logger` );	// import event log system
var bodyParser = require( "body-parser" );			// import POST request data parser
var abilityRoutes = require( "./routes/ability" );	// import SCE Core-v4 API routes
// TODO: Add new routes here

// Globals
var handlerTag = { "src": "apiRouter" };



// API App
logger.log( `Initializing SCE Core-v4 API...`, handlerTag );
var app = express();
app.use(bodyParser.json({			// support JSON-encoded request bodies
	strict: true
}));
app.use(bodyParser.urlencoded({		// support URL-encoded request bodies
	extended: true
}));



// @api				/ability
// @descrip	ion		This API routes to the Ability module's endpoints
app.use( "/ability", abilityRoutes );		// serves the MongoDB Test Interface page

// @api				/clevel
// @description		This API routes to the Clearance Level module's endpoints
// app.use( "/clevel", );



module.exports = app;
// END core/app/app.js
