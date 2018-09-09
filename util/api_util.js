//	PROJECT: 		Core-v4
// 	Name: 			Rolando Javier
// 	File: 			api_util.js
// 	Date Created: 	September 4, 2018
// 	Last Modified: 	September 4, 2018
// 	Details:
// 					This file contains utility functions that various APIs will need to perform
//					basic tasks (i.e. session management, access control, etc.)
// 	Dependencies:
// 					ExpressJS 4.x
// 					body-parser (NPM middleware req'd by ExpressJS 4.x to acquire POST data
//					parameters: "npm install --save body-parser")

"use strict";

// Includes
var express = require("express");
var https = require("https");
var fs = require("fs");
// var router = express.Router();
var settings = require("./settings");					// import server system settings
var al = require(`${settings.util}/api_legend.js`);		// import API Documentation Module
var dt = require(`${settings.util}/datetimes`);			// import datetime utilities
var ef = require(`${settings.util}/error_formats`);		// import error formatter
// var crypt = require(`${settings.util}/cryptic`);		// import custom sce crypto wrappers
var ssl = require(settings.security);					// import https ssl credentials
var credentials = require(settings.credentials);		// import server system credentials
var www = require(`${settings.util}/www`);				// import custom https request wrappers
var logger = require(`${settings.util}/logger`);		// import event log system

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

// Container (Singleton)
const apiutil = {};






// BEGIN API Utility Functions

/*
	@function 	verifySession
	@parameter 	token - the database access token
	@parameter 	sessionID - the session token string to verify
	@parameter 	callback - a callback to run after the verification operation is completed. It is passed 2 arguments:
					"valid" - If no validation error occurred, this value is true for a valid token, false otherwise. If a validation error occurred, this value is null.
					"error" - If no validation error occurred, this value is null. Otherwise, it contains a stringified JSON object describing the error (i.e. as given by error_formats.js)
					"session" - Regardless of whether a validation error occurred, this value is the object returned from the session data search, which contains the sessionID, memberID, maxIdleTime, loginTime, and lastActivity timestamp.
	@returns 	n/a
	@details 	This function wraps the session ID verification routine into a single function call, allowing callbacks to process the operation result.
*/
apiutil.verifySession = function (token, sessionID, callback) {
	var handlerTag = {"src": "verifySession"};
	var verificationPostBody = {
		"accessToken": token,
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

	// Check to make sure that the submitted sessionID is in the session database, and that it has not passed its maxIdleTime since its last activity
	www.https.post(verificationPostOptions, verificationPostBody, function (reply, error) {
		logger.log(`${reply.length} ${(reply.length === 1) ? "result" : "results"} found`, handlerTag);
		var existingSession = reply[0];
		var validResult = typeof existingSession === "object" && typeof existingSession.maxIdleTime === "number" && typeof existingSession.lastActivity === "string";
		var lastActiveTimestamp = new Date((validResult) ? existingSession.lastActivity : Date.now());

		// Determine remaining idle time
		lastActiveTimestamp.setMinutes(lastActiveTimestamp.getMinutes() + ((validResult) ? existingSession.maxIdleTime : 0));
		var tokenExpired = dt.hasPassed(lastActiveTimestamp);
		if (validResult && !tokenExpired) {
			callback( true, null, existingSession );
		} else if (!validResult) {
			callback( null, ef.asCommonStr( ef.struct.unexpectedValue, {
				"msg": "The session ID search yielded invalid results; the session doesn't exist"
			} ), existingSession );
		} else if (tokenExpired) {
			callback( false, null, existingSession );
		} else if (error) {
			callback( null, ef.asCommonStr( ef.struct.coreErr, error ), existingSession );
		}
	});
};

/*
	@function 	clearSession
	@parameter 	token - the database access token
	@parameter 	sessionID - the session token of the user whose session data will be cleared
	@parameter 	callback - a required callback function to run after attempting to clear the specified user's session data. It is passed two arguments:
					reply - if the operation was understood by the MongoDB server, this is a JSON object detailing the success of the operation
					error - if there was no error, this parameter is "null"; otherwise, it is an object detailing the error that occurred
	@returns 	n/a
	@details 	This function is useful for removing a user's session data from the database when their token becomes invalid, or when the session manager is used to manually log them out.
*/
apiutil.clearSession = function (token, sessionID, callback) {
	var handlerTag = {"src": "clearSession"};
	var removalPostBody = {
		"accessToken": credentials.mdbi.accessToken,
		"collection": "SessionData",
		"search": {
			"sessionID": sessionID
		}
	};
	var removalPostOptions = {
		"hostname": "localhost",
		"path": "/mdbi/delete/document",
		"method": "POST",
		"agent": ssl_user_agent,
		"headers": {
			"Content-Type": "application/json",
			"Content-Length": Buffer.byteLength(JSON.stringify(removalPostBody))
		}
	};

	www.https.post(removalPostOptions, removalPostBody, callback);
};

/*
	@function 	isCapable
	@parameter 	abilityList - an array of ability ID numbers to check for
	@parameter 	userID - the ID number or username of the user whose abilities will be checked
	@parameter 	callback - a required callback function to run after the capability check is executed. It is passed the following parameters:
					result - On a successfully fulfilled match condition, this value is true. If the match condition was not fulfilled, this value is false. On an error or unexpected response, this value is -1.
	@parameter 	matchMode - (optional) a number controlling what kind of comparison will be performed. The following are valid match modes:
					0 - Full match: (default) user must have ALL abilities in the list
					1 - Loose match: user must have AT LEAST ONE ability in the list
					2 - Excluded match: user must NOT HAVE ANY of the abilities in the list
	@returns 	n/a
	@details 	This function is useful for determining if a user has the correct permissions for a specific feature.
*/
apiutil.isCapable = function (abilityList, userID, callback, matchMode = 0) {
	var handlerTag = {"src": "isCapable"};
	var status = false;
	var checkPostBody = {
		"accessToken": credentials.mdbi.accessToken,
		"collection": "OfficerDossier",
		"search": {
			"abilities": null
		}
	};
	var checkPostOptions = {
		"hostname": "localhost",
		"path": "/mdbi/search/documents",
		"method": "POST",
		"agent": ssl_user_agent,
		"headers": {
			"Content-Type": "application/json",
			"Content-Length": 0
		}
	};

	// Modify post body depending on user ID or username usage
	if (typeof userID === "string") {
		checkPostBody.search["userName"] = userID;
	} else if (typeof userID === "number") {
		checkPostBody.search["memberID"] = userID;
	}

	// Modify mdbi query based on match mode
	switch (matchMode) {
		case 0: {	// Full Match Mode
			checkPostBody.search.abilities = {
				"$all": abilityList
			};
			break;
		}
		case 1: {	// Loose Match Mode
			checkPostBody.search.abilities = {
				"$in": abilityList
			};
			break;
		}
		case 2: {	// Excluded Match Mode
			checkPostBody.search.abilities = {
				"$nin": abilityList
			};
			break;
		}
		default: {
			status = -1;
			break;
		}
	}

	// Finalize content length calculation
	checkPostOptions.headers["Content-Length"] = Buffer.byteLength(JSON.stringify(checkPostBody));

	// Run database query if nothing went wrong
	if (status !== -1) {
		www.https.post(checkPostOptions, checkPostBody, function (reply, error) {
			logger.log(`${reply.length} ${(reply.length === 1) ? "result" : "results"} found`, handlerTag);
			if (error) {
				callback(-1);
			} else if (reply.length !== 1) {
				callback(false);
			} else {
				callback(true);
			}
		});
	} else {
		callback(-1);
	}
};

// END API Utility Functions





Object.freeze( apiutil );
module.exports = apiutil;
// END api_util.js
