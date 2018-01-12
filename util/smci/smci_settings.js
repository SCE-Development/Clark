//	PROJECT: 		MEANserver
// 	Name: 			Rolando Javier
// 	File: 			smci_settings.js
// 	Date Created: 	January 9, 2018
// 	Last Modified: 	January 9, 2018
// 	Details:
// 					The Sce Mail Chimp Interface (SMCI) Settings. This file contains the MailChimp API's Settings in JSON.
// 	Dependencies:
// 					n/a

"use strict"



// Container
var smci_settings = {};



// Members
/*
	@member 	apikey
	@details 	This is the api key I'm using to run the smci wrappers.
*/
smci_settings.apikey = "140bebdf09a48807e7e931c81777f640-us15";

/*
	@member 	apiDataCenter
	@details 	This member signifies the data center that handles all mailchimp requests.
*/
smci_settings.apiDataCenter = "us15";

/*
	@member 	apiVersion
	@details 	This member signifies the current working version of MailChimp API that this module is using.
*/
smci_settings.apiVersion = "3.0";

/*
	@member 	anystring
	@details 	This is a temporary signature used to identify api transactions (i.e. a username).
*/
smci_settings.anystring = "rjavier443";



module.exports = smci_settings;
// END smci_settings.js
