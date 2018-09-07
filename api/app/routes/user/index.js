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
var dt = require(`${settings.util}/datetimes`);		// import datetime utilities
var ef = require(`${settings.util}/error_formats`);		// import error formatter
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

// Create an API Documentation Object
var api = al.createLegend(
	"User",
	"This API controls all user control modifications",
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
		"success": true,
		"data": "ping!"
	};

	response.set( "Content-Type", "application/json" );
	response.send( pingPacket ).status( 200 ).end();
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
		response.send( api.getDoc( pretty ) ).status( 200 ).end();
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
						"lastLogin": timestamp
						// TODO: add logic here to also update the user's last activity (for the
						// server to automatically monitor and refresh your session timeout
						// counter)
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
					response.send(sessionResponse).status(200).end();
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
					response.send(errStr).status(500).end();
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
				response.send( errStr ).status( 499 ).end();

				// Reject the promise to prevent further computation
				reject();
			} else if (match.list.length > 1) {

				// If multiple accounts were in the list, we can't tell who this user
				// is, and that is a fatal authentication error. Treat it as such...
				var errStr = ef.asCommonStr(ef.struct.adminAmbiguous);
	
				logger.log(`FATAL ERR: Ambiguous identity!`, handlerTag);
				response.send(errStr).status(499).end();

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
					response.send(errStr).status(500).end();
					reject();
				} else if (!Array.isArray(match.list)) {

					// If we didn't get an array back, let's call that an error and fail
					logger.log(
						`Invalid value returned from mdbi/search/documents query: ${match.list}`,
						handlerTag
					);

					// Send the response back
					response.send(
						ef.asCommonStr(
							ef.struct.unexpectedValue,
							match.list
						)
					).status( 500 ).end();

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
		var handlerTag = { "src": "adminLogoutHandler" };
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
					response.send(
						er.asCommonStr( er.struct.coreErr, error )
					).status( 500 ).end();
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
						response.set( "Content-Type", "text/html" );
						response.status( 200 ).send( {
							"success": true,
							"msg": "The user has been logged out"
						} ).end();
					}
				}
			};

			// Remove session data from db to effectively log user out
			au.clearSession( credentials.mdbi.accessToken, sid, queryCallback );
		}
	}
);

// @endpoint		(GET) /search
// @description		This endpoint serves as a general way to search for one or more users given
//					some search criteria
// @parameters		(object) request		The web request object provided by express.js. The
//											request body is expected to contain the following
//											members:
//							(string) sessionID		The client's session token
//							(string) searchType		The type of search to execute. Currently
//													supported search types include "username",
//													"first name", "last name", "join date",
//													"email", and "major"
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
				'"username", "first name", "last name", "join date", "email", and "major"'
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
		"name": "request.option.regexMode",
		"type": "~boolean",
		"desc":	"A boolean specifying whether or not to interpret the searchTerm as a regular " +
				"expression"
	},
	{
		"name": "request.option.pageNumber",
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
	"criteria",
	apiInfo.args.search,
	apiInfo.rval.search,
	function (request, response) {
		var handlerTag = {"src": "dashboardMemberSearchHandler"};
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
				response.send(null).status(200).end();
			} else {
				// Send the found results to the client
				logger.log(`${reply.length} ${(reply.length === 1) ? "result" : "results"} found`, handlerTag);
				if (reply.length === 0) {
					response.send(null).status(200).end();
				} else {
					response.send(reply).status(200).end();
				}
			}
		};
	
		var verificationCallback = function (valid, error) {
			response.set("Content-Type", "application/json");
			if (error) {
				logger.log(`Error: ${error}`, handlerTag);
				response.send(ef.asCommonStr(ef.struct.coreErr, error)).status(500).end();
			} else if (!valid) {
				logger.log(`Error: Invalid session token`, handlerTag);
				response.status(499).send(ef.asCommonStr(ef.struct.expiredSession)).end();
			} else {
				var validFormat = true;
				var searchPostBody = {
					"accessToken": credentials.mdbi.accessToken,
					"collection": "Member",
					"search": {}
				};
				var searchPostOptions = {
					"hostname": "localhost",
					"path": "/mdbi/search/documents",
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
					// If search term is null, search for everything
					searchPostBody.search = {};
				} else {
					// Determine how to format the search criteria, based on the search type
					var stype = "invalid";
					switch (request.body.searchType) {
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
	
					// Place search term in the search post body, based on any relevant search modifiers provided
					var objectToPlace = request.body.searchTerm;
					if (isRegex) {
						objectToPlace = {
							"$regex": request.body.searchTerm
						};
					}
					searchPostBody.search[stype] = objectToPlace;
				}
	
				// Configure search with any provided options
				if (resultsPerPage !== null) {
					// Add results per page as a custom option
					searchPostBody.options = {
						"limit": resultsPerPage
					};
	
					// Add page number as a custom option
					if (pageNum !== null) {
						searchPostBody.options.page = pageNum;
					}
				}
	
				// Recalculate Content-Length header; the above options caused the body length to change!
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

// END User Routes





module.exports = router;
// END api/routes/user/index.js
