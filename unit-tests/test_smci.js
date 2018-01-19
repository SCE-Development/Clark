//	PROJECT: 		Core v4
// 	Name: 			Rolando Javier
// 	File: 			test_smci.js
// 	Date Created: 	January 17, 2018
// 	Last Modified: 	January 17, 2018
// 	Details:
// 					This file contains the unit tests for server.js's SMCI module.
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

// Silence the web request wrapper module's console logging
www.config.silence();

// For Debugging: use verbose logging
// www.config.verbose();



// SMCI Module Test
describe("SMCI Unit Tests", function () {
	// API root endpoint
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

	// Authorized Apps Endpoint
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

	// Automations Endpoint
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

	// Batches Endpoint
	describe("Batches", function () {
		describe("smci.batchOps dummy test", function () {
			it("is a dummy test, since I don't yet know how to test Batch Operations...");
		});

		// ...to test the other batch operation api wrappers, I need to have a better understanding of how to use the MailChimp batch api
	});

	// Campaign Folders Endpoint
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

	// Campaigns
	describe("Campaigns", function () {
		describe("smci.campaigns.create()", function () {
			it("should create a MailChimp email campaign", function (done) {
				var expectedKeys = ["id", "web_id", "type", "create_time", "archive_url", "long_archive_url", "status", "emails_sent", "send_time", "content_type", "needs_block_refresh", "recipients", "settings", "variate_settings", "tracking", "rss_opts", "ab_split_opts", "social_card", "report_summary", "delivery_status", "_links"];
				var requestBody = {
					"recipients": {
						"list_id": "3c307a9f3f"
					},
					"type": "regular",
					"settings": {
						"subject_line": "Your Purchase Receipt",
						"reply_to": "orders@mammothhouse.com",
						"from_name": "Customer Service"
					}
				};	// dummy data, you need to make a real list first!
				smci.campaigns.create(requestBody, function (response, error) {
					assert.isNull(error);
					assert.hasAllKeys(response, expectedKeys);
					done();
				});
			});
		});

		describe("smci.campaigns.search()", function () {
			it("should find all campaigns containing the search term", function (done) {
				var expectedKeys = ["results", "total_items", "_links"];
				var searchTerm = {"query": "test"};
				smci.campaigns.search(searchTerm, function (response, error) {
					assert.isNull(error);
					assert.containsAllKeys(response, expectedKeys);
					done();
				});
			});
			it("should fail when passing nothing to the querystring", function (done) {
				var keysOfAnErrorResponse = ["detail", "instance", "status", "title", "type"];
				smci.campaigns.search(null, function (response, error) {
					assert.isNull(error);
					assert.hasAllKeys(response, keysOfAnErrorResponse);
					done();
				});
			});
		});
	});

	// Lists
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
				
			});
		});
	});
});



// Utility Functions
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
