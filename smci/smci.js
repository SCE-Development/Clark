//	PROJECT: 		MEANserver
// 	Name: 			Rolando Javier
// 	File: 			smci.js
// 	Date Created: 	January 8, 2018
// 	Last Modified: 	January 12, 2018
// 	Details:
// 					The Sce Mail Chimp Interface (SMCI). This file contains JavaScript wrapper functions for the MailChimp API that handle communication and control over the associated MailChimp account's mailing system, email campaign/subscriber lists, and various other preferences.
//	Notes: 			ECMAscript 6 constructs can be used here (i.e. templating)
// 	Dependencies:
// 					Node.js HTTPS Module
//					Node.js Query String Module

"use strict"

// Includes
const https = require("https");						// import NodeJS https module
const qs = require("querystring");					// import NodeJS querystring module
var settings = require("../util/settings");			// import server system settings
var logger = require(`${settings.util}/logger`);	// import event log system
const smci_settings = require("./smci_settings");	// import MailChimp Settings



// Container (Singleton)
const smci = {};



// BEGIN Functions
/*
	@function 	getApiRoot
	@parameter	qsObj - the JSON object representing the request's query string parameters expected by the MailChimp GET / api. MailChimp uses these parameters to determine how to format its response. If no particular control over the response is desired, this parameter can be passed "null". Otherwise, the object can contain any or all of the following:
					{
						"fields": "...",
						"exclude_fields": "..."
					}
				where "fields" is a comma-separated list of fields to include in the response, and "exclude_fields" is a comma-separated list of fields to omit in the response. Read the MailChimp API reference for more details on the above query string parameters.
	@parameter 	callback - a callback function to run after the request is issued. It is passed two arguments:
					"response" - the response object from MailChimp
					"error" - any error(s) that occurred while processing the request
				The values of the "error" and "response" arguments vary depending on the result of the request.
				On success: "error" is null, and "response" is the JSON response object returned from MailChimp.
				On failure: "error" is the object returned by the NodeJS https.get() function's "error" event, and "response" is null.
	@returns	n/a
	@details 	This function makes a GET request to the MailChimp API Root using the NodeJS https.get() api.
*/
smci.getApiRoot = function (qsObj, callback) {
	var handlerTag = {"src": "smci/getApiRoot"};
	var querystring = (qsObj === null) ? "" : `?${qs.stringify(qsObj)}`;
	var options = {
		"hostname": `${smci_settings.apiDataCenter}.api.mailchimp.com`,
		"path": `/${smci_settings.apiVersion}/${querystring}`,
		"method": "GET",
		"auth": `${smci_settings.anystring}:${smci_settings.apikey}`
	};

	https.get(options, function (response) {
		response.on("data", function (data) {
			// process.stdout.write(data);
			// console.log(`${typeof data} data:`, data.toString());	// object is of type Buffer
			logger.log(`MailChimp returned a response...`, handlerTag);
			if (typeof callback === "function") {
				// BEGIN test
				try {
					callback(JSON.parse(data.toString()), null);
				} catch (e) {
					logger.log(`JSON parsing failed: ${e}`, handlerTag);
					callback(null, e);
				}
				// END test
			}
		});
	}).on("error", function (err) {
		logger.log(`HTTPS GET failed: ${err}`, handlerTag);
		if (typeof callback === "function") {
			callback(null, err);
		}
	}).end();
};

/*
	@function 	postAuthorizedApp
	@parameter	requestBody - the JSON object representing the request body's parameters expected by the MailChimp POST /authorized-apps api. MailChimp uses these parameters to link your application with the MailChimp account that uses its services. The object must be in the following format:
					{
						"client_id": "...",
						"client_secret": "..."
					}
				where "client_id" is a string representing the client app's unique id/username for authorization, and "client_secret" is a string representing the client app's password for authorization. Both can be found by logging into your MailChimp Account and finding the appropriate registered app. Once located, use this function with the acquired cliend id and secret to obtain SMCI's private OAuth2 access and viewer tokens. Read the MailChimp API reference for more details on the above query string parameters and processes.
	@parameter 	callback - a callback function to run after the request is issued. It is passed two arguments:
					"response" - the response object from MailChimp's POST /authorized-apps api
					"error" - any error(s) that occurred while processing the request
				The values of the "error" and "response" arguments vary depending on the result of the request.
				On success: "error" is null, and "response" is the JSON response object returned from MailChimp, namely a set of OAuth-2 based credentials used to associate SMCI's API calls with this application's account. Read the MailChimp API reference for more details on the expected response body
				On failure: "error" is the object returned by the NodeJS https.request() function's "error" event, and "response" is null.
	@returns 	n/a
	@details 	This function links the client associated with "client_id" to MailChimp's services. In doing so, it returns OAuth-2 based credentials for use in associating SMCI's API calls with the associated MailChimp account.
	@note 		The OAuth-2 credentials that are returned with the success of this request MUST be kept for future reference.
*/
smci.postAuthorizedApp = function (requestBody, callback) {
	var handlerTag = {"src": "smci/postAuthorizedApp"};
	var options = {
		"hostname": `${smci_settings.apiDataCenter}.api.mailchimp.com`,
		"path": `/${smci_settings.apiVersion}/authorized-apps`,
		"method": "POST",
		"auth": `${smci_settings.anystring}:${smci_settings.apikey}`,
		"headers": {
			"Content-Type": "application/json",
			"Content-Length": Buffer.byteLength(JSON.stringify(requestBody))
		}
	};

	var requestObj = https.request(options, function (response) {
		response.on("data", function (data) {
			logger.log(`MailChimp returned a response...`, handlerTag);
			if (typeof callback === "function") {
				try {
					logger.log(`status: ${response.statusCode}`, handlerTag);
					logger.log(`headers: ${(typeof response.headers === "object") ? JSON.stringify(response.headers) : response.headers}`, handlerTag);
					logger.log(`response: ${data}`, handlerTag);
					// callback((typeof data === "string") ? JSON.parse(data) : data, null);
				} catch (e) {
					logger.log(`JSON parsing failed: ${e}`, handlerTag);
					callback(null, e);
				}
			}
		});
	});
	requestObj.on("error", function (err) {
		logger.log(`HTTPS POST failed: ${err}`, handlerTag);
		if (typeof callback === "function") {
			callback(null, err);
		}
	});
	requestObj.write(JSON.stringify(requestBody));
	requestObj.end();
};

/*
	@function 	getAuthorizedApps
	@parameter	qsObj - the JSON object representing the request's query string parameters expected by the MailChimp GET /authorized-apps api. MailChimp uses these parameters to determine how to format its response. If no particular control over the response is desired, this parameter can be passed "null". Otherwise, the object can contain any or all of the following:
					{
						"fields": "...",
						"exclude_fields": "...",
						"count": ...,
						"offset": ...
					}
				where "fields" is a comma-separated list of fields to include in the response, "exclude_fields" is a comma-separated list of fields to omit in the response, "count" is the max number of records you want to receive, and "offset" is the number of records from a collection that you want MailChimp to skip before compiling your requested results. Read the MailChimp API reference for more details on the above query string parameters.
	@parameter 	callback - a callback function to run after the request is issued. It is passed two arguments:
					"response" - the response object from MailChimp's GET /authorized-apps api
					"error" - any error(s) that occurred while processing the request
				The values of the "error" and "response" arguments vary depending on the result of the request.
				On success: "error" is null, and "response" is the JSON response object returned from MailChimp.
				On failure: "error" is the object returned by the NodeJS https.get() function's "error" event, and "response" is null.
	@returns	n/a
	@details 	This function executes a GET request using the NodeJS https.get() api to acquire the list of all authorized apps associated with the MailChimp account, as well as any information about them (that you specify with the "qsObj" parameter).
*/
smci.getAuthorizedApps = function (qsObj, callback) {
	var handlerTag = {"src": "smci/getAuthorizedApps"};
	var querystring = (qsObj === null) ? "" : `?${qs.stringify(qsObj)}`;
	var options = {
		"hostname": `${smci_settings.apiDataCenter}.api.mailchimp.com`,
		"path": `/${smci_settings.apiVersion}/authorized-apps${querystring}`,
		"method": "GET",
		"auth": `${smci_settings.anystring}:${smci_settings.apikey}`
	};

	https.get(options, function (response) {
		response.on("data", function (data) {
			logger.log(`MailChimp returned a response...`, handlerTag);
			if (typeof callback === "function") {
				// BEGIN test
				try {
					callback(JSON.parse(data.toString()), null);
				} catch (e) {
					logger.log(`JSON parsing failed: ${e}`, handlerTag);
					callback(null, e);
				}
				// END test
			}
		});
	}).on("error", function (err) {
		logger.log(`HTTPS GET failed: ${err}`, handlerTag);
		if (typeof callback === "function") {
			callback(null, err);
		}
	}).end();
};
// END Functions



module.exports = smci;
// END smci.js
