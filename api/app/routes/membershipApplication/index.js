//	PROJECT: 		Core-v4
// 	Name: 			R. Javier
// 	File: 			api/routes/membershipApplication/index.js
// 	Date Created: 	March 17, 2019
// 	Last Modified: 	March 17, 2019
// 	Details:
// 					This file contains routing logic to service all routes requested under the the
//                  "/memberApplication" endpoint (a.k.a. the Membership Application Module)
//					which is publicly exposed to allow applications from the public facing site.
// 	Dependencies:
// 					JavaScript ECMAscript 6

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
var rf = require(`${settings.util}/response_formats`);		// import response formatter
var crypt = require(`${settings.util}/cryptic`);		// import custom sce crypto wrappers
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

// Example API Documentation Arguments
var api = al.createLegend(
	"Membership Application",
	"An API used to service SCE membership applications",
	router					// reference to the router object
);
var apiInfo = {
	"args": {},
	"rval": {}
};






// BEGIN Membership Application Routes

// @endpoint		(GET) /ping
// @description		This endpoint is used to ping the Membership Application
//					Module API router.
// @parameters		(object) request		The web request object provided by
//											express.js. The request body doesn't
//											require any arguments.
//					(object) response		the web response object provided by
//											express.js.
// @returns			On success: a code 200 and a ping message
//					On failure: a code 499 and an error format object
apiInfo.args.ping = [];
apiInfo.rval.ping = [
	{
		"condition": "On success",
		"desc": "a code 200 and a ping message"
	},
	{
		"condition": "On failure",
		"desc": "a code 499 and an error format object"
	}
];
api.register(
	"Ping",
	"GET",							// http request type string
	"/ping",
	"This endpoint is used to ping the Membership Application Module API \
	router",
	apiInfo.args.ping,			// the API's request arguments (i.e. body/querystring)
	apiInfo.rval.ping,			// the API's response/return values
	function ( request, response ) {

		var handlerTag = { src: "(get) /api/membershipApplication/ping" };

		// Send PING packet
		logger.log(
			`Sending ping packet to client @ ip ${request.ip}`,
			handlerTag
		);
		var pingPacket = { data: "ping!" };
		response.set( "Content-Type", "application/json" );
		response.status( 200 ).send(
			rf.asCommonStr( true, pingPacket )
		).end();
	}
);

// @endpoint		(GET) /help
// @description		This endpoint sends the client documentation on this API module (Membership Application)
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
		"desc": "An optional boolean to request a pretty HTML page of the Membership Application API doc"
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
api.register ( "Help", "GET", "/help", "This endpoint sends the client documentation on \
API module (Membership Application)", apiInfo.args.help, apiInfo.rval.help, function ( request, response ) {

	var handlerTag = { "src": "(get) /api/membershipApplication/help"};
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
} );

// @endpoint		(GET) /username/isAvailable
// @description		This endpoint checks if the given username is available
// @parameters		(object) request		The web request object provided by
//											express.js. The request's only query
//											string parameter is:
//						(string) username		The username to check for
// @returns			On success:	a code 200, and an object whose only member is a
//								boolean indicating the username's availability.
//					On failure:	a code 500, and an error format object detailing
//								the error.
apiInfo.args.usernameIsAvailable = [
	{
		name: "request.username",
		type: "string",
		desc: "The username to check for."
	}
];
apiInfo.rval.usernameIsAvailable = [
	{
		condition: "On success",
		desc: "a code 200, and an object whose only member is a boolean \
		indicating the username's availability."
	},
	{
		condition: "On failure",
		dsec: "a code 500, and an error format object detailing the error."
	}
];
api.register(
	"Username Is Available",
	"GET",
	"/username/isAvailable",
	"This endpoint checks if the given username is available.",
	apiInfo.args.usernameIsAvailable,
	apiInfo.rval.usernameIsAvailable,
	function( request, response ){

		var handlerTag = { src: "(get) /api/memershipApplication/username/isAvailable" };
		response.set( "Content-Type", "application/json" );

		try{

			// Initiate a search for the given username in the user database
			var requestBody = {
				accessToken: credentials.mdbi.accessToken,
				collection: "Member",
				search: {
					userName: request.query.username
				}
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
					var data = rf.asCommonStr(
						true,
						{
							isAvailable: reply.length === 0 ? true : false
						}
					);
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
			response.status( 500 ).send( errStr ).end();
		}
	}
);

// @endpoint		(POST) /submit
// @description		This endpoint acquires a membership application, validates
//					its input, and registers the user in the database.
// @parameters		(object) request		The web request object provided by
//											express.js. The request body is
//											expected to be a JSON object with
//											following members:
//						(string) firstName		The user's first name
//						(string) middleInitial	The user's middle initial
//						(string) lastName		The user's last name
//						(string) email			The user's email address
//						(string) username		The user's chosen username
//						(string) password		The user's chosen password
//						(string) major			The user's major of study
// @returns			On success: a code 200, and an object whose only member is a
//								boolean indicating the success of the operation.
//					On failure: a code 500, and an error format object detailing
//								the error.
apiInfo.args.submit = [
	{
		name: "request.firstName",
		type: "string",
		desc: "The user's first name"
	},
	{
		name: "request.middleInitial",
		type: "string",
		desc: "The user's middle initial"
	},
	{
		name: "request.lastName",
		type: "string",
		desc: "The user's last name"
	},
	{
		name: "request.email",
		type: "string",
		desc: "The user's email address"
	},
	{
		name: "request.username",
		type: "string",
		desc: "The user's chosen username"
	},
	{
		name: "request.password",
		type: "string",
		desc: "The user's chosen password"
	},
	{
		name: "request.major",
		type: "string",
		desc: "The user's major of study"
	}
];
apiInfo.rval.submit = [
	{
		condition: "On success",
		desc: "a code 200, and an object whose only member is a boolean indicating the success of the operation."
	},
	{
		condition: "On failure",
		desc: "a code 500, and an error format object detailing the error."
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

		var handlerTag = { src: "(get) /api/memershipApplication/submit" };
		response.set( "Content-Type", "application/json" );

		// Attempt to process this membership application
		try {

			var body = request.body;
			var requiredFields = [
				"firstName",
				"lastName",
				"email",
				"username",
				"password"
			];
			var missingFields = [];

			// Validate the input against a list of required fields
			requiredFields.forEach( function( reqField ) {

				// Check if this field is not defined
				if( typeof body[reqField] === "undefined" ){

					// Place this field in a list of mising fields
					missingFields.push(reqField);
				}
			} );

			// Ensure all required fields a present
			if( missingFields.length > 0 ){

				// Reject input due to lack of required field(s)
				var errStr = ef.asCommonStr(
					ef.struct.invalidBody,
					{ missingFields: missingFields }
				);
				logger.log( errStr, handlerTag );
				response.status(500).send(errStr).end();
			}

			// Check field types
			else if(
				typeof body.firstName !== "string" ||
				typeof body.lastName !== "string" ||
				typeof body.email !== "string" ||
				typeof body.username !== "string" ||
				typeof body.password !== "string"
			) {

				// Reject input due to invalid type(s)
				var errStr = ef.asCommonStr(
					ef.struct.invalidDataType,
					false
				);
				logger.log( errStr, handlerTag );
				response.status(500).send(errStr).end();
			}

			// Commit application to Member database
			var currentTs = new Date( Date.now() );
			var requestBody = {
				accessToken: credentials.mdbi.accessToken,
				collection: "Member",
				data: {
					firstName: body.firstName,
					middleInitial: body.middleInitial,
					lastName: body.lastName,
					joinDate: currentTs,
					userName: body.username,
					passWord: crypt.hashPwd(
						body.username,
						body.password
					),
					email: body.email,
					emailVerified: false,
					emailOptIn: true,
					major: body.major ? body.major : "",
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
						"Your application has been submitted. Please visit the SCE (Engr 294) office to complete registration and membership payment."
					);
					logger.log( `Successfully registered un-verified user ${body.username}`, handlerTag );
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
// END Membership Application Routes





module.exports = router;
// END api/routes/membershipApplication/index.js
