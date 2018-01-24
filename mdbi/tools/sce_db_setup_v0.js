//	PROJECT: 		Core-v4
// 	Name: 			Rolando Javier
// 	File: 			sce_db_setup_v0.js
// 	Date Created: 	January 22, 2018
// 	Last Modified: 	January 22, 2018
// 	Details:
// 					This file contains the setup script for the SCE MongoDB. It creates the necessary database collections if they don't already exist.
//					The script can be run using the command "node sce_db_setup.js", but can also be controlled manually by passing in a third argument after the file name:
//						"--stats"
//										This command prints database statistics. Useful for determing the db size if the db exists.
//						"--init"
//										This command makes sure to create the necessary database collections if they do not exist. This is the default behavior if the third parameter was omitted.
// 	Dependencies:
// 					n/a

"use strict"

// Includes
var settings = require("../../util/settings");
var credentials = require(settings.credentials).mdbi;
var assert = require("assert");
var arg = process.argv[2];
var mongo_settings = require("../mongo_settings");
var mongo = require("mongodb").MongoClient;
var mdb = require("../mongoWrapper");	// acquire MongoDB API Wrappers

// Globals
var mongoOptions = {
	"appname": "SCE DB Setup v0"
};
var placeholders = {
	"serverActivations": {
		"login": "placeholder"
	},
	"Member": {
		"memberID": 0,
		"firstName": "placeholder",
		"middleInitial": "p",
		"lastName": "placeholder",
		"joinDate": "placeholder",
		"userName": "placeholder",
		"passWord": "placeholder",
		"email": "placeholder",
		"major": "placeholder",
		"lastLogin": "placeholder"
	},
	"MembershipData": {
		"memberID": 0,
		"startTerm": "placeholder",
		"endTerm": "placeholder",
		"doorCodeID": "placeholder",
		"gradDate": "placeholder",
		"level": 0,
		"membershipStatus": true
	},
	"DoorCode": {
		"dcID": 0,
		"code": "placeholder"
	},
	"ClearanceLevel": {
		"cID": 0,
		"levelName": "placeholder",
		"abilities": []
	},
	"Ability": {
		"abilityID": 0,
		"abilityName": "placeholder"
	},
	"SessionData": {
		"sessionID": 0,
		"memberID": 0,
		"loginTime": "placeholder",
		"lastActivity": "placeholder"
	},
	"Announcement": {
		"aID": 0,
		"senderID": 0,
		"title": "placeholder",
		"msgContent": "placeholder",
		"imgPath": "placeholder"
	}
};
var url = `mongodb://${encodeURIComponent(credentials.user)}:${encodeURIComponent(credentials.pwd)}@${mongo_settings.hostname}:${mongo_settings.port}/${mongo_settings.database}`;

// BEGIN Database Client
if (arg === "--help") {
	help();
} else {
	mongo.connect(url, function (err, db) {
		console.log("Server connection established. Authenticating...");

		// Authenticate
		if (!err) {
			console.log("Auth Successful...");

			// Handle arguments
			switch (arg) {
				// Get database stats
				case "--stats": {
					console.log("Getting db statistics...");
					db.command({"dbStats": 1}, function (err, results) {
						if (err) {
							console.log((typeof err === "object") ? JSON.stringify(err) : err);
						} else {
							console.log(results);
						}

						// End database connection
						endSession(db);
					});
					break;
				}

				// Initialize database
				default: {
					console.log("Initializing db to SCE specifications...");

					// Manually create the required collections using MongoDB functions (do not use Mongo Wrappers, since they have a security feature that blocks the creation of new collections that do not exist)...
					mdb.database = db;
					var promiseServerActivations = new Promise (function (resolve, reject) {
						db.collection("serverActivations").insertOne(placeholders.serverActivations, null, function (error, result) {
							if (error) {
								console.log(`Error creating collection serverActivations: ${error}`);
							} else {
								resolve();
							}
						});
					});
					var promiseMember = new Promise (function (resolve, reject) {
						db.collection("Member").insertOne(placeholders.Member, null, function (error, result) {
							if (error) {
								console.log(`Error creating collection Member: ${error}`);
							} else {
								resolve();
							}
						});
					});
					var promiseMembershipData = new Promise (function (resolve, reject) {
						db.collection("MembershipData").insertOne(placeholders.MembershipData, null, function (error, result) {
							if (error) {
								console.log(`Error creating collection MembershipData: ${error}`);
							} else {
								resolve();
							}
						});
					});
					var promiseDoorCode = new Promise (function (resolve, reject) {
						db.collection("DoorCode").insertOne(placeholders.DoorCode, null, function (error, result) {
							if (error) {
								console.log(`Error creating collection DoorCode: ${error}`);
							} else {
								resolve();
							}
						});
					});
					var promiseClearanceLevel = new Promise (function (resolve, reject) {
						db.collection("ClearanceLevel").insertOne(placeholders.ClearanceLevel, null, function (error, result) {
							if (error) {
								console.log(`Error creating collection ClearanceLevel: ${error}`);
							} else {
								resolve();
							}
						});
					});
					var promiseAbility = new Promise (function (resolve, reject) {
						db.collection("Ability").insertOne(placeholders.Ability, null, function (error, result) {
							if (error) {
								console.log(`Error creating collection Ability: ${error}`);
							} else {
								resolve();
							}
						});
					});
					var promiseSessionData = new Promise (function (resolve, reject) {
						db.collection("SessionData").insertOne(placeholders.SessionData, null, function (error, result) {
							if (error) {
								console.log(`Error creating collection SessionData: ${error}`);
							} else {
								resolve();
							}
						});
					});
					var promiseAnnouncement = new Promise (function (resolve, reject) {
						db.collection("Announcement").insertOne(placeholders.Announcement, null, function (error, result) {
							if (error) {
								console.log(`Error creating collection Announcement: ${error}`);
							} else {
								resolve();
							}
						});
					});

					promiseServerActivations.then((msg) => {
						promiseMember.then((msg) => {
							promiseMembershipData.then((msg) => {
								promiseDoorCode.then((msg) => {
									promiseClearanceLevel.then((msg) => {
										promiseAbility.then((msg) => {
											promiseSessionData.then((msg) => {
												promiseAnnouncement.then((msg) => {
													console.log("Setup Complete...");
													endSession(db);
												});
											});
										});
									});
								});
							});
						});
					});
					break;
				}
			}
		} else {
			// Report error and end database connection
			console.log(`Auth Failed: ${err}`);
			if (db) {
				endSession(db);
			}
		}
	});
}
// END Database Client



// BEGIN Utility Functions
/*
	@function 	endSession
	@parameter 	mongoDatabase - the MongoDB database object returned from MongoClient.connect()
	@parameter 	(optional) callback - a callback to run after completing the operation. This function is not passed any arguments.
	@returns 	n/a
	@details 	This function ends the MongoDB session by first logging out the authenticated user and closing the connection directly.
*/
function endSession (mongoDatabase, callback) {
	console.log("Ending session...");

	mongoDatabase.logout();
	mongoDatabase.close();

	if (typeof callback === "function") {
		callback();
	}
}

/*
	@function 	help
	@parameter 	n/a
	@returns 	n/a
	@details 	This function prints a help prompt to console.
*/
function help () {
	console.log("\nsce_db_setup_v0.js - The SCE Core-v4 MongoDB Schema Setup Script");
	console.log("\nCommand Synopsis:");
	console.log("\t\"node sce_db_setup_v0.js [option]\"");
	console.log("\nOptions:");
	console.log("\t--stat\n\t\tAcquires current MongoDB database statistics for the SCE database");
	console.log("\t--init\n\t\tThe default behavior; initializes the database to the structure described by schema_v0.js");
	console.log("\t--help\n\t\tRuns this help prompt");
}
// END Utility Functions



// END sce_db_setup_v0.js
