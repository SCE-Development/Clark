//	PROJECT: 		Core-v4
// 	Name: 			Rolando Javier
// 	File: 			api/routes/user/index.js
// 	Date Created: 	September 5, 2018
// 	Last Modified: 	September 5, 2018
// 	Details:
// 					This file contains routing logic to service all routes requested under the the
//					"/api/user" endpoint (a.k.a. the User Module)
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
var rf = require(`${settings.util}/response_formats`);	// import response formatter
var ef = require(`${settings.util}/error_formats`);		// import error formatter
var schema = require(`${settings.util}/../mdbi/tools/schema_v0.js`);
var crypt = require(`${settings.util}/cryptic`);		// import custom sce crypto wrappers
var ssl = require(settings.security);					// import https ssl credentials
var credentials = require(settings.credentials);		// import server system credentials
var www = require(`${settings.util}/www`);				// import custom https request wrappers
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
	"User",
	"This API facilitates all user account modifications and controls",
	router					// reference to the router object
);
var apiInfo = {
	"args": {},
	"rval": {}
};





// BEGIN User Routes

// @endpoint		(GET) /ping
// @description 	This endpoint is used to ping the User Module API router
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
api.register ( "Ping", "GET", "/ping", "This endpoint is used to ping the User Module \
API router", apiInfo.args.ping, apiInfo.rval.ping, function ( request, response ) {

	var handlerTag = { "src": "(get) /api/ability/ping" };
	logger.log( `Sending ping to client @ ip ${request.ip}`, handlerTag );

	// Send PING packet
	var pingPacket = {
		"data": "ping!"
	};

	response.set( "Content-Type", "application/json" );
	response.status( 200 ).send(
		rf.asCommonStr( true, pingPacket )
	).end();
} );

// @endpoint		(GET) /help
// @description		This endpoint sends the client documentation on this API module (User)
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
		"desc": "An optional boolean to request a pretty HTML page of the User API doc"
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
API module (User)", apiInfo.args.help, apiInfo.rval.help, function ( request, response ) {

	var handlerTag = { "src": "(get) /api/user/help"};
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

// @endpoint		(POST) /login
// @description		This endpoint is used to request a login of the specified user with the given
//					credentials and options from the Administrator's portal. With this info, this
//					endpoint is able to determine if the user has the correct user-password combo.
//					However, unlike this API's predecessor, this function won't figure out whether
//					this particular user has access to certain functions (i.e. whether they can
//					access the administrator's portal).
// @parameters		(object) request		The web request object provided by express.js. The
//											request body is expected to be a JSON object with
//											the following members:
//							(string) username					The user's username
//							(string) pwd						The user's password
//							(boolean) sessionStorageSupport		A boolean signifying whether or
//																not the client browser supports
//																the modern SessionStorage API.
//																(Will be) Used by this server to
//																determine whether to use cookies
//																or the SessionStorage mechanism
//					(object) response		The web resposne object provided by express.js
// @returns			On success, and valid credentials:
//						a code 200, and a sessionID to validate all server operations during the
//						session.
//					On success, and invalid credentials:
//						a code 200, and an error format object detailing the invalid credentials
//					On credential validation error:
//						a code 499, and an error format object detailing the validation error
//					On any other failure:
//						a code 500, and an error format object detailing the error
apiInfo.args.login = [
	{
		"name": "request.username",
		"type": "string",
		"desc": "The user's username"
	},
	{
		"name": "request.pwd",
		"type": "string",
		"desc": "The user's password"
	},
	{
		"name": "request.sessionStorageSupport",
		"type": "boolean",
		"desc": "A boolean signifying whether or not the client browser supports the modern " +
				"SessionStorage API. (Will be) Used by this server to determine whether to use " +
				"cookies or the SessionStorage mechanism."
	}
];
apiInfo.rval.login = [
	{
		"condition": "On success, and valid credentials",
		"desc": "A code 200, and a sessionID to validate all server operations during the session"
	},
	{
		"condition": "On success, and invalid credentials",
		"desc": "A code 200, and an error format object detailing the invalid credentials"
	},
	{
		"condition": "On credential validation error",
		"desc": "A code 499, and an error format object detailing the validation error"
	},
	{
		"condition": "On any other failure",
		"desc": "A code 500, and an error format object detailing the error"
	}
];
api.register(
	"Login",
	"POST",							// http request type string
	"/login",
	"This endpoint is used to request a login of the specified user with the given " +
	"credentials and options from the Administrator's portal. With this info, this " +
	"endpoint is able to determine if the user has the correct user-password combo. " +
	"However, unlike this API's predecessor, this function won't figure out whether " +
	"this particular user has access to certain functions (i.e. whether they can " +
	"access the administrator's portal).",
	apiInfo.args.login,			// the API's request arguments (i.e. body/querystring)
	apiInfo.rval.login,			// the API's response/return values
	function ( request, response ) {

		// TODO: make use of "sessionStorageSupported" to switch between SessionStorage API and
		// old-fashioned cookies.
		var handlerTag = { "src": "(post) /api/user/login" };
		var timestamp = ( new Date( Date.now() ) ).toISOString();
		var sessionStorageSupported = request.body.sessionStorageSupport;
		var match = {
			"list": []
		};
		var sessionID = "";

		// Set response content type
		logger.log( `Submitting admin credentials from client @ ip ${request.ip}`, handlerTag );
		response.set( "Content-Type", "application/json" );

		// Use this callback function after successfully generating session data. This function
		// will respond to the client with a unique session token, the username of the current
		// user who's logged in (for verification puposes on the front-end), and a destination
		// URL to redirect to after logging in.
		var grantCoreAccess = function ( match, resolve, reject ) {
			console.log(`GENERATED: ${JSON.stringify(match.list)}`);

			// Create POST request body to update the newly-created session data with ther user's
			// last login date
			var memberUpdateBody = {
				"accessToken": credentials.mdbi.accessToken,
				"collection": "Member",
				"search": {
					"memberID": {
						"$eq": match.list[0].memberID
					}
				},
				"update": {
					"$set": {
						"lastLogin": timestamp,
						"lastActivity": timestamp
					}
				}
			};
			var memberUpdateOptions = {
				"hostname": "localhost",
				"path": "/mdbi/update/documents",
				"method": "POST",
				"agent": ssl_user_agent,
				"headers": {
					"Content-Type": "application/json",
					"Content-Length": Buffer.byteLength(JSON.stringify(memberUpdateBody))
				}
			};
	
			// Update member's last-login date here
			www.https.post(memberUpdateOptions, memberUpdateBody, function (reply, error) {
				if (error) {
					var errStr = ef.asCommonStr(ef.struct.httpsPostFail, error);
	
					logger.log(`Member lastLogin update failed: ${error}`, handlerTag);
					reject();
				} else {
					var redir = `https://${request.hostname}:${settings.port}/core/dashboard`;
	
					// Give client their session id and client redirection headers here
					console.log(`UPDATED: ${JSON.stringify(match.list)}`);
					console.log(`Redirecting: ${redir}`);
					var sessionResponse = {
						"sessionID": sessionID,
						"username": match.list[0].userName,
						"destination": redir
					};
	
					// Cross browser support
					if (!sessionStorageSupported) {
						response.set("Set-Cookie", `sessionID=${sessionID}`);
					}
					response.status( 200 ).send(
						rf.asCommonStr( true, sessionResponse )
					).end();
					resolve();
				}
			});
		};

		// Use this callback after a successful identity verification to generate a new
		// session for the user
		var generageSessionData = function (match, resolve, reject) {
			
			// Generate session id and session data here
			console.log(`CLEARED: ${JSON.stringify(match.list)}`);
			sessionID = crypt.hashSessionID(match.list[0].userName);
			var sessionDataBody = {
				"accessToken": credentials.mdbi.accessToken,
				"collection": "SessionData",
				"data": {
					"sessionID": sessionID,
					"memberID": match.list[0].memberID,
					"loginTime": timestamp,
					"lastActivity": timestamp,
					"maxIdleTime": settings.sessionIdleTime
				}
			};
			var sessionRequestOptions = {
				"hostname": "localhost",
				"path": "/mdbi/write",
				"method": "POST",
				"agent": ssl_user_agent,
				"headers": {
					"Content-Type": "application/json",
					"Content-Length": Buffer.byteLength(JSON.stringify(sessionDataBody))
				}
			};
	
			// Submit session id to mongodb here
			www.https.post(sessionRequestOptions, sessionDataBody, function (reply, error) {
				if (error) {	// report errors
					var errStr = ef.asCommonStr(ef.struct.httpsPostFail, error);
	
					logger.log(`SessionData insert failed: ${error}` , handlerTag);
					response.status( 500 ).send(errStr).end();
					reject();
				} else {
					grantCoreAccess(match, resolve, reject);
				}
			});
		};

		// Use this callback function to determine if a user match was generated
		var evaluateDbResults = function (match, resolve, reject) {

			// Evaluate the database search results
			// logger.log(`Probe2: ${reply}`, handlerTag);	// debug
			if (match.list.length === 0) {

				// If no match was found, that's an error
				var errStr = ef.asCommonStr(ef.struct.adminInvalid);
				
				logger.log( `Incorrect Credentials: Access Denied`, handlerTag );
				response.status( 499 ).send( errStr ).end();

				// Reject the promise to prevent further computation
				reject();
			} else if (match.list.length > 1) {

				// If multiple accounts were in the list, we can't tell who this user
				// is, and that is a fatal authentication error. Treat it as such...
				var errStr = ef.asCommonStr(ef.struct.adminAmbiguous);
	
				logger.log(`FATAL ERR: Ambiguous identity!`, handlerTag);
				response.status( 499 ).send(errStr).end();

				// Reject the promise to prevent further computation
				reject();
			} else {
				
				// Otherwise, if credentials returned one match, we know the username and
				// password combination were correct, AND we have only one result (i.e.
				// we can uniquely identify who this client is). Proceed to create a user
				// session for this user.
				generageSessionData(match, resolve, reject);
			}
		};

		// Create a promise to submit credentials and search for a match in the database
		var submitCredentials = new Promise( function ( resolve, reject ) {

			// Define request parameters
			var requestBody = {
				"accessToken": credentials.mdbi.accessToken,
				"collection": "CoreAccess",
				"search": {
					"userName": request.body.user,
					"passWord": crypt.hashPwd(request.body.user, request.body.pwd)
				}
			};
			var queryOptions = {
				"hostname": "localhost",
				"path": "/mdbi/search/documents",
				"method": "POST",
				"agent": ssl_user_agent,
				"headers": {
					"Content-Type": "application/json",
					"Content-Length": Buffer.byteLength(JSON.stringify(requestBody))
				}
			};
	
			// Submit credentials to mdbi/search/documents and find all matches
			www.https.post(queryOptions, requestBody, function (reply, error) {

				// Setup for the match comparison
				match.list = reply;	// is expected to be an array
	
				// logger.log(`${match.list}`, handlerTag);
				if (error) {

					// Report any error
					var errStr = ef.asCommonStr(ef.struct.httpsPostFail, error);
	
					logger.log(`A request error occurred: ${error}`, handlerTag);
					response.status(500).send(errStr).end();
					reject();
				} else if (!Array.isArray(match.list)) {

					// If we didn't get an array back, let's call that an error and fail
					logger.log(
						`Invalid value returned from mdbi/search/documents query: ${match.list}`,
						handlerTag
					);

					// Send the response back
					response.status( 500 ).send(
						ef.asCommonStr(
							ef.struct.unexpectedValue,
							match.list
						)
					).end();

					// Reject the promise to end all further computation
					reject();
				} else {

					// If no errors, proceed to evaluate the matched user list
					evaluateDbResults(match, resolve, reject);
				}
			} );
		} );

		// Submit credentials first
		submitCredentials.then( function (value) {
			// do nothing?
		} ).catch( function ( e ) {
			console.log(e);
		} );
	}
);

// @endpoint		(POST) /logout
// @description		This endpoint is used to requuest a logout of the specified session for the
//					given user
// @parameters		(object) request		The web request object provided by express.js. The
//											request body is expected to contain the following
//											members:
//							(string) sessionID		The session token of the session to log off
//							(string) userName		The username of the user to log off
//							(boolean) sessionStorageSuppport
//													A boolean indicating the client browser's
//													support of the sessionStorage technology
//					(object) response		The web response object provided by express.js
// @returns			On success:	a code 200 and a success message indicating the user logged out
//								successfully
//					On failure: a code 499 and an error format object detailing the error
apiInfo.args.logout = [
	{
		"name": "request.sessionID",
		"type": "string",
		"desc": "The session token string of the session to log off"
	},
	{
		"name": "request.userName",
		"type": "string",
		"desc": "The username of the user to log off"
	},
	{
		"name": "request.sessionStorageSupport",
		"type": "boolean",
		"desc": "A boolean indicating the client browser's support of sessionStorage technology"
	}
];
apiInfo.rval.logout = [
	{
		"condition": "On success",
		"desc": "a code 200, and a success message indicating the user logged out successfully"
	},
	{
		"condition": "On failure",
		"desc": "a code 499, and an error format object detailing the error"
	}
];
api.register(
	"Logout",
	"POST",
	"/logout",
	"This endpoint is used to request a logout of the specified session for the specified user",
	apiInfo.args.logout,
	apiInfo.rval.logout,
	function ( request, response ) {
		var handlerTag = { "src": "(post) /api/user/logout" };
		var validBody =	(typeof request.body.userName === "string") &&
						(typeof request.body.sessionID === "string") &&
						(typeof request.body.sessionStorageSupport !== "undefined");
		
		// Initialize the response content type to json
		response.set("Content-Type", "application/json");

		// Check for valid request body
		if ( !validBody ) {

			// If invalid body, send the code 499 and error format object JSON
			response.status( 499 ).send(
				ef.asCommonStr( ef.struct.invalidBody )
			).end();
		} else {

			// Acquire the sessionID and userName
			var uname = (typeof request.body.userName !== "string") ? null : request.body.userName;
			var sid = (typeof request.body.sessionID !== "string") ? null : request.body.sessionID;

			// Define a callback to evaluate the results of the logout attempt
			var queryCallback = function (reply, error) {
				
				var resultJSON = reply;	// is expected to be JSON

				if (error) {
					
					// If something unexpected happened, report any unexpected errors
					logger.log( `A request error occurred: ${ error }`, handlerTag );
					response.status( 500 ).send(
						er.asCommonStr( er.struct.coreErr, error )
					).end();
				} else {
					
					// Otherwise, tell the client the result of the user logout attempt
					if (resultJSON.n > 1) {
						
						// If more than one record was deleted, this is fatal! Ite means
						// someone else's session was removed, and their username/sessionID
						// pair was NOT unique. Reply with an error
						logger.log( `ERROR: ${ resultJSON.n } session data was deleted!`, handlerTag );
						response.status( 500 ).send(
							ef.asCommonStr( ef.struct.coreErr )
						).end();
					} else {

						// If all's good, the client no longer has valid session data and can no
						// longer interact with the Core API (except for re-logging in). You can
						// now signal the client to redirect to the core portal
						logger.log( `Logging out ${ uname } (${ sid })`, handlerTag );
						response.set( "Content-Type", "application/json" );
						response.status( 200 ).send(
							rf.asCommonStr( true, {
								"msg": "The user has been logged out"
							} )
						).end();
					}
				}
			};

			// Remove session data from db to effectively log user out
			au.clearSession( credentials.mdbi.accessToken, sid, queryCallback );
		}
	}
);

// @endpoint		(POST) /add
// @description		This endpoint provides the client the ability to add a user to the Core
//					database
// @parameters		(object) request		The web request object provided by express.js. The
//											request body is expected to contain the following
//											members:
//							(string) sessionID		The client's session token
//							(number) userID			The client's logged-in member ID for session
//													verification purposes
//							(object) newUser		A JSON object representing the user to add to
//													the database. This must contain all required
//													parameters and may contain any number of the
//													optional (i.e. "~") parameters:
//									(string) firstName		The new user's first name
//									(string) middleInitial	The new user's middle initial
//									(string) lastName		The new user's last name
//									(string) userName		The new user's selected user name
//									(string) passWord		The new user's password in plain text
//									(string) email			The new user's email address
//									(~Date) endDate			The new user's membership plan
//															expiration date. If omitted, this
//															defaults to the current semester's end
//															Date.
//									(~Date) startDate		The new user's start date for Core
//															systems/Member systems access. If
//															omitted, this defaults to the current
//															Date.
//									(~Date) gradDate		The new user's expected graduation
//															Date. If omitted, this defaults to
//															false
//									(~boolean) emailOptIn	A boolean specifying whether the user
//															wants to receive emails from us. This
//															defaults to false.
//									(~string) major			The new user's current major. This
//															defaults to an empty string
//									(~number) doorcodeId	The dcID of the new user's door code.
//															If omitted, a doorcode will not be
//															assigned (i.e. this value is set to
//															false)
//									(~number) levelId		The id of the clearance level to
//															assign to the new user. If omitted,
//															this defaults to 2 (Member)
//					(object) response		The web response object provided by express.js
// @returns			On success:
//						a code 200 and a sucess message (response format object)
//					On invalid or expired session token:
//						a code 200, and an error format object describing the issue
//					On existing user error:
//						a code 200, and an error format object describint the existence of the
//						user
//					On invalid or insufficient permissions:
//						a code 200, and an error format object describing the issue
//					On failure:
//						a code 500, and an error format object describing the failure
apiInfo.args.add = [
	{
		"name": "request.sessionID",
		"type": "string",
		"desc": "The client's session token"
	},
	{
		"name": "request.userID",
		"type": "number",
		"desc": "The client's logged-in member ID for session verification purposes"
	},
	{
		"name": "request.newUser",
		"type": "object",
		"desc": "A JSON object representing the user to add to the database. This must contain " +
				"all required parameters and may contain any or all of the optional (i.e. \"~\"" +
				") parameters:"
	},
	{
		"name": "request.newUser.firstName",
		"type": "string",
		"desc": "The new user's first name"
	},
	{
		"name": "request.newUser.middleInitial",
		"type": "string",
		"desc": "The new user's middle initial"
	},
	{
		"name": "request.newUser.lastName",
		"type": "string",
		"desc": "The new user's last name"
	},
	{
		"name": "request.newUser.userName",
		"type": "string",
		"desc": "The new user's selected user name"
	},
	{
		"name": "request.newUser.passWord",
		"type": "string",
		"desc": "The new user's password in plain text"
	},
	{
		"name": "request.newUser.email",
		"type": "string",
		"desc": "The new user's email address"
	},
	{
		"name": "request.newUser.endDate",
		"type": "~Date",
		"desc": "The new user's membership plan expiration date. If omitted, this defaults to " +
				"the current semester's end Date."
	},
	{
		"name": "request.newUser.startDate",
		"type": "~Date",
		"desc": "The new user's start date for Core systems/Member systems access. If " +
				"omitted, this defaults to the current Date"
	},
	{
		"name": "request.newUser.gradDate",
		"type": "~Date",
		"desc": "The new user's expected graduation date. If omitted, this defaults to null."
	},
	{
		"name": "request.newUser.emailOptIn",
		"type": "~string",
		"desc": "A boolean specifying whether the user wants to receive emails from us. This " +
				"defaults to false."
	},
	{
		"name": "request.newUser.major",
		"type": "~string",
		"desc": "The new user's current major. This defaults to an empty string."
	},
	{
		"name": "request.newUser.doorcodeId",
		"type": "~number",
		"desc": "The dcId of the new user's door code. If omitted, a doorcode will not be " +
				"assigned (i.e. this value is set to null)."
	},
	{
		"name": "request.newUser.levelId",
		"type": "~number",
		"desc": "The id of the clearance level to assign to the new user. If omitted, this " +
				"defaults to 2 (Member)."
	}
];
apiInfo.rval.add = [
	{
		"condition": "On success",
		"desc": "A code 200 and a success message (response format object)"
	},
	{
		"condition": "On invalid/expired session token",
		"desc": "A code 200 and an error format object describing the issue"
	},
	{
		"condition": "On existing user error",
		"desc": "A code 200, and an error format object describing the the existence of the user"
	},
	{
		"condition": "On failure",
		"desc": "A code 500 and an error format object describing the failure"
	}
];
api.register(
	"Add",
	"POST",
	"/add",
	"This endpoint provides the client the ability to add a user to the Core database",
	apiInfo.args.add,
	apiInfo.rval.add,
	function ( request, response ) {

		var handlerTag = { "src": "(post) /api/user/add" };
		var sessionID = ( typeof request.body.sessionID !== "undefined" ) ? request.body.sessionID : null;
		var userID = ( typeof request.body.userID !== "undefined" ) ? request.body.userID : null;
		var newUser = ( typeof request.body.newUser !== "undefined" ) ? request.body.newUser : null;
		var session = null;		// houses session data of the user to verify

		// First, set the response content type to json
		response.set( "Content-Type", "application/json" );

		// Next, verify that the client session is valid
		au.verifySession( credentials.mdbi.accessToken, sessionID, function ( valid, error, sessionData ) {

			// Record the client's session data
			session = sessionData;
			// If there was a verification error
			if ( error ) {

				// Reply with an error message
				logger.log(`Error: ${error}`, handlerTag);
				response.status( 500 ).send(
					ef.asCommonStr( ef.struct.coreErr, error )
				).end();
			} else if ( !valid ) {

				// Else if the token is invalid, reply with the appropriate error
				logger.log( `Error: Invalid session token`, handlerTag );
				response.status( 200 ).send(
					ef.asCommonStr( ef.struct.expiredSession )
				).end();
			} else {

				// Otherwise, proceed to check if the user is capable of adding a user
				au.isCapable( [0], userID, capabilityCallback );
			}
		} );

		var capabilityCallback = function ( result ) {

			// Run a capability check
			switch ( result ) {
				case -1: {

					// If the capability check encountered an error, throw the error
					logger.log( `Permissions check is incomplete`, handlerTag );
					response.status( 500 ).send(
						ef.asCommonStr( ef.struct.coreErr, {
							"msg": "Permissions check is incomplete"
						} )
					).end();
					break;
				}
				case false: {

					// If the client doesn't have add permissions, deny their request
					var msg = `User with memberID "${session.memberID}" not permitted` +
					" to perform member addition";
					logger.log( msg, handlerTag );
					response.status( 200 ).send(
						ef.asCommonStr( ef.struct.adminUnauthorized, { "msg": msg } )
					).end();
					break;
				}
				case true: {

					// Prepare aggregation POST request options
					var aggregationBody = {
						"accessToken": credentials.mdbi.accessToken,
						"collection": "Member",
						"pipeline": [
							{
								"$match": {
									"userName": {
										"$eq": newUser.userName
									}
								}
							}
						]
					};
					var aggregationOptions = {
						"hostname": "localhost",
						"path": "/mdbi/search/aggregation",
						"method": "POST",
						"agent": ssl_user_agent,
						"headers": {
							"Content-Type": "application/json",
							"Content-Length": Buffer.byteLength(
								JSON.stringify( aggregationBody )
							)
						}
					};

					// If the user has the ability, Let's go ahead first check that the provided
					// new user doesn't already exist in the database
					logger.log(
						`Authorization verified. Performing redundancy check...`,
						handlerTag
					);
					www.https.post( aggregationOptions, aggregationBody, aggregationCallback );
					break;
				}
			}
		};

		var aggregationCallback = function ( reply, error ) {

			// Determine what to do after the aggregation completed
			if ( error ) {

				// If an error occurred,
				logger.log( `Redundancy check failed: ${error}`, handlerTag );
				response.status( 500 ).send(
					ef.asCommonStr( ef.struct.coreErr, {
						"error": error
					} )
				).end();
			} else {

				// Otherwise, process the data returned from the aggregation
				var userAlreadyExists = reply.length > 0 ? true : false;
				if ( userAlreadyExists ) {

					// If user already exists, abort the operation and report the failure
					logger.log(
						`User "${newUser.userName}" already exists. Aborting...`,
						handlerTag
					);
					response.status( 200 ).send(
						ef.asCommonStr( ef.struct.mdbiNoEffect, {
							"msg": `User "${newUser.userName}" already exists. Aborting...`
						} )
					).end();
				} else {

					// Otherwise, go ahead and add the user to the database
					var addUserBody = {
						"accessToken": credentials.mdbi.accessToken,
						"collection": "Member",
						"data": {
							"firstName": newUser.firstName,
							"middleInitial": newUser.middleInitial,
							"lastName": newUser.lastName,
							"userName": newUser.userName,
							"passWord": crypt.hashPwd( newUser.userName, newUser.passWord ),
							"email": newUser.email,
							"emailVerified": false,		// new user; email is not verified yet
							"emailOptIn": true,			// default this to true
							"major": typeof newUser.major !== "undefined" ? newUser.major : "",
							"lastLogin": false			// new user; they haven't logged in yet
						}
					};
					var addUserOptions = {
						"hostname": "localhost",
						"path": "/mdbi/write",
						"method": "POST",
						"agent": ssl_user_agent,
						"headers": {
							"Content-Type": "application/json",
							"Content-Length": Buffer.byteLength( JSON.stringify( addUserBody ) )
						}
					};

					// Send the request to add this user to the database
					www.https.post( addUserOptions, addUserBody, function ( reply, error ) {

						// Check for errors
						if ( error ) {

							// If error, report the error
							var errStr = ef.asCommonStr( ef.struct.httpsPostFail, error );
							logger.log( `New user registration failed: ${ errStr }`, handlerTag );
							response.status( 500 ).send( errStr ).end();
						} else {

							// If no error, intialize the member's membership data
							insertionCallback();
						}
					} );

					// // DEBUG
					// response.status( 200 ).send(
					// 	rf.asCommonStr( true, {
					// 		"agReply": reply,
					// 		"agError": error
					// 	} )
					// ).end();
				}
			}
		};

		// After a successful insertion, we next want ot populate the user's membership data
		var insertionCallback = function () {

			// Now that we have inserted the new user's Member data, we must acquire its memberID
			// to associate with the corresponding MembershipData document
			var body = {
				"accessToken": credentials.mdbi.accessToken,
				"collection": "Member",
				"search": {
					"userName": newUser.userName
				}
			};
			var options = {
				"hostname": "localhost",
				"path": "/mdbi/search/documents",
				"method": "POST",
				"agent": ssl_user_agent,
				"headers": {
					"Content-Type": "application/json",
					"Content-Length": Buffer.byteLength( JSON.stringify( body ) )
				}
			};

			// Send the request to find the member you just added
			www.https.post( options, body, function ( reply, error ) {

				// Check for errors
				if ( error ) {

					// If error, report the error
					var errStr = ef.asCommonStr( ef.struct.httpsPostFail, error );
					logger.log( `New user registration failed: ${ errStr }`, handlerTag );
					response.status( 500 ).send( errStr ).end();
				} else {

					// If no error, initialize a MembershipData Document for this member
					var newUserMembershipData = {
						"memberID": reply[0].memberID,
						"startTerm": new Date( Date.now() ),	// set to current date
						"endTerm": "",		// TODO: define funct to get current semester end date
						"doorCodeID": 	typeof newUser.doorcodeID === "undefined" ?
										false : newUser.doorcodeID,
						"gradDate": 	typeof newUser.gradDate === "undefined" ?
										false : newUser.gradDate,
						"level": 2,					// new user; set to member level
						"membershipStatus": false	// new user; set false until email is verified
					};

					// Prepare a request to insert the new membership data
					var body = {
						"accessToken": credentials.mdbi.accessToken,
						"collection": "MembershipData",
						"data": newUserMembershipData,
						"options": {
							"preserveKey": true		// ensure the memberID isn't overwritten by __docId__ due to race cond.
						}
					};
					var options = {
						"hostname": "localhost",
						"path": "/mdbi/write",
						"method": "POST",
						"agent": ssl_user_agent,
						"headers": {
							"Content-Type": "application/json",
							"Content-Length": Buffer.byteLength( JSON.stringify( body ) )
						}
					};

					// Send request
					www.https.post( options, body, function ( reply, error ) {

						// Check for errors
						if ( error ) {

							// If error, report error
							var errStr = ef.asCommonStr( ef.struct.httpsPostFail, error );
							logger.log( `Ne user membership registration failed: ${ errStr }`, handlerTag );
							response.status( 500 ).send( errStr ).end();
						} else {

							// Otherwise, send a success message
							// DEBUG
							response.status( 200 ).send(
								rf.asCommonStr( true, {
									"reply": reply
								} )
							).end();
						}
					} );
				}
			} );
		};
	}
);

// @endpoint		(DELETE) /delete
// @description		This endpoint provides a way to delete users from the database. If a deletion
//					is requested, the user's MembershipData entry will first be deleted, followed
//					by their actual Member entry. Since this is a delete request, there actually
//					aren't any body parameters to send. Rather, parameters are embedded into the
//					URL querystring after the "/delete".
// @parameters		(object) request		The web request object provided by express.js.
//					(object) response		The web response object provided by express.js.
//					(string) id				The URL parameter to place after the "/delete", which
//											represents the member ID of the member to delete. For
//											example, making a request to the server using the URL
//											".../api/user/delete?id=13" will delete the member
//											whose member ID is 13
//					(string) sessionID		The client's session token string, embedded in the
//											URL querystring
// @returns			On success:
//						a code 200, and a response format object desribing the deletion success
//					On no deletion:
//						a code 200, and a response format object with "status" set to false and
//						with a message describing the inability to delete
//					On unauthorized action:
//						a code 200, and an error format object describing your lack of permissions
//					On failure:
//						a code 500, and an error format object describing the failure
apiInfo.args.delete = [
	{
		"name": "request",
		"type": "object",
		"desc": "The web request object provided by express.js"
	},
	{
		"name": "response",
		"type": "object",
		"desc": "The web response object provided by express.js"
	},
	{
		"name": "querystring.id",
		"type": "string",
		"desc": "The URL parameter to place after the \"/delete\", which represents the member " +
				"ID of the member to delete. For example, making a request to the server using " +
				"the URL \".../api/user/delete?id=13\" will delete the member whose member ID " +
				"is 13"
	},
	{
		"name": "querystring.sessionID",
		"type": "string",
		"desc": "The client's session token string, embedded in the URL querystring"
	}
];
apiInfo.rval.delete = [
	{
		"condition": "On success",
		"desc": "a code 200, and a response format object desribing the deletion success"
	},
	{
		"condition": "On no deletion",
		"desc": "a code 200, and a response format object with \"status\" set to false and " +
				"with a message describing the inability to delete"
	},
	{
		"condition": "On unauthorized action",
		"desc": "a code 200, and an error format object describing your lack of permissions"
	},
	{
		"condition": "On failure",
		"desc": "a code 500, and an error format object describing the failure"
	}
];
api.register(
	"Delete",
	"DELETE",
	"/delete",
	"This endpoint provides a way to delete users from the database. If a deletion is requested" +
	", the user's MembershipData entry will first be deleted, followed by their actual Member " +
	"entry. Since this is a delete request, there actually aren't any body parameters to send. " +
	"Rather, parameters are embedded into the URL querystring after the \"/delete\".",
	apiInfo.args.delete,
	apiInfo.rval.delete,
	function ( request, response ) {

		// Acquire required request parameters
		var handlerTag = { "src": "(post) /api/user/search" };
		var sessionID = (typeof request.query.sessionID !== "undefined") ? request.query.sessionID : null;
		var idToDelete = (typeof request.query.id !== "undefined") ? request.query.id : null;

		// Set the response content type to application JSON
		response.set("Content-Type", "application/json");

		// Verify the client's session
		au.verifySession( credentials.mdbi.accessToken, sessionID, function( valid, error, sessionData ) {

			// Check if a session verification error occurred
			if ( error ) {

				// If error, report error
				logger.log( `Error: ${error}`, handlerTag );
				response.status( 500 ).send(
					ef.asCommonStr( ef.struct.coreErr, error )
				).end();
			} else if ( !valid ) {

				// If session token is invalid, report invalid session token
				logger.log(`Error: Invalid session token`, handlerTag);
				response.status( 200 ).send(
					ef.asCommonStr( ef.struct.expiredSession )
				).end();
			} else {
				
				// Otherwise, check if the client is permitted to delete users
				au.isCapable( [ 2 ], sessionData.memberID, function( result ) {

					// Determine the result of the capability check
					if ( result === -1 ) {

						// If error, report error
						var msg = `Error: Capability check failed`;
						logger.log( msg , handlerTag );
						response.status( 500 ).send(
							ef.asCommonStr( ef.struct.coreErr, { "msg": msg } )
						).end();
					} else if ( !result ) {

						// If the client is not capable, report it
						var msg = `Member id ${sessionData.memberID} not permitted to delete users`;
						logger.log( msg, handlerTag );
						response.status( 200 ).send(
							ef.asCommonStr( ef.struct.adminUnauthorized, {
								"msg": "You are not permitted to delete users"
							} )
						).end();
					} else {

						// If the capability check succeeded, proceed to delete the requested user
						deleteMembershipData( idToDelete );
					}
				} );
			}
		} );

		// This callback deletes the membership data of the user specified by "userID"
		var deleteMembershipData = function( userID ) {

			// Prepare request parameters
			var body = {
				"accessToken": credentials.mdbi.accessToken,
				"collection": "MembershipData",
				"search": {
					"memberID": userID
				}
			};
			var options = {
				"hostname": "localhost",
				"path": "/mdbi/delete/document",
				"method": "POST",
				"agent": ssl_user_agent,
				"headers": {
					"Content-Type": "application/json",
					"Content-Length": Buffer.byteLength( JSON.stringify( body ) )
				}
			};

			// Send the request to delete the member's membership data
			www.https.post( options, body, function( reply, error ) {

				// Check for errors
				if ( error ) {

					// If error, report error
					logger.log( `MembershipData delete failed: ${error}`, handlerTag );
					response.status( 500 ).send(
						ef.asCommonStr( ef.struct.coreErr )
					).end();
				} else {

					// DEBUG
					// response.status( 200 ).send(
					// 	rf.asCommonStr( true, {
					// 		"deleteMembershipDataReply": reply
					// 	} )
					// ).end();
					// Process the results of the operation
					if ( reply.ok === 0 ) {

						// If the db didn't acknowledge your request, report it
						logger.log( `Delete MembershipData Error: Mongo replied with NACK (${reply})`, handlerTag );
						response.status( 500 ).send(
							ef.asCommonStr( ef.struct.unexpectedValue, {
								"msg": "Error: Database replied with NACK"
							} )
						).end();
					} else if ( reply.n === 0 ) {

						// If the delete didn't do anything, reply with an error
						logger.log( `Delete MembershipData Error: No document was deleted`, handlerTag );
						response.status( 500 ).send(
							ef.asCommonStr( ef.struct.mdbiNoEffect, {
								"msg": "No membership data document matched the deletion search"
							} )
						).end();
					} else {

						// Otherwise, proceed to finally delete the member's entry
						deleteMember( userID );
					}
				}
			} );
		};

		// This callback deletes a member's entry from the member collection specified by "userID"
		var deleteMember = function( userID ) {

			// Prepare request parameters
			var body = {
				"accessToken": credentials.mdbi.accessToken,
				"collection": "Member",
				"search": {
					"memberID": userID
				}
			};
			var options = {
				"hostname": "localhost",
				"path": "/mdbi/delete/document",
				"method": "POST",
				"agent": ssl_user_agent,
				"headers": {
					"Content-Type": "application/json",
					"Content-Length": Buffer.byteLength( JSON.stringify( body ) )
				}
			};

			// send the request to delete the member from the member collection
			www.https.post( options, body, function( reply, error ) {

				// Check for errors
				if ( error ) {

					// If error, report error
					logger.log( `Member delete failed: ${error}`, handlerTag );
					response.status( 500 ).send(
						ef.asCommonStr( ef.struct.coreErr )
					).end();
				} else {

					// Process the results of the operation
					if ( reply.ok === 0 ) {

						// If the db didn't acknowledge your request, report it
						logger.log( `Delete Member Error: Mongo replied with NACK (${reply})`, handlerTag );
						response.status( 500 ).send(
							ef.asCommonStr( ef.struct.unexpectedValue, {
								"msg": "Error: Database replied with NACK"
							} )
						).end();
					} else if ( reply.n === 0 ) {

						// If the delete didn't do anything, reply with an error
						logger.log( `Delete Member Error: No document was deleted`, handlerTag );
						response.status( 500 ).send(
							ef.asCommonStr( ef.struct.mdbiNoEffect, {
								"msg": "No member document matched the deletion search"
							} )
						).end();
					} else {

						// Otherwise, respond with a success message
						logger.log( `Member ${userID} removed from database`, handlerTag );
						response.status( 200 ).send(
							rf.asCommonStr( true, {
								"msg": "Member was successfully deleted"
							} )
						).end();
					}
				}
			} );
		};
	}
);

// @endpoint		(GET) /search
// @description		This endpoint serves as a general way to search for one or more users given
//					some search criteria. It combines legacy APIs '/dashboard/search/members'
//					and '/dashboard/search/memberdata' into one API that acquires all info
//					about a given user.
// @parameters		(object) request		The web request object provided by express.js. The
//											request body is expected to contain the following
//											members:
//							(string) sessionID		The client's session token
//							(string) searchType		The type of search to execute. Currently
//													supported search types include "username",
//													"first name", "last name", "join date",
//													"email", "id", and "major"
//							(string) searchTerm		The term to search for
//							~(object) options		A JSON object containing options to customize
//													the result set after it is returned from the
//													search. If given, it may contain any or all of
//													the following:
//									(~number) resultMax		The maximum number of results to
//															return. The default is 100 results.
//									(~boolean) regexMode	A boolean specifying whether or not to
//															interpret the searchTerm as a regular
//															expression.
//									(~number) pageNumber	The page number of the result page
//															to return
//					(object) response		The web response object provided by express.js
// @returns			On success:
//						a code 200, and a list (array) of returned search results, or null if no
//						results were found
//					On invalid or expired session token:
//						a code 499, and an error format object
//					On failure:
//						a code 500 and an error format object
apiInfo.args.search = [
	{
		"name": "request.sessionID",
		"type": "string",
		"desc": "The client's session token"
	},
	{
		"name": "request.searchType",
		"type": "string",
		"desc":	"The type of search to execute. Currently supported search types include " +
				'"username", "first name", "last name", "join date", "email", "id" and "major"'
	},
	{
		"name": "request.searchTerm",
		"type": "string",
		"desc": "The term to search for"
	},
	{
		"name": "request.options",
		"type": "~object",
		"desc":	"An optional JSON object to customize the result set after it is returned from " +
				"the search. If given, it may contain any or all of the following parameters:"
	},
	{
		"name": "request.options.resultMax",
		"type": "~number",
		"desc": "The maximum number of results to return. The default is 100 results"
	},
	{
		"name": "request.options.regexMode",
		"type": "~boolean",
		"desc":	"A boolean specifying whether or not to interpret the searchTerm as a regular " +
				"expression"
	},
	{
		"name": "request.options.pageNumber",
		"type": "~number",
		"desc":	"The page number of the result page to return"
	}
];
apiInfo.rval.search = [
	{
		"condition": "On success",
		"desc":	"a code 200, and a list (array) of returned search results, or null if no " +
				"results were found"
	},
	{
		"condition": "On invalid or expired session token",
		"desc": "a code 499, and an error format object"
	},
	{
		"condition": "On failure",
		"desc": "a code 500 and an error format object"
	}
];
api.register(
	"Search",
	"POST",
	"/search",
	"This endpoint serves as a general way to search for one or more users given some search " +
	"criteria. It combines legacy APIs '/dashboard/search/members' and '/dashboard/search/" +
	"memberdata' into on API that acquires all info about a given user.",
	apiInfo.args.search,
	apiInfo.rval.search,
	function (request, response) {
		var handlerTag = {"src": "(post) /api/user/search"};
		var sessionID = (typeof request.body.sessionID !== "undefined") ? request.body.sessionID : null;
		var isRegex = false;
		var resultsPerPage = null;
		var pageNum = null;
		// logger.log(`This is the requested max results per page: ${resultsPerPage}`, handlerTag);	// debug
	
		// Acquire options, if any
		if (typeof request.body.options !== "undefined") {
			
			if (typeof request.body.options.resultMax === "number") {
				
				resultsPerPage = request.body.options.resultMax;
			}
			
			if (typeof request.body.options.pageNumber === "number") {
				
				pageNum = request.body.options.pageNumber;
			}
			
			if (typeof request.body.options.regexMode === "boolean") {
				
				isRegex = request.body.options.regexMode;
			}
		}
	
		var mdbiSearchCallback = function (reply, error) {	// expects reply to be an array of the found matches
			if (error) {
				
				logger.log(`MDBI search failed: ${error}`, handlerTag);
				response.status(500).send(ef.asCommonStr(ef.struct.coreErr, error)).end();
			} else if (reply === null) {
				
				logger.log(`Search returned null`, handlerTag);
				response.status(200).send(
					rf.asCommonStr( true, null )
				).end();
			} else {
				
				// Send the found results to the client
				logger.log(`${reply.length} ${(reply.length === 1) ? "result" : "results"} found`, handlerTag);
				if (reply.length === 0) {
					response.status(200).send(
						rf.asCommonStr( true, reply )
					).end();
				} else {
					response.status(200).send(
						rf.asCommonStr( true, reply )
					).end();
				}
			}
		};
	
		var verificationCallback = function (valid, error) {
			
			response.set("Content-Type", "application/json");
			
			if (error) {
				
				logger.log(`Error: ${error}`, handlerTag);
				response.status(500).send(ef.asCommonStr(ef.struct.coreErr, error)).end();
			} else if (!valid) {
				
				logger.log(`Error: Invalid session token`, handlerTag);
				response.status(499).send(ef.asCommonStr(ef.struct.expiredSession)).end();
			} else {
				
				var validFormat = true;
				var searchPostBody = {
					"accessToken": credentials.mdbi.accessToken,
					"collection": "Member",
					"pipeline": [],
					"agOptions": {}
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

	
				// Determine the type of search to make
				logger.log(`Authorization verified. Now checking for matches to ${typeof request.body.searchTerm} ${request.body.searchTerm} (${(pageNum === null) ? "unpaginated" : `page ${pageNum}`})...`, handlerTag);
				if (request.body.searchTerm === "" || typeof request.body.searchTerm === "undefined") {
					
					// If search term is null, tell the pipeline to search for everything
					// searchPostBody.search = {};
					searchPostBody.pipeline.push( {
						"$match": {
							"memberID": {
								"$ne": -1
							}
						}
					} );
				} else {

					// Determine how to format the search criteria, based on the search type
					var stype = "invalid";
					switch (request.body.searchType) {
						
						case "id": {
							
							stype = "memberID";
							break;
						}

						case "username": {
							
							stype = "userName";
							break;
						}
						
						case "first name": {
							
							stype = "firstName";
							break;
						}
						
						case "last name": {
							
							stype = "lastName";
							break;
						}
						
						case "join date": {
							
							stype = "joinDate";
							break;
						}
						
						case "email": {
							
							stype = "email";
							break;
						}
						
						case "major": {
							
							stype = "major";
							break;
						}

						default: {
							
							logger.log(`Invalid search type "${request.body.searchType}"!`, handlerTag);
							validFormat = false;
							break;
						}
					}
	
					// Place search term in the search post body, based on any relevant search
					// modifiers provided
					var objectToPlace = request.body.searchTerm;
					var pipelineStage = {
						"$match": {
							"$and": [

								// Remove the placeholder item from the search results
								{
									"memberID": {
										"$ne": -1
									}
								},
								{}
							]
						}
					};

					// If a regular expression was submitted, tell MongoDB to parse the string as
					// a regular expression
					if (isRegex) {
						objectToPlace = {
							"$regex": request.body.searchTerm
						};
					}

					// Add the search matching pipeline stage to the pipeline queue
					pipelineStage["$match"]["$and"][1][stype] = objectToPlace;
					searchPostBody.pipeline.push( pipelineStage );
				}
	
				// Add a lookup pipepline stage to append member data to the result set
				searchPostBody.pipeline.push(

					// Add a pipeline query to merge membership data to member data using a left
					// outer join (i.e. $lookup)
					{
						"$lookup": {
							"from": "MembershipData",
							"localField": "memberID",
							"foreignField": "memberID",
							"as": "memberData"
						}
					},

					// Add pipeline queries to append the user's associated doorcode
					{
						"$lookup": {
							"from": "DoorCode",
							"localField": "memberData.doorCodeID",
							"foreignField": "dcID",
							"as": "doorCodeData"
						}
					},

					// Add pipeline queries to append the user's ability data
					{
						"$lookup": {
							"from": "ClearanceLevel",
							"localField": "memberData.level",
							"foreignField": "cID",
							"as": "clevelData"
						}
					},

					// Flatten membership data
					{
						"$replaceRoot": {
							"newRoot": {
								"memberID": "$memberID",
								"firstName": "$firstName",
								"middleInitial": "$middleInitial",
								"lastName": "$lastName",
								"joinDate": "$joinDate",
								"userName": "$userName",
								"passWord": "$passWord",
								"email": "$email",
								"emailVerified": "$emailVerified",
								"emailOptIn": "$emailOptIn",
								"major": "$major",
								"lastLogin": "$lastLogin",
								"startTerm": "$memberData.startTerm",
								"endTerm": "$memberData.endTerm",
								"doorCodeID": "$memberData.doorCodeID",
								"doorcode": "$doorCodeData.code",
								"gradDate": "$memberData.gradDate",
								"level": "$memberData.level",
								"levelName": "$clevelData.levelName",
								"abilities": "$clevelData.abilities",
								"membershipStatus": "$memberData.membershipStatus"
							}
						}
					},

					// Restore membership data to top-level parameters instead of array members
					{
						"$unwind": {
							"path": "$startTerm",
							"preserveNullAndEmptyArrays": true
						}
					},
					{
						"$unwind": {
							"path": "$endTerm",
							"preserveNullAndEmptyArrays": true
						}
					},
					{
						"$unwind": {
							"path": "$doorCodeID",
							"preserveNullAndEmptyArrays": true
						}
					},
					{
						"$unwind": {
							"path": "$gradDate",
							"preserveNullAndEmptyArrays": true
						}
					},
					{
						"$unwind": {
							"path": "$level",
							"preserveNullAndEmptyArrays": true
						}
					},
					{
						"$unwind": {
							"path": "$levelName",
							"preserveNullAndEmptyArrays": true
						}
					},
					{
						"$unwind": {
							"path": "$abilities",
							"preserveNullAndEmptyArrays": true
						}
					},
					{
						"$unwind": {
							"path": "$membershipStatus",
							"preserveNullAndEmptyArrays": true
						}
					},
					{
						"$unwind": {
							"path": "$doorcode",
							"preserveNullAndEmptyArrays": true
						}
					}
				);

				// Configure search with any provided options
				if (resultsPerPage !== null) {

					// Add page number as a custom option
					if (pageNum !== null) {

						searchPostBody.pipeline.push( {
							"$skip": pageNum * resultsPerPage
						} );
					}
					
					// Add results per page as a custom option
					searchPostBody.pipeline.push( {
						"$limit": resultsPerPage
					} );
				}

				// Recalculate Content-Length header; the above options caused the body length
				// to change!
				searchPostOptions.headers["Content-Length"] = Buffer.byteLength(JSON.stringify(searchPostBody));

				// Execute MDBI search here...
				if (!validFormat) {

					logger.log(`A formatting error occurred!`, handlerTag);
					response.status(499).send(ef.asCommonStr(ef.struct.invalidBody)).end();
				} else {

					// Search with MDBI here...
					www.https.post(searchPostOptions, searchPostBody, mdbiSearchCallback, handlerTag.src);
				}
			}
		};

		au.verifySession(credentials.mdbi.accessToken, sessionID, verificationCallback);
	}
);

// @endpoint		(POST) /edit
// @description		This endpoint enables the modification of member and membership data. It is a
//					combination of the legacy APIs "/dashboard/edit/memberfield", "/dashboard
//					/edit/membershipstatus", and "/dashboard/edit/dc", enabling the user to edit
//					all of a user's primary account info, membership data, and associated door
//					code ID, all with a single API
// @parameters		(object) request		The web reqeust object provided by express.js. The
//											request body ix expcected to contain the following
//											members:
//							(string) sessionID		The client's session token
//							(number) memberID		The member id of the account to edit
//							(object) fields			A JSON object specifying the fields to edit.
//													The object's keys can include any of the
//													valid field names within the Member and the
//													MembershipData collections; This endpoint will
//													automatically determine which collection(s)
//													your data belongs to, and update the
//													appropriate fields.
// @returns			On success:
//							a code 200, and a success response-formatted object
//					On invalid/expired session token:
//							a code 499 and an error-formatted object in the response body
//							detailng the expired session token issue
//					On illegal/unsuccessful update:
//							a code 200 and an error-formatted object in the response body
//							detailing the invalid operation
//					On any other failure:
//							a code 500 and an error format object
apiInfo.args.edit = [
	{
		"name": "request.sessionID",
		"type": "string",
		"desc": "The client's session token"
	},
	{
		"name": "request.memberID",
		"type": "number",
		"desc": "The member id of the account to edit"
	},
	{
		"name": "request.fields",
		"type": "object",
		"desc":	"A JSON object specifying the fields to edit. The object's keys can include " +
				"any of the valid field names within the member and the MembershipData " +
				"collections; This endpoint will automatically determine which collection(s) " +
				"your data belongs to, and update the appropriate fields."
	}
];
apiInfo.rval.edit = [
	{
		"condition": "On success",
		"desc": "a code 200, and a success response-formatted object"
	},
	{
		"condition": "On invalid/expired session token",
		"desc":	"a code 499, and an error-formatted object in the response body detailing the " +
				"expired session issue"
	},
	{
		"condition": "On illegal/unsuccessful update",
		"desc":	"a code 200, and an error-formatted object in the response body detailing the " +
				"invalid operation"
	},
	{
		"condition": "On any other failure",
		"desc":	"a code 500, and an error-formatted object"
	}
];
api.register(
	"Edit",
	"POST",
	"/edit",
	'This endpoint enables the modification of member and membership data. It is a ' +
	'combination of the legacy APIs "/dashboard/edit/memberfield", "/dashboard' +
	'/edit/membershipstatus", and "/dashboard/edit/dc", enabling the user to edit ' +
	"all of a user's primary account info, membership data, and associated door code ID, " +
	'all with a single API',
	apiInfo.args.edit,
	apiInfo.rval.edit,
	function ( request, response ) {

		// Acquire request body arguments
		var handlerTag = { "src": "(post) /api/user/edit" };
		var sessionID = ( typeof request.body.sessionID !== "undefined" ) ?
			request.body.sessionID : null;
		var memberID = ( typeof request.body.memberID !== "undefined" ) ?
			request.body.memberID : null;
		var fields = ( typeof request.body.fields !== "undefined" ) ?
			request.body.fields : null;
		var session = null;

		// Set the content type of the response to json
		response.set( "Content-Type", "application/json" );

		// Create a record of data fields to update for each relevant collection
		var updateQueue = organizeUpdates( fields );

		// Structure the update queries for both Member and MembershipData collections
		var queries = buildEditQueries( memberID, updateQueue );

		// Create a Promise to update data in the MemberCollection
		var updateMC = new Promise( function ( resolve, reject ) {

			// Send requests
			logger.log(
				`Authorization verified. Performing member data update...`,
				handlerTag
			);

			// If the query includes data for modifying the Member collection,
			// we should execute the request
			if ( queries.body.Member !== false ) {
				
				// Send a POST request to the MDBI to update the Member collection with any
				// queued updates
				www.https.post(
					queries.options.Member,
					queries.body.Member,
					function ( reply, error ) {
						
						// Check for any errors in the Member collection update
						if ( error ) {
	
							// Some MDBI error happened
							logger.log( `MDBI update failed: ${error}`, handlerTag );
							reject( {
								"statusCode": 500,
								"responseMsg": JSON.parse(
									ef.asCommonStr( ef.struct.coreErr, error )
								)
							} );
						} else if ( reply.nModified < 1 ) {
	
							// If updates were queued for the Member collection and the MDBI wasn't
							// able to update any document at all for this collection, reply with an
							// MDBI_NO_EFFECT error to the promise
							var efmt = ef.asCommonStr( ef.struct.mdbiNoEffect, {
								"unmodified": {
									"collection": "Member",
									"fields": updateQueue.Member
								}
							} );
							logger.log( efmt, handlerTag );
							resolve( {
								"statusCode": 499,
								"responseMsg": JSON.parse( efmt )
							} );
						} else if ( reply.nModified > 1 ) {
	
							// FATAL: The MDBI updated several documents (i.e. data corruption)
							var efmt = ef.asCommonStr( ef.struct.mdbiMultiEffect );
							logger.log( efmt, handlerTag );
							reject( {
								"statusCode": 499,
								"responseMsg": JSON.parse( efmt )
							} );
						} else {
	
							// Otherwise, log the success
							resolve( {
								"statusCode": 200,
								"responseMsg": JSON.parse(
									rf.asCommonStr( true, {
										"msg": "Member collection successfully updated"
									} )
								)
							} );
						}
					},
					handlerTag.src
				);
			} else {

				// If no updates to the Member collection are requested, Simply resolve
				resolve( {
					"statusCode": 200,
					"responseMsg": JSON.parse(
						rf.asCommonStr( true, {
							"msg": "No Member collection updates queued. Skipping..."
						} )
					)
				} );
			}
		} );

		// Create a Promise to update data in the MembershipData collection
		var updateMdC = new Promise( function ( resolve, reject ) {

			// Send the membership update request
			logger.log(
				`Member data update complete. Updating membership data`,
				handlerTag
			);

			// Send a POST request to the MDBI to update the MembershipData Collection with any
			// queued updates
			if ( queries.body.MembershipData !== false ) {
				
				// If there are any updates requested for the MembershipData collection, then
				// perform the updates
				www.https.post(
					queries.options.MembershipData,
					queries.body.MembershipData,
					function ( reply, error ) {
	
						// Check for any errors in the MembershipData collection update
						if ( error ) {
	
							// Some MDBI error happened
							logger.log( `MDBI membership update failed: ${error}`, handlerTag );
							reject( {
								"statusCode": 500,
								"responseMsg": JSON.parse(
									ef.asCommonStr( ef.struct.coreErr, error )
								)
							} );
						} else if ( reply.nModified < 1 ) {
	
							// If updates were queued for the MembershipData collection and the
							// MDBI wasn't able to update anything, reply with an MDBI_NO_EFFECT
							// error to the promise
							var efmt = ef.asCommonStr( ef.struct.mdbiNoEffect, {
								"unmodified": {
									"collection": "MembershipData",
									"fields": updateQueue.MembershipData
								}
							} );
							logger.log( efmt, handlerTag );
							resolve( {
								"statusCode": 499,
								"responseMsg": JSON.parse( efmt )
							} );
						} else if ( reply.nModified > 1 ) {
	
							// FATAL: The MDBI updated several documents
							var efmt = ef.asCommonStr( ef.struct.mdbiMultiEffect );
							logger.log( efmt, handlerTag );
							reject( {
								"statusCode": 499,
								"responseMsg": JSON.parse( efmt )
							} );
						} else {
	
							// Otherwise, reply with success
							resolve( {
								"statusCode": 200,
								"responseMsg": JSON.parse(
									rf.asCommonStr( true, {
										"msg": "MembershipData collection successfully updated"
									} )
								)
							} );
						}
					},
					handlerTag.src
				);
			} else {

				// Otherwise, do nothing and return the result of the operation
				resolve( {
					"statusCode": 200,
					"responseMsg": JSON.parse(
						rf.asCommonStr( true, {
							"msg": "No MembershipData cosllection updates queued. Skipping..."
						} )
					)
				} );
			}
		} );

		// Define a callback to run after running the capability check
		var capabilityCallback = function ( result ) {

			// Do different things based on the result of the capabililty check
			switch ( result ) {

				// If the permissions check failed
				case -1: {

					// Throw an error
					logger.log( `Permissions check is incomplete`, handlerTag );
					response.status( 499 ).send(
						ef.asCommonStr( ef.struct.coreErr )
					).end();
					break;
				}

				// Else, if the user is not authorized
				case false: {

					// Report to the client that the user is not allowed to modify data
					logger.log( `User with memberID "${session.memberID}" not permitted` +
					" to perform member data modification", handlerTag );
					response.status( 499 ).send(
						ef.asCommonStr( ef.struct.adminUnauthorized )
					).end();
				}

				// Otherwise, the user is likely authorized to perform this action
				case true: {

					// If the user is authorized, perform the updates as Promises
					Promise.all( [
						updateMC,
						updateMdC
					] ).then( function ( valOnSuccess ) {

						// If both promises resolve, then no serious errors occurred. Check for
						// warnings
						var warnings = [];
						var successes = [];
						for ( var i = 0; i < valOnSuccess.length; i++ ) {

							// If any of the query results is not a code 200, it counts as an
							// unsuccessful attempt
							if ( valOnSuccess[i].statusCode !== 200 ) {

								warnings.push( valOnSuccess[i] );
							} else {

								successes.push( valOnSuccess[i] );
							}
						}

						// If absolutely none of our queries worked, it's a hard failure
						if ( successes.length === 0 ) {

							// Collect the unmodified
							// On a hard failure, return a code 499 and MDBI_
							// response.status( 200 ).send( valOnSuccess ).end();
							response.status( 200 ).send( ef.asCommonStr(
								ef.struct.mdbiNoEffect, {
									"unmodified": warnings
								}
							) ).end();
						} else if ( warnings.length > 0 ) {

							// Otherwise, if the request didn't ENTIRELY fail, but still partially
							// failed, send a "soft" error
							response.status( 200 ).send( ef.asCommonStr(
								ef.struct.mdbiPartialEffect, {
									"unmodified": warnings,
									"modified": successes
								}
							) ).end();
						} else {

							// Finally, if no warnings were generated and all our queries were
							// successful, send a success message
							response.status( 200 ).send( rf.asCommonStr( true, {
								"msg": "User data successfully modified",
								"result": successes
							} ) );
						}
					}, function ( valOnFailure ) {

						// If any one of the promises rejects, this is a failure. Reply to the
						// client with the given error
						response.status(
							valOnFailure.statusCode
						).send(
							valOnFailure.responseMsg
						).end();
					} );
					break;
				}

				// If none of the above options occurred, we received an unexpected value
				default: {

					// Throw an error
					logger.log( `Error: Unexpected value received: ${result}`, handlerTag );
					response.status( 500 ).send(
						ef.asCommonStr( ef.struct.unexpectedValue, {
							"val": result
						} )
					).end();
					break;
				}
			}
		};

		// Before sending the request, make sure this client isn't expired
		au.verifySession( credentials.mdbi.accessToken, sessionID, function ( valid, error, sData ) {

			// Store the session object that was returned
			session = sData;

			// Check for an error
			if ( error ) {

				// Tell the client about it
				logger.log( `Error: ${error}`, handlerTag );
				response.status( 500 ).send(
					
					ef.asCommonStr( ef.struct.coreErr, error )
				).end();
			} else if ( !valid ) {

				// Session expired, let the client know it!
				logger.log( `Error: Invalid session token`, handlerTag );
				response.status( 499 ).send(
					
					ef.asCommonStr( ef.struct.expiredSession )
				).end();
			} else {

				// If verification succeeded, let's ensure access control (i.e. check if the
				// client has the ability to change users data)
				au.isCapable( [1], session.memberID, capabilityCallback );
			}
		} );
	}
);


// END User Routes

// BEGIN Utility Functions specific for Users

// @function		organizeUpdates()
// @description		This function takes the object of requested field updates (see endpoint
//					"/edit") and organizes them into their respective update queues
// @parameters		(object) fields			The fields to update (from endpoint "/edit")
// @returns			(object) updateQueue	A JSON object contianing the update data in their
//											respsective collections. For example, if fields is
//											a JSON object with keys "major" and "level", which
//											are fields in two different collections, the resulting
//											updateQueue will be:
//											{
//												"Member": [ { "major": "..." } ],
//												"MembershipData": [ { "level": 0123... } ]
//											}
// @note			This function is intended solely for the "/edit" endpoint
function organizeUpdates ( fields ) {

	// Initialize an empty update queue for all possible fields that can be updated
	var updateQueue = {
		"Member": [],
		"MembershipData": [],
	};

	// Determine fields that exist within each collection
	var memberFields = Object.keys(
		schema.collectionMembers.Member
	);
	var membershipDataFields = Object.keys(
		schema.collectionMembers.MembershipData
	);

	// Determine which collections to update
	Object.keys( fields ).forEach( function ( fieldName ) {

		// Ensure that the memberID is not changed
		if ( fieldName === "memberID" ) {
			return;
		}

		// If this field belongs in the Member collection
		if ( memberFields.includes( fieldName ) ) {

			// Push it on the Member collection's update queue
			var item = {};
			item[ fieldName ] = fields[ fieldName ];
			updateQueue.Member.push( item );
		}

		// If this field belongs in the MembershipData collection
		if ( membershipDataFields.includes( fieldName ) ) {

			// Push it on the MembershipData collection's update queue
			var item = {};
			item[ fieldName ] = fields[ fieldName ];
			updateQueue.MembershipData.push( item );
		}

		// If this field is not defined in the collection, it is not part of the the schema and
		// shouldn't be added
		// TODO: Add specialized options to enable the addition of extra parameters for more
		// specific document customization
	} );

	// Return the populated updateQueue
	return updateQueue;
}

// @function		buildEditQueries()
// @description		This function generates the member edit query post bodies and options objects
// @parameters		(string) memberID		The member id of the member to edit
//					(object) updateQueue	A JSON object containing the update data in their
//											respective collections (see "organizeUpdates()")
// @returns			(object) queries		A JSON object that contains all the update query post
//											bodies and options needed to update both the Member
//											and MembershipData collections, in the follwoing
//											format:
//											{
//												"body": {
//													"Member": { ... },
//													"MembershipData": { ... }
//												},
//												"options": {
//													"Member": { ... },
//													"MembershipData": { ... }
//												}
//											}
// @note			This function is intended solely for the "/edit" endpoint
function buildEditQueries ( memberID, updateQueue ) {

	// Create query for Member collection updates
	var memberQuery = {
		"accessToken": credentials.mdbi.accessToken,
		"collection": "Member",
		"search": {
			"memberID": memberID
		},
		"update": {
			"$set": {}
		}
	};
	var memberQueryOptions = {
		"hostname": "localhost",
		"path": "/mdbi/update/documents",
		"method": "POST",
		"agent": ssl_user_agent,
		"headers": {
			"Content-Type": "application/json",
			"Content-Length": 0
		}
	};

	// Create query for MembershipData collection modification
	var mdQuery = {
		"accessToken": credentials.mdbi.accessToken,
		"collection": "MembershipData",
		"search": {
			"memberID": memberID
		},
		"update": {
			"$set": {}
		}
	};
	var mdQueryOptions = {
		"hostname": "localhost",
		"path": "/mdbi/update/documents",
		"method": "POST",
		"agent": ssl_user_agent,
		"headers": {
			"Content-Type": "application/json",
			"Content-Length": 0
		}
	};

	// Append each new field value to the memberQuery
	updateQueue.Member.forEach( function ( fieldObj ) {

		// For each field to update, place its value into the update set
		var fieldName = Object.keys( fieldObj )[ 0 ];
		memberQuery.update.$set[ fieldName ] = fieldObj[ fieldName ];
	} );
	
	// Append each new field value to the mdQuery
	updateQueue.MembershipData.forEach( function ( fieldObj ) {

		// For each field to update, place its value into the update set
		var fieldName = Object.keys( fieldObj )[ 0 ];
		mdQuery.update.$set[ fieldName ] = fieldObj[ fieldName ];
	} );

	// Calculate the memberQuery's content length
	memberQueryOptions.headers["Content-Length"] = Buffer.byteLength(
		JSON.stringify( memberQuery )
	);
	
	// Calculate the mdQuery's content length
	mdQueryOptions.headers["Content-Length"] = Buffer.byteLength(
		JSON.stringify( mdQuery )
	);

	// Return the queries to the endpoint handler
	return {
		"body": {
			"Member": updateQueue.Member.length > 0 ? memberQuery : false,
			"MembershipData": updateQueue.MembershipData.length > 0 ? mdQuery : false
		},
		"options": {
			"Member": updateQueue.Member.length > 0 ? memberQueryOptions : false,
			"MembershipData": updateQueue.MembershipData.length > 0 ? mdQueryOptions : false
		}
	};
}

// END Utility Functions specific for Users





module.exports = router;
// END api/routes/user/index.js
