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
			"search": `https://${hostname}/core/dashboard/search/members`,
			"searchMembership": `https://${hostname}/core/dashboard/search/memberdata`
		};

		// Model Data
		this.msg = "Add, search, and edit members here";
		this.errmsg = "";
		this.resultsPerPage = 10;
		this.pageNumber = 0;
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
		this.memberRegistrationStep = 0;
		this.memberRegistrationPercent = "0%";
		this.emailToVerify = "";
		this.emailVerified = "Unknown";

		// Controller Functions
		this.init = function () {
			// Bind actions to the member detail modal hide event
			$("#memberModal").on("hidden.bs.modal", function (event) {
				ctl.clearDetail();
			});

			// Bind actions to the add member modal hide event
			$("#addMemberModal").on("hidden.bs.modal", function (event) {
				ctl.clearAddMemberModal();
			});

			// Perform an initial search
			ctl.search();
		};
		this.search = function (resetPageNumber = false) {
			var requestBody = {
				"sessionID": sessionStorage.getItem("sessionID"),
				"searchType": ctl.searchType,
				"searchTerm": ctl.searchTerm,
				"options": {
					"resultMax": ctl.resultsPerPage,
					"pageNumber": ctl.pageNumber
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
			if (resetPageNumber) {
				ctl.pageNumber = 0;
				requestBody.options.pageNumber = ctl.pageNumber;
			}

			// Execute search
			console.log(`Searching by ${ctl.searchType} for ${ctl.searchTerm}`);
			$http.post(urls.search, requestBody, config).then((response) => {
				console.log(response.data);	// debug
				switch (response.status) {
					case 200: {
						ctl.errmsg = "";

						if (ctl.pageNumber === 0) {	// i.e. a click of "Search" button
							ctl.results = (response.data === null) ? [] : response.data;
						} else {	// i.e. a click of the "next page" button
							if (Array.isArray(response.data) && response.data.length > 0) {
								// Only change the result set model if the page data is valid
								ctl.results = response.data;
							} else {
								// Otherwise, undo the page increment
								ctl.errmsg = `There is no page ${ctl.pageNumber + 1}!`;
								console.log(ctl.errmsg);
								ctl.pageNumber--;
							}
						}
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
		this.beautifyDate = function (dateString) {
			var result = new Date(Date.parse(dateString));

			if (Number.isNaN(result)) {
				result = dateString;
			} else {
				result = result.toUTCString();
			}

			return result;
		};



		// BEGIN member detail modal controllers
		this.viewDetail = function (index) {
			var person = ctl.results[index];
			console.log(`Viewing ${person.userName}'s details`);

			// Request additional information
			var requestBody = {
				"sessionID": sessionStorage.getItem("sessionID"),
				"memberID": person.memberID
			};
			var config = {
				"headers": {
					"Content-Type": "application/json"
				}
			};
			$http.post(urls.searchMembership, requestBody, config).then((response) => {
				console.log(response.data);	// debug
				switch (response.status) {
					case 200: {
						console.log("Processing member data...");

						// Compute any details that need formatting
						var joinDate = ctl.beautifyDate(response.data[0].joinDate);
						var startDate = ctl.beautifyDate(response.data[0].startTerm);
						var endDate = ctl.beautifyDate(response.data[0].endTerm);
						var memberStatus = (response.data[0].membershipStatus) ? "Active" : "Inactive";

						// Populate the modal with details
						$("#memberUserName").val(response.data[0].userName);
						$("#memberFirstName").val(response.data[0].firstName);
						$("#memberMiddleInitial").val(response.data[0].middleInitial);
						$("#memberLastName").val(response.data[0].lastName);
						$("#memberEmail").val(response.data[0].email);
						$("#memberJoinDate").val(joinDate);
						$("#memberMajor").val(response.data[0].major);
						$("#memberDoorCode").val(response.data[0].doorcode);
						$("#memberStartTerm").val(startDate);
						$("#memberEndTerm").val(endDate);
						$("#memberStatus").val(memberStatus);

						// Open the modal
						console.log("Showing member details...")
						$("#memberModal").modal('show');
						break;
					}
					case 499: {
						console.log("Uh oh...");
						ctl.errmsg = "Uh oh...";
						break;
					}
					case 500: {
						console.log("Double Uh oh...");
						ctl.errmsg = "Internal Server Error";
						break;
					}
					default: {
						ctl.errmsg = "Unexpected response<<<";
						break;
					}
				}
			}).catch(function (errResponse) {
				logDebug("ProfilerController", "viewDetail", `Error: ${JSON.stringify(errResponse)}`);
				ctl.errmsg = (typeof errResponse.data === "undefined") ? errResponse : errResponse.data.emsg;
			});
		};
		this.clearDetail = function () {
			console.log(`Clearing modal...`);
			$("#memberUserName").val("");
			$("#memberFirstName").val("");
			$("#memberMiddleInitial").val("");
			$("#memberLastName").val("");
			$("#memberEmail").val("");
			$("#memberJoinDate").val("");
			$("#memberMajor").val("");
		};
		// END member detail modal controllers



		// BEGIN add member modal controllers
		this.openAddMemberModal = function () {
			console.log(`Activating Member Registration Modal...`);

			// First, clear modal
			ctl.clearAddMemberModal();

			// Then, show
			$("#addMemberModal").modal("show");
		};
		this.updateAddMemberModal = function () {
			console.log(`Member Registration is at step ${ctl.memberRegistrationStep}`);

			// First, clear any error messages
			ctl.showAddMemberError("");

			// Then, update the view
			switch (ctl.memberRegistrationStep) {
				case 0: {	// the default; all except step 0 are hidden
					$(".registration-step").addClass("hidden");
					$("#addStep0").removeClass("hidden");
					ctl.setAddMemberProgress(0);
					break;
				}
				case 1: {	// step 1: ID verification
					$(".registration-step").addClass("hidden");
					$("#addStep1").removeClass("hidden");
					ctl.setAddMemberProgress(20);
					break;
				}
				case 2: {	// step 2: Email verification
					$(".registration-step").addClass("hidden");
					$("#addStep2").removeClass("hidden");
					ctl.setAddMemberProgress(40);
					break;
				}
				case 3: {	// step 3: Payment verification
					$(".registration-step").addClass("hidden");
					$("#addStep3").removeClass("hidden");
					ctl.setAddMemberProgress(60);
					break;
				}
				case 4: {	// step 4: Door Code Verification
					$(".registration-step").addClass("hidden");
					$("#addStep4").removeClass("hidden");
					ctl.setAddMemberProgress(80);
					break;
				}
				case 5: {	// step 5: Complete!!!
					$(".registration-step").addClass("hidden");
					$("#addStep5").removeClass("hidden");
					ctl.setAddMemberProgress(100);
					break;
				}
				default: {
					console.log(`Invalid member registration step ${ctl.memberRegistrationStep}`);
					break;
				}
			}
		};
		this.addMemberNextStep = function () {
			ctl.memberRegistrationStep++;
			ctl.updateAddMemberModal();
		};
		this.addMemberPrevStep = function () {
			ctl.memberRegistrationStep--;
			ctl.updateAddMemberModal();
		};
		this.setAddMemberProgress = function (percent) {
			ctl.memberRegistrationPercent = `${percent}%`;
			$("#addMemberProgress").attr("aria-valuenow", ctl.memberRegistrationPercent).css("width", ctl.memberRegistrationPercent);
		};
		this.setEmailStatus = function (status) {
			ctl.emailVerified = status;
		};
		this.showEmailStatus = function () {
			$("#emailStatusLabel").removeClass("hidden");
		};
		this.hideEmailStatus = function () {
			$("#emailStatusLabel").addClass("hidden");
		};
		this.checkEmailStatus = function () {
			var requestBody = {
				"sessionID": sessionStorage.getItem("sessionID"),
				"searchType": "email",
				"searchTerm": ctl.emailToVerify
			};
			var config = {
				"headers": {
					"Content-Type": "application/json"
				}
			};

			// Make a request for member data here...
			if (ctl.emailToVerify === "") {
				ctl.showAddMemberError("Please enter an email to check!");
			} else {
				$http.post(urls.search, requestBody, config).then((response) => {
					console.log(response.data);

					switch (response.status) {
						case 200: {
							console.log("Checking Email Verification Status...");

							if (response.data.length !== 1) {
								ctl.setEmailStatus("Unknown");
								ctl.showEmailStatus();
								ctl.showAddMemberError("Error: The email verification couldn't be checked for some reason...");
							} else {
								// check for email verification here
								var emailWasVerified = true;

								if (!emailWasVerified) {
									ctl.setEmailStatus("Not Verified");
									ctl.showEmailStatus();
									ctl.showAddMemberError("So the email isn't verified... Ask the user to verify their email first!");
								} else {
									ctl.setEmailStatus("Verified");
									ctl.showEmailStatus();
								}
							}
							break;
						}
						case 499: {
							console.log("Invalid session token");
							ctl.showAddMemberError((typeof response.data[0].emsg === "undefined") ? "Session Token Rejected..." : response.data[0].emsg);
							break;
						}
						case 500: {
							console.log("Double Uh oh...");
							ctl.showAddMemberError("Internal Server Error");
							break;
						}
						default: {
							ctl.showAddMemberError("Unexpected response<<<<");
							break;
						}
					}
				}).catch(function (errResponse) {
					logDebug("ProfilerController", "checkEmailStatus", `Error: ${errResponse}`);
					ctl.showAddMemberError((typeof errResponse.data === "undefined") ? errResponse : errResponse.data.emsg);
				});
			}
		};
		this.showAddMemberError = function (msg) {
			$("#addMemberErrorMessage").html(msg);
		};
		this.clearAddMemberModal = function () {
			console.log(`Clearing Member Registration Modal...`);

			// Clear things here...
			ctl.setEmailStatus("Unknown");
			ctl.hideEmailStatus();
			ctl.memberRegistrationStep = 0;
			ctl.updateAddMemberModal();
		};
		// END add member modal controllers



		// BEGIN search result controllers
		this.setSearchType = function (type) {
			ctl.searchType = type;
		};
		this.setResultsPerPage = function (num) {
			ctl.resultsPerPage = num;
		};
		this.setSearchMode = function (mode) {
			console.log(`Interpreting search as ${mode}`);
			ctl.searchMode = mode;
		};
		this.incrementPage = function() {
			// Increment page number
			ctl.pageNumber++;

			// Resubmit request with new page number
			console.log(`Requesting Page ${ctl.pageNumber+1}`);
			ctl.search();
		};
		this.decrementPage = function() {
			ctl.errmsg = "";

			if (ctl.pageNumber > 0) {
				// Decrement page number
				ctl.pageNumber--;

				// Resubmit request with new page number
				console.log(`Requesting Page ${ctl.pageNumber+1}`);
				ctl.search();
			} else {
				ctl.errmsg = `You can't go back further!`;
				console.log(ctl.errmsg);
			}
		};
		// END search result controllers

		

		// Run controller initialization
		ctl.init();
	}
});

// END profiler.component.js
