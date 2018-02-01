// PROJECT: 		MEANserver
// Name: 			Rolando Javier
// File: 			route_handlers.js
// Date Created: 	October 26, 2017
// Last Modified: 	January 9, 2018
// Details:
//				 	This file abstracts all MAIN route handler functions to be used by server.js. The server.js file
//				 	takes these and places them to their desired endpoints. This frees up the server code from
//				 	the clutter introduced by placing all route handlers in server.js. All functions defined here
// 					are written to service requests for their corresponding endpoints (defined in server.js)
// Dependencies:
// 					JQuery v1.12.4
// 					ExpressJS 4.x
// 					body-parser (NPM middleware req'd by ExpressJS 4.x to acquire POST data parameters: "npm install --save body-parser")

"use strict"

// Includes
var fs = require("fs");
var https = require("https");
var crypt = require("./cryptic");					// import custom sce crypto wrappers
var settings = require("./settings");				// import server system settings
var dt = require("./datetimes");					// import datetime utilities
var ef = require("./error_formats");				// import error formatter
var logger = require(`${settings.util}/logger`);	// import event log system
var ssl = require(settings.security);				// import https ssl credentials
var www = require(`${settings.util}/www`);			// import custom https request wrappers
var assert = require("assert");

// Containers
var handle_map = {};		// A map of all endpoint handlers

// ExpressJS transaction options
var options = {
	root: settings.root,	// Server root directory (i.e. where server.js is located)
	dotfiles: "deny",
	headers: {
		"x-timestamp": Date.now(),
		"x-sent": true
	}
};

// Misc settings
// www.config.silence();
var ssl_user_agent = new https.Agent({
	"port": settings.port,
	"ca": fs.readFileSync(ssl.cert)
});



// BEGIN Handler Functions
/*
	@function 	generalError
	@parameter 	request - the web request object provided by express.js
	@parameter 	response - the web response object provided by express.js
	@returns 	On success: gives the client an error page and a code 200
				On failure: gives the client an error message and a code 500
	@details 	This function handles all general errors that occur
*/
handle_map.generalError = function (request, response) {
	var handlerTag = {"src": "generalError"};
	
	logger.log(`General error occurred. Sending error page to client @ ip ${request.ip}`, handlerTag);
	response.set("Content-Type", "text/html");
	response.sendFile("genErr.html", options, function (error) {
		if (error) {
			logger.log(error, handlerTag);
			response.status(500).send(ef.asCommonStr(ef.struct.coreErr, error)).end();
		} else {
			logger.log(`Sent genErr.html to ${settings.port}`, handlerTag);
			response.status(200).end();
		}
	});
};

/*	
	@function	rootHandler
	@parameter	request - the web request object provided by express.js
	@parameter	response - the web response object provided by express.js
	@returns	On success: gives the client the index.html page and a code 200
				On failure: gives the client a commonErrorObject and a code 500
	@details 	This function handles all requests for the server root (i.e. "/"). Used on a GET request
*/
handle_map.rootHandler = function (request, response) {			// GET request on root dir (login page-> index.html)
	var handlerTag = {"src": "rootHandler"};
	logger.log(`Server root requested from client @ ip ${request.ip}`, handlerTag);
	logger.log(request.toString(), handlerTag);
	response.set("Content-Type", "text/html");
	response.sendFile("index.html", options, function (error) {
		if (error) {
			logger.log(error, handlerTag);
			response.status(500).send(ef.asCommonStr(ef.struct.coreErr, error)).end();
		} else {
			logger.log(`Sent index.html to ${settings.port}`, handlerTag);
			response.status(200).end();
		}
	});
};

/*
	@function 	adminPortalHandler
	@parameter	request - the web request object provided by express.js
	@parameter	response - the web response object provided by express.js
	@returns	On success: gives the client core.html and a code 200
				On failure: gices the 
	@details 	This function handles all requests for the admin portal (i.e. "/core"). Used on a GET request
*/
handle_map.adminPortalHandler = function (request, response) {
	var handlerTag = {"src": "adminPortalHandler"};
	logger.log(`Admin portal requested from client @ ip ${request.ip}`, handlerTag);

	response.set("Content-Type", "text/html");
	response.sendFile("core/core.html", options, function (error) {
		if (error) {
			logger.log(error, handlerTag);
			response.status(500).send(ef.asCommonStr(ef.struct.coreErr, error)).end();
		} else {
			logger.log(`Sent admin portal to ${settings.port}`, handlerTag);
			response.status(200).end();
		}
	});
};

/*
	@function 	adminLoginHandler
	@parameter 	request - the web request object provided by express.js
	@parameter 	response - the web response object provided by express.js
	@returns 	On success: a code 200 with a redirection header and a session ID to validate all server operations during the session.
				On request failure: a code 500 and an error message detailing the error
				On credential validation failure: a code 499 and an error message detailing the error (i.e. a commonErrorObject from error_formats.js)
				On incorrect credentials: a code 200 and an error message detailing the error (i.e. a commonErrorObject from error_formats.js)
	@details 	This function is used to submit credentials from the administrator login portal to the server for processing. If login credentials are correct, the client is then passed a session id to use in all further server correspondence. Then, a redirection occurrs to the admin dashboard
*/
handle_map.adminLoginHandler = function (request, response) {
	var handlerTag = {"src": "adminLoginHandler"};
	var timestamp = (new Date(Date.now())).toISOString();
	var sessionStorageSupported = request.body.sessionStorageSupport;
	var match = {
		"list": []
	};
	var sessionID = "";

	logger.log(`Submitting admin credentials from client @ ip ${request.ip}`, handlerTag);
	response.set("Content-Type", "application/json");

	// BEGIN promises
	var submitCredentials = new Promise(function (resolve, reject) {
		var requestBody = {
			"collection": "Member",
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
			match.list = reply;	// is expected to be an array
			var matchFound = false;

			// logger.log(`${match.list}`, handlerTag);
			if (error) {
				// Report any error
				var errStr = ef.asCommonStr(ef.struct.httpsPostFail, error);

				logger.log(`A request error occurred: ${error}`, handlerTag);
				response.send(errStr).status(500).end();
				reject();
			} else {
				// Evaluate the database search results
				// logger.log(`Probe2: ${reply}`, handlerTag);	// debug
				if (match.list.length === 0) {	// i.e. no match was found
					var errStr = ef.asCommonStr(ef.struct.adminInvalid);
					
					logger.log(`Incorrect credentials`, handlerTag);
					response.send(errStr).status(499).end();
					reject();
				} else if (match.list.length > 1) {	// i.e. multiple accounts were returned
					var errStr = ef.asCommonStr(ef.struct.adminAmbiguous);

					logger.log(`FATAL ERR: Ambiguous identity!`, handlerTag);
					response.send(errStr).status(499).end();
					reject();
				} else {	// i.e. credentials returned one match
					// console.log(`SUBMITTED: ${typeof match.list} ${JSON.stringify(match.list)}`);	// debug
					

					// Search the MembershipData collection for the member's clearance level
					var requestBody = {
						"collection": "MembershipData",
						"search": {
							"memberID": match.list[0].memberID
						}
					};
					var submissionOptions = {
						"hostname": "localhost",
						"path": "/mdbi/search/documents",
						"method": "POST",
						"agent": ssl_user_agent,
						"headers": {
							"Content-Type": "application/json",
							"Content-Length": Buffer.byteLength(JSON.stringify(requestBody))
						}
					};

					// Submit search criteria
					www.https.post(submissionOptions, requestBody, function (reply, error) {
						var membershipData = reply;	// expects an array

						if (error) {
							var errStr = ef.asCommonStr(ef.struct.httpsPostFail, error);

							logger.log(`A request error occurred: ${error}`, handlerTag);
							response.send(errStr).status(500).end();
							reject();
						} else if (membershipData.length > 1) {
							var errStr = ef.asCommonStr(ef.struct.adminAmbiguous);

							logger.log(`Ambiguous membership data`, handlerTag);
							response.send(errStr).status(499).end();
							reject();
						} else if (membershipData.length < 1) {
							var errStr = ef.asCommonStr(ef.stringify.coreErr);

							logger.log(`No admin data returned`, handlerTag);
							response.send(errStr).status(499).end();
							reject();
						} else {
							// console.log(JSON.stringify(membershipData));	// debug
							// Check if member is an officer or admin
							if (membershipData[0].level !== 0 && membershipData[0].level !== 1) {
								var errStr = ef.asCommonStr(ef.struct.adminUnauthorized);

								logger.log(`User is not authorized`);
								response.send(errStr).status(499).end();
								reject();
							} else {
								console.log(`CLEARED: ${JSON.stringify(match.list)}`);

								// Generate session id and session data here
								var sessionID = crypt.hashSessionID(match.list[0].userName);
								var sessionDataBody = {
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
										console.log(`GENERATED: ${JSON.stringify(match.list)}`);
										
										var memberUpdateBody = {
											"collection": "Member",
											"search": {
												"memberID": {
													"$eq": match.list[0].memberID
												}
											},
											"update": {
												"$set": {
													"lastLogin": timestamp
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
									}
								});
							}
						}
					});
				}
			}
		});
	});
	// END promises



	// Submit credentials first
	submitCredentials.then(function (value) {
		// do nothing?
	}).catch(function (e) {
		console.log(e);
	});
};

/*
	@function 	adminDashboardHandler
	@parameter 	request - the web request object provided by express.js
	@parameter 	response - the web response object provided by express.js
	@returns 	?
	@details 	This function is used to serve all requests for the admin dashboard after a successful admin login
*/
handle_map.adminDashboardHandler = function (request, response) {
	var handlerTag = {"src": "adminDashboardHandler"};
	var sessionID = (typeof request.body.sessionID !== "undefined") ? request.body.sessionID : null;
	var verificationPostBody = {
		"collection": "SessionData",
		"search": {
			"sessionID": sessionID
		}
	};
	var verificationPostOptions = {
		"hostname": "localhost",
		"path": "/mdbi/search/documents",
		"method": "POST",
		"agent": ssl_user_agent,
		"headers": {
			"Content-Type": "application/json",
			"Content-Length": Buffer.byteLength(JSON.stringify(verificationPostBody))
		}
	};
	logger.log(`Admin dashboard request from client @ ip ${request.ip}`, handlerTag);

	// Check to make sure that the submitted sessionID is in the session database, and that it has not passed its masIdleTime since its last activity
	// logger.log(JSON.stringify(request.body), handlerTag);
	www.https.post(verificationPostOptions, verificationPostBody, function (reply, error) {
		var existingSession = reply[0];
		var validResult = typeof existingSession === "object" && typeof existingSession.maxIdleTime === "number";
		var lastActiveTimestamp = new Date(existingSession.lastActivity);

		// Determine remaining idle time
		lastActiveTimestamp.setMinutes(lastActiveTimestamp.getMinutes() + existingSession.maxIdleTime);
		var tokenExpired = dt.hasPassed(lastActiveTimestamp);
		if (validResult && !tokenExpired) {
			// If the search returns a database entry, grant the user access
			// logger.log(JSON.stringify(reply), handlerTag);	// debugs
			response.set("Content-Type", "text/html");
			response.sendFile("core/dashboard.html", options, function (error) {
				if (error) {
					logger.log(error, handlerTag);
					response.status(500).send(ef.asCommonStr(ef.struct.coreErr, error)).end();
				} else {
					logger.log(`Valid session token. Sent admin dashboard to ${settings.port}`, handlerTag);
					response.status(200).end();
				}
			});
		} else {
			// Else, return them to the login page
			if (tokenExpired) {
				logger.log(`Session token has expired.`, handlerTag);
			}

			response.set("Content-Type", "text/html");
			response.location(`https://${request.hostname}:${settings.port}/core/`);
			response.sendFile("core/core.html", options, function (error) {
				if (error) {
					logger.log(error, handlerTag);
					response.status(500).send(ef.asCommonStr(ef.stringify.coreErr, error)).end();
				} else {
					logger.log(`Invalid session token. Returning admin portal to ${settings.port}`);
					response.status(499).end();
				}
			});
		}
	});
};
// END Handler Functions



module.exports = handle_map;
// END route_handlers.js 