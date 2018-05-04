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
			"searchMembership": `https://${hostname}/core/dashboard/search/memberdata`,
			"searchDoorCodes": `https://${hostname}/core/dashboard/search/dc`,
			"editDoorCodeInAdd": `https://${hostname}/core/dashboard/edit/dc`,
			"editMemStatus": `https://${hostname}/core/dashboard/edit/membershipstatus`,
			"editMemberField": `https://${hostname}/core/dashboard/edit/memberfield`
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
		this.newMemberUsername = "";
		this.emailToVerify = "";
		this.emailVerified = "Unknown";
		this.currentMemberDetail = {};

		// Controller Functions
		this.init = function () {
			// Bind actions to the member detail modal hide event
			$("#memberModal").on("hidden.bs.modal", function (event) {
				ctl.clearDetail();
				ctl.closeMemberDetailEditor();
			});

			// Bind actions to the add member modal hide event
			$("#addMemberModal").on("hidden.bs.modal", function (event) {
				ctl.clearAddMemberModal();
			});

			// Bind actions to member detail edit buttons
			$(".member-detail-item").mouseenter(function () {
				$(this).append( $("<button type='button' class='btn btn-default member-detail-edit-btn'><span class='glyphicon glyphicon-pencil'></span></button>") );
			}).mouseleave(function () {
				$(this).find("button:last").remove();
			}).on("click", function (event) {
				var fieldValue = $(this).children(".member-detail-field").html();
				var fieldID = $(this).children(".member-detail-field").attr("id");
				
				// Show based on what was clicked
				ctl.launchMemberDetailEditor(fieldID, fieldValue);
			});

			// Perform an initial search
			ctl.search();
		};
		this.getEmailVerifiedClassByStatus = function (isVerified, classIfTrue, classIfFalse) {
			var outputClass = classIfFalse;
			if (isVerified) {
				outputClass = classIfTrue;
			}
			return outputClass;
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



		// BEGIN member detail modal controllers data model
		this.currentField = "";
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

						// Save current member details to model
						ctl.currentMemberDetail = response.data[0];

						// Compute any details that need formatting
						var joinDate = ctl.beautifyDate(response.data[0].joinDate);
						var startDate = ctl.beautifyDate(response.data[0].startTerm);
						var endDate = ctl.beautifyDate(response.data[0].endTerm);
						var memberStatus = (response.data[0].membershipStatus) ? "Active" : "Inactive";

						// Populate the modal with details
						$("#memberUserName").html(response.data[0].userName);
						$("#memberFirstName").html(response.data[0].firstName);
						$("#memberMiddleInitial").html(response.data[0].middleInitial);
						$("#memberLastName").html(response.data[0].lastName);
						$("#memberEmail").html(response.data[0].email);
						$("#memberEmailVerified").addClass("glyphicon");
						$("#memberEmailVerified").addClass((response.data[0].emailVerified === true) ? "glyphicon-ok" : "glyphicon-remove");
						$("#memberEmailVerified").css("color", (response.data[0].emailVerified === true) ? "green" : "red");
						$("#memberJoinDate").html(joinDate);
						$("#memberMajor").html(response.data[0].major);
						$("#memberDoorCode").html(response.data[0].doorcode);
						$("#memberStartTerm").html(startDate);
						$("#memberEndTerm").html(endDate);
						$("#memberStatus").html(memberStatus);

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
		this.launchMemberDetailEditor = function (fieldID, fieldValue) {
			var fieldName = fieldID.replace("member", "");
			
			console.log("Launching Member Detail Edit Bar...");
			console.log(`${fieldID} -> ${fieldValue}`);
			$("#detailEditorFieldName").html(fieldName);

			ctl.currentField = fieldName;
			ctl.showMemberDetailError("");

			// Determine which UI elements to show for this edit
			switch (fieldID) {
				case "memberDoorCode": {
					// Hide all, then show door code editor
					$(".member-detail-edit-field").addClass("hidden");
					$("#doorcoder1").removeClass("hidden");
					break;
				}
				case "memberJoinDate": {
					// Hide all, then show the membership_manager component
					$(".member-detail-edit-field").addClass("hidden");
					$("#membershipmanager").removeClass("hidden");
					break;
				}
				case "memberStartTerm": {
					// Hide all, then show the membership_manager component
					$(".member-detail-edit-field").addClass("hidden");
					$("#membershipmanager").removeClass("hidden");
					break;
				}
				case "memberEndTerm": {
					// Hide all, then show the membership_manager component
					$(".member-detail-edit-field").addClass("hidden");
					$("#membershipmanager").removeClass("hidden");
					break;
				}
				default: {
					// Hide all, then show the editor bar
					$(".member-detail-edit-field").addClass("hidden");
					$("#editorbar").removeClass("hidden");
					break;
				}
			}

			// Reveal the collapsible
			$("#memberDetailEditor").collapse("show");
		};
		this.closeMemberDetailEditor = function () {
			console.log("Closing Member Detail Edit Bar...");

			// Clear all internal UI elements
			$("#editorbarInputField").val("");

			// Hide all internal UI elements
			$(".member-detail-edit-field").addClass("hidden");
			ctl.showMemberDetailError("");

			// Hide the collapsible
			$("#memberDetailEditor").collapse("hide");
		};
		this.submitNewMemberDetail = function () {
			var type = ctl.currentField;
			var val = $("#editorbarInputField").val();
			var success = true;

			console.log(`Submitting ${val} as updated ${type}...`);

			switch (type) {
				case "FirstName": {
					type = "firstName";
					break;
				}
				case "MiddleInitial": {
					type = "middleInitial";
					break;
				}
				case "LastName": {
					type = "lastName";
					break;
				}
				case "Major": {
					type = "major";
					break;
				}
				// default: {
				// 	console.log(`Error: Unexpected detail field name "${type}"`);
				// 	ctl.showMemberDetailError(`Unable to edit "${type}"`);
				// 	success = false;
				// 	break;
				// }
			}

			if (success) {
				var requestBody = {
					"sessionID": sessionStorage.getItem("sessionID"),
					"username": $("#memberUserName").html(),
					"field": type,
					"value": val
				};
				var config = {
					"headers": {
						"Content-Type": "application/json"
					}
				};
				$http.post(urls.editMemberField, requestBody, config).then((response) => {
					console.log(response.data);
					switch (response.status) {
						case 200: {
							console.log("Membership data update succeeded!");

							// Clear and close bar
							ctl.closeMemberDetailEditor();

							// Close modal
							$("#memberDetailModalCloseButton").click();

							// Refresh search results
							ctl.search();
							break;
						}
						default: {
							console.log(`Something didn't work... (Code ${response.status})`);
							var msg = "Oops... The operation had an issue";
							if (typeof response.data.emsg !== "undefined") {
								msg += `: ${response.data.emsg}`;
							}
							ctl.showMemberDetailError(msg);
							break;
						}
					}
				}).catch(function (errResponse) {
					logDebug("ProfilerController", "submitNewMemberDetail", `Error: ${JSON.stringify(errResponse)}`);
					var msg = (typeof errResponse.data.eobj !== "undefined") ? errResponse.data.eobj : (typeof errResponse.data.emsg !== "undefined") ? errResponse.data.emsg : (typeof errResponse.data.etype !== "undefined") ? errResponse.data.etype : "An error occurred..."
					ctl.showMemberDetailError(msg);
				});
			}
		}
		this.showMemberDetailError = function (val) {
			$("#memberDetailErrorMessage").html(val);
		};
		this.clearDetail = function () {
			console.log(`Clearing modal...`);
			$("#editorbarInputField").val("");
			$("#memberUserName").html("");
			$("#memberFirstName").html("");
			$("#memberMiddleInitial").html("");
			$("#memberLastName").html("");
			$("#memberEmail").html("");
			$("#memberEmailVerified").removeClass("glyphicon");
			$("#memberEmailVerified").removeClass("glyphicon-ok");
			$("#memberEmailVerified").removeClass("glyphicon-remove");
			$("#memberJoinDate").html("");
			$("#memberMajor").html("");
			$("#memberDoorCode").html("");
			$("#memberStartTerm").html("");
			$("#memberEndTerm").html("");
			$("#memberStatus").html("");
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
		this.finalizeMemberReg = function () {
			var requestBody = {
				"sessionID": sessionStorage.getItem("sessionID"),
				"username": ctl.newMemberUsername,
				"status": true
			};
			var config = {
				"headers": {
					"Content-Type": "application/json"
				}
			};
			$http.post(urls.editMemStatus, requestBody, config).then((response) => {
				console.log(response.data);
				switch (response.status) {
					case 200: {
						$("#cancelAddMemberBtn").click();
						break;
					}
					default: {
						console.log(`Darn... (Code ${response.status})`);
						var msg = "Oops... The operation had an issue";
						if (typeof response.data.emsg !== "undefined") {
							msg += `: ${response.data.emsg}`;
						}
						ctl.showAddMemberError(msg);
						break;
					}
				}
			}).catch(function (errResponse) {
				logDebug("ProfilerController", "finalizeMemberReg", `Error: ${JSON.stringify(errResponse)}`);
				var msg = (typeof errResponse.data.etype !== "undefined") ? errResponse.data.etype : "An error occurred..."
				ctl.showAddMemberError(msg);
			});
		};
		this.setMemberUsername = function (val) {
			ctl.newMemberUsername = (typeof val === "undefined") ? $("#newMemUname").val() : val;

			ctl.showAddMemberError("");
			if (ctl.newMemberUsername === "") {
				ctl.showAddMemberError("Please provide a username!");
			} else {
				this.addMemberNextStep();
			}
		};
		this.setAddMemberProgress = function (percent) {
			ctl.memberRegistrationPercent = `${percent}%`;
			$("#addMemberProgress").attr("aria-valuenow", ctl.memberRegistrationPercent).css("width", ctl.memberRegistrationPercent);
		};
		this.showDoorCodePanel = function () {
			// Reveal the collapsible
			$("#doorCodePanel").collapse("show");
		};
		this.hideDoorCodePanel = function () {
			$("#doorCodePanel").collapse("hide");
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

			// Hide email status and error messages first
			ctl.showAddMemberError("");
			ctl.setEmailStatus("Unknown");
			ctl.hideEmailStatus();

			// Make a request for member data
			if (ctl.emailToVerify === "") {
				ctl.showAddMemberError("Please enter an email to check!");
			} else {
				$http.post(urls.search, requestBody, config).then((response) => {
					console.log(response.data);

					switch (response.status) {
						case 200: {
							console.log("Checking Email Verification Status...");

							if (response.data.length > 1) {
								ctl.setEmailStatus("Unknown");
								ctl.showEmailStatus();
								ctl.showAddMemberError("Error: The email verification couldn't be checked for some reason...");
							} else if (typeof response.data[0] === "undefined") {
								ctl.setEmailStatus("Unknown");
								ctl.showEmailStatus();
								ctl.showAddMemberError("The email you entered returned no search result data. Make sure it's correct!");
							} else {
								// check for email verification here
								if (!response.data[0].emailVerified) {
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
					ctl.setEmailStatus("Unknown");
					ctl.hideEmailStatus();
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
			ctl.doorCodeList = [];
			ctl.hideDoorCodePanel();
			ctl.memberRegistrationStep = 0;
			ctl.newMemberUsername = "";
			$("#newMemUname").val("");
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
