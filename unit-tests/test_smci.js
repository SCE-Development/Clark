//	PROJECT: 		Core v4
// 	Name: 			Rolando Javier
// 	File: 			test_smci.js
// 	Date Created: 	January 17, 2018
// 	Last Modified: 	January 17, 2018
// 	Details:
// 					This file contains the unit tests for server.js's SMCI module. Note that these test rely on using actual emails from the MailChimp account's email quota. It is recommeded to only run tests individually (i.e. try to run only the inner-most-nested "describe(...);" method of the test you wish to perform). Note that some of these tests depend on the success of other tests; be cautious about which tests you run, since some tests have pre-requesites that must be met.
// 	Dependencies:
// 					MochaJS v4.1.0
// 					ChaiJS v4.1.2
"use strict"

// Includes
var chai = require("chai");
var smci = require("../smci/smci");
var smci_settings = require("../smci/smci_settings");
var www = require("../util/www.js");
var assert = chai.assert;



// Test control settings
var ctl = {
	runAll: false,
	runApi: false,
	runAuthorizedApps: false,
	runAutomations: false,
	runBatchOps: false,
	runCampaignFolders: false,
	runCampaigns: false,
	runLists: false,
	runTemplateFolders: false,
	runTemplates: true
};

// Silence the web request wrapper module's console logging
www.config.silence();

// For Debugging: use verbose logging
// www.config.verbose();



// SMCI Module Test
describe("SMCI Unit Tests", function () {
	// API root endpoint
	if (ctl.runAll || ctl.runApi) {
		describe("API Root", function () {
			describe("smci.api.getRoot()", function () {
				it("should acquire the MailChimp api root", function (done) {
					var keysOfAnErrorResponse = ["type", "title", "status", "detail", "instance"];
					smci.api.getRoot(null, function (response, error) {
						assert.isNull(error);
						assert.doesNotHaveAnyKeys(response, keysOfAnErrorResponse);
						done();	// required to signal end of an async test
					});
				});
			});

			describe("smci.api.ping()", function () {
				it("should ping the api server health", function (done) {
					var keysOfAnErrorResponse = ["type", "title", "status", "details", "instance"];
					var expectedKeys = ["health_status"];

					smci.api.ping(function (response, error) {
						assert.isNull(error);
						assert.doesNotHaveAnyKeys(response, keysOfAnErrorResponse);
						assert.containsAllKeys(response, expectedKeys);
						done();
					});
				});
			});
		});
	}

	// Authorized Apps Endpoint
	if (ctl.runAll || ctl.runAuthorizedApps) {
		describe("Authorized Apps", function () {
			describe("smci.authorizedApps.register()", function () {
				it("shouldn't be tested yet, until you're certain it won't override MailChimp's client ids");
			});
			describe("smci.authorizedApps.getFullList()", function () {
				it("should acquire a full list of authorized apps from MailChimp", function (done) {
					var expectedKeys = ["apps", "total_items", "_links"];
					smci.authorizedApps.getFullList(null, function (response, error) {
						assert.isNull(error);
						assert.hasAllKeys(response, expectedKeys);
						done();
					});
				});
			});
			describe("smci.authorizedApps.getAppInfo()", function () {
				it ("should acquire information about a specific app", function (done) {
					var expectedKeys = ["id", "name", "description", "users", "_links"];
					var appID = "394135694205"; // Client id associated with the MailChimp account's app "rj_my_test_app"
					smci.authorizedApps.getAppInfo(appID, null, function (response, error) {
						assert.isNull(error);
						assert.hasAllKeys(response, expectedKeys);
						done();
					});
				});
			});
		});
	}

	// Automations Endpoint
	if (ctl.runAll || ctl.runAutomations) {
		describe("Automations", function () {
			describe("smci.automations.getFullList()", function () {
				it("should acquire a full list of automations from MailChimp", function (done) {
					var expectedKeys = ["automations", "total_items", "_links"];
					smci.automations.getFullList(null, function (response, error) {
						assert.isNull(error);
						assert.hasAllKeys(response, expectedKeys);
						done();
					});
				});
			});

			// ...to test the other automation api wrappers, I need to create an automation!
		});
	}

	// Batches Endpoint
	if (ctl.runAll || ctl.runBatchOps) {
		describe("Batches", function () {
			describe("smci.batchOps dummy test", function () {
				it("is a dummy test, since I don't yet know how to test Batch Operations...");
			});

			// ...to test the other batch operation api wrappers, I need to have a better understanding of how to use the MailChimp batch api
		});
	}

	// Campaign Folders Endpoint
	if (ctl.runAll || ctl.runCampaignFolders) {
		describe("Campaign Folders", function () {
			var campaignFolderId = "";	// nothing yet
			var campaignFolderName = "smci_unit_test_folder";
			var newFolderName = "smci_unit_test_new_folder";

			describe("smci.campaignFolders.createFolder()", function () {
				it("should create a campaign folder in MailChimp", function (done) {
					var expectedKeys = ["name", "id", "count", "_links"];
					smci.campaignFolders.createFolder(campaignFolderName, function (response, error) {
						assert.isNull(error);
						assert.hasAllKeys(response, expectedKeys);
						if (error === null) {
							campaignFolderId = response.id;
							done();
						} else {
							done(error);
						}
					});
				});
			});

			describe("smci.campaignFolders.getFullList()", function () {
				it("should acquire a full list of campaign folders from MailChimp", function (done) {
					var expectedKeys = ["folders", "total_items", "_links"];
					smci.campaignFolders.getFullList(null, function (response, error) {
						assert.isNull(error);
						assert.hasAllKeys(response, expectedKeys);
						done();
					});
				});
			});

			describe("smci.campaignFolders.getFolder()", function () {
				it("should acquire information about the folder we previously created", function (done) {
					var expectedKeys = ["name", "id", "count", "_links"];
					smci.campaignFolders.getFolder(campaignFolderId, null, function (response, error) {
						assert.isNull(error);
						assert.hasAllKeys(response, expectedKeys);
						assert.strictEqual(response.id, campaignFolderId);
						assert.strictEqual(response.name, campaignFolderName);
						done();
					});
				});
			});

			describe("smci.campaignFolders.editFolder()", function () {
				it("should change the campaign folder name", function (done) {
					var expectedKeys = ["name", "id", "count", "_links"];
					smci.campaignFolders.editFolder(campaignFolderId, newFolderName, function (response, error) {
						assert.isNull(error);
						assert.hasAllKeys(response, expectedKeys);
						assert.strictEqual(response.id, campaignFolderId);
						assert.strictEqual(response.name, newFolderName);
						done();
					});
				});
			});

			describe("smci.campaignFolders.deleteFolder()", function () {
				it("should delete the folder we created/updated", function (done) {
					var keysOfAnErrorResponse = ["type", "title", "status", "detail", "instance"];
					smci.campaignFolders.deleteFolder(campaignFolderId, function (response, error) {
						assert.isNull(error);
						assert.doesNotHaveAnyKeys(response, keysOfAnErrorResponse);
						done();
					});
				});
			});
		});
	}

	// Campaigns
	if (ctl.runAll || ctl.runCampaigns) {
		describe("Campaigns", function () {
			var testCampaignID = "e6e3985d78";	// id of a campaign existing in the MailChimp Account; will reassign after creating the campaign
			var testCampaignListID = "9e8ae49d3e";	// id of a list existing in the MailChimp Account
			var testCopyCampaignID = "";	// will populate after copying a campaign
			
			// describe("smci.campaigns.create()", function () {
			// 	it("should create a MailChimp email campaign", function (done) {
			// 		var expectedKeys = [
			// 			"id",
			// 			"web_id",
			// 			"type",
			// 			"create_time",
			// 			"archive_url",
			// 			"long_archive_url",
			// 			"status",
			// 			"emails_sent",
			// 			"send_time",
			// 			"content_type",
			// 			"needs_block_refresh",
			// 			"recipients",
			// 			"settings",
			// 			// "variate_settings",	// situational
			// 			"tracking",
			// 			// "rss_opts",	// situational
			// 			// "ab_split_opts",	// situational
			// 			// "social_card",	// situational
			// 			// "report_summary",	// situational
			// 			"delivery_status",
			// 			"_links"
			// 		];
			// 		var requestBody = {
			// 			"recipients": {
			// 				"list_id": testCampaignListID	// Test List
			// 			},
			// 			"type": "regular",
			// 			"settings": {
			// 				"subject_line": "SCE SMCI Campaign API Test",
			// 				"title": "Test of SCE SMCI",
			// 				"reply_to": smci_settings.accountEmail,
			// 				"from_name": "SCE SMCI"
			// 			}
			// 		};	// dummy data, you need to make a real list first!
			// 		smci.campaigns.create(requestBody, function (response, error) {
			// 			assert.isNull(error);
			// 			if (error === null) {
			// 				testCampaignID = response.id;
			// 			}
			// 			assert.hasAllKeys(response, expectedKeys);
			// 			done();
			// 		});
			// 	});
			// });

			// describe("smci.campaigns.getFullList()", function () {
			// 	it("should acquire a list of all campaigns", function (done) {
			// 		var expectedKeys = [
			// 			"campaigns",
			// 			"total_items",
			// 			"_links"
			// 		];

			// 		smci.campaigns.getFullList(null, function (response, error) {
			// 			console.log(JSON.stringify(response));
			// 			assert.isNull(error);
			// 			assert.containsAllKeys(response, expectedKeys);
			// 			done();
			// 		});
			// 	});
			// });

			describe("smci.campaigns.getCampaignInfo()", function () {
				it("should acquire info about the created campaign", function (done) {
					var expectedKeys = [
						"id",
						"web_id",
						"type",
						"create_time",
						"archive_url",
						"long_archive_url",
						"status",
						"emails_sent",
						"send_time",
						"content_type",
						"needs_block_refresh",
						"recipients",
						"settings",
						// "variate_settings",	// situational
						"tracking",
						// "rss_opts",	// situational
						// "ab_split_opts",	// situational
						// "social_card",	// situational
						// "report_summary",	// situational
						"delivery_status",
						"_links"
					];

					smci.campaigns.getCampaignInfo(testCampaignID, null, function (response, error) {
						console.log(JSON.stringify(response));	// debug
						assert.isNull(error);
						assert.containsAllKeys(response,expectedKeys);
						done();
					});
				});
			});

			// describe("smci.campaigns.editCampaignInfo", function () {
			// 	it("should update the settings for the campaign we created", function (done) {
			// 		var expectedKeys = [
			// 			"id",
			// 			"web_id",
			// 			"type",
			// 			"create_time",
			// 			"archive_url",
			// 			"long_archive_url",
			// 			"status",
			// 			"emails_sent",
			// 			"send_time",
			// 			"content_type",
			// 			"needs_block_refresh",
			// 			"recipients",
			// 			"settings",
			// 			// "variate_settings",	// situational
			// 			"tracking",
			// 			// "rss_opts",	// situational
			// 			// "ab_split_opts",	// situational
			// 			// "social_card",	// situational
			// 			// "report_summary",	// situational
			// 			"delivery_status",
			// 			"_links"
			// 		];
			// 		var newSettings = {
			// 			"settings": {
			// 				"auto_footer": true
			// 			}
			// 		};

			// 		smci.campaigns.editCampaignInfo(testCampaignID, newSettings, function (response, error) {
			// 			assert.isNull(error);
			// 			assert.containsAllKeys(response, expectedKeys);
			// 			done();
			// 		});
			// 	});
			// });

			// describe("smci.campaigns.search()", function () {
			// 	it("should find all campaigns containing the search term", function (done) {
			// 		var expectedKeys = [
			// 			// "results",	// situational
			// 			"total_items",
			// 			"_links"
			// 		];
			// 		var searchTerm = {"query": "test"};
			// 		smci.campaigns.search(searchTerm, function (response, error) {
			// 			assert.isNull(error);
			// 			assert.containsAllKeys(response, expectedKeys);
			// 			done();
			// 		});
			// 	});
			// 	it("should fail when passing nothing to the querystring", function (done) {
			// 		var keysOfAnErrorResponse = ["detail", "instance", "status", "title", "type"];
			// 		smci.campaigns.search(null, function (response, error) {
			// 			assert.isNull(error);
			// 			if (typeof response.total_items !== "undefined" && response.total_items !== 0) {
			// 				expectedKeys.push("results");	// handles situational case
			// 			}
			// 			assert.hasAllKeys(response, keysOfAnErrorResponse);
			// 			done();
			// 		});
			// 	});
			// });

			describe("smci.campaigns.pauseCampaign()", function () {	// only works with an RSS campaign
				it("shouldn't be tested unless you create your own RSS campaign using SMCI");
				// it("should pause the created campaign", function (done) {
				// 	var keysOfAnErrorResponse = [
				// 		"type",
				// 		"title",
				// 		"status",
				// 		"detail",
				// 		"instance"
				// 	];

				// 	smci.campaigns.pauseCampaign(testCampaignID, function (response, error) {
				// 		console.log(error);
				// 		assert.isNull(error);
				// 		assert.doesNotHaveAnyKeys(response, keysOfAnErrorResponse);
				// 		done();
				// 	});
				// });
			});

			// describe("smci.campaigns.copyCampaign()", function () {
			// 	it("should copy the campaign we created", function (done) {
			// 		var expectedKeys = [
			// 			"id",
			// 			"web_id",
			// 			"type",
			// 			"create_time",
			// 			"archive_url",
			// 			"long_archive_url",
			// 			"status",
			// 			"emails_sent",
			// 			"send_time",
			// 			"content_type",
			// 			"needs_block_refresh",
			// 			"recipients",
			// 			"settings",
			// 			// "variate_settings",	// situational
			// 			"tracking",
			// 			// "rss_opts",	// situational
			// 			// "ab_split_opts",	// situational
			// 			// "social_card",	// situational
			// 			// "report_summary",	// situational
			// 			"delivery_status",
			// 			"_links"
			// 		];

			// 		smci.campaigns.copyCampaign(testCampaignID, function (response, error) {
			// 			assert.isNull(error);
			// 			if (error === null) {
			// 				testCopyCampaignID = response.id;
			// 			}
			// 			assert.containsAllKeys(response, expectedKeys);
			// 			done();
			// 		});
			// 	});
			// });

			describe("smci.campaigns.resumeCampaign()", function () {	// only works with an RSS campaign
				it("shouldn't be tested unless you create your own RSS campaign using SMCI");
			});

			// describe("smci.campaigns.scheduleCampaign()", function () {
			// 	it("should schedule the created campaign for delivery", function (done) {
			// 		var keysOfAnErrorResponse = [
			// 			"type",
			// 			"title",
			// 			"status",
			// 			"detail",
			// 			"instance"
			// 		];
			// 		var currentDate = new Date(Date.now());
			// 		var requestBody = {
			// 			// "schedule_time": formatUtcString(new Date(Date.now), true, true),
			// 			"schedule_time": toMailChimpUtcStr(currentDate),
			// 			"timewarp": false
			// 		};
					
			// 		smci.campaigns.scheduleCampaign(testCampaignID, requestBody, function (response, error) {
			// 			assert.isNull(error);
			// 			assert.doesNotHaveAnyKeys(response, keysOfAnErrorResponse);
			// 			done();
			// 		});
			// 	});
			// });

			// describe("smci.campaigns.unscheduleCampaign()", function () {
			// 	it("should unschedule the created campaign", function (done) {
			// 		var keysOfAnErrorResponse = [
			// 			"type",
			// 			"title",
			// 			"status",
			// 			"detail",
			// 			"instance"
			// 		];

			// 		smci.campaigns.unscheduleCampaign(testCampaignID, function (response, error) {
			// 			assert.isNull(error);
			// 			assert.doesNotHaveAnyKeys(response, keysOfAnErrorResponse);
			// 			done();
			// 		});
			// 	});
			// });

			// describe("smci.campaigns.sendTestEmail()", function () {
			// 	it("should send a test email to the following recipients", function (done) {
			// 		var keysOfAnErrorResponse = [
			// 			"type",
			// 			"title",
			// 			"status",
			// 			"detail",
			// 			"instance"
			// 		];
			// 		var recipients = ["rjavier443@gmail.com", "rjavier.engr@gmail.com"];	// insert your test email recipients here...
			// 		var requestBody = {
			// 			"test_emails": recipients,
			// 			"send_type": "html"
			// 		};

			// 		smci.campaigns.sendTestEmail(testCampaignID, requestBody, function (response, error) {
			// 			assert.isNull(error);
			// 			assert.doesNotHaveAnyKeys(response, keysOfAnErrorResponse);
			// 			done();
			// 		});
			// 	});
			// });

			// describe("smci.campaigns.sendCampaign()", function () {
			// 	it("should send the campaign", function (done) {
			// 		var keysOfAnErrorResponse = [
			// 			"type",
			// 			"title",
			// 			"status",
			// 			"detail",
			// 			"instance"
			// 		];

			// 		smci.campaigns.sendCampaign(testCampaignID, function (response, error) {
			// 			assert.isNull(error);
			// 			assert.doesNotHaveAnyKeys(response, keysOfAnErrorResponse);
			// 			done();
			// 		});
			// 	});
			// });

			// describe("smci.campaigns.getChecklist()", function () {
			// 	it("should acquire the campaign's readiness checklist", function (done) {
			// 		var expectedKeys = [
			// 			"is_ready",
			// 			"items",
			// 			"_links"
			// 		];

			// 		smci.campaigns.getChecklist(testCampaignID, null, function (response, error) {
			// 			console.log(JSON.stringify(response));
			// 			assert.isNull(error);
			// 			assert.containsAllKeys(response, expectedKeys);
			// 			done();
			// 		});
			// 	});
			// });

			// describe("smci.campaigns.deleteCampaign()", function () {
			// 	it("should delete the campaign we created", function (done) {
			// 		var keysOfAnErrorResponse = ["type", "title", "status", "detail", "instance"];

			// 		smci.campaigns.deleteCampaign(testCampaignID, function (response, error) {	// delete the first campaign we created
			// 			assert.isNull(error, "deletion of created campaign");
			// 			assert.doesNotHaveAnyKeys(response, keysOfAnErrorResponse, "deletion of created campaign");

			// 			smci.campaigns.deleteCampaign(testCopyCampaignID, function (response, error) {
			// 				assert.isNull(error, "deletiong of copy campaign");
			// 				assert.doesNotHaveAnyKeys(response, keysOfAnErrorResponse, "deletion of copy campaign");
			// 				done();
			// 			});
			// 		});
			// 	});
			// });
		});
	}

	// Lists
	if (ctl.runAll || ctl.runLists) {
		describe("Lists", function () {
			var testListName = "smci_test_list";
			var testListContact = {
				"company": "Software and Computer Engineering Society",
				"address1": "1 Washington Square",
				"city": "San Jose",
				"state": "California",
				"zip": "95112",	// must be a STRING, else MailChimp returns error
				"country": "US"
			};
			var testListPermissionReminder = "You subscribed to this email because you agreed to help test the development of SCE Core v4";
			var testListCampaignDefaults = {
				"from_name": smci_settings.anystring,
				"from_email": smci_settings.accountEmail,
				"subject": "SMCI Test",
				"language": "English"
			};
			var testListID = null;	// will assign after list creation
			var testListNewMemberID = null;	// will assign after member addition

			describe("smci.lists.createList()", function () {
				it("should create a MailChimp mailing list", function (done) {
					var expectedKeys = ["id", "web_id", "name", "contact", "permission_reminder", "use_archive_bar", "campaign_defaults", "notify_on_subscribe", "notify_on_unsubscribe", "date_created", "list_rating", "email_type_option", "subscribe_url_short", "subscribe_url_long", "beamer_address", "visibility", "modules", "stats", "_links"];
					var requestBody = {
						"name": testListName,
						"contact": testListContact,
						"permission_reminder": testListPermissionReminder,
						"campaign_defaults": testListCampaignDefaults,
						"email_type_option": false
					};

					smci.lists.createList(requestBody, function (response, error) {
						assert.isNull(error);
						assert.containsAllKeys(response, expectedKeys);
						if (error === null) {
							testListID = response.id;
							done();
						} else {
							done(error);
						}
					});
				});
			});

			describe("smci.lists.getFullList()", function () {
				it("should acquire a full list of mailing lists", function (done) {
					var expectedKeys = ["lists", "total_items", "_links"];
					smci.lists.getFullList(null, function (response, error) {
						assert.isNull(error);
						assert.containsAllKeys(response, expectedKeys);
						done();
					});
				});
			});

			describe("smci.lists.batchListMembers()", function () {
				it("should add new list members to the created list", function (done) {
					var expectedKeys = ["new_members", "updated_members", "errors", "total_created", "total_updated", "error_count", "_links"];
					var requestBody = {
						"members": [
							formatListEmailObj("rjavier441@gmail.com", "html", "subscribed", {}, {}, "English", true, -121, 37, "", "", "", ""),
							formatListEmailObj("rjavier443@gmail.com", "text", "subscribed", {}, {}, "English", true, -121, 37, "", "", "", "")
						],
						"updated_existing": false
					};

					smci.lists.batchListMembers(testListID, requestBody, function (response, error) {
						assert.isNull(error);
						assert.containsAllKeys(response, expectedKeys);
						done();
					});
				});
			});

			describe("smci.lists.getListInfo()", function () {
				it("should acquire the created list's info", function (done) {
					var expectedKeys = ["id", "web_id", "name", "contact", "permission_reminder", "use_archive_bar", "campaign_defaults", "notify_on_subscribe", "notify_on_unsubscribe", "date_created", "list_rating", "email_type_option", "subscribe_url_short", "subscribe_url_long", "beamer_address", "visibility", "modules", "stats", "_links"];
					
					smci.lists.getListInfo(testListID, null, function (response, error) {
						assert.isNull(error);
						assert.containsAllKeys(response, expectedKeys);
						done();
					});
				});
			});

			describe("smci.lists.editListSettings()", function () {
				it("should change the created list's settings", function (done) {
					var expectedKeys = ["id", "web_id", "name", "contact", "permission_reminder", "use_archive_bar", "campaign_defaults", "notify_on_subscribe", "notify_on_unsubscribe", "date_created", "list_rating", "email_type_option", "subscribe_url_short", "subscribe_url_long", "beamer_address", "visibility", "modules", "stats", "_links"];
					var requestBody = {
						"name": testListName,
						"contact": testListContact,
						"permission_reminder": "This is the NEW permission_reminder to remind you that you are signed up for this email since you are helping to test SCE Core v4 (still in development)",
						"campaign_defaults": testListCampaignDefaults,
						"email_type_option": true
					};

					smci.lists.editListSettings(testListID, requestBody, function (response, error) {
						assert.isNull(error);
						assert.containsAllKeys(response, expectedKeys);
						done();
					});
				});
			});

			describe("smci.lists.addListMember()", function () {
				it("should add a new recipient to the created list", function (done) {
					var expectedKeys = [
						"id",
						"email_address",
						"unique_email_id",
						"email_type",
						"status",
						// "unsubscribe_reason",	// situational?
						"merge_fields",
						// "interests",	// situational?
						"stats",
						"ip_signup",
						"timestamp_signup",
						"ip_opt","timestamp_opt",
						"member_rating",
						"last_changed",
						"language",
						"vip",
						"email_client",
						"location",
						// "last_note",	// situational?
						"list_id",
						"_links"
					];
					var requestBody = {
						"email_address": "rjavier.engr@gmail.com",
						"status": "subscribed"
					};

					smci.lists.addListMember(testListID, requestBody, function (response, error) {
						assert.isNull(error);
						assert.containsAllKeys(response, expectedKeys);
						if (error === null) {
							testListNewMemberID = response.id;
							done();
						} else {
							done(error);
						}
					});
				});
			});

			describe("smci.lists.getListMembers()", function () {
				it("should acquire a full list of members in the created list", function (done) {
					var expectedKeys = [
						"members",
						"list_id",
						"total_items",
						"_links"
					];

					smci.lists.getListMembers(testListID, null, function (response, error) {
						assert.isNull(error);
						assert.containsAllKeys(response, expectedKeys);
						done();
					});
				});
			});

			describe("smci.lists.editListMember()", function () {
				it("should edit the list member previously added", function (done) {
					var expectedKeys = [
						"id",
						"email_address",
						"unique_email_id",
						"email_type",
						"status",
						// "unsubscribe_reason",	// situational?
						"merge_fields",
						// "interests",	// situational?
						"stats",
						"ip_signup",
						"timestamp_signup",
						"ip_opt",
						"timestamp_opt",
						"member_rating",
						"last_changed",
						"language",
						"vip",
						"email_client",
						"location",
						// "last_note",	// situational?
						"list_id",
						"_links"
					];
					var requestBody = {
						"email_type": "text",
						"vip": false
					};

					smci.lists.editListMember(testListID, testListNewMemberID, requestBody, function (response, error) {
						assert.isNull(error);
						assert.containsAllKeys(response, expectedKeys);
						done();
					});
				});
			});

			describe("smci.lists.removeListMember()", function () {
				it("should remove the list member we added", function (done) {
					var keysOfAnErrorResponse = [
						"type",
						"title",
						"status",
						"detail",
						"instance"
					];

					smci.lists.removeListMember(testListID, testListNewMemberID, function (response, error) {
						assert.isNull(error);
						assert.doesNotHaveAnyKeys(response, keysOfAnErrorResponse);
						done();
					});
				});
			});

			describe("smci.lists.deleteList()", function () {
				it("should delete the list we created earlier", function (done) {
					var keysOfAnErrorResponse = ["type", "title", "status", "detail", "instance"];
					smci.lists.deleteList(testListID, function (response, error) {
						assert.isNull(error);
						assert.doesNotHaveAnyKeys(response, keysOfAnErrorResponse);
						done();
					});
				});
			});

			describe("smci.lists.searchMembers()", function () {
				it("should list all members fitting the search query", function (done) {
					var expectedKeys = ["exact_matches", "full_search", "_links"];
					var qsObj = {
						"query": "rj"
					};
					smci.lists.searchMembers(qsObj, function (response, error) {
						assert.isNull(error);
						assert.containsAllKeys(response, expectedKeys);
						done();
					});
				});
			});
		});
	}

	// Template Folders
	if (ctl.runAll || ctl.runTemplateFolders) {
		describe("Template Folders", function () {
			var createdFolderName = "SCE SMCI Test Template Folder";
			var createdFolderNewName = "SCE SMCI Test Other Name Folder";
			var createdFolderID = "";	// will reassign after folder creation

			describe("smci.templateFolders.createFolder()", function () {
				it("should create a folder for email templates", function (done) {
					var expectedKeys = [
						"name",
						"id",
						"count",
						"_links"
					];

					smci.templateFolders.createFolder(createdFolderName, function (response, error) {
						assert.isNull(error);
						assert.containsAllKeys(response, expectedKeys);
						if (error === null) {
							createdFolderID = response.id;
						}
						done();
					});
				});
			});

			describe("smci.templateFolders.getFullList()", function () {
				it("should acquire a full list of template folders", function (done) {
					var expectedKeys = [
						"folders",
						"total_items",
						"_links"
					];

					smci.templateFolders.getFullList(null, function (response, error) {
						console.log(JSON.stringify(response));	// debug
						assert.isNull(error);
						assert.containsAllKeys(response, expectedKeys);
						done();
					});
				});
			});

			describe("smci.templateFolders.getFolder()", function () {
				it("should acquire info about the created folder", function (done) {
					var expectedKeys = [
						"name",
						"id",
						"count",
						"_links"
					];

					smci.templateFolders.getFolder(createdFolderID, null, function (response, error) {
						assert.isNull(error);
						assert.containsAllKeys(response, expectedKeys);
						done();
					});
				});
			});

			describe("smci.templateFolders.editFolder()", function () {
				it("should change the name of the created folder", function (done) {
					var expectedKeys = [
						"name",
						"id",
						"count",
						"_links"
					];

					smci.templateFolders.editFolder(createdFolderID, createdFolderNewName, function (response, error) {
						assert.isNull(error);
						assert.containsAllKeys(response, expectedKeys);
						done();
					});
				});
			});

			describe("smci.templateFolders.deleteFolder()", function () {
				it("should delete the folder we created", function (done) {
					var keysOfAnErrorResponse = [
						"type",
						"title",
						"status",
						"detail",
						"instance"
					];

					smci.templateFolders.deleteFolder(createdFolderID, function (response, error) {
						assert.isNull(error);
						assert.doesNotHaveAnyKeys(response, keysOfAnErrorResponse);
						done();
					});
				});
			});
		});
	}

	// Templates
	if (ctl.runAll || ctl.runTemplates) {
		describe("Templates", function () {
			var createdTemplateName = "SCE SMCI Test Template";
			var createdTemplateID = "";	// will reassign after creation of template

			describe("smci.templates.createTemplate()", function () {
				it("should create a new email template", function (done) {
					var expectedKeys = [
						"id",
						"type",
						"name",
						"drag_and_drop",
						"responsive",
						"category",
						"date_created",
						"created_by",
						"active",
						// "folder_id",	// situational
						"thumbnail",
						"share_url",
						"_links"
					];
					var folderID = null;
					var content = "<p>This is some random html that I've placed within the email!</p>";

					smci.templates.createTemplate(createdTemplateName, folderID, content, function (response, error) {
						// console.log(JSON.stringify(response));	// debug
						assert.isNull(error);
						assert.containsAllKeys(response, expectedKeys);
						if (error === null) {
							createdTemplateID = response.id;
						}
						done();
					});
				});
			});

			describe("smci.templates.getFullList()", function () {
				it("should acquire a full list of email templates", function (done) {
					var expectedKeys = [
						"templates",
						"total_items",
						"_links"
					];

					smci.templates.getFullList(null, function (response, error) {
						// console.log(JSON.stringify(response));	// debug
						assert.isNull(error);
						assert.containsAllKeys(response, expectedKeys);
						done();
					});
				});
			});

			describe("smci.templates.getTemplateInfo()", function () {
				it("should acquire info about the created template", function (done) {
					var expectedKeys = [
						"id",
						"type",
						"name",
						"drag_and_drop",
						"responsive",
						"category",
						"date_created",
						"created_by",
						"active",
						// "folder_id",	// situational
						"thumbnail",
						"share_url",
						"_links"
					];

					smci.templates.getTemplateInfo(createdTemplateID, null, function (response, error) {
						// console.log(JSON.stringify(response));	// debug
						assert.isNull(error);
						assert.containsAllKeys(response, expectedKeys);
						done();
					});
				});
			});

			describe("smci.templates.editTemplateName()", function () {
				it("should edit just the name of the template", function (done) {
					var expectedKeys = [
						"id",
						"type",
						"name",
						"drag_and_drop",
						"responsive",
						"category",
						"date_created",
						"created_by",
						"active",
						// "folder_id",	// situational
						"thumbnail",
						"share_url",
						"_links"
					];

					smci.templates.editTemplateName(createdTemplateID, "some new name", function (response, error) {
						assert.isNull(error);
						assert.containsAllKeys(response, expectedKeys);
						done();
					});
				});
			});

			describe("smci.templates.editTemplateContent()", function () {
				it("should edit just the HTML content of the template", function (done) {
					var expectedKeys = [
						"id",
						"type",
						"name",
						"drag_and_drop",
						"responsive",
						"category",
						"date_created",
						"created_by",
						"active",
						// "folder_id",	// situational
						"thumbnail",
						"share_url",
						"_links"
					];

					smci.templates.editTemplateName(createdTemplateID, "<p>some new html content</p>", function (response, error) {
						assert.isNull(error);
						assert.containsAllKeys(response, expectedKeys);
						done();
					});
				});
			});

			describe("smci.templates.moveTemplate()", function () {
				it("should change the location of the template", function (done) {
					var expectedKeys = [
						"id",
						"type",
						"name",
						"drag_and_drop",
						"responsive",
						"category",
						"date_created",
						"created_by",
						"active",
						// "folder_id",	// situational
						"thumbnail",
						"share_url",
						"_links"
					];
					var testFolderID = "ea54d3c058";	// exists as "SCE SMCI Test Templates"

					smci.templates.editTemplateName(createdTemplateID, testFolderID, function (response, error) {
						assert.isNull(error);
						assert.containsAllKeys(response, expectedKeys);
						done();
					});
				});
			});

			describe("smci.templates.deleteTemplate()", function () {
				it("should delete the created template", function (done) {
					var keysOfAnErrorResponse = [
						"type",
						"title",
						"status",
						"detail",
						"instance"
					];

					smci.templates.deleteTemplate(createdTemplateID, function (response, error) {
						// console.log(response);	// debug - do not JSON.stringify; response has a circular structure in it
						assert.isNull(error);
						assert.doesNotHaveAnyKeys(response, keysOfAnErrorResponse);
						done();
					});
				});
			});
		});
	}
});



// Utility Functions
/*
	@function 	toMailChimpUtcStr
	@parameter 	dateObj - an object of type Date specifying the current datetime
	@returns 	The formatted date string
	@details 	This function formats the "dateObj" parameter's ISO (UTC) string to conform to the MailChimp UTC time standards for scheduling campaigns. As of API v3.0, MailChimp only accepts time scheduling in blocks of 15 minutes.
*/
function toMailChimpUtcStr (dateObj) {
	var currentMinutes = dateObj.getMinutes();
	if (currentMinutes < 15) {
		dateObj.setMinutes(15);
	} else if (currentMinutes < 30) {
		dateObj.setMinutes(30);
	} else if (currentMinutes < 45) {
		dateObj.setMinutes(45);
	} else {
		dateObj.setMinutes(0);
		dateObj.setHours(dateObj.getHours() + 1);	// Date.setHours() automatically handles going out of range of 0-23
	}

	return dateObj.toISOString();
}

/*
	@function 	formatListEmailObj
	@parameter 	email_address - the email address to add to the batch operation's list recipients
	@parameter 	email_type - the email type ""
	@parameter 	status - the email status ""
	@parameter 	merge_fields - the merge tag(s) ""
	@parameter 	interests - the interests of the recipient ""
	@parameter 	languange - the primary language used by the recipient ""
	@parameter 	vip - the vip status of the recipient ""
	@parameter 	locationLat - the latitude location of the recipient ""
	@parameter 	locationLong - the longitude location of the recipient ""
	@parameter 	ip_signup - the signup ip address used by the recipient ""
	@parameter 	timestamp_signup - the timestamp marking the signup time of the recipient ""
	@parameter 	ip_opt - the opt ip used by the recipient ""
	@parameter 	timestamp_opt - the timestamp marking the opt time of the recipient ""
	@returns 	The email object expected by the smci.lists.batchListMembers() request body members parameter.
	@details 	This function creates an email object expected by a list batch operation when adding members to the list.
*/
function formatListEmailObj (email_address, email_type, status, merge_fields, interests, language, vip, locationLat, locationLong, ip_signup, timestamp_signup, ip_opt, timestamp_opt) {
	var obj = {
		"email_address": email_address,
		"email_type": email_type,
		"status": status,
		"merge_fields": merge_fields,
		"interests": interests,
		"language": language,
		"vip": vip,
		"location": {
			"latitude": locationLat,
			"longitude": locationLong,
		},
		"ip_signup": ip_signup,
		"timestamp_signup": timestamp_signup,
		"ip_opt": ip_opt,
		"timestamp_opt": timestamp_opt
	};

	return obj;
}

// END test_smci.js
