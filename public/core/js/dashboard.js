//	PROJECT: 		Core-v4
// 	Name: 			Rolando Javier
// 	File: 			dashboard.js
// 	Date Created: 	January 28, 2018
// 	Last Modified: 	February 12, 2018
// 	Details:
// 					This file contains all front-end javascript for the dashboard.html admin dashboard.
// 	Dependencies:
// 					AngularJS 1.6.7
"use strict";

// Globals
var storageOk = storageAvailable("sessionStorage");
var dbgMode = true;	// changes relevant parameters when doing debugging
var hostname = (dbgMode) ? "localhost:8080" : "sce.engr.sjsu.edu";
var urls = {
	"logout": `https://${hostname}/core/logout`,
	"search": `https://${hostname}/mdbi/search/documents`,
	"corePortal": `https://${hostname}/core`
};

// BEGIN init
$(document).ready(init());
function init () {
	console.log("You have entered the SCE Core v4 Admin Dashboard");
	setDebug(true);	// have verbose client side logging from lib/utility.js
}
// END init



// BEGIN AngularJS App
var pageApp = angular.module("adminDashboard",["profiler", "officertools"]);
// END AngularJS App



// BEGIN Angular Controllers
/*
	@controller 	UserController
	@details 		This controller handles actions related to the user control dropdown in the nav bar, handling all sorts of user actions (i.e. logout, profile viewing, etc.)
*/
pageApp.controller("UserController", function userController ($scope, $http, $window) {
	$scope.username = (storageOk) ? sessionStorage.getItem("username") : "User";
	$scope.logout = function () {
		var requestBody = {
			"sessionID": (storageOk) ? sessionStorage.getItem("sessionID") : "Without session storage, cookies should be automatically sent to the server",
			"userName": $scope.username,
			"sessionStorageSupport": storageOk
		};
		var config = {
			"headers": {
				"Content-Type": "application/json"
			}
		};

		logDebug("UserController", "logout", `Logging ${$scope.username} out...`);
		$http.post(urls.logout, requestBody, config).then((response) => {	// called when http status code is within the 200s
			switch (response.status) {
				case 200: {	// logout succeeded; go to core login page
					// Redirect the user to the core portal after a succesful logout
					logDebug("UserController", "logout", "Logout Successful");
					$window.location.assign(urls.corePortal);
					break;
				}
				default: {
					logDebug("UserController", "logout", `Unexpected response: ${JSON.stringify(response.data)}`);
					break;
				}
			}
		}).catch(function (errResponse) {	// called when http status code is outside 200s
			logDebug("UserController", "logout", `Error: ${JSON.stringify(errResponse.data)}`);
		});
	};
});

/*
	@controller 	contextController
	@details 		This controller handles context control, determining when certain page elements are displayed or not
*/
pageApp.controller("ContextController", function contextController ($scope) {
	$scope.hideAllPanels = () => {
		$("#member-profiler").addClass("hidden");
		$("#session-manager").addClass("hidden");
		$("#officertools").addClass("hidden");
	};
	$scope.showPanel = (elementId) => {
		console.log(`Showing ${elementId} panel`);
		$scope.hideAllPanels();
		$(`#${elementId}`).removeClass("hidden");
	};
	$scope.hidePanel = (elementId) => {
		$(`#${elementId}`).addClass("hidden");
	};
});

/*
	@controller 	UserDataController
	@details 		This controller handls the passing of user data from the main dashboard to the officertools component (but can theoretically be used by others if placed in the right enclosing tag in the dashboard.html)
*/
pageApp.controller("UserDataController", function userDataController($scope) {
	$scope.username = (storageOk) ? sessionStorage.getItem("username") : "User";
	$scope.sessionID = (storageOk) ? sessionStorage.getItem("sessionID") : "Without session storage, cookies should be automatically sent to the server";
});
// END Angular Controllers



// BEGIN Utility Functions
// END Utility Functions



// END dashboard.js
