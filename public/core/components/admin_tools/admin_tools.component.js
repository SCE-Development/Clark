//	PROJECT: 		Core-v4
// 	Name: 			R. Javier
// 	File: 			admin_tools.component.js
// 	Date Created: 	May 3, 2018
// 	Last Modified: 	May 3, 2018
// 	Details:
// 					This file contains the AngularJS component that provides officer administrative features
// 	Dependencies:
// 					AngularJS v1.6.x

angular.module("admintools").component("admintools", {
	"templateUrl": "components/admin_tools/admin_tools.template.html",	// relative to dashboard.html file
	"bindings": {
		"currentuser": "<currentuser",
		"sessionID": "<sid"
	},
	"controller": function ($rootScope, $http, $window) {
		var ctl = this;
		var dbgMode = true;
		var hostname = (dbgMode) ? "localhost:8080" : "sce.engr.sjsu.edu";
		var urls = {
			"getOfficerList": `https://${hostname}/core/dashboard/search/officerlist`,
			"getOfficerAbilities": `https://${hostname}/core/dashboard/search/officerabilities`,
			"editOfficerClearance": `https://${hostname}/core/dashboard/edit/officerclearance`
		};



		// BEGIN Model Data
		ctl.error_message = "";
		ctl.officerList = [];
		// END Model Data



		// BEGIN Main Controllers
		this.$onInit = function () {
			// runs only once, when the module is fully loaded
		};
		this.$onChanges = function () {
			// runs when one of the binding's parents changes the value of the binding
			ctl.loadData();
		};
		this.loadData = function () {
			console.log(`Officer Manager Current User: ${ctl.currentuser}, ${ctl.sessionID}`);
		};
		this.loadOfficerRoster = function () {
			var requestBody = {
				"sessionID": ctl.sessionID,
				"currentUser": ctl.currentuser
			};
			var config = {
				"headers": {
					"Content-Type": "application/json"
				}
			};

			ctl.setError("");
			console.log(`Loading officer roster list...`);
			$http.post(urls.getOfficerList, requestBody, config).then((response) => {
				console.log(response.data);
				switch (response.status) {
					case 200: {
						console.log(`Officer list acquired`);
						ctl.officerList = response.data;
						break;
					}
					default: {
						logDebug("OfficerManagementController", "request officer list", `Unable to acquire officer list (${response.status})`);
						console.log(`Unexpected response (${response.status}): ${response.data}`);
						break;
					}
				}
			}).catch(function (errResponse) {
				logDebug("OfficerManagementController", "request officer list", `Error: ${JSON.stringify(errResponse)}`);
				ctl.setError(errResponse.data.emsg);
			});
		};
		this.loadOfficerAbilities = function (index) {
			var officer = ctl.officerList[index];
			var requestBody = {
				"sessionID": ctl.sessionID,
				"officerID": officer.memberID,
				"getInfo": true
			};
			var config = {
				"headers": {
					"Content-Type": "application/json"
				}
			};

			console.log(`Loading ${ctl.officerList[index].userName}'s abilities (${JSON.stringify(ctl.officerList[index].abilities)})`);
			$http.post(urls.getOfficerAbilities, requestBody, config).then((response) => {
				console.log(response.data);
				switch (response.status) {
					case 200: {
						console.log(`Officer data acquired`);

						// Replace the current officer's ability data in the model
						ctl.officerList[index].abilityInfo = response.data;
						break;
					}
					default: {
						logDebug("OfficerManagementController", "request officer ability names", `Unable to acquire officer abilities (${response.status})`);
						console.log(`Unexpected response (${response.status}): ${response.data}`);
						break;
					}
				}
			}).catch(function (errResponse) {
				logDebug("OfficerManagementController", "request officer ability names", `Error: ${JSON.stringify(errResponse)}`);
				ctl.setError(errResponse.data.emsg);
			});
		};
		this.changeClearance = function (officerID, officerLevel, officerLevelName = false) {	// every officer will have only one clearance level
			var requestBody = {
				"sessionID": ctl.sessionID,
				"currentUser": ctl.currentuser,
				"officerID": officerID,
				"level": officerLevel
			};
			var config = {
				"headers": {
					"Content-Type": "application/json"
				}
			};

			console.log(`Changing clearance level ${officerLevel}${officerLevelName ? " (" + officerLevelName + ")" : ""} from officer "${officerID}"`);
			$http.post(urls.editOfficerClearance, requestBody, config).then((response) => {
				console.log(response.data);
			}).catch(function (errResponse) {
				logDebug("OfficerManagementController", "change officer clearance level", `Error: ${JSON.stringify(errResponse)}`);
				ctl.setError(errResponse.data.emsg);
			});
		}
		this.revokeClearance = function (officerID, officerLevel, officerLevelName = false) {	// every officer will have only one clearance level
			var requestBody = {
				"sessionID": ctl.sessionID,
				"currentUser": ctl.currentuser,
				"officerID": officerID,
				"level": 2 				// set the officer as a member
			};
			var config = {
				"headers": {
					"Content-Type": "application/json"
				}
			};

			console.log(`Revoking clearance level ${officerLevel}${officerLevelName ? " (" + officerLevelName + ")" : ""} from officer "${officerID}"`);
			$http.post(urls.editOfficerClearance, requestBody, config).then((response) => {
				console.log(response.data);
				ctl.loadOfficerRoster();
			}).catch(function (errResponse) {
				logDebug("OfficerManagementController", "revoke officer clearance level", `Error: ${JSON.stringify(errResponse)}`);
				ctl.setError(errResponse.data.emsg);
			});
		};
		// END Main Controllers



		// BEGIN Utility Controllers
		this.setError = function (msg) {
			ctl.error_message = msg;
		};
		this.launchOfficerManagementModal = function () {
			console.log(`Launching officer management modal`);

			// Load the officer roster
			ctl.loadOfficerRoster();

			// Select all div.officer-management-modal decendants in admintools tag (i.e. direct or indirect child of admintools component tag), and show them
			$("admintools div.officer-management-modal").modal("show");
		};
		this.showMemberList = function (memberListID) {
			console.log(`Firing event "showMemberListComponent"`);

			// Fire event
			$rootScope.$emit("showMemberListComponent", {
				"memberListID": memberListID
			});
		};
		this.hideMemberList = function (memberListID) {
			console.log(`Firing event "hideMemberListComponent"`);

			// Fire event
			$rootScope.$emit("hideMemberListComponent", {
				"memberListID": memberListID
			});
		};
		// END Utility Controllers



		// BEGIN Global Event Listeners
		$rootScope.$on( "memberListSelection", function (event, arg) {

			// test
			// console.log(`Caught memberListSelection:`, arg);
			var requestBody = {
				"sessionID": ctl.sessionID,
				"currentUser": ctl.currentuser,
				"officerID": arg.selection.memberID,
				"level": 1		// promote to officer level
			};
			var config = {
				"headers": {
					"Content-Type": "application/json"
				}
			};

			// Promote the selected member to an officer
			console.log(`Promoting "${arg.selection.userName}" clearance level to Officer...`);
			$http.post(urls.editOfficerClearance, requestBody, config).then((response) => {
				console.log(response.data);
				ctl.loadOfficerRoster();
			}).catch(function (errResponse) {
				logDebug("OfficerManagementController", "promote officer clearance level", `Error: ${JSON.stringify(errResponse)}`);
				ctl.setError(errResponse.data.emsg);
			});
		} );
		// END Global Event Listeners
	}
});

// END admin_tools.component.js