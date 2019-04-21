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

api.register(
	"Submit",
	"POST",
	"/submit",
	"This endpoint acquires a membership application, validates its input, " +
	"and registers the user in the database.",
	apiInfo.args.submit,
	apiInfo.rval.submit,
	function( request, response ) {

		var handlerTag = { src: "(get) /api/3DPrintingForm/submit" };
		response.set( "Content-Type", "application/json" );

		// Attempt to process this membership application
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

			// Commit application to Member database
			var currentTs = new Date( Date.now() );
			var requestBody = {
				accessToken: credentials.mdbi.accessToken,
				collection: "PrintingForm3D",
				data: {
					name: body.name,
					color: body.color,
					projectType: body.projectType,
					projectLink: body.url,
					projectContact: body.contact,
					projectComments: body.comment,
					lastLogin: currentTs
				}
			};

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





module.exports = router;
// END [filename]
