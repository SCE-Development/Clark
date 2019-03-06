//	PROJECT: 		MEANserver
// 	Name: 			Rolando Javier
// 	File: 			smci_settings.js
// 	Date Created: 	January 9, 2018
// 	Last Modified: 	January 12, 2018
// 	Details:
// 					The Sce Mail Chimp Interface (SMCI) Settings. This file contains the MailChimp API's Settings in JSON.
// 	Dependencies:
// 					n/a

"use strict"



// Container
var smci_settings = {};



// Members
/*
	@member 	accountEmail
	@details 	This is the email associated with the MailChimp account used by SMCI
*/
smci_settings.accountEmail = "fo.sce.sjsu@gmail.com ";	// temporary; will replace with real credentials after testing completes

/*
	@member 	apikey
	@details 	This is the api key I'm using to run the smci wrappers.
*/
smci_settings.apikey = "696c97d46233954526986811f40bd149-us8";

/*
	@member 	apiDataCenter
	@details 	This member signifies the data center that handles all mailchimp requests.
*/
smci_settings.apiDataCenter = "us8";

/*
	@member 	apiVersion
	@details 	This member signifies the current working version of MailChimp API that this module is using.
*/
smci_settings.apiVersion = "3.0";

/*
	@member 	anystring
	@details 	This is a temporary signature used to identify api transactions (i.e. a username).
*/
smci_settings.anystring = "scemern";

/*
	@member 	appAccessToken
	@details 	This is the OAuth2 Access Token given by recently linking the app to MailChimp's "rj_my_test_app"
	@note 		Everytime you wish to re-register the SMCI with MailChimp, you must use smci.postAuthorizedApp() and replace this access token with the new one returned from MailChimp!
*/
smci_settings.appAccessToken = "445a93b35572469af2e66eac2b27a6ed";

/*
	@member 	appViewerToken
	@details 	This is the OAuth2 Viewer Token given by recently linking the app to MailChimp's "rj_my_test_app"
	@note 		Everytime you wish to re-register the SMCI with MailChimp, you must use smci.postAuthorizedApp() and replace this viewer token with the new one returned from MailChimp!
*/
smci_settings.appViewerToken = "994d7d53d61f02efe90b8122c38baeac:v";



module.exports = smci_settings;
// END smci_settings.js
