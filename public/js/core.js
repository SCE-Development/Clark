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
		var uri = "http://localhost:8080/core/login"
		credentials.response = `You entered ${credentials.user} ${credentials.pwd}`;
		console.log(credentials.response);
		post(uri, {"user":credentials.user, "pwd": credentials.pwd}, function (response, status, jqxhr) {
			logDebug("submit()", "reply", `Status: ${status} -> ${response}`);
		}, true);
	};
});
// END Angular



// BEGIN Utility Functions
function temporaryAlert () {
	$("#submissionResponse").fadeIn("slow");
	$("#submissionResponse").removeClass("hidden");
	setTimeout(function () {
		$("#submissionResponse").fadeOut("slow");
		credentials.response = "";
	}, 3000);
}
// END Utility Functions



// END core.js
