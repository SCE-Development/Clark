//	PROJECT: 		Core-v4
// 	Name: 			Rolando Javier
// 	File: 			api/routes/clearanceLevel/index.js
// 	Date Created: 	October 13, 2018
// 	Last Modified: 	October 13, 2018
// 	Details:
// 					This file contains routing logic to service all routes requested under the the
//                  "clearanceLevel" endpoint (a.k.a. the Clearance Level Module)
// 	Dependencies:
// 					ExpressJS 4.x
// 					body-parser	(NPM middleware req'd by ExpressJS 4.x to acquire POST data
//								parameters: "npm install --save body-parser")

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
var rf = require(`${settings.util}/response_formats`);	// import response formatter
// var crypt = require(`${settings.util}/cryptic`);		// import custom sce crypto wrappers
var ssl = require(settings.security);					// import https ssl credentials
var credentials = require(settings.credentials);		// import server system credentials
var www = require(`${settings.util}/www`);			// import custom https request wrappers
var logger = require(`${settings.util}/logger`);		// import event log system

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


// Link api documentation path
// Documentation Template Styling
router.use( "/docTemplate.css", express.static(
	`${settings.util}/class/ApiLegend/template/docTemplate.css`
) );

// Create an API Documentation Object
var api = al.createLegend(
	"Clearance Level",
	"This API provides control over clearance levels",
	router					// reference to the router object
);
var apiInfo = {
	"args": {},
	"rval": {}
};





// BEGIN Clearance Level Routes

// @endpoint		(GET) /help
// @description		This endpoint sends the client documentation on this API module (Clearance
//					Level)
// @parameters		(object) request		The web request object provided by express.js. The
//											request body is expected to be a JSON object with the
//											following members:
//						(~boolean) pretty		A boolean to request a pretty HTML page of the API
//												Module documentation
//					(object) response		The web response object provided by express.js
// @returns			On success: a code 200, and the documentation in the specified format
//					On failure: a code 500, and an error format object
apiInfo.args.help = [
	{
		"name": "request.pretty",
		"type": "~boolean",		// "~" = optional
		"desc": "An optional boolean to request a pretty HTML page of the Clearance Level API doc"
	}
];
apiInfo.rval.help = [
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
	"Help",
	"GET",							// http request type string
	"/help",
	"This endpoint sends the client documentation on API module (Clearance Level)",
	apiInfo.args.help,			// the API's request arguments (i.e. body/querystring)
	apiInfo.rval.help,			// the API's response/return values
	function ( request, response ) {

		// Setup Arguments
		var handlerTag = { "src": "(get) /api/clearanceLevel/help"};
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
			var output = pretty ? api.getDoc( true ) : rf.asCommonStr(
				true,
				api.getDoc( false )
			);
			response.status( 200 ).send( output ).end();
		} catch ( exception ) {
			
			response.set( "Content-Type", "application/json" );
			response.status( 500 ).send(
				ef.asCommonStr( ef.struct.coreErr, { "exception": exception } )
			).end();
		}
	}
);

// @endpoint		(GET) /getAll
// @description		This endpoint is used to request a full list of clearance levels assignable to
//					users
// @parameters		(object) request		The web request object provided by express.js. The
//											request body is expected to be a JSON object with the
//											following members:
//						(string) sessionID		The client's session token string
//						(string) currentUser	The client user's username
//					(object) response		The web response object provided by express.js
// @returns			On success: a code 200, and a full list of clearance levels assignable to
//								users
//					On unauthorized action: a code 200, and an error-formatted object detailing
//								the authorization issue.
//					On invalid/expired session token: a code 200, and an error-formatted object
//								detailing the expired session issue
//					On any other failure: a code 500, and an error-formatted object detailing the
//								issue
apiInfo.args.getAll = [
	{
		"name": "request.sessionID",
		"type": "string",
		"desc": "The client's session token string"
	},
	{
		"name": "request.currentUser",
		"type": "string",
		"desc": "The client user's username"
	}
];
apiInfo.rval.getAll = [
	{
		"condition": "On success",
		"desc": "a code 200, and a full list of clearance levels assignable to users"
	},
	{
		"condition": "On unauthorized action",
		"desc": "a code 200, and an error-formatted object detailing the authorization issue"
	},
	{
		"condition": "On invalid/expired session token",
		"desc": "a code 200, and an error-formatted object detailing the expired session issue"
	},
	{
		"condition": "On any other failure",
		"desc": "a code 500, and an error-formatted object detailing the issue"
	}
];
api.register( "GetAll", "GET", "/getAll", "Gets a full list of clearance levels assignable \
to users", apiInfo.args.getAll, apiInfo.rval.getAll, function( request, response ) {

	var handlerTag = 	{ "src": "(get) /api/clearanceLevel/getAll" };
	var sessionID = 	( typeof request.query.sessionID !== "undefined" ) ?
						request.query.sessionID : null;
	var currentUser =	( typeof request.query.currentUser !== "undefined" ) ?
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
				response.status( 500 ).send(
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
				response.status(200).send(ef.asCommonStr(ef.struct.adminUnauthorized)).end();
				break;
			}
			case true: {
				// Capability Verification succeeded. Now let's get a full list of clearance levels
				var searchPostBody = {
					"accessToken": credentials.mdbi.accessToken,
					"collection": "ClearanceLevel",
					"pipeline": [
						{
							"$match": {
								"cID": {
									"$ne": -1
								}
							}
						},
						{
							"$lookup": {
								"from": "Ability",
								"localField": "abilities",
								"foreignField": "abilityID",
								"as": "abilityInfo"
							}
						},
						{
							"$replaceRoot": {
								"newRoot": {
									"cID": "$cID",
									"levelName": "$levelName",
									"abilities": "$abilityInfo"
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

				logger.log(
					`Authorization verified. Acquiring available clearance level list...`,
					handlerTag
				);
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
			response.status( 200 ).send(
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

// @endpoint		(GET) /search
// @description		This endpoint is used to search for a list of clearance levels using the given
//					search term and type
// @parameters		(object) request		The web request object provided by express.js. The
//											request body is expected to be a JSON object with the
//											following members:
//							(string) sessionID		The client's session token string
//							(string) currentUser	The client user's username
//							(string) search			The term to search for. If search type is
//													'levelName', regular expressions are supported
//							(string) type			The search type. Valid search types include
//													"cID", "levelName", "abilityID"
//					(object) response		The web response object provided by express.js
// @returns			On success: a code 200, and the set of clearance levels satisfying the search
//					On unauthorized action: a code 200, and an error-formatted object detailing
//								the authorization issue.
//					On invalid/expired session token: a code 200, and an error-formatted object
//								detailing the expired session issue
//					On any other failure: a code 500, and an error-formatted object detailing the
//								issue.
apiInfo.args.search = [
	{
		"name": "request.sessionID",
		"type": "string",
		"desc": "The client's session token string"
	},
	{
		"name": "request.currentUser",
		"type": "string",
		"desc": "The client user's username"
	},
	{
		"name": "request.search",
		"type": "string",
		"desc": "The term to search for. If search type is 'levelName', regular expressions are" +
				" supported"
	},
	{
		"name": "request.type",
		"type": "string",
		"desc": "The search type. Valid search types include 'cID', 'levelName', 'abilityID'"
	}
];
apiInfo.rval.search = [
	{
		"condition": "On success",
		"desc": "a code 200, and the set of clearance levels satisfying the search"
	},
	{
		"condition": "On unauthorized action",
		"desc": "a code 200, and an error-formatted object detailing the authorization issue"
	},
	{
		"condition": "On invalid/expired session token",
		"desc": "a code 200, and an error-formatted object detailing the expired session issue"
	},
	{
		"condition": "On any other failure",
		"desc": "a code 500, and an error-formatted object detailing the issue"
	}
];
api.register( "Search", "GET", "/search", "Gets any clearance levels that match the search",
apiInfo.args.search, apiInfo.rval.search, function( request, response ) {

	// Initialize API
	var handlerTag = 	{ "src": "(get) /api/clearanceLevel/getAll" };
	var sessionID = 	( typeof request.query.sessionID !== "undefined" ) ?
						request.query.sessionID : null;
	var currentUser =	( typeof request.query.currentUser !== "undefined" ) ?
						request.query.currentUser : null;
	var search =		( typeof request.query.search !== "undefined" ) ?
						request.query.search : null;
	var type =			( typeof request.query.type !== "undefined" ) ?
						request.query.type : null;

	// Set the content type to be json
	response.set( "Content-Type", "application/json" );

	// Verify Session
	au.verifySession( credentials.mdbi.accessToken, sessionID, function( valid, error ) {

		// Check for errors
		if( error ) {
			
			// If an unexpected error occurred, respond with error
			logger.log( `Error: ${ error }`, handlerTag );
			response.status( 500 ).send(
				ef.asCommonStr( ef.struct.coreErr, error )
			).end();
		} else if (!valid) {
			
			// Else if the session is expired, let the client know it
			logger.log(`Error: Invalid session token`, handlerTag);
			response.status( 500 ).send(
				ef.asCommonStr( ef.struct.expiredSession )
			).end();
		} else {

			// Else if verification succeeded, check if the user's permissions allow them to add,
			// edit, and delete clearance levels
			au.isCapable( [14,15,16], currentUser, capabilityCallback );
		}
	} );

	// Check capabilities
	var capabilityCallback = function( result ) {

		// Determine the result of the permission check
		switch( result ) {

			case -1: {

				// If the permissions check was inconclusive, prevent further action and throw
				// an error.
				logger.log( `Permissions check is incomplete`, handlerTag );
				response.status( 500 ).send(
					ef.asCommonStr( ef.struct.coreErr )
				).end();
				break;
			}

			case false: {

				// If capabilities are insufficient, notify client of insufficient permissions
				logger.log(
					`User ${currentUser} not permitted to perform clearance level management 
					operation`,
					handlerTag
				);
				response.status( 500 ).send( ef.asCommonStr( ef.struct.adminUnauthorized ) ).end();
				break;
			}

			case true: {

				// If capabilities are adequate, Search for the clearance levels with the given
				// search criteria
				searchClearanceLevels();
			}
		}
	};

	// Search Clearance Levels
	var searchClearanceLevels = function() {

		// Create status variables
		var invalidType = false;
		
		// Determine how to fomulate pipeline query based on search type
		var pipeline = [];
		var matchQuery = {
			"$match": {}
		};
		var lookupQuery = {
			"$lookup": {
				"from": "Ability",
				"localField": "abilities",
				"foreignField": "abilityID",
				"as": "abilityInfo"
			}
		};
		var replaceRootQuery = {
			"$replaceRoot": {
				"newRoot": {
					"cID": "$cID",
					"levelName": "$levelName",
					"abilities": "$abilityInfo"
				}
			}
		};
		switch( type ) {
			case "cID": {
				matchQuery.$match.$and = [ {
					"cID": { "$ne": -1 }
				}, {
					"cID": { "$eq": search }
				} ];
				pipeline = [ matchQuery, lookupQuery, replaceRootQuery ];
				break;
			}
			case "levelName": {
				matchQuery.$match.$and = [ {
					"cID": { "$ne": -1 }
				}, {
					"levelName": {
						"$regex": search
					}
				} ];
				pipeline = [ matchQuery, lookupQuery, replaceRootQuery ];
				break;
			}
			case "abilityID": {
				matchQuery.$match.cID = {
					"$ne": -1
				};
				replaceRootQuery.$replaceRoot.newRoot.abilityFound = {
					"$setIsSubset": [ [ Number.parseInt(search) ], "$abilities" ]
				};
				var filterQuery = {
					"$match": {
						"abilityFound": true
					}
				};
				pipeline = [ matchQuery, lookupQuery, replaceRootQuery, filterQuery ];
				break;
			}
			default: {

				// Type is invalid
				invalidType = true;
				break;
			}
		}

		// Check if the type was invalid
		if( invalidType ) {

			// Log an error message
			var emsg = `Search type "${type}" is not valid`;
			logger.log( emsg, handlerTag );

			// Respond with an error
			response.status( 200 ).send(
				ef.asCommonStr(
					ef.struct.unexpectedValue,
					emsg
				)
			).end();
		} else {

			// Use aggregation to acquire the matching clearance level entries in the database
			var searchPostBody = {
				"accessToken": credentials.mdbi.accessToken,
				"collection": "ClearanceLevel",
				"pipeline": pipeline
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

			// Attempt to acquire the list of clearance levels that match the search
			logger.log( `Authorization verified. Searching clearance levels...`, handlerTag );
			www.https.post(
				searchPostOptions,
				searchPostBody,
				mdbiSearchCallback,
				handlerTag.src
			);
	
			// // DEBUG
			// response.status( 200 ).send(
			// 	rf.asCommonStr( true, {
			// 		"search": typeof search + " " + search,
			// 		"type": typeof type + " " + type,
			// 		"test": "Hello World"
			// 	} )
			// ).end();
		}
	};
	
	// Evaluate results from the search
	var mdbiSearchCallback = function( reply, error ) {
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
				response.status( 200 ).send(
					ef.asCommonStr( ef.struct.unexpectedValue, msg )
				).end();
			} else {
				response.status( 200 ).send(
					rf.asCommonStr( true, reply )
				).end();
			}
		}
	};
} );
// END Clearance Level Routes





module.exports = router;
// END api/routes/clearanceLevel/index.js
