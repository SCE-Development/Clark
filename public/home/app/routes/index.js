//	PROJECT: 		Core-v4
// 	Name: 			Rolando Javier
// 	File: 			home/app/routes/index.js
// 	Date Created: 	April 10, 2018
// 	Last Modified: 	April 10, 2018
// 	Details:
// 					This file contains logic to service all routes requested under the the "/" (aka "home") endpoint
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
var ef = require(`${settings.util}/error_formats`);	// import error formatter
var ssl = require(settings.security);				// import https ssl credentials
var credentials = require(settings.credentials);	// import server system credentials
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
});

router.get("/test", function (request, response) {
	var handlerTag = {"src": "rootHandler"};
	logger.log(`Server root requested from client @ ip ${request.ip}`, handlerTag);
	logger.log(request.toString(), handlerTag);
	response.set("Content-Type", "text/html");
	response.sendFile("./home/myhometest.html", options, function (error) {
		if (error) {
			logger.log(error, handlerTag);
			response.status(500).send(ef.asCommonStr(ef.struct.coreErr, error)).end();
		} else {
			logger.log(`Sent index.html to ${settings.port}`, handlerTag);
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
	var handlerTag = {"src": "/NOTFOUND"};
	logger.log(`Non-existent endpoint "${request.path}" requested from client @ ip ${request.ip}` ,handlerTag);
	response.status(404).json({
		"status": 404,
		"subapp": "home",
		"err": "Non-Existent Endpoint"
	}).end();
});

/*
	@endpoint 	ERROR (for any other errors)
	@parameter 	n/a
	@returns 	n/a
	@details 	This function sends an error status (500) if an error occurred forcing the other methods to not run.
*/
router.use(function (err, request, response) {
	var handlerTag = {"src": "/ERROR"};
	logger.log(`Error occurred with request from client @ ip ${request.ip}`);
	response.status(500).json({
		"status": 500,
		"subapp": "core",
		"err": err.message
	}).end();
});
// END Error Handling Routes



// BEGIN Utility Functions
/*
	@function 	verifySession
	@parameter 	token - the database access token
	@parameter 	sessionID - the session token string to verify
	@parameter 	callback - a callback to run after the verification operation is completed. It is passed 2 arguments:
					"valid" - If no validation error occurred, this value is true for a valid token, false otherwise. If a validation error occurred, this value is null.
					"error" - If no validation error occurred, this value is null. Otherwise, it contains a stringified JSON object describing the error (i.e. as given by error_formats.js)
	@returns 	n/a
	@details 	This function wraps the session ID verification routine into a single function call, allowing callbacks to process the operation result.
*/
function verifySession (token, sessionID, callback) {
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
			callback(true, null);
		} else if (!validResult) {
			callback(null, ef.asCommonStr(ef.struct.unexpectedValue));
		} else if (tokenExpired) {
			callback(false, null);
		} else if (error) {
			callback(null, ef.asCommonStr(ef.struct.coreErr, error));
		}
	});
}

/*
	@function 	clearSession
	@parameter 	token - the database access token
	@parameter 	sessionID - the session token of the user whose sesion data will be cleared
	@parameter 	callback - a required callback function to run after attempting to clear the specified user's session data. It is passed two arguments:
					reply - if the operation was understood by the MongoDB server, this is a JSON object detailing the success of the operation
					error - if there was no error, this parameter is "null"; otherwise, it is an object detailing the error that occurred
	@returns 	n/a
	@details 	This function is useful for removing a user's session data from the database when their token becomes invalid, or when the session manager is used to manually log them out.
*/
function clearSession (token, sessionID, callback) {
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
}
// END Utility Functions



module.exports = router;
// END core/app/routes/index.js
