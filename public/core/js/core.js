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
	setDebug(true);	// have post() logging
}
// END init



// BEGIN Angular
angular.module("adminPortal",[]).controller("loginCredentials", ["$scope", "$window", "$location", function ($scope, $window, $location) {
	var credentials = this;
	credentials.user = "";
	credentials.pwd = "";
	credentials.status = "";
	credentials.response = "";

	credentials.submit = function () {
		var uri = "https://localhost:8080/core/login";

		// Update UI with current status
		credentials.response = "";
		credentials.status = "Submitting...";

		// Send login credentials
		post(uri, {"user":credentials.user, "pwd": credentials.pwd}, function (response, status, jqxhr) {
			$scope.$apply(function () {
				var msgAsString;

				// Clear status indicator
				credentials.status += "Done";

				// Handle response
				if (typeof response.etype !== "undefined") {
					// Show error to screen by updating model
					credentials.response = (typeof response.emsg !== "undefined") ? response.emsg : `A problem has occurred. Please notify an sce officer! ${response.etype}`;
				} else if (typeof response.sessionID !== "undefined") {
					// Login succeeded; Enter the site with your session token
					gotoDashboard(response.sessionID, $window, $location);
				}

				// BEGIN debug
				try {
					msgAsString = JSON.stringify(response);
				} catch (e) {
					logDebug("submit()", "parseError", `Could not parse response ${response}: ${e}`);
					msgAsString = response.toString();
				}
				logDebug("submit()", "reply", `Status: ${status} -> ${msgAsString}`);
				// END debug
			});
		}, true);
	};
}]);
// END Angular



// BEGIN Utility Functions
function gotoDashboard (sessionID, ngwindow, nglocation) {
	var dashboardUrl = "https://localhost:8080/core/dashboard";
	var token = {
		"sessionID": sessionID
	};
	// location = dashboardUrl;
	// window.location.href = dashboardUrl;
	window.open()
	// post(dashboardUrl, token, function (response, status, jqxhr) {
	// });
}
// END Utility Functions



// END core.js
