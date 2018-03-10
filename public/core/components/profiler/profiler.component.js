//	PROJECT: 		Core-v4
// 	Name: 			R. Javier
// 	File: 			profiler.component.js
// 	Date Created: 	February 15, 2018
// 	Last Modified: 	February 16, 2018
// 	Details:
// 					This file contains the AngularJS component that displays a searched user's information
// 	Dependencies:
// 					AngularJS v1.6.x

angular.module("profiler").component("profiler", {
	templateUrl: "components/profiler/profiler.template.html",	// relative to dashboard.html file
	controller: function ($http) {
		var ctl = this;
		var dbgMode = true;	// changes relevant parameters when doing debugging
		var hostname = (dbgMode) ? "localhost:8080" : "sce.engr.sjsu.edu";
		var urls = {
			"search": `https://${hostname}/core/dashboard/search/members`
		};

		// Model Data
		this.msg = "Add, search, and edit members here";
		this.errmsg = "";
		this.resultsPerPage = 10;
		this.searchTerm = "";
		this.searchMode = "exact";
		this.searchType = "username";
		this.results = [
			// {
			// 	"memberID": 0,
			// 	"firstName": "hello",
			// 	"middleInitial": "w.",
			// 	"lastName": "orld",
			// 	"joinDate": "2018-02-19T13:04:55Z",
			// 	"userName": "testUsername",
			// 	"email": "testUser@email.com",
			// 	"major": "test major"
			// }
		];

		// Controller Functions
		this.init = function () {
			ctl.search();
		};
		this.search = function () {
			var requestBody = {
				"sessionID": sessionStorage.getItem("sessionID"),
				"searchType": ctl.searchType,
				"searchTerm": ctl.searchTerm,
				"options": {
					"resultMax": ctl.resultsPerPage
				}
			};
			var config = {
				"headers": {
					"Content-Type": "application/json"
				}
			};
			var searchTypeStr = "";

			// Process Search Customizations
			if (ctl.searchMode !== "exact") {
				if (ctl.searchMode === "word") {
					// filter by text indexes here...
				} else if (ctl.searchMode === "regex") {
					requestBody.options["regexMode"] = true;
				}
			}

			// Execute search
			console.log(`Searching by ${ctl.searchType} for ${ctl.searchTerm}`);
			$http.post(urls.search, requestBody, config).then((response) => {
				console.log(response.data);	// debug
				switch (response.status) {
					case 200: {
						ctl.errmsg = "";
						ctl.results = (response.data === null) ? [] : response.data;
						break;
					}
					default: {
						ctl.errmsg = "Unexpected response<<<";
						ctl.results = [];
						break;
					}
				}
			}).catch(function (errResponse) {
				logDebug("ProfilerController", "search", `Error: ${JSON.stringify(errResponse)}`);
				ctl.errmsg = errResponse.data.emsg;
			});
		};
		this.viewDetail = function (username) {
			console.log(`Viewing ${username}'s details`);
		};
		this.setSearchType = function (type) {
			ctl.searchType = type;
		};
		this.setResultsPerPage = function (num) {
			ctl.resultsPerPage = num;
		};
		this.setSearchMode = function (mode) {
			console.log(`Interpreting search as ${mode}`);
			ctl.searchMode = mode;
		}
	}
});

// END profiler.component.js
