//	PROJECT: 		Core-v4
// 	Name: 			Thai Quach
// 	File: 			3DPF API
// 	Date Created: 	4/20/2019
// 	Last Modified: 	4/20/2019
// 	Details:
// 					This file contains routing logic to service all routes requested under the the
//                  "[endpoint]" endpoint (a.k.a. the [moduleName] Module)
// 	Dependencies:
// 					[Dependencies]

"use strict";

// Includes (include as many as you need; the bare essentials are included here)
var express = require("express");
var https = require("https");
var fs = require("fs");
var router = express.Router();
var settings = require("../../../../util/settings");	// import server system settings
var al = require(`${settings.util}/api_legend.js`);		// import API Documentation Module
var au = require(`${settings.util}/api_util.js`);		// import API Utility Functions
// var dt = require(`${settings.util}/datetimes`);		// import datetime utilities
var ef = require(`${settings.util}/error_formats`);		// import error formatter
var crypt = require(`${settings.util}/cryptic`);		// import custom sce crypto wrappers
var ssl = require(settings.security);					// import https ssl credentials
var credentials = require(settings.credentials);		// import server system credentials
var www = require(`${settings.util}/www`);			// import custom https request wrappers
var logger = require(`${settings.util}/logger`);		// import event log system
var rf = require(`${settings.util}/response_formats`);		// import response formatter
var db = require("mongodb")

// Required Endpoint Options
var options = {
	root: settings.root,	// Server root directory (i.e. where server.js is located)
	dotfiles: "deny",
	headers: {
		"x-timestamp": Date.now(),
		"x-sent": true
	}
};
var ssl_user_agent = new https.Agent({
	"port": settings.port,
	"ca": fs.readFileSync(ssl.cert)
});

// Example API Documentation Arguments

var api = al.createLegend(
	"3D Printing Form",
	"API for the 3D Printing Form",
	router					// reference to the router object
);
var apiInfo = {
	"args": {},
	"rval": {}
};


// BEGIN [Module] Routes

// Example API route
apiInfo.args.example = [
	{
		"name": "API argument #1",
		"type": "~string",		// "~" = optional
		"desc": "An optional string argument for this API"
	}
];
apiInfo.rval.example = [
	{
		"condition": "On success",
		"desc": "This function returns true"
	},
	{
		"condition": "On failure",
		"desc": "This function returns false"
	}
];


//api routing for POST request
api.register(
	"Submit",
	"POST",
	"/submit",
	"This endpoint recieve 3D printing forms" +
	"and registers the requests in the database at PrintingForm3D collection.",
	apiInfo.args.submit,
	apiInfo.rval.submit,
	function( request, response ) {

		// src:  api / api folder name / register's parameter
		var handlerTag = { src: "(get) /api/3DPrintingForm/submit" };
		response.set( "Content-Type", "application/json" );

		// Attempt to process 3D form's information
		try {
			var body = request.body;
			var requiredFields = [
				"name",
				"color",
				"projectType",
				"projectLink",
				"projectContact",
				"projectComments"
			];

			// Commit application to PrintingForm3D database
			var requestBody = {
				accessToken: credentials.mdbi.accessToken,
				collection: "PrintingFormFor3DPrinting",

				// Left : Right
				// Left: from 3D Printing Form schema
				// Right: api
				data: {
					name: body.name,
					color: body.color,
					projectType: body.projectType,
					projectLink: body.url,
					projectContact: body.contact,
					projectComments: body.comment,
					progress: body.progress,
					date: body.date
				}
			};

			//Post Request, followed git documentation
			var requestOptions = {
				hostname: "localhost",
				path: "/mdbi/write",
				method: "POST",
				agent: ssl_user_agent,
				headers: {
					"Content-Type": "application/json",
					"Content-Length": Buffer.byteLength(
						JSON.stringify( requestBody )
					)
				}
			};

			//Response
			www.https.post( requestOptions, requestBody, function( reply, error ) {

				// Check for errors
				if( error ){

					// Report error
					var errStr = ef.asCommonStr(
						ef.struct.httpsPostFail,
						error
					);
					logger.log( errStr, handlerTag );
					response.status( 500 ).send( errStr ).end();
				} else {

					// Send response back
					var data = rf.asCommonStr(
						true,
						"Your application has been submitted. We will contact you when ready."
						);
					logger.log( `Successfully Submit Printing Form`, handlerTag );
					response.status( 200 ).send( data ).end();
				}
			} );
		} catch( exception ){

			// Report exception
			var errStr = ef.asCommonStr(
				ef.struct.coreErr,
				{ exception: exception }
			);
			logger.log( errStr, handlerTag );
			response.status(500).send(errStr).end();
		}
	}
);

// END [Module] Routes

//////////GET Request
api.register(
	"Get 3D Printing Info",
	"GET",
	"/GetForm",
	"This endpoint send back the 3D Printing Form in json.",
	apiInfo.args.D3A,
	apiInfo.rval.D3R,
	function( request, response ){

		var handlerTag = { src: "(get) /api/3DPrintingForm/GetForm" };
		response.set( "Content-Type", "application/json" );

		try{
			// Initiate a search for the given username in the user database
			var requestBody = {
				accessToken: credentials.mdbi.accessToken,
				collection: "PrintingFormFor3DPrinting",
			};
			var requestOptions = {
				hostname: "localhost",
				path: "/mdbi/search/documents",
				method: "POST",
				agent: ssl_user_agent,
				headers: {
					"Content-Type": "application/json",
					"Content-Length": Buffer.byteLength(
						JSON.stringify( requestBody )
					)
				}
			};
			www.https.post( requestOptions, requestBody, function( reply, error ) {

				// Check for errors
				if( error ){

					// Report error
					var errStr = ef.asCommonStr(
						ef.struct.httpsPostFail,
						error
					);
					logger.log( errStr, handlerTag );
					response.status( 500 ).send( errStr ).end();
				} else {

					// Send response back
					//var data = "ok?"
					response.status( 200 ).send( reply ).end();
				}
			} );
		} catch( exception ){

			// Report exception
			var errStr = ef.asCommonStr(
				ef.struct.coreErr,
				{ exception: exception }
			);
			logger.log( errStr, handlerTag );
			response.status( 500 ).send( errStr ).end();
		}
	}
);


module.exports = router;
// END [filename]
