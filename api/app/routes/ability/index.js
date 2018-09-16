//	PROJECT: 		Core-v4
// 	Name: 			Rolando Javier
// 	File: 			api/app/routes/ability/index.js
// 	Date Created: 	September 1, 2018
// 	Last Modified: 	September 1, 2018
// 	Details:
// 					This file contains routing logic to service all routes requested under the the "/api/ability" endpoint (a.k.a. the Ability Module)
// 	Dependencies:
// 					ExpressJS 4.x
// 					body-parser (NPM middleware req'd by ExpressJS 4.x to acquire POST data parameters: "npm install --save body-parser")

"use strict";

// Includes
var express = require("express");
var https = require("https");
var fs = require("fs");
var router = express.Router();
var settings = require("../../../../util/settings");	// import server system settings
var al = require(`${settings.util}/api_legend.js`);		// import API Documentation Module
// var dt = require(`${settings.util}/datetimes`);		// import datetime utilities
var rf = require(`${settings.util}/response_formats`);	// import response formatter
var ef = require(`${settings.util}/error_formats`);		// import error formatter
// var crypt = require(`${settings.util}/cryptic`);		// import custom sce crypto wrappers
var ssl = require(settings.security);					// import https ssl credentials
var credentials = require(settings.credentials);		// import server system credentials
var www = require(`${settings.util}/www`);			// import custom https request wrappers
var logger = require(`${settings.util}/logger`);		// import event log system
var au = require(`${settings.util}/api_util.js`);		// import API Utility Functions

// Options
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

// Link api documentation path
// Documentation Template Styling
router.use( "/docTemplate.css", express.static(
	`${settings.util}/class/ApiLegend/template/docTemplate.css`
) );

// Instantiate an API Legend
var apiLegend = al.createLegend(
	"Ability",
	"This API controls all things related to System Abilities (i.e. ACL-related permissions)",
	router
);

// Create temporary storage for api endpoint info
var apiInfo = {
	"args": {},
	"rval": {}
};





// BEGIN Ability Routes

// @endpoint		(GET) /ping
// @description 	This endpoint is used to ping the Ability Module API router
// @parameters		(object) request		The web request object provided by express.js. The
// 											request body doesn't require any arguments.
// 					(object) response 		The web response object provided by express.js
// @returns		On success: a code 200 and a ping message
// 				On failure: a code 499 and an error format object
apiInfo.args.ping = [			// API Arguments
];
apiInfo.rval.ping = [			// API Return Values
	{
		"condition": "On success",
		"desc": "a code 200 and a ping message"
	},
	{
		"condition": "On failure",
		"desc": "a code 499 and an error format object"
	}
];
apiLegend.register ( "Ping", "GET", "/ping", "This endpoint is used to ping the Ability Module \
API router", apiInfo.args.ping, apiInfo.rval.ping, function ( request, response ) {

	var handlerTag = { "src": "(get) /api/ability/ping" };
	logger.log( `Sending ping to client @ ip ${request.ip}`, handlerTag );

	// Send PING packet
	var pingPacket = {
		"data": "ping!"
	};

	response.set( "Content-Type", "application/json" );
	response.send(
		rf.asCommonStr( true, pingPacket )
	).status( 200 ).end();
} );

// @endpoint		(GET) /help
// @description		This endpoint sends the client documentation on this API module (Ability)
// @parameters		(object) request		The web request objec provided by express.js. The
//											request body is expected to be a JSON object with the
//											following members:
//						~(boolean) pretty		A boolean to request a pretty HTML page of the API
//												Module documentation
//					(object) response		The web response object provided by express.js
// @returns			On success: a code 200, and the documentation in the specified format
//					On failure: a code 500, and an error format object
apiInfo.args.help = [
	{	
		"name": "request.pretty",
		"type": "~boolean",
		"desc": "An optional boolean to request a pretty HTML page of the Ability API doc"
	}
];
apiInfo.rval.help = [
	{
		"condition": "On success",
		"desc": "a code 200, and the documentation in the specified format"
	},
	{
		"condition": "On failure",
		"desc": "a code 499, and an error format object"
	}
];
apiLegend.register ( "Help", "GET", "/help", "This endpoint sends the client documentation on \
API module (Ability)", apiInfo.args.help, apiInfo.rval.help, function ( request, response ) {

	var handlerTag = { "src": "(get) /api/ability/help"};
	var pretty = ( typeof request.query.pretty !== "undefined" ? true : false );

	try {

		// Determine how to represent the API doc
		if ( pretty ) {

			logger.log( `Sending pretty API doc to client @ ip ${request.ip}`, handlerTag );
			response.set( "Content-Type", "text/html" );
		} else {

			logger.log( `Sending API doc to client @ ip ${request.ip}`, handlerTag );
			response.set( "Content-Type", "application/json");
		}

		// Send the API doc
		var output = pretty ? apiLegend.getDoc( true ) : rf.asCommonStr(
			true, apiLegend.getDoc( false )
		);
		response.send( output ).status( 200 ).end();
	} catch ( exception ) {
		
		response.set( "Content-Type", "application/json" );
		response.status( 500 ).send(
			ef.asCommonStr( ef.struct.coreErr, { "exception": exception } )
		).end();
	}
} );

// @endpoint		(GET) /getAll
// @description		This endpoint is used to request a full list of abilities assignable to
//					clearance levels
// @parameters		(object) request		The web request objec provided by express.js. The
//											request body is expected to be a JSON object with the
//											following members:
//						(string) sessionID		The client's session token string
//						(string) currentUser	The current user's username
//					(object) response		The web response object provided by express.js
// @returns			On success:	a code 200, and a full list of abilities assignable to clearance
//								levels
// 					On unauthorized action:	a code 200, and an error-formatted object detailing
//								the authorization issue
// 					On invalid/expired session token: a code 499, and an error-formatted JSON
//								object detailing the expired session issue
// 					On any other failure: a code 500, and a JSON object detailing the issue
apiInfo.args.getAll = [
	{
		"name": "request.sessionID",
		"type": "string",
		"desc": "The client's session token string"
	},
	{
		"name": "request.currentUser",
		"type": "string",
		"desc": "The current user's username"
	}
];
apiInfo.rval.getAll = [
	{
		"condition": "On success",
		"desc": "a code 200, and a full list of abilities assignable to clearance levels"
	},
	{
		"condition": "On unauthorized action",
		"desc": "a code 200, and an error-formatted object detailing the authorization issue"
	},
	{
		"condition": "On invalid/expired session token",
		"desc": "a code 499, and an error-formatted JSON object detailing the expired session\
		issue"
	},
	{
		"condition": "On any other failure",
		"desc": "a code 500, and a JSON object detailing the issue"
	}
];
apiLegend.register ( "GetAll", "GET", "/getAll", "Gets a full list of abilities assignable to \
clearance levels", apiInfo.args.getAll, apiInfo.rval.getAll, function ( request, response ) {

	var handlerTag = { "src": "(get) /api/ability/getAll" };
	var sessionID =	(typeof request.query.sessionID !== "undefined") ?
					request.query.sessionID : null;
	var currentUser =	(typeof request.query.currentUser !== "undefined") ?
						request.query.currentUser : null;

	// Set the content type to be json
	response.set( "Content-Type", "application/json" );

	// Define a callback to evaluate the MDBI search results
	var mdbiSearchCallback = function (reply, error) {
		if (error) {
			// Some MDBI error happened
			logger.log(`MDBI search failed: ${error}`, handlerTag);
			response.status(500).send(ef.asCommonStr(ef.struct.coreErr, error)).end();
		} else {
			logger.log(`${reply.length} ${(reply.length === 1) ? "result" : "results"} found`, handlerTag);
			if (reply === null) {
				// If a null value is returned, this is unexpected
				var msg = `Clearance level list request returned null`;
				logger.log(`Error: null value returned in available ability list request`, handlerTag);
				response.status( 499 ).send(
					ef.asCommonStr( ef.struct.unexpectedValue, msg )
				).end();
			} else {
				response.status( 200 ).send(
					rf.asCommonStr( true, reply )
				).end();
			}
		}
	};

	// Define a callback to evaluate the results of the capability check
	var capabilityCallback = function (resultOfCheck) {
		switch (resultOfCheck) {
			case -1: {
				logger.log(`Permissions check is incomplete`, handlerTag);
				response.status(500).send(ef.asCommonStr(ef.struct.coreErr)).end();
				break;
			}
			case false: {
				logger.log(`User ${currentUser} not permitted to perform officer management operation`, handlerTag);
				response.status(499).send(ef.asCommonStr(ef.struct.adminUnauthorized)).end();
				break;
			}
			case true: {
				// Capability Verification succeeded. Now let's get a full list of abilities
				var searchPostBody = {
					"accessToken": credentials.mdbi.accessToken,
					"collection": "Ability",
					"pipeline": [
						{
							"$match": {
								"abilityID": {
									"$ne": -1
								}
							}
						}
					]
				};

				var searchPostOptions = {
					"hostname": "localhost",
					"path": "/mdbi/search/aggregation",
					"method": "POST",
					"agent": ssl_user_agent,
					"headers": {
						"Content-Type": "application/json",
						"Content-Length": Buffer.byteLength(JSON.stringify(searchPostBody))
					}
				};

				logger.log(`Authorization verified. Acquiring available ability list...`, handlerTag);
				www.https.post(searchPostOptions, searchPostBody, mdbiSearchCallback, handlerTag.src);
				break;
			}
		}
	};

	// Define a callback to evaluate the results of the session verification
	var verificationCallback = function (valid, error) {
		if (error) {
			// Some unexpected error occurred...
			logger.log(`Error: ${error}`, handlerTag);
			response.status( 500 ).send( error ).end();
		} else if (!valid) {
			// Session expired, let the client know it!
			logger.log(`Error: Invalid session token`, handlerTag);
			response.status( 499 ).send(
				ef.asCommonStr( ef.struct.expiredSession )
			).end();
		} else {
			// Verification succeeded; let's make sure the request issuer is qualified to edit abilities
			au.isCapable( [5,6,7], currentUser, capabilityCallback );
		}
	};

	// Run queries
	au.verifySession(credentials.mdbi.accessToken, sessionID, verificationCallback);
} );

// Remove the apiInfo's references when done routing
delete apiInfo.args;
delete apiInfo.rval;

// END Ability Routes





// BEGIN Error Handling Routes

// @endpoint		NOTFOUND (404)
// @description		This endpoint handles any endpoint requests that do not exist under the
//					"/ability" endpoint
// @parameters		n/a
// @returns			a code 404 and an error-formatted object
router.use( function ( request, response ) {

	var handlerTag = { "src": "/ability/notfound" };

	// Set content type to json
	response.set( "Content-Type", "application/json" );

	// Send 404 to client
	logger.log(
		`Non-existent endpoint "${request.path}" requested from client @ ip ${request.ip}`,
		handlerTag
	);
	response.status( 404 ).json(
		ef.asCommonStr( ef.struct.nonexistentEndpoint, {
			"endpoint": request.originalUrl,
			"protocol": request.protocol,
			"method": request.method
		} )
	).end();
} );

// @endpoint		ERROR (for any other errors)
// @description		This function sends an error status (500) if an error occurred forcing the
//					other endpoints to fail.
// @parameters		n/a
// @returns			a code 500 and an error-formatted object
router.use( function ( request, response ) {

	var handlerTag = { "src": "/ability/error" };

	// Set content type to json
	response.set( "Content-Type", "application/json" );
	
	// Send 500 to client
		logger.log(
			`Error occurred with request from client @ ip ${request.ip}`,
			handlerTag
		);
	response.status( 500 ).json(
		ef.asCommonStr( ef.struct.coreErr, {
			"endpoint": request.originalUrl,
			"protocol": request.protocol,
			"method": request.method
		} )
	).end();
} );

// END Error Handling Routes





module.exports = router;
// END api/app/routes/ability/index.js
