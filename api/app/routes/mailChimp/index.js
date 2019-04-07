//	PROJECT: 		Core-v4
// 	Name: 			[author]
// 	File: 			[filename]
// 	Date Created: 	[creationdate]
// 	Last Modified: 	[moddate]
// 	Details:
// 					This file contains routing logic to service all routes requested under the the
//                  "[endpoint]" endpoint (a.k.a. the [moduleName] Module)
// 	Dependencies:
// 					[Dependencies]

"use strict";

// Includes (include as many as you need; the bare essentials are included here)
var express = require("express");
var https = require("https");
var fs = require("fs");
var router = express.Router();
var settings = require("../../../../util/settings");	// import server system settings
var al = require(`${settings.util}/api_legend.js`);		// import API Documentation Module
var au = require(`${settings.util}/api_util.js`);		// import API Utility Functions
// var dt = require(`${settings.util}/datetimes`);		// import datetime utilities
var ef = require(`${settings.util}/error_formats`);		// import error formatter
// var crypt = require(`${settings.util}/cryptic`);		// import custom sce crypto wrappers
var ssl = require(settings.security);					// import https ssl credentials
// var credentials = require(settings.credentials);		// import server system credentials
var www = require(`${settings.util}/www`);			// import custom https request wrappers
var logger = require(`${settings.util}/logger`);		// import event log system
var smci = require(`${settings.util}/../smci/smci.js`);

// Required Endpoint Options
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

// Example API Documentation Arguments

var api = al.createLegend(
	"Example API Name",
	"Example API Desc",
	router					// reference to the router object
);
var apiInfo = {
	"args": {},
	"rval": {}
};






// BEGIN [Module] Routes

// Example API route

apiInfo.args.example = [
	{
		"name": "API argument #1",
		"type": "~string",		// "~" = optional
		"desc": "An optional string argument for this API"
	}
];
apiInfo.rval.example = [
	{
		"condition": "On success",
		"desc": "This function returns true"
	},
	{
		"condition": "On failure",
		"desc": "This function returns false"
	}
];
api.register(
	"Example API Endpoint Name",
	"GET",							// http request type string
	"/mailchimptest",
	"POST to mailchimp",
	apiInfo.args.example,			// the API's request arguments (i.e. body/querystring)
	apiInfo.rval.example,			// the API's response/return values
	function ( request, response ) {

		// Initialize
		var handlerTag = { "src": "(get) /api/ability/ping" };
		logger.log( `Sending response to client @ ip ${request.ip}`, handlerTag );

		// smci.api.getRoot(null, function(res, err) {
		// 	logger.log("Sending response " + JSON.stringify(res));
		// 	response.status(200).send(res).end();
		// });

		smci.campaigns.create(
			{
				'type': 'regular',
				'recipients': {
					'list_id':'2f831f6fd8'
				},
				'settings':
					{
						'subject_line': 'Mailchimp Test 3/14/2019',
						'title': 'Mailchimp Test 3/14/2019',
						'from_name':'SCE Dev Test',
						'reply_to':'sce.sjsu@gmail.com'
					}
			},
			function(res, err) {
				logger.log("Sending response " + JSON.stringify(res));
				var campaignId = res.id;
				var campaignContents = {
					'template': {
						'id':293933
					}
				};
				smci.campaigns.setCampaignContent(campaignId, campaignContents, function(res2, err2) {
						if (res2) {
							smci.campaigns.sendCampaign(campaignId, function(res1, err1) {

								try{
									// console.log( res1 );
									response.status(200).send({"success": true}).end();
								} catch( exception ){
									console.log( exception );
									response.status(500).send({ "RES1": JSON.stringify( res1 ) }).end();
								}
							});
						}
				});
			}
		);
	}
);


// END [Module] Routes





module.exports = router;
// END [filename]
