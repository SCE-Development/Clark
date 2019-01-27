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
	"controller": function ($http, $window) {
		var ctl = this;
		var dbgMode = true;
		var hostname = (dbgMode) ? "localhost:8080" : "sce.engr.sjsu.edu";
		var urls = {
			"exportExpiredCodes": `https://${hostname}/core/dashboard/export/expiredcodes`,
			"officerProcedures": `https://docs.google.com/document/d/1QSzIZJMYxSxh1gFspEfgXpe3luh0vifudv5D8a3IG18/edit`,
			"officerTraining": `https://drive.google.com/open?id=0B4BheoHJ1lZVZ1VZNUxJVE4xRm8`,
			"lockerSpreadsheet": `https://docs.google.com/spreadsheets/d/1oJwqrKhh2XXOJiyq0De10DJvdBHFsegZ7OmAgI5uSIQ/edit#gid=1312223330`,
			"dreamsparkSpreadsheet": `https://docs.google.com/spreadsheets/d/1SvtXBSY5wMtHmuUTDMGFIOS1BTviAm1O4dmBm94xCK8/edit`,
			"eodProfitForm": `https://goo.gl/vcBWma`,
			"cashCountProcedures": `https://www.goo.gl/kA8yTE`,
			"storeSlideshow": `https://docs.google.com/presentation/d/1iRopCuN8qT0e_easSX0t6StIwvqul-OgHZpkkA28g5o/edit#slide=id.p`,
			"announcement": `localhost:3000/eventsManager`,
			"3DConsole": `localhost:3000/3DConsole`
			//"announcement": `https://sce.engr.sjsu.edu/wp-admin/edit.php`
		};



		// BEGIN Model Data
		ctl.error_message = "";
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
		this.openNewWindow = function (urlName) {
			ctl.setError("");
			if (typeof urls[urlName] === "undefined") {
				console.log(`Error: unable to open new tab to ${urlName}`);
				ctl.setError(`Unable to perform your redirect`);
			} else {
				$window.open(urls[urlName], "_blank");
			}
		};
		// END Utility Controllers
	}
});

// END officer_tools.component.js
