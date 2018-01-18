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
var www = require("../util/www.js");
var assert = chai.assert;

// Silence the web request wrapper module
www.config.silence();

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
});

// END test_smci.js
