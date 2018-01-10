//	PROJECT: 		MEANserver
// 	Name: 			Rolando Javier
// 	File: 			smci.js
// 	Date Created: 	January 8, 2018
// 	Last Modified: 	January 9, 2018
// 	Details:
// 					The Sce Mail Chimp Interface (SMCI). This file contains JavaScript wrapper functions for the MailChimp API. ECMAscript 6 constructs can be used here (i.e. templating)
// 	Dependencies:
// 					Node.js HTTPS Module

"use strict"

// Includes
const https = require("https");
const settings = require("./smci_settings");



// Container (Singleton)
const smci = {};



// Functions
/*
	@function 	requestRoot
	@parameter 	callback - a callback function to run after the request is issued. It is passed the https.get() callback response
	@details 	Makes a GET request to the MailChimp API Root
*/
smci.requestRoot = function (callback) {
	var options = {
		"hostname": `${settings.apiDataCenter}.api.mailchimp.com`,
		"path": `/${settings.apiVersion}/`,
		"method": "GET",
		"auth": `${settings.anystring}:${settings.apikey}`
	};

	https.get(options, function (response) {
		console.log("resStatus", response.statusCode);
		console.log("headers:", response.headers);

		response.on("data", function (data) {
			process.stdout.write(data);
		});
	}).on("error", function (err) {
		console.log(err);
	}).end();
};



module.exports = smci;
// END smci.js
