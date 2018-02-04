//	PROJECT: 		Core-v4
// 	Name: 			Rolando Javier
// 	File: 			core/app/routes/index.js
// 	Date Created: 	February 2, 2018
// 	Last Modified: 	February 2, 2018
// 	Details:
// 					This file contains logic to service all routes requested under the the "/core" endpoint
// 	Dependencies:
// 					ExpressJS 4.x
// 					body-parser (NPM middleware req'd by ExpressJS 4.x to acquire POST data parameters: "npm install --save body-parser")

"use strict";

// Includes
var express = require("express");
var https = require("https");
var fs = require("fs");
var router = express.Router();
var settings = require("../../../../util/settings");// import server system settings
var dt = require(`${settings.util}/datetimes`);		// import datetime utilities
var ef = require(`${settings.util}/error_formats`);	// import error formatter
var crypt = require(`${settings.util}/cryptic`);	// import custom sce crypto wrappers
var ssl = require(settings.security);				// import https ssl credentials
var www = require(`${settings.util}/www`);			// import custom https request wrappers
var logger = require(`${settings.util}/logger`);	// import event log system

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



// BEGIN Core Routes
/*
	@endpoint	/
	@parameter	request - the web request object provided by express.js
	@parameter	response - the web response object provided by express.js
	@returns	n/a
	@details 	This function serves the SCE core admin login portal on "/core" endpoint requests. Used on a GET request
*/
router.get("/", function (request, response) {
	var handlerTag = {"src": "adminPortalHandler"};
	logger.log(`Admin portal requested from client @ ip ${request.ip}`, handlerTag);

	response.set("Content-Type", "text/html");
	response.sendFile("core/core.html", options, function (error) {
		if (error) {
			logger.log(error, handlerTag);
			response.send(ef.asCommonStr(ef.struct.coreErr, error)).status(500).end();
		} else {
			logger.log(`Sent admin portal to ${settings.port}`, handlerTag);
			response.status(200).end();
		}
	});
});

/*
	@endpoint 	/login
	@parameter 	request - the web request object provided by express.js
	@parameter 	response - the web response object provided by express.js
	@returns 	On success: a code 200 with a redirection header and a session ID to validate all server operations during the session.
				On request failure: a code 500 and an error message detailing the error
				On credential validation failure: a code 499 and an error message detailing the error (i.e. a commonErrorObject from error_formats.js)
				On incorrect credentials: a code 200 and an error message detailing the error (i.e. a commonErrorObject from error_formats.js)
	@details 	This function is used to submit credentials from the administrator login portal to the server for processing. This is done by performing the described POST request to the "/core/login" endpoint. If login credentials are correct, the client is then passed a redirect url and a session id to use in all further server correspondence. Then, a redirection occurrs to the admin dashboard from the client side using the provided url and session id.
*/
router.post("/login", function (request, response) {
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
});

/*
	@endpoint 	/dashboard
	@parameter 	request - the web request object provided by express.js
	@parameter 	response - the web response object provided by express.js
	@returns 	?
	@details 	This function is used to serve all requests for the admin dashboard after a successful admin login.
*/
router.post("/dashboard", function (request, response) {
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
});

/*
	@function 	/dashboard
	@parameter 	request - the web request object provided by express.js
	@parameter 	response - the web response object provided by express.js
	@returns 	On success: gives the client an error page and a code 200
				On failure: gives the client an error message and a code 500
	@details 	This function handles the odd case where using the url bar to enter or refresh the dashboard causes unexpected behavior. Since the dashboard requires a POST request to acquire the session ID securely, this route is used to explicitly deny access by GET request.
*/
router.get("/dashboard", function (request, response) {
	var handlerTag = {"src": "generalError"};
	
	logger.log(`General error occurred. Sending error page to client @ ip ${request.ip}`, handlerTag);
	response.set("Content-Type", "text/html");
	response.sendFile("home/genErr.html", options, function (error) {
		if (error) {
			logger.log(error, handlerTag);
			response.status(500).send(ef.asCommonStr(ef.struct.coreErr, error)).end();
		} else {
			logger.log(`Sent genErr.html to ${settings.port}`, handlerTag);
			response.status(200).end();
		}
	});
});
// END Core Routes



// BEGIN Error Handling Routes
/*
	@endpoint 	NOTFOUND (404)
	@parameter 	n/a
	@returns 	n/a
	@details 	This function handles any endpoint requests that do not exist under the "/test" endpoint
*/
router.use(function (request, response) {
	var handlerTag = {"src": "/core/NOTFOUND"};
	logger.log(`Non-existent endpoint "${request.path}" requested from client @ ip ${request.ip}` ,handlerTag);
	response.status(404).json({
		"status": 404,
		"subapp": "core",
		"err": "Non-Existent Endpoint"
	});
});

/*
	@endpoint 	ERROR (for any other errors)
	@parameter 	n/a
	@returns 	n/a
	@details 	This function sends an error status (500) if an error occurred forcing the other methods to not run.
*/
router.use(function (err, request, response) {
	var handlerTag = {"src": "/core/ERROR"};
	logger.log(`Error occurred with request from client @ ip ${request.ip}`);
	response.status(500).json({
		"status": 500,
		"subapp": "core",
		"err": err.message
	});
});
// END Error Handling Routes



module.exports = router;
// END core/app/routes/index.js
