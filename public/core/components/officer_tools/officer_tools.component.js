//	PROJECT: 		Core-v4
// 	Name: 			R. Javier
// 	File: 			officer_tools.component.js
// 	Date Created: 	May 3, 2018
// 	Last Modified: 	May 3, 2018
// 	Details:
// 					This file contains the AngularJS component that provides officer administrative features
// 	Dependencies:
// 					AngularJS v1.6.x

angular.module("officertools").component("officertools", {
	"templateUrl": "components/officer_tools/officer_tools.template.html",	// relative to dashboard.html file
	"bindings": {
		"currentuser": "<currentuser",
		"sessionID": "<sid"
	},
	"controller": function ($http) {
		var ctl = this;
		var dbgMode = true;
		var hostname = (dbgMode) ? "localhost:8080" : "sce.engr.sjsu.edu";
		var urls = {
			"exportExpiredCodes": `https://${hostname}/core/dashboard/export/expiredcodes`
		};
		ctl.error_message = "";



		// BEGIN Model Data
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
			console.log(`Officer Tools Current User: ${ctl.currentuser}, ${ctl.sessionID}`);
		};
		// END Main Controllers



		// BEGIN Utility Controllers
		this.setError = function (msg) {
			ctl.error_message = msg;
		};
		this.exportDoorCodes = function () {
			var requestBody = {
				"sessionID": ctl.sessionID
			};
			var config = {
				"headers": {
					"Content-Type": "application/json"
				}
			};

			console.log(`Exporting expired member door codes...`);
			ctl.setError("");
			$http.post(urls.exportExpiredCodes, requestBody, config).then((response) => {
				console.log(response.data);
				switch (response.status) {
					case 200: {
						if (response.data.status === "success") {
							ctl.setError("Export successful");
						} else {
							ctl.setError("A success status was not found");
						}
						break;
					}
					default: {
						ctl.setError(`Unexpected response (${response.status})`);
						console.log(`Unexpected response (${response.status}): ${response.data}`);
						break;
					}
				}
			}).catch(function (errResponse) {
				logDebug("OfficerToolsController", "export", `Error: ${JSON.stringify(errResponse)}`);
				ctl.setError(errResponse.data.emsg);
			});
		};
		// END Utility Controllers
	}
});

// END officer_tools.component.js