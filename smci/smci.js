//	PROJECT: 		MEANserver
// 	Name: 			Rolando Javier
// 	File: 			smci.js
// 	Date Created: 	January 8, 2018
// 	Last Modified: 	January 17, 2018
// 	Details:
// 					The Sce Mail Chimp Interface (SMCI). This file contains JavaScript wrapper functions for the MailChimp v3.0 APIs, which handle communication and control over the associated MailChimp account's mailing system, email campaign/subscriber lists, and various other preferences.
//	Notes: 			ECMAscript 6 constructs can be used here (i.e. templating).
// 					This file is a work in progress. The completed wrapper functions included in this file only cover the following MailChimp APIs:
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
//						Batch Operations:
//							POST /batches
//							GET /batches
//							GET /batches/{batch_id}
//							DELETE /batches/{batch_id}
//						Campaign Folders:
//							POST /campaign-folders
//							GET /campaign-folders
//							GET /campaign-folders/{folder_id}
//							PATCH /campaign-folders/{folder_id}
//							DELETE /campaign-folders/{folder_id}
//						Campaigns:
//							POST /campaigns
//							GET /campaigns
//							GET /campaigns/{campaign_id}
//							PATCH /campaigns/{campaign_id}
//							DELETE /campaigns/{campaign_id}
//							POST /campaigns/{campaign_id}/actions/pause
//							POST /campaigns/{campaign_id}/actions/replicate
//							POST /campaigns/{campaign_id}/actions/resume
//							POST /campaigns/{campaign_id}/actions/schedule
//							POST /campaigns/{campaign_id}/actions/send
//							POST /campaigns/{campaign_id}/actions/test
//							POST /campaigns/{campaign_id}/actions/unschedule
//							GET /campaigns/{campaign_id}/send-checklist
//						Search Campaigns (defined under campaigns):
//							GET /search-campaigns
//						Search Members (defined under lists):
//							GET /search-members
//						Lists:
//							POST /lists
//							GET /lists
//							POST /lists/{list_id}
//							GET /lists/{list_id}
//							PATCH /lists/{list_id}
//							DELETE /lists/{list_id}
//							POST /lists/{list_id}/members
//							GET /lists/{list_id}/members
//							PATCH /lists/{list_id}/members/{subscriber_hash}
//							DELETE /lists/{list_id}/members/{subscriber_hash}
// 						Template Folders:
//							POST /template-folders
//							GET /template-folders
//							GET /template-folders/{folder_id}
//							PATCH /template-folders/{folder_id}
//							DELETE /template-folders/{folder_id}
//						Templates:
//							POST /templates
//							GET /templates
//							GET /templates/{template_id}
//							PATCH /templates/{template_id}
//							DELETE /templates/{template_id}
// 	Dependencies:
// 					Node.js HTTPS Module
//					Node.js Query String Module

"use strict"

// Includes
const https = require("https");						// import NodeJS https module
const qs = require("querystring");					// import NodeJS querystring module
var settings = require("../util/settings");			// import server system settings
var logger = require(`${settings.util}/logger`);	// import event log system
var www = require(`${settings.util}/www`).https;
const smci_settings = require("./smci_settings");	// import MailChimp Settings



// Container (Singleton) - contains the api wrappers defined below
const smci = {
	"api": {},
	"authorizedApps": {},
	"automations": {},
	"batchOps": {},
	"campaignFolders": {},
	"campaigns": {},
	"lists": {},
	"templateFolders": {},
	"templates": {}
};



// BEGIN MailChimp API Wrapper Functions
// BEGIN api root
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

	www.get(options, callback, handlerTag.src);
};

/*
	@function 	api.ping
	@parameter 	callback - a callback function to run after the request is issued. It is passed two arguments:
					"response" - the response object from MailChimp
					"error" - any error(s) that occurred while processing the request
				The values of the "error" and "response" arguments vary depending on the result of the request.
				On success: "error" is null, and "response" is the JSON response object returned from MailChimp.
				On failure: "error" is the object returned by the NodeJS https.get() function's "error" event, and "response" is null.
	@returns	n/a
	@details 	This function makes a GET request to the MailChimp GET /ping api using the NodeJS https.get() api.
*/
smci.api.ping = function (callback) {
	var handlerTag = {"src": "smci/api.ping"};
	var options = {
		"hostname": `${smci_settings.apiDataCenter}.api.mailchimp.com`,
		"path": `/${smci_settings.apiVersion}/ping`,
		"method": "GET",
		"auth": `${smci_settings.anystring}:${smci_settings.apikey}`
	};

	www.get(options, callback, handlerTag.src);
};
// END api root



// BEGIN authorized apps
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
	@details 	This function executes a POST request using the NodeJS https.request() api to link the client associated with "client_id" to MailChimp's services. In doing so, it returns OAuth-2 based credentials for use in associating SMCI's API calls with the associated MailChimp account.
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

	www.post(options, requestBody, callback, handlerTag.src);
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

	www.get(options, callback, handlerTag.src);
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

	www.get(options, callback, handlerTag.src);
};
// END authorized apps



// BEGIN automations
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

	www.get(options, callback, handlerTag.src);
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

	www.get(options, callback, handlerTag.src);
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

	www.post(options, null, callback, handlerTag.src);
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

	www.post(options, null, callback, handlerTag.src);
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

	www.get(options, callback, handlerTag.src);
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

	www.get(options, callback, handlerTag.src);
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

	www.delete(options, callback, handlerTag.src);
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

	www.post(options, null, callback, handlerTag.src);
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

	www.post(options, null, callback, handlerTag.src);
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

	www.post(options, requestBody, callback, handlerTag.src);
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

	www.get(options, callback, handlerTag.src);
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

	www.get(options, callback, handlerTag.src);
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

	www.post(options, requestBody, callback, handlerTag.src);
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

	www.get(options, callback, handlerTag.src);
};
// END automations



// BEGIN batch operations
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

	www.post(options, requestBody, callback, handlerTag.src);
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

	www.get(options, callback, handlerTag.src);
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

	www.get(options, callback, handlerTag.src);
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

	www.delete(options, callback, handlerTag.src);
};
// END batch operations



// BEGIN campaign folders
/*
	@function 	campaignFolders.createFolder
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
smci.campaignFolders.createFolder = function (folderName, callback) {
	var handlerTag = {"src": "smci/campaignFolders.createFolder"};
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

	www.post(options, requestBody, callback, handlerTag.src);
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

	www.get(options, callback, handlerTag.src);
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

	www.get(options, callback, handlerTag.src);
};

/*
	@function 	campaignFolders.editFolder
	@parameter  folderID - the unique id for the campaign folder to edit
	@parameter 	newName - the new name to apply to the folder
	@parameter 	callback - a callback function to run after the request is issued. It is passed two arguments:
					"response" - the response object from MailChimp's PATCH /campaign-folders/{folder_id} api
					"error" - any error(s) that occurred while processing the request
				The values of the "error" and "response" arguments vary depending on the result of the request.
				On success: "error" is null, and "response" is the JSON response object returned from MailChimp.
				On failure: "error" is the object returned by the NodeJS https.request() function's "error" event, and "response" is null.
	@returns 	n/a
	@details 	This function executes a PATCH request using the NodeJS https.request() api to edit/update a campaign folder. This function currently only allows changes to a campaign folder's name.
*/
smci.campaignFolders.editFolder = function (folderID, newName, callback) {
	var handlerTag = {"src": "smci/campaignFolders.editFolder"};
	var requestBody = {
		"name": newName
	};
	var options = {
		"hostname": `${smci_settings.apiDataCenter}.api.mailchimp.com`,
		"path": `/${smci_settings.apiVersion}/campaign-folders/${folderID}`,
		"method": "PATCH",
		"auth": `${smci_settings.anystring}:${smci_settings.apikey}`,
		"headers": {
			"Content-Type": "application/json",
			"Content-Length": Buffer.byteLength(JSON.stringify(requestBody))
		}
	};

	www.patch(options, requestBody, callback, handlerTag.src);
};

/*
	@function 	campaignFolders.deleteFolder
	@parameter  folderID - the unique id for the campaign folder to edit
	@parameter 	callback - a callback function to run after the request is issued. It is passed two arguments:
					"response" - the response object from MailChimp's DELETE /campaign-folders/{folder_id} api
					"error" - any error(s) that occurred while processing the request
				The values of the "error" and "response" arguments vary depending on the result of the request.
				On success: "error" is null, and "response" is the JSON response object returned from MailChimp.
				On failure: "error" is the object returned by the NodeJS https.request() function's "error" event, and "response" is null.
	@returns 	n/a
	@details 	This function executes a DELETE request using the NodeJS https.request() api to delete a campaign folder. This operation also places any campaigns within the specified folder under the "unfiled" category.
*/
smci.campaignFolders.deleteFolder = function (folderID, callback) {
	var handlerTag = {"src": "smci/campaignFolders.deleteFolder"};
	var options = {
		"hostname": `${smci_settings.apiDataCenter}.api.mailchimp.com`,
		"path": `/${smci_settings.apiVersion}/campaign-folders/${folderID}`,
		"method": "DELETE",
		"auth": `${smci_settings.anystring}:${smci_settings.apikey}`
	};

	www.delete(options, callback, handlerTag.src);
};
// END campaign folders



// BEGIN campaigns
/*
	@function 	campaigns.create
	@paraemter 	requestBody - the JSON object representing the request body's parameters expected by the MailChimp POST /campaigns api. Read the MailChimp API reference for more details on this parameter.
	@parameter 	callback - a callback function to run after the request is issued. It is passed two arguments:
					"response" - the response object from MailChimp's POST /campaigns api
					"error" - any error(s) that occurred while processing the request
				The values of the "error" and "response" arguments vary depending on the result of the request.
				On success: "error" is null, and "response" is the JSON response object returned from MailChimp.
				On failure: "error" is the object returned by the NodeJS https.request() function's "error" event, and "response" is null.
	@returns 	n/a
	@details 	This function executes a POST request using the NodeJS https.request() api to create a campaign.
*/
smci.campaigns.create = function (requestBody, callback) {
	var handlerTag = {"src": "smci/campaigns.create"};
	var options = {
		"hostname": `${smci_settings.apiDataCenter}.api.mailchimp.com`,
		"path": `/${smci_settings.apiVersion}/campaigns`,
		"method": "POST",
		"auth": `${smci_settings.anystring}:${smci_settings.apikey}`,
		"headers": {
			"Content-Type": "application/json",
			"Content-Length": Buffer.byteLength(JSON.stringify(requestBody))
		}
	};

	www.post(options, requestBody, callback, handlerTag.src);
};

/*
	Izzy adding a neccesary api call to edit a mailchimp campaign
*/
smci.campaigns.setCampaignContent = function (campaignID, requestBody, callback) {
	var handlerTag = {"src": "smci/campaigns.setCampaignContent"};
	var options = {
		"hostname": `${smci_settings.apiDataCenter}.api.mailchimp.com`,
		"path": `/${smci_settings.apiVersion}/campaigns/${campaignID}/content`,
		"method": "PUT",
		"auth": `${smci_settings.anystring}:${smci_settings.apikey}`,
		"headers": {
			"Content-Type": "application/json",
			"Content-Length": Buffer.byteLength(JSON.stringify(requestBody))
		}
	};

	www.post(options, requestBody, callback, handlerTag.src);
};

/*
	@function 	campaigns.getFullList
	@parameter	qsObj - the JSON object representing the request's query string parameters expected by the MailChimp GET /campaigns api. MailChimp uses these parameters to determine how to format its response. If no particular control over the response is desired, this parameter can be passed "null". Otherwise, the object can contain any or all of the following:
					{
						"fields": "...",
						"exclude_fields": "...",
						"count": [int],
						"offset": [int],
						"type": "...",
						"status": "...",
						"before_send_time": "...",
						"since_send_time": "...",
						"before_create_time": "...",
						"since_create_time": "...",
						"list_id": "...",
						"folder_id": "...",
						"sort_field": "...",
						"sort_dir": "..."
					}
				Read the MailChimp API reference for more details on the above query string parameters.
	@parameter 	callback - a callback function to run after the request is issued. It is passed two arguments:
					"response" - the response object from MailChimp's GET /campaigns api
					"error" - any error(s) that occurred while processing the request
				The values of the "error" and "response" arguments vary depending on the result of the request.
				On success: "error" is null, and "response" is the JSON response object returned from MailChimp.
				On failure: "error" is the object returned by the NodeJS https.get() function's "error" event, and "response" is null.
	@returns 	n/a
	@details 	This function executes a GET request using the NodeJS https.get() api to acquire a full list of Email Campaigns associated with the MailChimp account.
*/
smci.campaigns.getFullList = function (qsObj, callback) {
	var handlerTag = {"src": "smci/campaigns.getFullList"};
	var querystring = (qsObj === null) ? "" : `?${qs.stringify(qsObj)}`;
	var options = {
		"hostname": `${smci_settings.apiDataCenter}.api.mailchimp.com`,
		"path": `/${smci_settings.apiVersion}/campaigns${querystring}`,
		"method": "GET",
		"auth": `${smci_settings.anystring}:${smci_settings.apikey}`
	};

	www.get(options, callback, handlerTag.src);
};

/*
	@function 	campaigns.getCampaignInfo
	@parameter 	campaignID - the unique ID associated with the campaign to find
	@parameter	qsObj - the JSON object representing the request's query string parameters expected by the MailChimp GET /campaigns/{campaign_id} api. MailChimp uses these parameters to determine how to format its response. If no particular control over the response is desired, this parameter can be passed "null". Otherwise, the object can contain any or all of the following:
					{
						"fields": "...",
						"exclude_fields": "..."
					}
				Read the MailChimp API reference for more details on the above query string parameters.
	@parameter 	callback - a callback function to run after the request is issued. It is passed two arguments:
					"response" - the response object from MailChimp's GET /campaigns/{campaign_id} api
					"error" - any error(s) that occurred while processing the request
				The values of the "error" and "response" arguments vary depending on the result of the request.
				On success: "error" is null, and "response" is the JSON response object returned from MailChimp.
				On failure: "error" is the object returned by the NodeJS https.get() function's "error" event, and "response" is null.
	@returns 	n/a
	@details 	This function executes a GET request using the NodeJS https.get() api to acquire information about the email campaign specified by "campaignID".
*/
smci.campaigns.getCampaignInfo = function (campaignID, qsObj, callback) {
	var handlerTag = {"src": "smci/campaigns.getCampaignInfo"};
	var querystring = (qsObj === null) ? "" : `?${qs.stringify(qsObj)}`;
	var options = {
		"hostname": `${smci_settings.apiDataCenter}.api.mailchimp.com`,
		"path": `/${smci_settings.apiVersion}/campaigns/${campaignID}${querystring}`,
		"method": "GET",
		"auth": `${smci_settings.anystring}:${smci_settings.apikey}`
	};

	www.get(options, callback, handlerTag.src);
};

/*
	@function 	campaigns.editCampaignInfo
	@parameter 	campaignID - the unique ID associated with the campaign to edit
	@parameter 	requestBody - the JSON object representing the request body's parameters expected by the MailChimp PATCH /campaigns/{campaign_id} api. Read the MailChimp API reference for more details on this parameter
	@parameter 	callback - a callback function to run after the request is issued. It is passed two arguments:
					"response" - the response object from MailChimp's PATCH /campaigns/{campaign_id} api
					"error" - any error(s) that occurred while processing the request
				The values of the "error" and "response" arguments vary depending on the result of the request.
				On success: "error" is null, and "response" is the JSON response object returned from MailChimp.
				On failure: "error" is the object returned by the NodeJS https.request() function's "error" event, and "response" is null.
	@returns 	n/a
	@details 	This function executes a PATCH request using the NodeJS https.request() api to edit the settings of the email campaign specified by "campaignID".
*/
smci.campaigns.editCampaignInfo = function (campaignID, requestBody, callback) {
	var handlerTag = {"src": "smci/campaigns.editCampaignInfo"};
	var options = {
		"hostname": `${smci_settings.apiDataCenter}.api.mailchimp.com`,
		"path": `/${smci_settings.apiVersion}/campaigns/${campaignID}`,
		"method": "PATCH",
		"auth": `${smci_settings.anystring}:${smci_settings.apikey}`,
		"headers": {
			"Content-Type": "application/json",
			"Content-Length": Buffer.byteLength(JSON.stringify(requestBody))
		}
	};

	www.patch(options, requestBody, callback, handlerTag.src);
};

/*
	@function 	campaigns.deleteCampaign
	@parameter 	campaignID - the unique ID associated with the campaign to delete
	@parameter 	callback - a callback function to run after the request is issued. It is passed two arguments:
					"response" - the response object from MailChimp's DELETE /campaigns/{campaign_id} api
					"error" - any error(s) that occurred while processing the request
				The values of the "error" and "response" arguments vary depending on the result of the request.
				On success: "error" is null, and "response" is the JSON response object returned from MailChimp.
				On failure: "error" is the object returned by the NodeJS https.request() function's "error" event, and "response" is null.
	@returns 	n/a
	@details 	This function executes a DELETE request using the NodeJS https.request() api delete the email campaign specified by "campaignID".
*/
smci.campaigns.deleteCampaign = function (campaignID, callback) {
	var handlerTag = {"src": "smci/campaigns.deleteCampaign"};
	var options = {
		"hostname": `${smci_settings.apiDataCenter}.api.mailchimp.com`,
		"path": `/${smci_settings.apiVersion}/campaigns/${campaignID}`,
		"method": "DELETE",
		"auth": `${smci_settings.anystring}:${smci_settings.apikey}`
	};

	www.delete(options, callback, handlerTag.src);
};

/*
	@function 	campaigns.pauseCampaign
	@parameter 	campaignID - the unique ID associated with the RSS campaign to pause
	@parameter 	callback - a callback function to run after the request is issued. It is passed two arguments:
					"response" - the response object from MailChimp's POST /campaigns/{campaign_id}/actions/pause api
					"error" - any error(s) that occurred while processing the request
				The values of the "error" and "response" arguments vary depending on the result of the request.
				On success: "error" is null, and "response" is the JSON response object returned from MailChimp.
				On failure: "error" is the object returned by the NodeJS https.request() function's "error" event, and "response" is null.
	@returns 	n/a
	@details 	This function executes a POST request using the NodeJS https.request() api to pause the RSS email campaign specified by "campaignID".
	@note 		This function only works with RSS (blog post driven) campaigns. Calling this function to pause any other type of campaign will return an error! It is therefore recommended that you first call smci.campaigns.getCampaignInfo() to verify that the campaign is the correct type.
*/
smci.campaigns.pauseCampaign = function (campaignID, callback) {
	var handlerTag = {"src": "smci/campaigns.pauseCampaign"};
	var options = {
		"hostname": `${smci_settings.apiDataCenter}.api.mailchimp.com`,
		"path": `/${smci_settings.apiVersion}/campaigns/${campaignID}/actions/pause`,
		"method": "POST",
		"auth": `${smci_settings.anystring}:${smci_settings.apikey}`,
		"headers": {
			"Content-Type": "application/json",
			"Content-Length": 0
		}
	};

	www.post(options, null, callback, handlerTag.src);
};

/*
	@function 	campaigns.copyCampaign
	@parameter 	campaignID - the unique ID associated with the campaign to replicate
	@parameter 	callback - a callback function to run after the request is issued. It is passed two arguments:
					"response" - the response object from MailChimp's POST /campaigns/{campaign_id}/actions/replicate api
					"error" - any error(s) that occurred while processing the request
				The values of the "error" and "response" arguments vary depending on the result of the request.
				On success: "error" is null, and "response" is the JSON response object returned from MailChimp.
				On failure: "error" is the object returned by the NodeJS https.request() function's "error" event, and "response" is null.
	@returns 	n/a
	@details 	This function executes a POST request using the NodeJS https.request() api to copy the email campaign specified by "campaignID".
	@note 		This function only copies campaigns that are in the "saved" or "send" status. Calling this function on any campaign with other statuses will return an error! It is therefore recommended that you first call smci.campaigns.getCampaignInfo() to verify that the campaign is in the correct status.
*/
smci.campaigns.copyCampaign = function (campaignID, callback) {
	var handlerTag = {"src": "smci/campaigns.copyCampaign"};
	var options = {
		"hostname": `${smci_settings.apiDataCenter}.api.mailchimp.com`,
		"path": `/${smci_settings.apiVersion}/campaigns/${campaignID}/actions/replicate`,
		"method": "POST",
		"auth": `${smci_settings.anystring}:${smci_settings.apikey}`,
		"headers": {
			"Content-Type": "application/json",
			"Content-Length": 0
		}
	};

	www.post(options, null, callback, handlerTag.src);
};

/*
	@function 	campaigns.resumeCampaign
	@parameter 	campaignID - the unique ID associated with the RSS campaign to resume
	@parameter 	callback - a callback function to run after the request is issued. It is passed two arguments:
					"response" - the response object from MailChimp's POST /campaigns/{campaign_id}/actions/resume api
					"error" - any error(s) that occurred while processing the request
				The values of the "error" and "response" arguments vary depending on the result of the request.
				On success: "error" is null, and "response" is the JSON response object returned from MailChimp.
				On failure: "error" is the object returned by the NodeJS https.request() function's "error" event, and "response" is null.
	@returns 	n/a
	@details 	This function executes a POST request using the NodeJS https.request() api to resume the RSS email campaign specified by "campaignID".
	@note 		This function only resumes RSS (blog post driven) campaigns. Calling this function to resume any other type of campaign will return an error! It is therefore recommended that you first call smci.campaigns.getCampaignInfo() to verify that the campaign is the correct type.
*/
smci.campaigns.resumeCampaign = function (campaignID, callback) {
	var handlerTag = {"src": "smci/campaigns.resumeCampaign"};
	var options = {
		"hostname": `${smci_settings.apiDataCenter}.api.mailchimp.com`,
		"path": `/${smci_settings.apiVersion}/campaigns/${campaignID}/actions/resume`,
		"method": "POST",
		"auth": `${smci_settings.anystring}:${smci_settings.apikey}`,
		"headers": {
			"Content-Type": "application/json",
			"Content-Length": 0
		}
	};

	www.post(options, null, callback, handlerTag.src);
};

/*
	@function 	campaigns.scheduleCampaign
	@parameter 	campaignID - the unique ID associated with the campaign to schedule
	@parameter 	requestBody - the JSON object representing the request body's parameters expected by the MailChimp POST /campaigns/{campaign_id}/actions/schedule api. Read the MailChimp API reference for more details on this parameter
	@parameter 	callback - a callback function to run after the request is issued. It is passed two arguments:
					"response" - the response object from MailChimp's POST /campaigns/{campaign_id}/actions/schedule api
					"error" - any error(s) that occurred while processing the request
				The values of the "error" and "response" arguments vary depending on the result of the request.
				On success: "error" is null, and "response" is the JSON response object returned from MailChimp.
				On failure: "error" is the object returned by the NodeJS https.request() function's "error" event, and "response" is null.
	@returns 	n/a
	@details 	This function executes a POST request using the NodeJS https.request() api to schedule the email campaign specified by "campaignID".
	@note 		This function only works on unscheduled, fully-configured campaigns (i.e. non-draft campaigns, already setup via the MailChimp website). Current Solution: If a campaign is not fully-configured, you must first fully configure the campaign (i.e. design or designate its email template) in MailChimp's Admin portal. Use smci.campaigns.getChecklist() to see if a campaign is ready to send/schedule, or to see what needs to be done before sending it. If a campaign is already fully-configured, you must first call smci.campaigns.getCampaignInfo() to verify that the campaign's status is NOT "schedule". If the status is "schedule", then you must unschedule the campaign using smci.campaigns.unscheduleCampaign() before calling this function again on the same campaign.
*/
smci.campaigns.scheduleCampaign = function (campaignID, requestBody, callback) {
	var handlerTag = {"src": "smci/campaigns.scheduleCampaign"};
	var options = {
		"hostname": `${smci_settings.apiDataCenter}.api.mailchimp.com`,
		"path": `/${smci_settings.apiVersion}/campaigns/${campaignID}/actions/schedule`,
		"method": "POST",
		"auth": `${smci_settings.anystring}:${smci_settings.apikey}`,
		"headers": {
			"Content-Type": "application/json",
			"Content-Length": Buffer.byteLength(JSON.stringify(requestBody))
		}
	};

	www.post(options, requestBody, callback, handlerTag.src);
};

/*
	@function 	campaigns.sendCampaign
	@parameter 	campaignID - the unique ID associated with the campaign to send
	@parameter 	callback - a callback function to run after the request is issued. It is passed two arguments:
					"response" - the response object from MailChimp's POST /campaigns/{campaign_id}/actions/send api
					"error" - any error(s) that occurred while processing the request
				The values of the "error" and "response" arguments vary depending on the result of the request.
				On success: "error" is null, and "response" is the JSON response object returned from MailChimp.
				On failure: "error" is the object returned by the NodeJS https.request() function's "error" event, and "response" is null.
	@returns 	n/a
	@details 	This function executes a POST request using the NodeJS https.request() api to send the email campaign specified by "campaignID".
	@note 		This function only works on unsent, fully-configured campaigns (i.e. non-draft campaigns, already setup via the MailChimp website). Current Solution: If a campaign is not fully-configured, you must first fully configure the campaign (i.e. design or designate its email template) in MailChimp's Admin portal. Use smci.campaigns.getChecklist() to see if a campaign is ready to send, or to see what needs to be done before sending it. If already fully-configured, you must then call smci.campaigns.getCampaignInfo() to verify that the campaign status is NOT "sent". Calling this function to send a campaign that was already sent will have NO EFFECT; MailChimp WILL NOT RESEND a sent campaign.
*/
smci.campaigns.sendCampaign = function (campaignID, callback) {
	var handlerTag = {"src": "smci/campaigns.sendCampaign"};
	var options = {
		"hostname": `${smci_settings.apiDataCenter}.api.mailchimp.com`,
		"path": `/${smci_settings.apiVersion}/campaigns/${campaignID}/actions/send`,
		"method": "POST",
		"auth": `${smci_settings.anystring}:${smci_settings.apikey}`,
		"headers": {
			"Content-Type": "application/json",
			"Content-Length": 0
		}
	};

	www.post(options, null, callback, handlerTag.src);
};

/*
	@function 	campaigns.sendTestEmail
	@parameter 	campaignID - the unique ID of the campaign to associate the test email(s) to send
	@parameter 	requestBody - the JSON object representing the request body's parameters expected by the MailChimp POST /campaigns/{campaign_id}/actions/test api. Read the MailChimp API reference for more details on this parameter
	@parameter 	callback - a callback function to run after the request is issued. It is passed two arguments:
					"response" - the response object from MailChimp's POST /campaigns/{campaign_id}/actions/test api
					"error" - any error(s) that occurred while processing the request
				The values of the "error" and "response" arguments vary depending on the result of the request.
				On success: "error" is null, and "response" is the JSON response object returned from MailChimp.
				On failure: "error" is the object returned by the NodeJS https.request() function's "error" event, and "response" is null.
	@returns 	n/a
	@details 	This function executes a POST request using the NodeJS https.request() api to send a test email associated with the email campaign specified by "campaignID".
*/
smci.campaigns.sendTestEmail = function (campaignID, requestBody, callback) {
	var handlerTag = {"src": "smci/campaigns.sendTestEmail"};
	var options = {
		"hostname": `${smci_settings.apiDataCenter}.api.mailchimp.com`,
		"path": `/${smci_settings.apiVersion}/campaigns/${campaignID}/actions/test`,
		"method": "POST",
		"auth": `${smci_settings.anystring}:${smci_settings.apikey}`,
		"headers": {
			"Content-Type": "application/json",
			"Content-Length": Buffer.byteLength(JSON.stringify(requestBody))
		}
	};

	www.post(options, requestBody, callback, handlerTag.src);
};

/*
	@function 	campaigns.unscheduleCampaign
	@parameter 	campaignID - the unique ID associated with the campaign to unschedule
	@parameter 	callback - a callback function to run after the request is issued. It is passed two arguments:
					"response" - the response object from MailChimp's POST /campaigns/{campaign_id}/actions/unschedule api
					"error" - any error(s) that occurred while processing the request
				The values of the "error" and "response" arguments vary depending on the result of the request.
				On success: "error" is null, and "response" is the JSON response object returned from MailChimp.
				On failure: "error" is the object returned by the NodeJS https.request() function's "error" event, and "response" is null.
	@returns 	n/a
	@details 	This function executes a POST request using the NodeJS https.request() api to unschedule the email campaign specified by "campaignID".
	@note 		This function only works on unsent, fully-configured campaigns (i.e. non-draft campaigns, already setup via the MailChimp website). Current Solution: If a campaign is not fully-configured, you must first fully configure the campaign (i.e. design or designate its email template) in MailChimp's Admin portal. Use smci.campaigns.getChecklist() to see if a campaign is ready to send, or to see what needs to be done before sending it. If a campaign is already fully-configured, you must then call smci.campaigns.getCampaignInfo() to verify that the campaign has not yet been sent (i.e. status is "schedule", not "sent").
*/
smci.campaigns.unscheduleCampaign = function (campaignID, callback) {
	var handlerTag = {"src": "smci/campaigns.unscheduleCampaign"};
	var options = {
		"hostname": `${smci_settings.apiDataCenter}.api.mailchimp.com`,
		"path": `/${smci_settings.apiVersion}/campaigns/${campaignID}/actions/unschedule`,
		"method": "POST",
		"auth": `${smci_settings.anystring}:${smci_settings.apikey}`,
		"headers": {
			"Content-Type": "application/json",
			"Content-Length": 0
		}
	};

	www.post(options, null, callback, handlerTag.src);
};

/*
	@function 	campaigns.getChecklist
	@parameter 	campaignID - the unique ID associated with the campaign to check
	@parameter	qsObj - the JSON object representing the request's query string parameters expected by the MailChimp GET /campaigns/{campaign_id}/send-checklist api. MailChimp uses these parameters to determine how to format its response. If no particular control over the response is desired, this parameter can be passed "null". Otherwise, the object can contain any or all of the following:
					{
						"fields": "...",
						"exclude_fields": "..."
					}
				Read the MailChimp API reference for more details on the above query string parameters.
	@parameter 	callback - a callback function to run after the request is issued. It is passed two arguments:
					"response" - the response object from MailChimp's GET /campaigns/{campaign_id}/send-checklist api
					"error" - any error(s) that occurred while processing the request
				The values of the "error" and "response" arguments vary depending on the result of the request.
				On success: "error" is null, and "response" is the JSON response object returned from MailChimp.
				On failure: "error" is the object returned by the NodeJS https.get() function's "error" event, and "response" is null.
	@returns 	n/a
	@details 	This function executes a GET request using the NodeJS https.get() api to acquire a readiness checklist of the email campaign specified by "campaignID". It is useful in determining what steps remain before the campaign is ready to send/schedule, and is thus recommended for immediate use BEFORE calling any functions that perform sending/scheduling.
*/
smci.campaigns.getChecklist = function (campaignID, qsObj, callback) {
	var handlerTag = {"src": "smci/campaigns.getChecklist"};
	var querystring = (qsObj === null) ? "" : `?${qs.stringify(qsObj)}`;
	var options = {
		"hostname": `${smci_settings.apiDataCenter}.api.mailchimp.com`,
		"path": `/${smci_settings.apiVersion}/campaigns/${campaignID}/send-checklist${querystring}`,
		"method": "GET",
		"auth": `${smci_settings.anystring}:${smci_settings.apikey}`
	};

	www.get(options, callback, handlerTag.src);
};

/*
	@function 	campaigns.search
	@parameter	qsObj - the JSON object representing the request's query string parameters expected by the MailChimp GET /search-campaigns api. MailChimp uses these parameters to determine how to format its response. If no particular control over the response is desired, all query string parameters can be omitted, except the "query" parameter. The object is expected to be formatted as below:
					{
						"fields": "...",
						"exclude_fields": "...",
						"query": "..."
					}
				Read the MailChimp API reference for more details on the above query string parameters.
	@parameter 	callback - a callback function to run after the request is issued. It is passed two arguments:
					"response" - the response object from MailChimp's GET /search-campaigns api
					"error" - any error(s) that occurred while processing the request
				The values of the "error" and "response" arguments vary depending on the result of the request.
				On success: "error" is null, and "response" is the JSON response object returned from MailChimp.
				On failure: "error" is the object returned by the NodeJS https.get() function's "error" event, and "response" is null.
	@returns 	n/a
	@details 	This function executes a GET request using the NodeJS https.get() api to search for any campaigns containing the query term in "qsObj".
*/
smci.campaigns.search = function (qsObj, callback) {
	var handlerTag = {"src": "smci/campaigns.search"};
	var querystring = (qsObj === null) ? "" : `?${qs.stringify(qsObj)}`;
	var options = {
		"hostname": `${smci_settings.apiDataCenter}.api.mailchimp.com`,
		"path": `/${smci_settings.apiVersion}/search-campaigns${querystring}`,
		"method": "GET",
		"auth": `${smci_settings.anystring}:${smci_settings.apikey}`
	};

	www.get(options, callback, handlerTag.src);
};
// END campaigns



// BEGIN lists
/*
	@function 	lists.createList
	@parameter 	requestBody - the JSON object representing the request body's parameters expected by the MailChimp POST /lists api. Read the MailChimp API reference for more details on this parameter
	@parameter 	callback - a callback function to run after the request is issued. It is passed two arguments:
					"response" - the response object from MailChimp's POST /lists api
					"error" - any error(s) that occurred while processing the request
				The values of the "error" and "response" arguments vary depending on the result of the request.
				On success: "error" is null, and "response" is the JSON response object returned from MailChimp.
				On failure: "error" is the object returned by the NodeJS https.request() function's "error" event, and "response" is null.
	@returns 	n/a
	@details 	This function executes a POST request using the NodeJS https.request() api to create a MailChimp mailing list.
*/
smci.lists.createList = function (requestBody, callback) {
	var handlerTag = {"src": "smci/lists.createList"};
	var options = {
		"hostname": `${smci_settings.apiDataCenter}.api.mailchimp.com`,
		"path": `/${smci_settings.apiVersion}/lists`,
		"method": "POST",
		"auth": `${smci_settings.anystring}:${smci_settings.apikey}`,
		"headers": {
			"Content-Type": "application/json",
			"Content-Length": Buffer.byteLength(JSON.stringify(requestBody))
		}
	};

	www.post(options, requestBody, callback, handlerTag.src);
};

/*
	@function 	lists.getFullList
	@parameter	qsObj - the JSON object representing the request's query string parameters expected by the MailChimp GET /lists api. MailChimp uses these parameters to determine how to format its response. If no particular control over the response is desired, this parameter can be passed "null". Otherwise, the object can contain any or all of the following:
					{
						"fields": "...",
						"exclude_fields": "...",
						"count": [int],
						"offset": [int],
						"before_date_created": "...",
						"since_date_created": "...",
						"before_campaign_last_sent": "...",
						"since_campaign_last_sent": "...",
						"email": "...",
						"sort_field": "...",
						"sort_directory": "..."
					}
				Read the MailChimp API reference for more details on the above query string parameters.
	@parameter 	callback - a callback function to run after the request is issued. It is passed two arguments:
					"response" - the response object from MailChimp's GET /lists api
					"error" - any error(s) that occurred while processing the request
				The values of the "error" and "response" arguments vary depending on the result of the request.
				On success: "error" is null, and "response" is the JSON response object returned from MailChimp.
				On failure: "error" is the object returned by the NodeJS https.get() function's "error" event, and "response" is null.
	@returns 	n/a
	@details 	This function executes a GET request using the NodeJS https.get() api to acquire a full list of all MailChimp mailing lists associated with the account.
*/
smci.lists.getFullList = function (qsObj, callback) {
	var handlerTag = {"src": "smci/lists.getFullList"};
	var querystring = (qsObj === null) ? "" : `?${qs.stringify(qsObj)}`;
	var options = {
		"hostname": `${smci_settings.apiDataCenter}.api.mailchimp.com`,
		"path": `/${smci_settings.apiVersion}/lists${querystring}`,
		"method": "GET",
		"auth": `${smci_settings.anystring}:${smci_settings.apikey}`
	};

	www.get(options, callback, handlerTag.src);
};

/*
	@function 	lists.batchListMembers
	@parameter 	listID - the unique ID of the list containing the member(s) whose subscription statuses will be changed
	@parameter 	requestBody - the JSON object representing the request body's parameters expected by the MailChimp POST /lists/{list_id} api. Read the MailChimp API reference for more details on this parameter
	@parameter 	callback - a callback function to run after the request is issued. It is passed two arguments:
					"response" - the response object from MailChimp's POST /lists/{list_id} api
					"error" - any error(s) that occurred while processing the request
				The values of the "error" and "response" arguments vary depending on the result of the request.
				On success: "error" is null, and "response" is the JSON response object returned from MailChimp.
				On failure: "error" is the object returned by the NodeJS https.request() function's "error" event, and "response" is null.
	@returns 	n/a
	@details 	This function executes a POST request using the NodeJS https.request() api to batch subscribe/unsubscribe members of the list.
*/
smci.lists.batchListMembers = function (listID, requestBody, callback) {
	var handlerTag = {"src": "smci/lists.batchListMembers"};
	var options = {
		"hostname": `${smci_settings.apiDataCenter}.api.mailchimp.com`,
		"path": `/${smci_settings.apiVersion}/lists/${listID}`,
		"method": "POST",
		"auth": `${smci_settings.anystring}:${smci_settings.apikey}`,
		"headers": {
			"Content-Type": "application/json",
			"Content-Length": Buffer.byteLength(JSON.stringify(requestBody))
		}
	};

	www.post(options, requestBody, callback, handlerTag.src);
};

/*
	@function 	lists.getListInfo
	@parameter 	listID - the unique ID of the list to query
	@parameter	qsObj - the JSON object representing the request's query string parameters expected by the MailChimp GET /lists/{list_id} api. MailChimp uses these parameters to determine how to format its response. If no particular control over the response is desired, this parameter can be passed "null". Otherwise, the object can contain any or all of the following:
					{
						"fields": "...",
						"exclude_fields": "..."
					}
				Read the MailChimp API reference for more details on the above query string parameters.
	@parameter 	callback - a callback function to run after the request is issued. It is passed two arguments:
					"response" - the response object from MailChimp's GET /lists/{list_id} api
					"error" - any error(s) that occurred while processing the request
				The values of the "error" and "response" arguments vary depending on the result of the request.
				On success: "error" is null, and "response" is the JSON response object returned from MailChimp.
				On failure: "error" is the object returned by the NodeJS https.get() function's "error" event, and "response" is null.
	@returns 	n/a
	@details 	This function executes a GET request using the NodeJS https.get() api to acquire information about the list specified by "listID".
*/
smci.lists.getListInfo = function (listID, qsObj, callback) {
	var handlerTag = {"src": "smci/lists.getListInfo"};
	var querystring = (qsObj === null) ? "" : `?${qs.stringify(qsObj)}`;
	var options = {
		"hostname": `${smci_settings.apiDataCenter}.api.mailchimp.com`,
		"path": `/${smci_settings.apiVersion}/lists/${listID}${querystring}`,
		"method": "GET",
		"auth": `${smci_settings.anystring}:${smci_settings.apikey}`
	};

	www.get(options, callback, handlerTag.src);
};

/*
	@function 	lists.editListSettings
	@parameter 	listID - the unique ID of the list to query
	@parameter 	requestBody - the JSON object representing the request body's parameters expected by the MailChimp PATCH /lists/{list_id} api. Read the MailChimp API reference for more details on this parameter
	@parameter 	callback - a callback function to run after the request is issued. It is passed two arguments:
					"response" - the response object from MailChimp's PATCH /lists/{list_id} api
					"error" - any error(s) that occurred while processing the request
				The values of the "error" and "response" arguments vary depending on the result of the request.
				On success: "error" is null, and "response" is the JSON response object returned from MailChimp.
				On failure: "error" is the object returned by the NodeJS https.request() function's "error" event, and "response" is null.
	@returns 	n/a
	@details 	This function executes a PATCH request using the NodeJS https.request() api to edit settings of the list specified by "listID".
*/
smci.lists.editListSettings = function (listID, requestBody, callback) {
	var handlerTag = {"src": "smci/lists.editListSettings"};
	var options = {
		"hostname": `${smci_settings.apiDataCenter}.api.mailchimp.com`,
		"path": `/${smci_settings.apiVersion}/lists/${listID}`,
		"method": "PATCH",
		"auth": `${smci_settings.anystring}:${smci_settings.apikey}`,
		"headers": {
			"Content-Type": "application/json",
			"Content-Length": Buffer.byteLength(JSON.stringify(requestBody))
		}
	};

	www.patch(options, requestBody, callback, handlerTag.src);
};

/*
	@function 	lists.deleteList
	@parameter 	listID - the unique id associated with the list to delete
	@parameter 	callback - a callback function to run after the request is issued. It is passed two arguments:
					"response" - the response object from MailChimp's DELETE /lists/{list_id} api
					"error" - any error(s) that occurred while processing the request
				The values of the "error" and "response" arguments vary depending on the result of the request.
				On success: "error" is null, and "response" is the JSON response object returned from MailChimp.
				On failure: "error" is the object returned by the NodeJS https.request() function's "error" event, and "response" is null.
	@returns 	n/a
	@details 	This function executes a DELETE request using the NodeJS https.request() api to create a MailChimp mailing list.
*/
smci.lists.deleteList = function (listID, callback) {
	var handlerTag = {"src": "smci/lists.deleteList"};
	var options = {
		"hostname": `${smci_settings.apiDataCenter}.api.mailchimp.com`,
		"path": `/${smci_settings.apiVersion}/lists/${listID}`,
		"method": "DELETE",
		"auth": `${smci_settings.anystring}:${smci_settings.apikey}`
	};

	www.delete(options, callback, handlerTag.src);
};

/*
	@function 	lists.addListMember
	@parameter 	listID - the unique id associated with the list to add to
	@parameter 	requestBody - the JSON object representing the request body's parameters expected by the MailChimp POST /lists/{list_id}/members api. Read the MailChimp API reference for more details on this parameter.
	@parameter 	callback - a callback function to run after the request is issued. It is passed two arguments:
					"response" - the response object from MailChimp's POST /lists/{list_id}/members api
					"error" - any error(s) that occurred while processing the request
				The values of the "error" and "response" arguments vary depending on the result of the request.
				On success: "error" is null, and "response" is the JSON response object returned from MailChimp.
				On failure: "error" is the object returned by the NodeJS https.request() function's "error" event, and "response" is null.
	@returns 	n/a
	@details 	This function executes a POST request using the NodeJD https.request() api to add a new recipient to the MailChimp mailing list specified by "listID".
*/
smci.lists.addListMember = function (listID, requestBody, callback) {
	var handlerTag = {"src": "smci/lists.addListMember"};
	var options = {
		"hostname": `${smci_settings.apiDataCenter}.api.mailchimp.com`,
		"path": `/${smci_settings.apiVersion}/lists/${listID}/members`,
		"method": "POST",
		"auth": `${smci_settings.anystring}:${smci_settings.apikey}`,
		"headers": {
			"Content-Type": "application/json",
			"Content-Length": Buffer.byteLength(JSON.stringify(requestBody))
		}
	};

	www.post(options, requestBody, callback, handlerTag.src);
};

/*
	@function 	lists.getListMembers
	@parameter 	listID - the unique id of the list to acquire recipients from
	@parameter	qsObj - the JSON object representing the request's query string parameters expected by the MailChimp GET /lists/{list_id}/members api. MailChimp uses these parameters to determine how to format its response. If no particular control over the response is desired, this parameter can be passed "null". Otherwise, the object can contain any or all of the following:
					{
						"fields": "...",
						"exclude_fields": "...",
						"count": [int],
						"offset": [int],
						"email_type": "...",
						"status": "...",
						"since_timestamp_opt": "...",
						"before_timestamp_opt": "...",
						"since_last_changed": "...",
						"before_last_changed": "...",
						"unique_email_id": "...",
						"vip_only": [bool],
						"interest_category_id": "...",
						"interest_ids": "...",
						"interest_match": "..."
					}
				Read the MailChimp API reference for more details on the above query string parameters.
	@parameter 	callback - a callback function to run after the request is issued. It is passed two arguments:
					"response" - the response object from MailChimp's GET /lists/{list_id}/members api
					"error" - any error(s) that occurred while processing the request
				The values of the "error" and "response" arguments vary depending on the result of the request.
				On success: "error" is null, and "response" is the JSON response object returned from MailChimp.
				On failure: "error" is the object returned by the NodeJS https.get() function's "error" event, and "response" is null.
	@returns 	n/a
	@details 	This function executes a GET request using the NodeJD https.get() api to acquire a list of recipients of the MailChimp mailing list specified by "listID".
*/
smci.lists.getListMembers = function (listID, qsObj, callback) {
	var handlerTag = {"src": "smci/lists.getListMembers"};
	var querystring = (qsObj === null) ? "" : `?${qs.stringify(qsObj)}`;
	var options = {
		"hostname": `${smci_settings.apiDataCenter}.api.mailchimp.com`,
		"path": `/${smci_settings.apiVersion}/lists/${listID}/members${querystring}`,
		"method": "GET",
		"auth": `${smci_settings.anystring}:${smci_settings.apikey}`
	};

	www.get(options, callback, handlerTag.src);
};

/*
	@function 	lists.editListMember
	@parameter 	listID - the unique id of the list to acquire recipients from
	@parameter 	subscriberID - the MD5 hash of the lowercase version of the list member's email address,
	@parameter 	requestBody - the JSON object representing the request body's parameters expected by the MailChimp PATCH /lists/{list_id}/members/{subscriber_hash} api. Read the MailChimp API reference for more details on this parameter.
	@parameter 	callback - a callback function to run after the request is issued. It is passed two arguments:
					"response" - the response object from MailChimp's PATCH /lists/{list_id}/members/{subscriber_hash} api
					"error" - any error(s) that occurred while processing the request
				The values of the "error" and "response" arguments vary depending on the result of the request.
				On success: "error" is null, and "response" is the JSON response object returned from MailChimp.
				On failure: "error" is the object returned by the NodeJS https.request() function's "error" event, and "response" is null.
	@returns 	n/a
	@details 	This function executes a PATCH request using the NodeJD https.request() api to edit a recipient specified by "subscriberID" of the MailChimp mailing list specified by "listID".
*/
smci.lists.editListMember = function (listID, subscriberID, requestBody, callback) {
	var handlerTag = {"src": "smci/lists.editListMember"};
	var options = {
		"hostname": `${smci_settings.apiDataCenter}.api.mailchimp.com`,
		"path": `/${smci_settings.apiVersion}/lists/${listID}/members/${subscriberID}`,
		"method": "PATCH",
		"auth": `${smci_settings.anystring}:${smci_settings.apikey}`,
		"headers": {
			"Content-Type": "application/json",
			"Content-Length": Buffer.byteLength(JSON.stringify(requestBody))
		}
	};

	www.patch(options, requestBody, callback, handlerTag.src);
};

/*
	@function 	lists.removeListMember
	@parameter 	listID - the unique id of the list remove a recipient from
	@parameter 	subscriberID - the MD5 hash of the lowercase version of the list member's email address to remove
	@parameter 	callback - a callback function to run after the request is issued. It is passed two arguments:
					"response" - the response object from MailChimp's DELETE /lists/{list_id}/members/{subscriber_hash} api
					"error" - any error(s) that occurred while processing the request
				The values of the "error" and "response" arguments vary depending on the result of the request.
				On success: "error" is null, and "response" is the JSON response object returned from MailChimp.
				On failure: "error" is the object returned by the NodeJS https.request() function's "error" event, and "response" is null.
	@returns 	n/a
	@details 	This function executes a DELETE request using the NodeJD https.request() api to remove a recipient specified by "subscriberID" from the MailChimp mailing list specified by "listID".
*/
smci.lists.removeListMember = function (listID, subscriberID, callback) {
	var handlerTag = {"src": "smci/lists.removeListMember"};
	var options = {
		"hostname": `${smci_settings.apiDataCenter}.api.mailchimp.com`,
		"path": `/${smci_settings.apiVersion}/lists/${listID}/members/${subscriberID}`,
		"method": "DELETE",
		"auth": `${smci_settings.anystring}:${smci_settings.apikey}`
	};

	www.delete(options, callback, handlerTag.src);
};

/*
	@function 	lists.searchMembers
	@parameter	qsObj - the JSON object representing the request's query string parameters expected by the MailChimp GET /search-members api. MailChimp uses these parameters to determine how to format its response. If no particular control over the response is desired, all querystring parameters except the "query" parameter can be omitted. The object is expected to take the following format:
					{
						"fields": "...",
						"exclude_fields": "...",
						"query": "...",		// REQUIRED
						"list_id": "..."
					}
				Read the MailChimp API reference for more details on the above query string parameters.
	@parameter 	callback - a callback function to run after the request is issued. It is passed two arguments:
					"response" - the response object from MailChimp's GET /search-members api
					"error" - any error(s) that occurred while processing the request
				The values of the "error" and "response" arguments vary depending on the result of the request.
				On success: "error" is null, and "response" is the JSON response object returned from MailChimp.
				On failure: "error" is the object returned by the NodeJS https.get() function's "error" event, and "response" is null.
	@returns 	n/a
	@details 	This function executes a GET request using the NodeJS https.get() api to acquire a list of recipients fitting the querystring search term "query".
*/
smci.lists.searchMembers = function (qsObj, callback) {
	var handlerTag = {"src": "smci/lists.searchMembers"};
	var querystring = (qsObj === null) ? "" : `?${qs.stringify(qsObj)}`;
	var options = {
		"hostname": `${smci_settings.apiDataCenter}.api.mailchimp.com`,
		"path": `/${smci_settings.apiVersion}/search-members${querystring}`,
		"method": "GET",
		"auth": `${smci_settings.anystring}:${smci_settings.apikey}`
	};

	www.get(options, callback, handlerTag.src);
};
// END lists



// BEGIN templateFolders
/*
	@function 	templateFolders.createFolder
	@parameter 	folderName - the string name to give the folder
	@parameter 	callback - a callback function to run after the request is issued. It is passed two arguments:
					"response" - the response object from MailChimp's POST /template-folders api
					"error" - any error(s) that occurred while processing the request
				The values of the "error" and "response" arguments vary depending on the result of the request.
				On success: "error" is null, and "response" is the JSON response object returned from MailChimp.
				On failure: "error" is the object returned by the NodeJS https.request() function's "error" event, and "response" is null.
	@returns 	n/a
	@details 	This function executes a POST request using the NodeJS https.request() api to create a new MailChimp email template folder.
*/
smci.templateFolders.createFolder = function (folderName, callback) {
	var handlerTag = {"src": "smci/templateFolders.createFolder"};
	var requestBody = {
		"name": folderName
	};
	var options = {
		"hostname": `${smci_settings.apiDataCenter}.api.mailchimp.com`,
		"path": `/${smci_settings.apiVersion}/template-folders`,
		"method": "POST",
		"auth": `${smci_settings.anystring}:${smci_settings.apikey}`,
		"headers": {
			"Content-Type": "application/json",
			"Content-Length": Buffer.byteLength(JSON.stringify(requestBody))
		}
	};

	www.post(options, requestBody, callback, handlerTag.src);
};

/*
	@function 	templateFolders.deleteFolder
	@parameter 	folderID - the unique id associated with the folder to delete
	@parameter 	callback - a callback function to run after the request is issued. It is passed two arguments:
					"response" - the response object from MailChimp's DELETE /template-folders/{folder_id} api
					"error" - any error(s) that occurred while processing the request
				The values of the "error" and "response" arguments vary depending on the result of the request.
				On success: "error" is null, and "response" is the JSON response object returned from MailChimp.
				On failure: "error" is the object returned by the NodeJS https.request() function's "error" event, and "response" is null.
	@returns 	n/a
	@details 	This function executes a DELETE request using the NodeJS https.request() api to delete the MailChimp email template folder specified by "folderID".
*/
smci.templateFolders.deleteFolder = function (folderID, callback) {
	var handlerTag = {"src": "smci/templateFolders.deleteFolder"};
	var options = {
		"hostname": `${smci_settings.apiDataCenter}.api.mailchimp.com`,
		"path": `/${smci_settings.apiVersion}/template-folders/${folderID}`,
		"method": "DELETE",
		"auth": `${smci_settings.anystring}:${smci_settings.apikey}`
	};

	www.delete(options, callback, handlerTag.src);
};

/*
	@function 	templateFolders.getFullList
	@parameter	qsObj - the JSON object representing the request's query string parameters expected by the MailChimp GET /template-folders api. MailChimp uses these parameters to determine how to format its response. If no particular control over the response is desired, ths parameter can be passed "null". Otherwise, the object is expected to take the following format:
					{
						"fields": "...",
						"exclude_fields": "...",
						"count": [int],
						"offset": [int]
					}
				Read the MailChimp API reference for more details on the above query string parameters.
	@parameter 	callback - a callback function to run after the request is issued. It is passed two arguments:
					"response" - the response object from MailChimp's GET /template-folders api
					"error" - any error(s) that occurred while processing the request
				The values of the "error" and "response" arguments vary depending on the result of the request.
				On success: "error" is null, and "response" is the JSON response object returned from MailChimp.
				On failure: "error" is the object returned by the NodeJS https.get() function's "error" event, and "response" is null.
	@returns 	n/a
	@details 	This function executes a GET request using the NodeJS https.get() api to acquire a full list of MailChimp email template folders associated with the MailChimp account.
*/
smci.templateFolders.getFullList = function (qsObj, callback) {
	var handlerTag = {"src": "smci/templateFolders.getFullList"};
	var options = {
		"hostname": `${smci_settings.apiDataCenter}.api.mailchimp.com`,
		"path": `/${smci_settings.apiVersion}/template-folders/`,
		"method": "GET",
		"auth": `${smci_settings.anystring}:${smci_settings.apikey}`
	};

	www.get(options, callback, handlerTag.src);
};

/*
	@function 	templateFolders.getFolder
	@parameter 	folderID - the unique ID associated with the template folder to query
	@parameter	qsObj - the JSON object representing the request's query string parameters expected by the MailChimp GET /template-folders/{folder_id} api. MailChimp uses these parameters to determine how to format its response. If no particular control over the response is desired, ths parameter can be passed "null". Otherwise, the object is expected to take the following format:
					{
						"fields": "...",
						"exclude_fields": "..."
					}
				Read the MailChimp API reference for more details on the above query string parameters.
	@parameter 	callback - a callback function to run after the request is issued. It is passed two arguments:
					"response" - the response object from MailChimp's GET /template-folders/{folder_id} api
					"error" - any error(s) that occurred while processing the request
				The values of the "error" and "response" arguments vary depending on the result of the request.
				On success: "error" is null, and "response" is the JSON response object returned from MailChimp.
				On failure: "error" is the object returned by the NodeJS https.get() function's "error" event, and "response" is null.
	@returns 	n/a
	@details 	This function executes a GET request using the NodeJS https.get() api to acquire information of the MailChimp email template folder specified by "folderID".
*/
smci.templateFolders.getFolder = function (folderID, qsObj, callback) {
	var handlerTag = {"src": "smci/templateFolders.getFolder"};
	var querystring = (qsObj === null) ? "" : `?${qs.stringify(qsObj)}`;
	var options = {
		"hostname": `${smci_settings.apiDataCenter}.api.mailchimp.com`,
		"path": `/${smci_settings.apiVersion}/template-folders/${folderID}${querystring}`,
		"method": "GET",
		"auth": `${smci_settings.anystring}:${smci_settings.apikey}`
	};

	www.get(options, callback, handlerTag.src);
};

/*
	@function 	templateFolders.editFolder
	@parameter  folderID - the unique id for the template folder to edit
	@parameter 	newName - the new name to apply to the folder
	@parameter 	callback - a callback function to run after the request is issued. It is passed two arguments:
					"response" - the response object from MailChimp's PATCH /template-folders/{folder_id} api
					"error" - any error(s) that occurred while processing the request
				The values of the "error" and "response" arguments vary depending on the result of the request.
				On success: "error" is null, and "response" is the JSON response object returned from MailChimp.
				On failure: "error" is the object returned by the NodeJS https.request() function's "error" event, and "response" is null.
	@returns 	n/a
	@details 	This function executes a PATCH request using the NodeJS https.request() api to edit/update a template folder. This function currently only allows changes to a template folder's name.
*/
smci.templateFolders.editFolder = function (folderID, newName, callback) {
	var handlerTag = {"src": "smci/templateFolders.editFolder"};
	var requestBody = {
		"name": newName
	};
	var options = {
		"hostname": `${smci_settings.apiDataCenter}.api.mailchimp.com`,
		"path": `/${smci_settings.apiVersion}/template-folders/${folderID}`,
		"method": "PATCH",
		"auth": `${smci_settings.anystring}:${smci_settings.apikey}`,
		"headers": {
			"Content-Type": "application/json",
			"Content-Length": Buffer.byteLength(JSON.stringify(requestBody))
		}
	};

	www.patch(options, requestBody, callback, handlerTag.src);
};
// END templateFolders



// BEGIN templates
/*
	@function 	templates.createTemplate
	@parameter 	templateName - the string name to give the email template
	@parameter 	folderID - the unique id of the template folder to place the template it. If you don't want to file this template in a template folder, pass this parameter "null" to leave the template unfiled.
	@parameter 	content - the html content to place in the email. Read the MailChimp Template Language Guide to know more about how to format your html email content.
	@parameter 	callback - a callback function to run after the request is issued. It is passed two arguments:
					"response" - the response object from MailChimp's POST /templates api
					"error" - any error(s) that occurred while processing the request
				The values of the "error" and "response" arguments vary depending on the result of the request.
				On success: "error" is null, and "response" is the JSON response object returned from MailChimp.
				On failure: "error" is the object returned by the NodeJS https.request() function's "error" event, and "response" is null.
	@returns 	n/a
	@details 	This function executes a POST request using the NodeJS https.request() api to create a new MailChimp email template.
	@note 		MailChimp only supports "Classic Templates", and the "content" parameter must be passed VALID html code. Read about MailChimp's Template Language and Classic Templates in their Knowledge Base for more information on how to format your html content.
*/
smci.templates.createTemplate = function (templateName, folderID, content, callback) {
	var handlerTag = {"src": "smci/templates.createTemplate"};
	var requestBody = {
		"name": templateName,
		"html": content
	};
	if (folderID !== null) {
		requestBody["folder_id"] = folderID;
	}
	var options = {
		"hostname": `${smci_settings.apiDataCenter}.api.mailchimp.com`,
		"path": `/${smci_settings.apiVersion}/templates`,
		"method": "POST",
		"auth": `${smci_settings.anystring}:${smci_settings.apikey}`,
		"headers": {
			"Content-Type": "application/json",
			"Content-Length": Buffer.byteLength(JSON.stringify(requestBody))
		}
	};

	www.post(options, requestBody, callback, handlerTag.src);
};

/*
	@function 	templates.getFullList
	@parameter	qsObj - the JSON object representing the request's query string parameters expected by the MailChimp GET /templates api. MailChimp uses these parameters to determine how to format its response. If no particular control over the response is desired, ths parameter can be passed "null". Otherwise, the object is expected to take the following format:
					{
						"fields": "...",
						"exclude_fields": "...",
						"count": [int],
						"offset": [int],
						"created_by": "...",
						"since_created_at": "...",
						"before_created_at": "...",
						"type": "...",
						"category": "...",
						"folder_id": "..."
					}
				Read the MailChimp API reference for more details on the above query string parameters.
	@parameter 	callback - a callback function to run after the request is issued. It is passed two arguments:
					"response" - the response object from MailChimp's GET /templates api
					"error" - any error(s) that occurred while processing the request
				The values of the "error" and "response" arguments vary depending on the result of the request.
				On success: "error" is null, and "response" is the JSON response object returned from MailChimp.
				On failure: "error" is the object returned by the NodeJS https.get() function's "error" event, and "response" is null.
	@returns 	n/a
	@details 	This function executes a GET request using the NodeJS https.get() api to acquire a full list of email templates associated with the mailchimp account.
*/
smci.templates.getFullList = function (qsObj, callback) {
	var handlerTag = {"src": "smci/templates.getFullList"};
	var querystring = (qsObj === null) ? "" : `?${qs.stringify(qsObj)}`;
	var options = {
		"hostname": `${smci_settings.apiDataCenter}.api.mailchimp.com`,
		"path": `/${smci_settings.apiVersion}/templates${querystring}`,
		"method": "GET",
		"auth": `${smci_settings.anystring}:${smci_settings.apikey}`
	};

	www.get(options, callback, handlerTag.src);
};

/*
	@function 	templates.getTemplateInfo
	@parameter 	templateID - the unique id associated with the template to query
	@parameter	qsObj - the JSON object representing the request's query string parameters expected by the MailChimp GET /templates/{template_id} api. MailChimp uses these parameters to determine how to format its response. If no particular control over the response is desired, ths parameter can be passed "null". Otherwise, the object is expected to take the following format:
					{
						"fields": "...",
						"exclude_fields": "..."
					}
				Read the MailChimp API reference for more details on the above query string parameters.
	@parameter 	callback - a callback function to run after the request is issued. It is passed two arguments:
					"response" - the response object from MailChimp's GET /templates/{template_id} api
					"error" - any error(s) that occurred while processing the request
				The values of the "error" and "response" arguments vary depending on the result of the request.
				On success: "error" is null, and "response" is the JSON response object returned from MailChimp.
				On failure: "error" is the object returned by the NodeJS https.get() function's "error" event, and "response" is null.
	@returns 	n/a
	@details 	This function executes a GET request using the NodeJS https.get() api to acquire information about the email template specified by "templateID".
*/
smci.templates.getTemplateInfo = function (templateID, qsObj, callback) {
	var handlerTag = {"src": "smci/templates.getTemplateInfo"};
	var querystring = (qsObj === null) ? "" : `?${qs.stringify(qsObj)}`;
	var options = {
		"hostname": `${smci_settings.apiDataCenter}.api.mailchimp.com`,
		"path": `/${smci_settings.apiVersion}/templates/${templateID}${querystring}`,
		"method": "GET",
		"auth": `${smci_settings.anystring}:${smci_settings.apikey}`
	};

	www.get(options, callback, handlerTag.src);
};

/*
	@function 	templates.editTemplateName
	@parameter  templateID - the unique id for the template to edit
	@parameter 	newName - the new name to apply to the template
	@parameter 	callback - a callback function to run after the request is issued. It is passed two arguments:
					"response" - the response object from MailChimp's PATCH /templates/{template_id} api
					"error" - any error(s) that occurred while processing the request
				The values of the "error" and "response" arguments vary depending on the result of the request.
				On success: "error" is null, and "response" is the JSON response object returned from MailChimp.
				On failure: "error" is the object returned by the NodeJS https.request() function's "error" event, and "response" is null.
	@returns 	n/a
	@details 	This function executes a PATCH request using the NodeJS https.request() api to edit/update a template's name.
*/
smci.templates.editTemplateName = function (templateID, newName, callback) {
	var handlerTag = {"src": "smci/templates.editTemplateName"};
	var requestBody = {
		"name": newName
	};
	var options = {
		"hostname": `${smci_settings.apiDataCenter}.api.mailchimp.com`,
		"path": `/${smci_settings.apiVersion}/templates/${templateID}`,
		"method": "PATCH",
		"auth": `${smci_settings.anystring}:${smci_settings.apikey}`,
		"headers": {
			"Content-Type": "application/json",
			"Content-Length": Buffer.byteLength(JSON.stringify(requestBody))
		}
	};

	www.patch(options, requestBody, callback, handlerTag.src);
};

/*
	@function 	templates.editTemplateContent
	@parameter  templateID - the unique id for the template to edit
	@parameter 	newHtml - the new html content to apply to the template
	@parameter 	callback - a callback function to run after the request is issued. It is passed two arguments:
					"response" - the response object from MailChimp's PATCH /templates/{template_id} api
					"error" - any error(s) that occurred while processing the request
				The values of the "error" and "response" arguments vary depending on the result of the request.
				On success: "error" is null, and "response" is the JSON response object returned from MailChimp.
				On failure: "error" is the object returned by the NodeJS https.request() function's "error" event, and "response" is null.
	@returns 	n/a
	@details 	This function executes a PATCH request using the NodeJS https.request() api to edit/update a template's content.
*/
smci.templates.editTemplateContent = function (templateID, newHtml, callback) {
	var handlerTag = {"src": "smci/templates.editTemplateContent"};
	var requestBody = {
		"html": newHtml
	};
	var options = {
		"hostname": `${smci_settings.apiDataCenter}.api.mailchimp.com`,
		"path": `/${smci_settings.apiVersion}/templates/${templateID}`,
		"method": "PATCH",
		"auth": `${smci_settings.anystring}:${smci_settings.apikey}`,
		"headers": {
			"Content-Type": "application/json",
			"Content-Length": Buffer.byteLength(JSON.stringify(requestBody))
		}
	};

	www.patch(options, requestBody, callback, handlerTag.src);
};

/*
	@function 	templates.moveTemplate
	@parameter  templateID - the unique id for the template to edit
	@parameter 	newFolderID - the unique id of the template folder to move the template to
	@parameter 	callback - a callback function to run after the request is issued. It is passed two arguments:
					"response" - the response object from MailChimp's PATCH /templates/{template_id} api
					"error" - any error(s) that occurred while processing the request
				The values of the "error" and "response" arguments vary depending on the result of the request.
				On success: "error" is null, and "response" is the JSON response object returned from MailChimp.
				On failure: "error" is the object returned by the NodeJS https.request() function's "error" event, and "response" is null.
	@returns 	n/a
	@details 	This function executes a PATCH request using the NodeJS https.request() api to move a template to the folder specified by newFolderID.
*/
smci.templates.moveTemplate = function (templateID, newFolderID, callback) {
	var handlerTag = {"src": "smci/templates.moveTemplate"};
	var requestBody = {
		"folder_id": newFolderID
	};
	var options = {
		"hostname": `${smci_settings.apiDataCenter}.api.mailchimp.com`,
		"path": `/${smci_settings.apiVersion}/templates/${templateID}`,
		"method": "PATCH",
		"auth": `${smci_settings.anystring}:${smci_settings.apikey}`,
		"headers": {
			"Content-Type": "application/json",
			"Content-Length": Buffer.byteLength(JSON.stringify(requestBody))
		}
	};

	www.patch(options, requestBody, callback, handlerTag.src);
};

/*
	@function 	templates.deleteTemplate
	@parameter 	templateID - the unique id associated with the template to delete
	@parameter 	callback - a callback function to run after the request is issued. It is passed two arguments:
					"response" - the response object from MailChimp's DELETE /templates/{template_id} api
					"error" - any error(s) that occurred while processing the request
				The values of the "error" and "response" arguments vary depending on the result of the request.
				On success: "error" is null, and "response" is the JSON response object returned from MailChimp.
				On failure: "error" is the object returned by the NodeJS https.request() function's "error" event, and "response" is null.
	@returns 	n/a
	@details 	This function executes a DELETE request using the NodeJS https.request() api to delete the MailChimp email template specified by "templateID".
*/
smci.templates.deleteTemplate = function (templateID, callback) {
	var handlerTag = {"src": "smci/templates.deleteTemplate"};
	var options = {
		"hostname": `${smci_settings.apiDataCenter}.api.mailchimp.com`,
		"path": `/${smci_settings.apiVersion}/templates/${templateID}`,
		"method": "DELETE",
		"auth": `${smci_settings.anystring}:${smci_settings.apikey}`
	};

	www.delete(options, callback, handlerTag.src);
};
// END templates
// END MailChimp API Wrapper Functions



module.exports = smci;
// END smci.js
