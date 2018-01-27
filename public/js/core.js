//	PROJECT: 		Core-v4
// 	Name: 			Rolando Javier
// 	File: 			core.js
// 	Date Created: 	January 25, 2018
// 	Last Modified: 	January 25, 2018
// 	Details:
// 					This file contains all front-end javascript for the core.html admin portal.
// 	Dependencies:
// 					AngularJS 1.6.7
"use strict"

$(document).ready(init());

// BEGIN init
function init () {
	console.log("You have launched the SCE Core v4 Admin Portal");
	setDebug(true);
}
// END init



// BEGIN Angular
angular.module("adminPortal",[]).controller("loginCredentials", function () {
	var credentials = this;
	credentials.user = "";
	credentials.pwd = "";
	credentials.response = "";

	credentials.submit = function () {
		var uri = "https://localhost:8080/core/login"

		post(uri, {"user":credentials.user, "pwd": credentials.pwd}, function (response, status, jqxhr) {
			switch (typeof response) {
				case "object": {
					try {
						credentials.response = JSON.stringify(response);
					} catch (e) {
						logDebug("submit()", "parseError", `Could not parse response ${response}: ${e}`);
					}
					break;
				}
				default: {
					credentials.response = response.toString();
					break;
				}
			}
			logDebug("submit()", "reply", `Status: ${status} -> ${credentials.response}`);
			temporaryAlert(function () {
				credentials.response = "";
			});
		}, true);
	};
});
// END Angular



// BEGIN Utility Functions
function temporaryAlert (callback) {
	$("#submissionResponse").fadeIn("slow");
	$("#submissionResponse").removeClass("hidden");
	setTimeout(function () {
		$("#submissionResponse").addClass("hidden");
		callback();
	}, 3000);
}
// END Utility Functions



// END core.js
