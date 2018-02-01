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
var syskey = require(settings.credentials).syskey;
var schema = require("./schema_v0");
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
		"memberID": -1,
		"firstName": "placeholder",
		"middleInitial": "p",
		"lastName": "placeholder",
		"joinDate": "placeholder",
		"userName": "placeholder",
		"passWord": "b4ba87b48a80dbad417f853fae5f6d0d809879705d575ba0673ccf3e58eb46fd",
		"email": "placeholder",
		"major": "placeholder",
		"lastLogin": "placeholder"
	},
	"MembershipData": {
		"memberID": -1,
		"startTerm": "placeholder",
		"endTerm": "placeholder",
		"doorCodeID": "placeholder",
		"gradDate": "placeholder",
		"level": -1,
		"membershipStatus": true
	},
	"DoorCode": {
		"dcID": -1,
		"code": "placeholder"
	},
	"ClearanceLevel": {
		"cID": -1,
		"levelName": "placeholder",
		"abilities": []
	},
	"Ability": {
		"abilityID": -1,
		"abilityName": "placeholder",
		"abilityDescription": "placeholder"
	},
	"SessionData": {
		"sessionID": -1,
		"memberID": -1,
		"loginTime": "placeholder",
		"lastActivity": "placeholder",
		"maxIdleTime": -1
	},
	"Announcement": {
		"aID": -1,
		"senderID": -1,
		"title": "placeholder",
		"msgContent": "placeholder",
		"imgPath": "placeholder"
	}
};
var dbDefaults = {
	"ClearanceLevel": [
		{
			"cID": 0,
			"levelName": "Admin",
			"abilities": [0,1,2,3,4,5,6,7,8,9,10,11,12,13]
		},
		{
			"cID": 1,
			"levelName": "Officer",
			"abilities": [0,1,2,10,11,12,13]
		},
		{
			"cID": 2,
			"levelName": "Member",
			"abilities": []
		}
	],
	"Ability": [
		{
			"abilityID": 0,
			"abilityName": "Add Members",
			"abilityDescription": "This ability grants the user permission to add members to the SCE Member collection"
		},
		{
			"abilityID": 1,
			"abilityName": "Edit Members",
			"abilityDescription": "This ability grants the user permission to edit members in the SCE Member collection"
		},
		{
			"abilityID": 2,
			"abilityName": "Delete Members",
			"abilityDescription": "This ability grants the user permission to delete members from the SCE Member collection"
		},
		{
			"abilityID": 3,
			"abilityName": "Assign Officers",
			"abilityDescription": "This ability grants the user permission to assign members to officership"
		},
		{
			"abilityID": 4,
			"abilityName": "Discharge Officers",
			"abilityDescription": "This ability grants the user permission to discharge members from officership"
		},
		{
			"abilityID": 5,
			"abilityName": "Add Abilities",
			"abilityDescription": "This ability grants the user permission to add new abilities to the SCE Ability collection"
		},
		{
			"abilityID": 6,
			"abilityName": "Edit Abilities",
			"abilityDescription": "This ability grants the user permission to modify existing abilities within the SCE Ability collection"
		},
		{
			"abilityID": 7,
			"abilityName": "Delete Abilities",
			"abilityDescription": "This ability grants the user permission to delete abilities from the SCE Ability collection"
		},
		{
			"abilityID": 8,
			"abilityName": "Grant Abilities",
			"abilityDescription": "This ability grants the user permission to grant abilities to SCE Officers"
		},
		{
			"abilityID": 9,
			"abilityName": "Revoke Abilities",
			"abilityDescription": "This ability grants the user permission to revoke abilities from SCE Officers"
		},
		{
			"abilityID": 10,
			"abilityName": "Post Announcements",
			"abilityDescription": "This ability grants the user permission to post announcements to the Member Portal (and by extension, send them emails)"
		},
		{
			"abilityID": 11,
			"abilityName": "Edit Announcements",
			"abilityDescription": "This ability grants the user permission to edit announcements in the Member Portal(note that editing a posted announcement won't send another batch of emails)"
		},
		{
			"abilityID": 12,
			"abilityName": "Draft Announcements",
			"abilityDescription": "This ability grants the user permission to save incomplete announcements as drafts"
		},
		{
			"abilityID": 13,
			"abilityName": "Delete Announcements",
			"abilityDescription": "This ability grants the user permission to delete announcements"
		}
	]
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

				// Format the database
				case "--format": {
					console.log("WARNING: You are about to delete all records in the database! Are you sure? (Yes/No)");
					process.stdin.on("readable", function () {
						const chunk = process.stdin.read();
						if (chunk !== null) {
							var answer = chunk.slice(0, chunk.length - 1);
							if (answer.toString().toLowerCase() === "yes") {
								console.log("Dropping entire SCE database...");

								var deletionPromises = [];
								for (var i = 0; i < schema.collectionNames.length; i++) {
									deletionPromises[i] = new Promise(function (resolve, reject) {
										var target = schema.collectionNames[i];
										db.collection(target).deleteMany({}).then(function(result) {
											if (result.result.ok) {
												console.log(`Deleted ${target} documents`);
												resolve();
											} else {
												console.log(`Failed to delete ${target} documents`);
												reject();
											}
										});
									});
								}

								Promise.all(deletionPromises).then(function (results) {
									console.log(`Database format complete: ${results}`);
									process.kill(process.pid, "SIGINT");// needs to implement Promises
								}).catch(function (error) {
									console.log(`Failed to complete database format: ${error}`);
									process.kill(process.pid, "SIGINT");// needs to implement Promises
								});
							} else if (answer.toString().toLowerCase() === "no") {
								console.log("Aborting...");
								process.kill(process.pid, "SIGINT");
							} else {
								console.log(`I didn't understand "${answer.toString()}". Please say Yes or No...`);
							}
						}
					});
					break;
				}

				// Initialize database
				default: {
					console.log("Initializing db to SCE specifications...");

					// Manually create the required collections using MongoDB functions (do not use Mongo Wrappers, since they have a security feature that blocks the creation of new collections that do not exist)...
					mdb.database = db;
					var addServerActivations = new Promise (function (resolve, reject) {
						db.collection("serverActivations").insertOne(placeholders.serverActivations, null, function (error, result) {
							if (error) {
								console.log(`Error creating collection serverActivations: ${error}`);
								reject();
							} else {
								resolve();
							}
						});
					});
					var addMember = new Promise (function (resolve, reject) {
						db.collection("Member").insertOne(placeholders.Member, null, function (error, result) {
							if (error) {
								console.log(`Error creating collection Member: ${error}`);
								reject();
							} else {
								resolve();
							}
						});
					});
					var addMembershipData = new Promise (function (resolve, reject) {
						db.collection("MembershipData").insertOne(placeholders.MembershipData, null, function (error, result) {
							if (error) {
								console.log(`Error creating collection MembershipData: ${error}`);
								reject();
							} else {
								resolve();
							}
						});
					});
					var addDoorCode = new Promise (function (resolve, reject) {
						db.collection("DoorCode").insertOne(placeholders.DoorCode, null, function (error, result) {
							if (error) {
								console.log(`Error creating collection DoorCode: ${error}`);
								reject();
							} else {
								resolve();
							}
						});
					});
					var addClearanceLevel = new Promise (function (resolve, reject) {
						db.collection("ClearanceLevel").insertOne(placeholders.ClearanceLevel, null, function (error, result) {
							if (error) {
								console.log(`Error creating collection ClearanceLevel: ${error}`);
								reject();
							} else {
								resolve();
							}
						});
					});
					var addAbility = new Promise (function (resolve, reject) {
						db.collection("Ability").insertOne(placeholders.Ability, null, function (error, result) {
							if (error) {
								console.log(`Error creating collection Ability: ${error}`);
								reject();
							} else {
								resolve();
							}
						});
					});
					var addSessionData = new Promise (function (resolve, reject) {
						db.collection("SessionData").insertOne(placeholders.SessionData, null, function (error, result) {
							if (error) {
								console.log(`Error creating collection SessionData: ${error}`);
								reject();
							} else {
								resolve();
							}
						});
					});
					var addAnnouncement = new Promise (function (resolve, reject) {
						db.collection("Announcement").insertOne(placeholders.Announcement, null, function (error, result) {
							if (error) {
								console.log(`Error creating collection Announcement: ${error}`);
								reject();
							} else {
								resolve();
							}
						});
					});

					var addDefaultLevels = new Promise(function (resolve, reject) {
						try {
							db.collection("ClearanceLevel").insertMany(dbDefaults.ClearanceLevel);
							resolve();
						} catch (e) {
							console.log(`Error adding default levels: ${error}`);
							reject();
						}
					});

					var addDefaultAbilities = new Promise(function (resolve, reject) {
						try {
							db.collection("Ability").insertMany(dbDefaults.Ability);
							resolve();
						} catch (e) {
							console.log(`Error adding default abilities: ${error}`);
							reject();
						}
					});

					var addAdminUser = new Promise(function (resolve, reject) {
						db.collection("Member").insertOne(syskey, null, function(error, result) {
							if (error) {
								console.log(`Error creating syskey: ${error}`);
								reject();
							} else {
								resolve();
							}
						});
					});

					var addAdminMembership = new Promise(function (resolve, reject) {
						var membershipData = {
							"memberID": 0,
							"startTerm": new Date(Date.now()),
							"endTerm": new Date(Date.UTC(3005,0)),	// Jan, 3005
							"doorCodeID": 0,
							"gradDate": new Date(Date.UTC(3005,0)),	// Jan, 3005
							"level": 0,	// admin level
							"membershipStatus": true
						};
						db.collection("MembershipData").insertOne(membershipData, null, function (error, result) {
							if (error) {
								console.log(`Error adding membership data: ${error}`);
								reject();
							} else {
								resolve();
							}
						});
					});

					// Create database and apply schema
					Promise.all([
						addServerActivations,
						addMember,
						addMembershipData,
						addDoorCode,
						addClearanceLevel,
						addAbility,
						addSessionData,
						addAnnouncement,
						addDefaultLevels,
						addDefaultAbilities
					]).then(function (messages) {
						console.log(`Database schema successfully applied...`);

						// Add the root admin user
						Promise.all([
							addAdminUser,
							addAdminMembership
						]).then(function (messages) {
							console.log(`Root admin ${syskey.userName} successfully added...`);
							endSession(db);
						}).catch(function (error) {
							console.log(`Failed to add root admin: ${error}`);
							if (db) {
								endSession(db);
							}
						});
					}).catch(function (error) {
						console.log(`Failed to apply database schema: ${error}`);
						if (db) {
							endSession(db);
						}
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
	console.log("\t--format\n\t\tWARNING: This command does a complete wipe of the database (use only for debugging)");
}
// END Utility Functions



// END sce_db_setup_v0.js
