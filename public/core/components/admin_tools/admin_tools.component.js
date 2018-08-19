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
	"controller": function ($http, $window) {
		var ctl = this;
		var dbgMode = true;
		var hostname = (dbgMode) ? "localhost:8080" : "sce.engr.sjsu.edu";
		var urls = {
			"getOfficerList": `https://${hostname}/core/dashboard/search/officerlist`,
			"getOfficerAbilities": `https://${hostname}/core/dashboard/search/officerabilities`
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
		this.promoteAsOfficer = function () {
			console.log(`Promoting officer!`);
		};
		this.revokeAbility = function (abilityObj, officerObj) {
			console.log(`Revoking ability ID ${abilityObj.abilityID} from officer "${officerObj.userName}"`);
			$http.post();
		}
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
		// END Utility Controllers
	}
});

// END admin_tools.component.js