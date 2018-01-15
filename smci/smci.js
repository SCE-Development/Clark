//	PROJECT: 		MEANserver
// 	Name: 			Rolando Javier
// 	File: 			smci.js
// 	Date Created: 	January 8, 2018
// 	Last Modified: 	January 13, 2018
// 	Details:
// 					The Sce Mail Chimp Interface (SMCI). This file contains JavaScript wrapper functions for the MailChimp APIs that handle communication and control over the associated MailChimp account's mailing system, email campaign/subscriber lists, and various other preferences.
//	Notes: 			ECMAscript 6 constructs can be used here (i.e. templating)
// 					This file is a work in progress. The wrapper functions included in this file only cover the following MailChimp APIs:
//						API Root:
//							GET /
//						Authorized Apps:
//							POST /authorized-apps
//							GET /authorized-apps
//							GET /authorized-apps/{app_id}
//						Automations:
//							GET /automations
//							GET /automations/{workflow_id}
//							POST /automations/{workflow_id}/actions/pause-all-emails
//							POST /automations/{workflow_id}/actions/start-all-emails
//							GET /automations/{workflow_id}/emails
//							GET /automations/{workflow_id}/emails/{workflow_email_id}
//							DELETE /automations/{workflow_id}/emails/{workflow_email_id}
//							POST /automations/{workflow_id}/emails/{workflow_email_id}/actions/pause
//							POST /automations/{workflow_id}/emails/{workflow_email_id}/actions/start
//							POST /automations/{workflow_id}/emails/{workflow_email_id}/queue
//							GET /automations/{workflow_id}/emails/{workflow_email_id}/queue
//							GET /automations/{workflow_id}/emails/{workflow_email_id}/queue/{subscriber_hash}
//							POST /automations/{workflow_id}/removed-subscribers
//							GET /automations/{workflow_id}/removed-subscribers
//						Batch Opertaions:
//							POST /batches
//							GET /batches
//							GET /batches/{batch_id}
//							DELETE /batches/{batch_id}
//						Campaign Folders:
//							POST /campaign-folders
//							GET /campaign-folders
//							GET /campaign-folders/{folder_id}
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
const smci = {
	"api": {},
	"authorizedApps": {},
	"automations": {},
	"batchOps": {},
	"campaignFolders": {}
};



// BEGIN MailChimp API Wrapper Functions
/*
	@function 	api.getRoot
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
smci.api.getRoot = function (qsObj, callback) {
	var handlerTag = {"src": "smci/api.getRoot"};
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
	@function 	authorizedApps.register
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
smci.authorizedApps.register = function (requestBody, callback) {
	var handlerTag = {"src": "smci/authorizedApps.register"};
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
					// BEGIN debug
					// logger.log(`status: ${response.statusCode}`, handlerTag);
					// logger.log(`headers: ${(typeof response.headers === "object") ? JSON.stringify(response.headers) : response.headers}`, handlerTag);
					// logger.log(`response: ${data}`, handlerTag);
					// END debug
					callback(JSON.parse(data.toString()), null);
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
	@function 	authorizedApps.getFullList
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
smci.authorizedApps.getFullList = function (qsObj, callback) {
	var handlerTag = {"src": "smci/authorizedApps.getFullList"};
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

/*
	@function 	authorizedApps.getAppInfo
	@parameter 	appID - the app ID used to located the information associated with the desired app
	@parameter	qsObj - the JSON object representing the request's query string parameters expected by the MailChimp GET /authorized-apps/{app_id} api. MailChimp uses these parameters to determine how to format its response. If no particular control over the response is desired, this parameter can be passed "null". Otherwise, the object can contain any or all of the following:
					{
						"fields": "...",
						"exclude_fields": "..."
					}
				where "fields" is a comma-separated list of fields to include in the response, and "exclude_fields" is a comma-separated list of fields to omit in the response. Read the MailChimp API reference for more details on the above query string parameters.
	@parameter 	callback - a callback function to run after the request is issued. It is passed two arguments:
					"response" - the response object from MailChimp's GET /authorized-apps/{app_id} api
					"error" - any error(s) that occurred while processing the request
				The values of the "error" and "response" arguments vary depending on the result of the request.
				On success: "error" is null, and "response" is the JSON response object returned from MailChimp.
				On failure: "error" is the object returned by the NodeJS https.get() function's "error" event, and "response" is null.
	@returns 	n/a
	@details 	This function executes a GET request using the NodeJS https.get() api to acquire information about the app specified by "appID"
*/
smci.authorizedApps.getAppInfo = function (appID, qsObj, callback) {
	var handlerTag = {"src": "smci/authorizedApps.getAppInfo"};
	var querystring = (qsObj === null) ? "" : `?${qs.stringify(qsObj)}`;
	var options = {
		"hostname": `${smci_settings.apiDataCenter}.api.mailchimp.com`,
		"path": `/${smci_settings.apiVersion}/authorized-apps/${appID}${querystring}`,
		"method": "GET",
		"auth": `${smci_settings.anystring}:${smci_settings.apikey}`
	};

	https.get(options, function (response) {
		response.on("data", function (data) {
			logger.log(`MailChimp returned a response...`, handlerTag);
			if (typeof callback === "function") {
				try {
					callback(JSON.parse(data.toString()), null);
				} catch (e) {
					logger.log(`JSON parsing failed: ${e}`, handlerTag);
					callback(null, e);
				}
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
	@function 	automations.getFullList
	@parameter	qsObj - the JSON object representing the request's query string parameters expected by the MailChimp GET /automations api. MailChimp uses these parameters to determine how to format its response. If no particular control over the response is desired, this parameter can be passed "null". Otherwise, the object can contain any or all of the following:
					{
						"fields": "...",
						"exclude_fields": "...",
						"before_create_time": "...",
						"since_create_time": "...",
						"before_send_time": "...",
						"since_send_time": "...",
						"status": "..."
					}
				where "fields" is a comma-separated list of fields to include in the response, "exclude_fields" is a comma-separated list of fields to omit in the response, "before_create_time" is a string (ISO 8601 format) used to restrict the reponse results to automations created before this time, "since_create_time" is a string (ISO 8601 format) used to restrict the reponse results to automations created after this time, "before_send_time" is a string (ISO 8601 format) used to restrict the response results to automations sent before this time, "since_send_time" is a string (ISO 8601 format) used to restrict the response results to automations sent after this time, and "status" is a string used to restrict the response results to those of a certain status (i.e. "save", "paused", or "sending"). Read the MailChimp API reference for more details on the above query string parameters.
	@parameter 	callback - a callback function to run after the request is issued. It is passed two arguments:
					"response" - the response object from MailChimp's GET /automations api
					"error" - any error(s) that occurred while processing the request
				The values of the "error" and "response" arguments vary depending on the result of the request.
				On success: "error" is null, and "response" is the JSON response object returned from MailChimp.
				On failure: "error" is the object returned by the NodeJS https.get() function's "error" event, and "response" is null.
	@returns 	n/a
	@details 	This function executes a GET request using the NodeJS https.get() api to acquire a list of all automations associated with the MailChimp account
*/
smci.automations.getFullList = function (qsObj, callback) {
	var handlerTag = {"src": "smci/automations.getFullList"};
	var querystring = (qsObj === null) ? "" : `?${qs.stringify(qsObj)}`;
	var options = {
		"hostname": `${smci_settings.apiDataCenter}.api.mailchimp.com`,
		"path": `/${smci_settings.apiVersion}/automations${querystring}`,
		"method": "GET",
		"auth": `${smci_settings.anystring}:${smci_settings.apikey}`
	};

	https.get(options, function (response) {
		response.on("data", function (data) {
			logger.log(`MailChimp returned a response...`, handlerTag);
			if (typeof callback === "function") {
				try {
					callback(JSON.parse(data.toString()), null);
				} catch (e) {
					logger.log(`JSON parsing failed: ${e}`, handlerTag);
					callback(null, e);
				}
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
	@function 	automations.getInfo
	@parameter 	automationID - the workflow ID of the automation to search for.
	@parameter	qsObj - the JSON object representing the request's query string parameters expected by the MailChimp GET /automations/{workflow_id} api. MailChimp uses these parameters to determine how to format its response. If no particular control over the response is desired, this parameter can be passed "null". Otherwise, the object can contain any or all of the following:
					{
						"fields": "...",
						"exclude_fields": "..."
					}
				where "fields" is a comma-separated list of fields to include in the response, and "exclude_fields" is a comma-separated list of fields to omit in the response. Read the MailChimp API reference for more details on the above query string parameters.
	@parameter 	callback - a callback function to run after the request is issued. It is passed two arguments:
					"response" - the response object from MailChimp's GET /automations/{workflow_id} api
					"error" - any error(s) that occurred while processing the request
				The values of the "error" and "response" arguments vary depending on the result of the request.
				On success: "error" is null, and "response" is the JSON response object returned from MailChimp.
				On failure: "error" is the object returned by the NodeJS https.get() function's "error" event, and "response" is null.
	@returns 	n/a
	@details 	This function executes a GET request using the NodeJS https.get() api to acquire information about the automation specified by "automationID"
*/
smci.automations.getInfo = function (automationID, qsObj, callback) {
	var handlerTag = {"src": "smci/automations.getInfo"};
	var querystring = (qsObj === null) ? "" : `?${qs.stringify(qsObj)}`;
	var options = {
		"hostname": `${smci_settings.apiDataCenter}.api.mailchimp.com`,
		"path": `/${smci_settings.apiVersion}/automations/${automationID}${querystring}`,
		"method": "GET",
		"auth": `${smci_settings.anystring}:${smci_settings.apikey}`
	};

	https.get(options, function (response) {
		response.on("data", function (data) {
			logger.log(`MailChimp returned a response...`, handlerTag);
			if (typeof callback === "function") {
				try {
					callback(JSON.parse(data.toString()), null);
				} catch (e) {
					logger.log(`JSON parsing failed: ${e}`, handlerTag);
					callback(null, e);
				}
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
	@function 	automations.pause
	@parameter 	automationID - the workflow ID of the automation to pause.
	@parameter 	callback - a callback function to run after the request is issued. It is passed two arguments:
					"response" - the response object from MailChimp's POST /automations/{workflow_id}/actions/pause-all-emails api
					"error" - any error(s) that occurred while processing the request
				The values of the "error" and "response" arguments vary depending on the result of the request.
				On success: "error" is null, and "response" is the JSON response object returned from MailChimp.
				On failure: "error" is the object returned by the NodeJS https.request() function's "error" event, and "response" is null.
	@returns 	n/a
	@details 	This function executes a POST request using the NodeJS https.request() api to pause all emails in the automation workflow specified by "automationID".
*/
smci.automations.pause = function (automationID, callback) {
	var handlerTag = {"src": "smci/automations.pause"};
	var options = {
		"hostname": `${smci_settings.apiDataCenter}.api.mailchimp.com`,
		"path": `/${smci_settings.apiVersion}/automations/${automationID}/actions/pause-all-emails`,
		"method": "POST",
		"auth": `${smci_settings.anystring}:${smci_settings.apikey}`,
		"headers": {
			"Content-Type": "application/json"
		}
	};

	var requestObj = https.request(options, function (response) {
		response.on("data", function (data) {
			logger.log(`MailChimp returned a response...`, handlerTag);
			if (typeof callback === "function") {
				try {
					// BEGIN debug
					// logger.log(`status: ${response.statusCode}`, handlerTag);
					// logger.log(`headers: ${(typeof response.headers === "object") ? JSON.stringify(response.headers) : response.headers}`, handlerTag);
					// logger.log(`response: ${data}`, handlerTag);
					// END debug
					callback(JSON.parse(data.toString()), null);
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
	requestObj.end();
};

/*
	@function 	automations.start
	@parameter 	automationID - the workflow ID of the automation to start/restart.
	@parameter 	callback - a callback function to run after the request is issued. It is passed two arguments:
					"response" - the response object from MailChimp's POST /automations/{workflow_id}/actions/start-all-emails api
					"error" - any error(s) that occurred while processing the request
				The values of the "error" and "response" arguments vary depending on the result of the request.
				On success: "error" is null, and "response" is the JSON response object returned from MailChimp.
				On failure: "error" is the object returned by the NodeJS https.request() function's "error" event, and "response" is null.
	@returns 	n/a
	@details 	This function executes a POST request using the NodeJS https.request() api to start/restart all emails in the automation workflow specified by "automationID".
*/
smci.automations.start = function (automationID, callback) {
	var handlerTag = {"src": "smci/automations.start"};
	var options = {
		"hostname": `${smci_settings.apiDataCenter}.api.mailchimp.com`,
		"path": `/${smci_settings.apiVersion}/automations/${automationID}/actions/start-all-emails`,
		"method": "POST",
		"auth": `${smci_settings.anystring}:${smci_settings.apikey}`,
		"headers": {
			"Content-Type": "application/json"
		}
	};

	var requestObj = https.request(options, function (response) {
		response.on("data", function (data) {
			logger.log(`MailChimp returned a response...`, handlerTag);
			if (typeof callback === "function") {
				try {
					// BEGIN debug
					// logger.log(`status: ${response.statusCode}`, handlerTag);
					// logger.log(`headers: ${(typeof response.headers === "object") ? JSON.stringify(response.headers) : response.headers}`, handlerTag);
					// logger.log(`response: ${data}`, handlerTag);
					// END debug
					callback(JSON.parse(data.toString()), null);
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
	requestObj.end();
};

/*
	@function 	automations.getEmails
	@parameter 	automationID - the workflow ID of the automation to acquire an email list from.
	@parameter 	callback - a callback function to run after the request is issued. It is passed two arguments:
					"response" - the response object from MailChimp's GET /automations/{workflow_id}/emails api
					"error" - any error(s) that occurred while processing the request
				The values of the "error" and "response" arguments vary depending on the result of the request.
				On success: "error" is null, and "response" is the JSON response object returned from MailChimp.
				On failure: "error" is the object returned by the NodeJS https.get() function's "error" event, and "response" is null.
	@returns 	n/a
	@details 	This function executes a GET request using the NodeJS https.get() api to acquire a summary of emails associated with the automation specified by "automationID".
*/
smci.automations.getEmails = function (automationID, callback) {
	var handlerTag = {"src": "smci/automations.getEmails"};
	var options = {
		"hostname": `${smci_settings.apiDataCenter}.api.mailchimp.com`,
		"path": `/${smci_settings.apiVersion}/automations/${automationID}/emails`,
		"method": "GET",
		"auth": `${smci_settings.anystring}:${smci_settings.apikey}`
	};

	https.get(options, function (response) {
		response.on("data", function (data) {
			logger.log(`MailChimp returned a response...`, handlerTag);
			if (typeof callback === "function") {
				try {
					callback(JSON.parse(data.toString()), null);
				} catch (e) {
					logger.log(`JSON parsing failed: ${e}`, handlerTag);
					callback(null, e);
				}
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
	@function 	automations.getEmailInfo
	@parameter 	automationID - the workflow ID of the automation with the desired email
	@parameter 	emailID - the workflow email ID of the particular email to search for
	@parameter 	callback - a callback function to run after the request is issued. It is passed two arguments:
					"response" - the response object from MailChimp's GET /automations/{workflow_id}/emails/{workflow_email_id} api
					"error" - any error(s) that occurred while processing the request
				The values of the "error" and "response" arguments vary depending on the result of the request.
				On success: "error" is null, and "response" is the JSON response object returned from MailChimp.
				On failure: "error" is the object returned by the NodeJS https.get() function's "error" event, and "response" is null.
	@returns 	n/a
	@details 	This function executes a GET request using the NodeJS https.get() api to acquire information about a specific email (specified by "emailID") within the automation specified by "automationID"
*/
smci.automations.getEmailInfo = function (automationID, emailID, callback) {
	var handlerTag = {"src": "smci/automations.getEmailInfo"};
	var options = {
		"hostname": `${smci_settings.apiDataCenter}.api.mailchimp.com`,
		"path": `/${smci_settings.apiVersion}/automations/${automationID}/emails/${emailID}`,
		"method": "GET",
		"auth": `${smci_settings.anystring}:${smci_settings.apikey}`
	};

	https.get(options, function (response) {
		response.on("data", function (data) {
			logger.log(`MailChimp returned a response...`, handlerTag);
			if (typeof callback === "function") {
				try {
					callback(JSON.parse(data.toString()), null);
				} catch (e) {
					logger.log(`JSON parsing failed: ${e}`, handlerTag);
					callback(null, e);
				}
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
	@function 	automations.deleteEmail
	@parameter 	automationID - the workflow ID of the automation with the desired email
	@parameter 	emailID - the workflow email ID of the particular email to delete
	@parameter 	callback - a callback function to run after the request is issued. It is passed two arguments:
					"response" - the response object from MailChimp's DELETE /automations/{workflow_id}/emails/{workflow_email_id} api
					"error" - any error(s) that occurred while processing the request
				The values of the "error" and "response" arguments vary depending on the result of the request.
				On success: "error" is null, and "response" is the JSON response object returned from MailChimp.
				On failure: "error" is the object returned by the NodeJS https.request() function's "error" event, and "response" is null.
	@returns 	n/a
	@details 	This function executes a DELETE request using the NodeJS https.request() api to delete the automation email "emailID" within the "automationID" automation workflow.
*/
smci.automations.deleteEmail = function (automationID, emailID, callback) {
	var handlerTag = {"src": "smci/automations.deleteEmail"};
	var options = {
		"hostname": `${smci_settings.apiDataCenter}.api.mailchimp.com`,
		"path": `/${smci_settings.apiVersion}/automations/${automationID}/emails/${emailID}`,
		"method": "DELETE",
		"auth": `${smci_settings.anystring}:${smci_settings.apikey}`
	};

	var requestObj = https.request(options, function (response) {
		response.on("data", function (data) {
			logger.log(`MailChimp returned a response...`, handlerTag);
			if (typeof callback === "function") {
				try {
					callback(JSON.parse(data.toString()), null);
				} catch (e) {
					logger.log(`JSON parsing failed: ${e}`, handlerTag);
					callback(null, e);
				}
			}
		});
	});
	requestObj.on("error", function (err) {
		logger.log(`HTTPS DELETE failed: ${err}`, handlerTag);
		if (typeof callback === "function") {
			callback(null, err);
		}
	});
	requestObj.end();
};

/*
	@function 	automations.pauseEmail
	@parameter 	automationID - the workflow ID of the automation with the desired email
	@parameter 	emailID - the workflow email ID of the particular email to pause
	@parameter 	callback - a callback function to run after the request is issued. It is passed two arguments:
					"response" - the response object from MailChimp's POST /automations/{workflow_id}/emails/{workflow_email_id}/actions/pause api
					"error" - any error(s) that occurred while processing the request
				The values of the "error" and "response" arguments vary depending on the result of the request.
				On success: "error" is null, and "response" is the JSON response object returned from MailChimp.
				On failure: "error" is the object returned by the NodeJS https.request() function's "error" event, and "response" is null.
	@returns 	n/a
	@details 	This function executes a POST request using the NodeJS https.request() api to pause an automation email (within the "automationID" automation workflow) specified by "emailID".
*/
smci.automations.pauseEmail = function (automationID, emailID, callback) {
	var handlerTag = {"src": "smci/automations.pauseEmail"};
	var options = {
		"hostname": `${smci_settings.apiDataCenter}.api.mailchimp.com`,
		"path": `/${smci_settings.apiVersion}/automations/${automationID}/emails/${emailID}/actions/pause`,
		"method": "POST",
		"auth": `${smci_settings.anystring}:${smci_settings.apikey}`,
		"headers": {
			"Content-Type": "application/json"
		}
	};

	var requestObj = https.request(options, function (response) {
		response.on("data", function (data) {
			logger.log(`MailChimp returned a response...`, handlerTag);
			if (typeof callback === "function") {
				try {
					callback(JSON.parse(data.toString()), null);
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
	requestObj.end();
};

/*
	@function 	automations.startEmail
	@parameter 	automationID - the workflow ID of the automation with the desired email
	@parameter 	emailID - the workflow email ID of the particular email to start/restart
	@parameter 	callback - a callback function to run after the request is issued. It is passed two arguments:
					"response" - the response object from MailChimp's POST /automations/{workflow_id}/emails/{workflow_email_id}/actions/start api
					"error" - any error(s) that occurred while processing the request
				The values of the "error" and "response" arguments vary depending on the result of the request.
				On success: "error" is null, and "response" is the JSON response object returned from MailChimp.
				On failure: "error" is the object returned by the NodeJS https.request() function's "error" event, and "response" is null.
	@returns 	n/a
	@details 	This function executes a POST request using the NodeJS https.request() api to start/restart an automation email.
*/
smci.automations.startEmail = function (automationID, emailID, callback) {
	var handlerTag = {"src": "smci/automations.startEmail"};
	var options = {
		"hostname": `${smci_settings.apiDataCenter}.api.mailchimp.com`,
		"path": `/${smci_settings.apiVersion}/automations/${automationID}/emails/${emailID}/actions/start`,
		"method": "POST",
		"auth": `${smci_settings.anystring}:${smci_settings.apikey}`,
		"headers": {
			"Content-Type": "application/json"
		}
	};

	var requestObj = https.request(options, function (response) {
		response.on("data", function (data) {
			logger.log(`MailChimp returned a response...`, handlerTag);
			if (typeof callback === "function") {
				try {
					callback(JSON.parse(data.toString()), null);
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
	requestObj.end();
};

/*
	@function 	automations.subscribeToEmail
	@parameter 	automationID - the workflow ID string of the automation with the desired email
	@parameter 	emailID - the workflow email ID string of the particular email to subscribe to
	@parameter 	recipient - the email address string to add to the desired email's subscription list
	@parameter 	callback - a callback function to run after the request is issued. It is passed two arguments:
					"response" - the response object from MailChimp's POST /automations/{workflow_id}/emails/{workflow_email_id}/queue api
					"error" - any error(s) that occurred while processing the request
				The values of the "error" and "response" arguments vary depending on the result of the request.
				On success: "error" is null, and "response" is the JSON response object returned from MailChimp.
				On failure: "error" is the object returned by the NodeJS https.request() function's "error" event, and "response" is null.
	@returns 	n/a
	@details 	This function executes a POST request using the NodeJS https.request() api to add the "recipient" email address to the subscriber list of the "emailID" email in the "automationID" automation workflow.
*/
smci.automations.subscribeToEmail = function (automationID, emailID, recipient, callback) {
	var handlerTag = {"src": "smci/automations.subscribeToEmail"};
	var requestBody = {
		"email_address": recipient
	};
	var options = {
		"hostname": `${smci_settings.apiDataCenter}.api.mailchimp.com`,
		"path": `/${smci_settings.apiVersion}/automations/${automationID}/emails/${emailID}/queue`,
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
					// BEGIN debug
					// logger.log(`status: ${response.statusCode}`, handlerTag);
					// logger.log(`headers: ${(typeof response.headers === "object") ? JSON.stringify(response.headers) : response.headers}`, handlerTag);
					// logger.log(`response: ${data}`, handlerTag);
					// END debug
					callback(JSON.parse(data.toString()), null);
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
	@function 	automations.getEmailQueue
	@parameter 	automationID - the workflow ID string of the automation with the desired email
	@parameter 	emailID - the workflow email ID string of the particular email to acquire subscribers from
	@parameter 	callback - a callback function to run after the request is issued. It is passed two arguments:
					"response" - the response object from MailChimp's GET /automations/{workflow_id}/emails/{workflow_email_id}/queue api
					"error" - any error(s) that occurred while processing the request
				The values of the "error" and "response" arguments vary depending on the result of the request.
				On success: "error" is null, and "response" is the JSON response object returned from MailChimp.
				On failure: "error" is the object returned by the NodeJS https.get() function's "error" event, and "response" is null.
	@returns 	n/a
	@details 	This function executes a GET request using the NodeJS https.get() api to acquire the list of queued "recipient" email addresses from the subscriber list of the "emailID" email in the "automationID" automation workflow.
*/
smci.automations.getEmailQueue = function (automationID, emailID, callback) {
	var handlerTag = {"src": "smci/automations.getEmailQueue"};
	var options = {
		"hostname": `${smci_settings.apiDataCenter}.api.mailchimp.com`,
		"path": `/${smci_settings.apiVersion}/automations/${automationID}/emails/${emailID}/queue`,
		"method": "GET",
		"auth": `${smci_settings.anystring}:${smci_settings.apikey}`
	};

	https.get(options, function (response) {
		response.on("data", function (data) {
			logger.log(`MailChimp returned a response...`, handlerTag);
			if (typeof callback === "function") {
				try {
					callback(JSON.parse(data.toString()), null);
				} catch (e) {
					logger.log(`JSON parsing failed: ${e}`, handlerTag);
					callback(null, e);
				}
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
	@function 	automations.getEmailSubscriber
	@parameter 	automationID - the workflow ID string of the automation with the desired email
	@parameter 	emailID - the workflow email ID string of the particular email to acquire subscribers from
	@parameter 	subscriberHash - the MD5 hash of the lowercase version of the list member's email address
	@parameter 	callback - a callback function to run after the request is issued. It is passed two arguments:
					"response" - the response object from MailChimp's GET /automations/{workflow_id}/emails/{workflow_email_id}/queue/{subscriber_hash} api
					"error" - any error(s) that occurred while processing the request
				The values of the "error" and "response" arguments vary depending on the result of the request.
				On success: "error" is null, and "response" is the JSON response object returned from MailChimp.
				On failure: "error" is the object returned by the NodeJS https.get() function's "error" event, and "response" is null.
	@returns 	n/a
	@details 	This function executes a GET request using the NodeJS https.get() api to acquire information of the "subscriberHash" subscriber from the subscriber list of the "emailID" email in the "automationID" automation workflow.
*/
smci.automations.getEmailSubscriber = function (automationID, emailID, subscriberHash, callback) {
	var handlerTag = {"src": "smci/automations.getEmailSubscriber"};
	var options = {
		"hostname": `${smci_settings.apiDataCenter}.api.mailchimp.com`,
		"path": `/${smci_settings.apiVersion}/automations/${automationID}/emails/${emailID}/queue/${subscriberHash}`,
		"method": "GET",
		"auth": `${smci_settings.anystring}:${smci_settings.apikey}`
	};

	https.get(options, function (response) {
		response.on("data", function (data) {
			logger.log(`MailChimp returned a response...`, handlerTag);
			if (typeof callback === "function") {
				try {
					callback(JSON.parse(data.toString()), null);
				} catch (e) {
					logger.log(`JSON parsing failed: ${e}`, handlerTag);
					callback(null, e);
				}
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
	@function 	automations.blacklistSubscriber
	@parameter 	automationID - the workflow ID string of the automation with the desired email
	@parameter 	recipient - the email address string of the recipient to PERMANENTLY remove from the specified automation workflow
	@parameter 	callback - a callback function to run after the request is issued. It is passed two arguments:
					"response" - the response object from MailChimp's POST /automations/{workflow_id}/removed-subscribers api
					"error" - any error(s) that occurred while processing the request
				The values of the "error" and "response" arguments vary depending on the result of the request.
				On success: "error" is null, and "response" is the JSON response object returned from MailChimp.
				On failure: "error" is the object returned by the NodeJS https.request() function's "error" event, and "response" is null.
	@returns 	n/a
	@details 	This function executes a POST request using the NodeJS https.request() api to remove the "recipient" from the ENTIRE automation workflow specified by "automationID".
	@warning	According to MailChimp, this operation is PERMANENT; once a recipient has been removed from an automation workflow, that recipient can never be added to the same workflow again (i.e. the recipient will never receive emails from the specified automation ever again)!
*/
smci.automations.blacklistSubscriber = function (automationID, recipient, callback) {
	var handlerTag = {"src": "smci/automations.blacklistSubscriber"};
	var requestBody = {
		"email_address": recipient
	};
	var options = {
		"hostname": `${smci_settings.apiDataCenter}.api.mailchimp.com`,
		"path": `/${smci_settings.apiVersion}/automations/${automationID}/removed-subscribers`,
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
					callback(JSON.parse(data.toString()), null);
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
	@function 	automations.getBlacklist
	@parameter 	automationID - the workflow ID string of the desired automation workflow
	@parameter 	callback - a callback function to run after the request is issued. It is passed two arguments:
					"response" - the response object from MailChimp's GET /automations/{workflow_id}/removed-subscribers api
					"error" - any error(s) that occurred while processing the request
				The values of the "error" and "response" arguments vary depending on the result of the request.
				On success: "error" is null, and "response" is the JSON response object returned from MailChimp.
				On failure: "error" is the object returned by the NodeJS https.get() function's "error" event, and "response" is null.
	@returns 	n/a
	@details 	This function executes a GET request using the NodeJS https.get() api to acquire a list of removed recipients from the automation workflow specified by "automationID".
*/
smci.automations.getBlacklist = function (automationID, callback) {
	var handlerTag = {"src": "smci/automations.getBlacklist"};
	var options = {
		"hostname": `${smci_settings.apiDataCenter}.api.mailchimp.com`,
		"path": `/${smci_settings.apiVersion}/automations/${automationID}/removed-subscribers`,
		"method": "GET",
		"auth": `${smci_settings.anystring}:${smci_settings.apikey}`
	};

	https.get(options, function (response) {
		response.on("data", function (data) {
			logger.log(`MailChimp returned a response...`, handlerTag);
			if (typeof callback === "function") {
				try {
					callback(JSON.parse(data.toString()), null);
				} catch (e) {
					logger.log(`JSON parsing failed: ${e}`, handlerTag);
					callback(null, e);
				}
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
	@function 	batchOps.add
	@parameter 	requestBody - a JSON object containing the request body expected by the MailChimp POST /batches api. This is used to specify what type of action(s) MailChimp needs to do for this batch operation. Read the MailChimp API reference for more details on this parameter.
	@parameter 	callback - a callback function to run after the request is issued. It is passed two arguments:
					"response" - the response object from MailChimp's POST /batches api
					"error" - any error(s) that occurred while processing the request
				The values of the "error" and "response" arguments vary depending on the result of the request.
				On success: "error" is null, and "response" is the JSON response object returned from MailChimp.
				On failure: "error" is the object returned by the NodeJS https.request() function's "error" event, and "response" is null.
	@returns 	n/a
	@details 	This function executes a POST request using the NodeJS https.request() api to invoke MailChimp's batch operation processing.
*/
smci.batchOps.add = function (requestBody, callback) {
	var handlerTag = {"src": "smci/batchOps.add"};
	var options = {
		"hostname": `${smci_settings.apiDataCenter}.api.mailchimp.com`,
		"path": `/${smci_settings.apiVersion}/batches`,
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
					callback(JSON.parse(data.toString()), null);
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
	@function 	batchOps.getFullList
	@parameter	qsObj - the JSON object representing the request's query string parameters expected by the MailChimp GET /batches api. MailChimp uses these parameters to determine how to format its response. If no particular control over the response is desired, this parameter can be passed "null". Otherwise, the object can contain any or all of the following:
					{
						"fields": "...",
						"exclude_fields": "...",
						"count": ...,
						"offset": ...
					}
				where "fields" is a comma-separated list of fields to include in the response, "exclude_fields" is a comma-separated list of fields to omit in the response, "count" is the max number of records you want to receive, and "offset" is the number of records from a collection that you want MailChimp to skip before compiling your requested results. Read the MailChimp API reference for more details on the above query string parameters.
	@parameter 	callback - a callback function to run after the request is issued. It is passed two arguments:
					"response" - the response object from MailChimp's GET /batches api
					"error" - any error(s) that occurred while processing the request
				The values of the "error" and "response" arguments vary depending on the result of the request.
				On success: "error" is null, and "response" is the JSON response object returned from MailChimp.
				On failure: "error" is the object returned by the NodeJS https.get() function's "error" event, and "response" is null.
	@returns	n/a
	@details 	This function executes a GET request using the NodeJS https.get() api to acquire the list of all batch operation requests made under the associated MailChimp account, as well as any information about them (that you specify with the "qsObj" parameter).
*/
smci.batchOps.getFullList = function (qsObj, callback) {
	var handlerTag = {"src": "smci/batchOps.getFullList"};
	var querystring = (qsObj === null) ? "" : `?${qs.stringify(qsObj)}`;
	var options = {
		"hostname": `${smci_settings.apiDataCenter}.api.mailchimp.com`,
		"path": `/${smci_settings.apiVersion}/batches${querystring}`,
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

/*
	@function 	batchOps.getStatus
	@parameter 	batchID - the unique ID for the desired batch operation to query
	@parameter	qsObj - the JSON object representing the request's query string parameters expected by the MailChimp GET /batches/{batch_id} api. MailChimp uses these parameters to determine how to format its response. If no particular control over the response is desired, this parameter can be passed "null". Otherwise, the object can contain any or all of the following:
					{
						"fields": "...",
						"exclude_fields": "..."
					}
				where "fields" is a comma-separated list of fields to include in the response, and "exclude_fields" is a comma-separated list of fields to omit in the response. Read the MailChimp API reference for more details on the above query string parameters.
	@parameter 	callback - a callback function to run after the request is issued. It is passed two arguments:
					"response" - the response object from MailChimp's GET /batches/{batch_id} api
					"error" - any error(s) that occurred while processing the request
				The values of the "error" and "response" arguments vary depending on the result of the request.
				On success: "error" is null, and "response" is the JSON response object returned from MailChimp.
				On failure: "error" is the object returned by the NodeJS https.get() function's "error" event, and "response" is null.
	@returns	n/a
	@details 	This function executes a GET request using the NodeJS https.get() api to acquire the status of the batch operation request specified by "batchID", as well as any information about them (that you specify with the "qsObj" parameter).
*/
smci.batchOps.getStatus = function (batchID, qsObj, callback) {
	var handlerTag = {"src": "smci/batchOps.getStatus"};
	var querystring = (qsObj === null) ? "" : `?${qs.stringify(qsObj)}`;
	var options = {
		"hostname": `${smci_settings.apiDataCenter}.api.mailchimp.com`,
		"path": `/${smci_settings.apiVersion}/batches/${batchID}${querystring}`,
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

/*
	@function 	batchOps.delete
	@parameter 	batchID - the unique ID for the desired batch operation to delete
	@parameter 	callback - a callback function to run after the request is issued. It is passed two arguments:
					"response" - the response object from MailChimp's DELETE /batches/{batch_id} api
					"error" - any error(s) that occurred while processing the request
				The values of the "error" and "response" arguments vary depending on the result of the request.
				On success: "error" is null, and "response" is the JSON response object returned from MailChimp.
				On failure: "error" is the object returned by the NodeJS https.request() function's "error" event, and "response" is null.
	@returns 	n/a
	@details 	This function executes a DELETE request using the NodeJS https.request() api to delete the batch operation specified by "batchID", effectively cancelling any pending actions left in the batch operation.
	@warning	After this function is called, the results of any completed actions in the deleted batch operation will no longer be available for you to query.
*/
smci.batchOps.delete = function (batchID, callback) {
	var handlerTag = {"src": "smci/batchOps.delete"};
	var options = {
		"hostname": `${smci_settings.apiDataCenter}.api.mailchimp.com`,
		"path": `/${smci_settings.apiVersion}/batches/${batchID}`,
		"method": "DELETE",
		"auth": `${smci_settings.anystring}:${smci_settings.apikey}`
	};

	var requestObj = https.request(options, function (response) {
		response.on("data", function (data) {
			logger.log(`MailChimp returned a response...`, handlerTag);
			if (typeof callback === "function") {
				try {
					callback(JSON.parse(data.toString()), null);
				} catch (e) {
					logger.log(`JSON parsing failed: ${e}`, handlerTag);
					callback(null, e);
				}
			}
		});
	});
	requestObj.on("error", function (err) {
		logger.log(`HTTPS DELETE failed: ${err}`, handlerTag);
		if (typeof callback === "function") {
			callback(null, err);
		}
	});
	requestObj.end();
};

/*
	@function 	campaignFolders.create
	@parameter 	folderName - the name of the campaign folder to create
	@parameter 	callback - a callback function to run after the request is issued. It is passed two arguments:
					"response" - the response object from MailChimp's POST /campaign-folders api
					"error" - any error(s) that occurred while processing the request
				The values of the "error" and "response" arguments vary depending on the result of the request.
				On success: "error" is null, and "response" is the JSON response object returned from MailChimp.
				On failure: "error" is the object returned by the NodeJS https.request() function's "error" event, and "response" is null.
	@returns 	n/a
	@details 	This function executes a POST request using the NodeJS https.request() api to create a new MailChimp Campaign Folder with the name specified by "folderName"
*/
smci.campaignFolders.create = function (folderName, callback) {
	var handlerTag = {"src": "smci/campaignFolders.create"};
	var requestBody = {
		"name": folderName
	};
	var options = {
		"hostname": `${smci_settings.apiDataCenter}.api.mailchimp.com`,
		"path": `/${smci_settings.apiVersion}/campaign-folders`,
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
					callback(JSON.parse(data.toString()), null);
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
	@function 	campaignFolders.getFullList
	@parameter	qsObj - the JSON object representing the request's query string parameters expected by the MailChimp GET /campaign-folders api. MailChimp uses these parameters to determine how to format its response. If no particular control over the response is desired, this parameter can be passed "null". Otherwise, the object can contain any or all of the following:
					{
						"fields": "...",
						"exclude_fields": "...",
						"count": ...,
						"offset": ...
					}
				where "fields" is a comma-separated list of fields to include in the response, "exclude_fields" is a comma-separated list of fields to omit in the response, "count" is the max number of records you want to receive, and "offset" is the number of records from a collection that you want MailChimp to skip before compiling your requested results. Read the MailChimp API reference for more details on the above query string parameters.
	@parameter 	callback - a callback function to run after the request is issued. It is passed two arguments:
					"response" - the response object from MailChimp's GET /campaign-folders api
					"error" - any error(s) that occurred while processing the request
				The values of the "error" and "response" arguments vary depending on the result of the request.
				On success: "error" is null, and "response" is the JSON response object returned from MailChimp.
				On failure: "error" is the object returned by the NodeJS https.get() function's "error" event, and "response" is null.
	@returns 	n/a
	@details 	This function executes a GET request using the NodeJS https.get() api to acquire a list of all folders used to organize campaigns.
*/
smci.campaignFolders.getFullList = function (qsObj, callback) {
	var handlerTag = {"src": "smci/campaignFolders.getFullList"};
	var querystring = (qsObj === null) ? "" : `?${qs.stringify(qsObj)}`;
	var options = {
		"hostname": `${smci_settings.apiDataCenter}.api.mailchimp.com`,
		"path": `/${smci_settings.apiVersion}/campaign-folders${querystring}`,
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

/*
	@function 	campaignFolders.getFolder
	@parameter 	folderID - the unique id for the campaign folder to query
	@parameter	qsObj - the JSON object representing the request's query string parameters expected by the MailChimp GET /campaign-folders/{folder_id} api. MailChimp uses these parameters to determine how to format its response. If no particular control over the response is desired, this parameter can be passed "null". Otherwise, the object can contain any or all of the following:
					{
						"fields": "...",
						"exclude_fields": "..."
					}
				where "fields" is a comma-separated list of fields to include in the response, and "exclude_fields" is a comma-separated list of fields to omit in the response. Read the MailChimp API reference for more details on the above query string parameters.
	@parameter 	callback - a callback function to run after the request is issued. It is passed two arguments:
					"response" - the response object from MailChimp's GET /campaign-folders/{folder_id} api
					"error" - any error(s) that occurred while processing the request
				The values of the "error" and "response" arguments vary depending on the result of the request.
				On success: "error" is null, and "response" is the JSON response object returned from MailChimp.
				On failure: "error" is the object returned by the NodeJS https.get() function's "error" event, and "response" is null.
	@returns 	n/a
	@details 	This function executes a GET request using the NodeJS https.get() api to acquire information about the campaign folder specified by "folderID".
*/
smci.campaignFolders.getFolder = function (folderID, qsObj, callback) {
	var handlerTag = {"src": "smci/campaignFolders.getFolder"};
	var querystring = (qsObj === null) ? "" : `?${qs.stringify(qsObj)}`;
	var options = {
		"hostname": `${smci_settings.apiDataCenter}.api.mailchimp.com`,
		"path": `/${smci_settings.apiVersion}/campaign-folders/${folderID}${querystring}`,
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
// END MailChimp API Wrapper Functions



module.exports = smci;
// END smci.js
