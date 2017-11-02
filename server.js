// PROJECT: 		MEANserver
// Name: 			Rolando Javier
// File: 			server.js
// Date Created: 	October 17, 2017
// Last Modified: 	October 26, 2017
// Details:
// 					This file comprises the MEAN Stack server to be used in conjunction with PROJECT: SkillMatch

/* NodeJS+ExpressJS Server */
"use strict"
var http = require("http");
var fs = require("fs");
var logger = require("./util/logger");			// import event log system
var settings = require("./util/settings");		// import server settings
var handles = require("./util/route_handlers");	// import URI endpoint handlers
var port = process.argv[2];						// allow custom ports



/* Initialize logging */
logger.log(`**** Server Starting... ****`, {"pad": 3});

/* Create server instance */
const express = require("express");
const app = express();
logger.log(`\tExpressJS instance created`);	// test

/* Define Static Asset Locations (i.e. includes/js/css/img files) */
app.use(express.static(settings.root));
app.use(express.static(settings.root + "/css"));	// location of css files
app.use(express.static(settings.root + "/js"));		// location of js files
logger.log(`\tStatic asset locations recorded...`);	// test

/* Define Routes (RESTful)

	To create a new endpoint:
		- Select a URI to associate as the new endpoint (i.e. "routePath")
		- Define a handler function in util/route_handlers.js in a similar fashion the the others (i.e. "handlerFunc")
		- Place an app request here (i.e. "app.post([routePath], [handlerFunc])")
*/
app.get("/", handles.rootHandler);				// GET request of the main login page
app.post("/login", handles.loginHandler);		// POST request: RESTful login
logger.log(`\tServer endpoints routed...`);	// test



/* Listen for requests on specified port */
if (!port) {
	logger.log(`\tNo port specified: Using default port ${settings.port}`);	// test
	port = settings.port;
} else {
	logger.log(`\tUsing port ${port}`);	// test
	settings.port = port;
}
app.listen(port, function () {
	logger.log(`**** Server Startup Complete ****`);
	logger.log(`Now listening on port ${port}`);	// test
});
// END server.js 
