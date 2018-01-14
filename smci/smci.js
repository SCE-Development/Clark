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

/*
	@function 	getAppInfo
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
smci.getAppInfo = function (appID, qsObj, callback) {
	var handlerTag = {"src": "smci/getAppInfo"};
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
	@function 	getAutomations
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
smci.getAutomations = function (qsObj, callback) {
	var handlerTag = {"src": "smci/getAutomations"};
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
	@function 	getAutomationInfo
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
smci.getAutomationInfo = function (automationID, qsObj, callback) {
	var handlerTag = {"src": "smci/getAutomationInfo"};
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
	@function 	pauseAutomation
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
smci.pauseAutomation = function (automationID, callback) {
	var handlerTag = {"src": "smci/pauseAutomation"};
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
	@function 	beginAutomation
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
smci.beginAutomation = function (automationID, callback) {
	var handlerTag = {"src": "smci/beginAutomation"};
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
	@function 	getAutomationEmails
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
smci.getAutomationEmails = function (automationID, callback) {
	var handlerTag = {"src": "smci/getAutomationEmails"};
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
	@function 	getAutomationEmailInfo
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
smci.getAutomationEmailInfo = function (automationID, emailID, callback) {
	var handlerTag = {"src": "smci/getAutomationEmailInfo"};
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
	@function 	deleteAutomationEmail
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
smci.deleteAutomationEmail = function (automationID, emailID, callback) {
	var handlerTag = {"src": "smci/deleteAutomationEmail"};
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
	@function 	pauseAutomationEmail
	@parameter 	automationID - the workflow ID of the automation with the desired email
	@parameter 	emailID - the workflow email ID of the particular email to pause
	@parameter 	callback - a callback function to run after the request is issued. It is passed two arguments:
					"response" - the response object from MailChimp's POST /automations/{workflow_id}/emails/{workflow_email_id}/actions/pause api
					"error" - any error(s) that occurred while processing the request
				The values of the "error" and "response" arguments vary depending on the result of the request.
				On success: "error" is null, and "response" is the JSON response object returned from MailChimp.
				On failure: "error" is the object returned by the NodeJS https.request() function's "error" event, and "response" is null.
	@returns 	n/a
	@details 	This function executes a POST request using the NodeJS https.request() api to pause an automation email.
*/
smci.pauseAutomationEmail = function (automationID, emailID, callback) {
	var handlerTag = {"src": "smci/pauseAutomationEmail"};
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
	@function 	beginAutomationEmail
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
smci.beginAutomationEmail = function (automationID, emailID, callback) {
	var handlerTag = {"src": "smci/beginAutomationEmail"};
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
	@function 	subscribeToAutomationEmail
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
	@details 	This function executes a POST request using the NodeJS https.request() api to add the "recipient" email addres to the subscriber list of the "emailID" email in the "automationID" automation workflow.
*/
smci.subscribeToAutomationEmail = function (automationID, emailID, recipient, callback) {
	var handlerTag = {"src": "smci/subscribeToAutomationEmail"};
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
// END Functions



module.exports = smci;
// END smci.js
