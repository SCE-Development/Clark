// PROJECT: 		MEANserver
// Name: 			Rolando Javier
// File: 			server.js
// Date Created: 	October 17, 2017
// Last Modified: 	November 5, 2017
// Details:
// 					This file comprises the MEAN Stack server to be used in conjunction with PROJECT: SkillMatch
// Dependencies:
// 					NodeJS v6.9.1
// 					ExpressJS 4.16.2
// 					body-parser (NPM middleware req'd by ExpressJS 4.x to acquire POST data parameters: "npm install --save body-parser")
// 					multer (NPM middleware req'd by ExpressJS 4.x to parse multi-length POST data parameters: "npm install --save multer")

/* NodeJS+ExpressJS Server */
"use strict"
var http = require("http");
var fs = require("fs");
var bodyParser = require("body-parser");		// import POST request data parser
// var multer = require("multer");					// import POST multi-part/form-data parser
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
app.use(bodyParser.json({							// support JSON-encoded request bodies
	strict: true
}));
app.use(bodyParser.urlencoded({						// support URL-encoded request bodies
	extended: true
}));
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
app.post("/writeNewDoc", handles.testWriteNewDocHandler);	// POST request to write to the db from all pages
app.post("/findCollections", handles.testFindCollectionsHandler);	// POST request to find and list the db's collections on all page
app.post("/findDoc", handles.testFindDocHandler);	// POST request to find and list documents via a search
app.post("/deleteOneDoc", handles.testDeleteOneDocHandler);	// POST request to find and delete one document
app.post("/deleteManyDocs", handles.testDeleteManyDocsHandler);	// POST request to find and delete many documents
app.post("/updateOneDoc", handles.testUpdateOneDocHandler);	// POST request to update one document

// Test Page Endpoints (will be removed in production version)
app.get("/test", handles.testHandler);			// GET request of the test page
app.post("/test/write", handles.testWriteNewDocHandler);	// POST request to write to the db from the test page
app.post("/test/find", handles.testFindCollectionsHandler);	// POST request to find and list the db's collections on the test page
app.post("/test/finddoc", handles.testFindDocHandler);	// POST request to find and list documents via a search
app.post("/test/deletedoc", handles.testDeleteOneDocHandler);	// POST request to find and delete one document
app.post("/test/deletemanydocs", handles.testDeleteManyDocsHandler);	// POST request to find and delete many documents
app.post("/test/updatedoc", handles.testUpdateOneDocHandler);	// POST request to update one document
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
