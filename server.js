// PROJECT: 		MEANserver
// Name: 			Rolando Javier
// File: 			server.js
// Date Created: 	October 17, 2017
// Last Modified: 	October 18, 2017
// Details:
// 					This file comprises the MEAN Stack server to be used in conjunction with PROJECT: SkillMatch

/* NodeJS+ExpressJS Server */
"use strict"
var http = require("http");
var fs = require("fs");
var settings = require("./util/settings");		// import server settings
var handles = require("./util/route_handlers");	// import URI endpoint handlers
var port = process.argv[2];						// allow custom ports


/* Create server instance */
const express = require("express");
const app = express();

/* Define Static Asset Locations (i.e. includes/js/css/img files) */
app.use(express.static(settings.root));
app.use(express.static(settings.root + "/css"));	// location of css files
app.use(express.static(settings.root + "/js"));		// location of js files

/* Define Routes (RESTful) */
app.get("/", handles.rootHandler);				// GET request of the main login page
app.post("/login", handles.loginHandler);		// POST request: RESTful login
// app.post("/control", function (request, response) {	// POST request: RESTful control page
// 	console.log("Control Signal:");
// 	response.set("Content-Type", "text/javascript");
// 	response.send("Nothing");
// });



/* Listen for requests on specified port */
if (!port) {
	console.log(`No port specified: Using default port ${settings.port}`);
	port = settings.port;
} else {
	console.log(`Using port ${port}`);
	settings.port = port;
}
app.listen(port, function () {
	console.log(`Now listening on port ${port}`);
});
// END server.js 
