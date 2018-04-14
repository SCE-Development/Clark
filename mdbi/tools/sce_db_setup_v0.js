//	PROJECT: 		Core-v4
// 	Name: 			Rolando Javier
// 	File: 			sce_db_setup_v0.js
// 	Date Created: 	January 22, 2018
// 	Last Modified: 	March 30, 2018
// 	Dependencies:
// 					schema_v0.js (the database schema file describing the database structure)
// 					cryptic.js (for password hashing)
//					MongoDB v3.4.x or above
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
var cryptic = require(`${settings.util}/cryptic`);
var syskey = require(settings.credentials).syskey;
var schema = require("./schema_v0");
var assert = require("assert");
var arg = process.argv[2];
var args = process.argv;
var mongo_settings = require("../mongo_settings");
var mongo = require("mongodb").MongoClient;
var mdb = require("../mongoWrapper");	// acquire MongoDB API Wrappers

// Globals
var mongoOptions = {
	"appname": "SCE DB Setup v0"
};
var placeholders = require("./res/placeholders.json");
var dbDefaults = require("./res/defaults.json");

// Mock Data (member ids foreign key constraint: 0-12 are the only existing memberIDs)
var mockMembers = require("./res/mockMembers.json");
var mockMemberData = require("./res/mockMembershipData.json");
var mockAnnouncements = require("./res/mockAnnouncements.json");
var mockDoorCodes = require("./res/mockDoorCodes.json");
var url = `mongodb://${encodeURIComponent(credentials.user)}:${encodeURIComponent(credentials.pwd)}@${mongo_settings.hostname}:${mongo_settings.port}/${mongo_settings.database}?authSource=sce_core`;

// BEGIN Database Client
if (arg === "--help") {
	help();
} else {
	mongo.connect(url, mongoOptions, function (err, db) {
		console.log("Server connection established. Authenticating...");

		// Authenticate
		if (!err) {
			console.log("Auth Successful...");

			// Handle arguments
			if (args.includes("--stats")) {
				// Get database stats
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
			} else if (args.includes("--format")) {
					// Format the database
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
										db.dropCollection(target, null, function(error, result) {
												if (error) {
													console.log(`Failed to drop ${target} collection: ${error}`);
													reject();
												} else {
													console.log(`Collection ${target} dropped?: ${JSON.stringify(result)}`);
													resolve();
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
			} else if (args.includes("--init") || args.includes("--mock")) {
				// Manually create the required collections using MongoDB functions (do not use Mongo Wrappers, since they have a security feature that blocks the creation of new collections that do not exist)...
				console.log("Initializing db to SCE specifications...");
				mdb.database = db;

				// BEGIN db schema application promises
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
							// Apply Member collection index
							var indexTraits = {
								"collection": "Member",
								"iname": "sceMemberIndex",
								"fields": [
									"firstName",
									"lastName",
									"userName",
									"email"
								]
							};
							defineTextIndex(db, indexTraits, function (err, result) {
								if (err) {
									console.log(`Error indexing collection Member: ${err}`);
									reject();
								} else {
									resolve();
								}
							});
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
							// Apply Announcement collection index
							var indexTraits = {
								"collection": "Announcement",
								"iname": "sceAnnouncementIndex",
								"fields": [
									"title",
									"msgContent"
								]
							};
							defineTextIndex(db, indexTraits, function (err, result) {
								if (err) {
									console.log(`Error indexing collection Announcement: ${err}`);
									reject();
								} else {
									resolve();
								}
							});
						}
					});
				});
				var addOfficerApplication = new Promise (function (resolve, reject) {
					db.collection("OfficerApplication").insertOne(placeholders.OfficerApplication, null, function (error, result) {
						if (error) {
							console.log(`Error creating collection OfficerApplication: ${error}`);
							reject();
						} else {
							resolve();
						}
					});
				});
				// END db schema application promises

				// BEGIN db defaults promises
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
				// END db defaults promises

				// BEGIN db views application promises
				var addMemberDossierView = new Promise(function (resolve, reject) {
					var memberDossierCommand = {
						"create": "MemberDossier",
						"viewOn": "Member",
						"pipeline": [
							{
								"$lookup": {
									"from": "MembershipData",
									"localField": "memberID",
									"foreignField": "memberID",
									"as": "memPlanData"
								}
							},
							{
								"$lookup": {
									"from": "DoorCode",
									"localField": "memPlanData.doorCodeID",
									"foreignField": "dcID",
									"as": "dcInfo"
								}
							},
							{
								"$replaceRoot": {
									"newRoot": {
										"memberID": "$memberID",
										"firstName": "$firstName",
										"middleInitial": "$middleInitial",
										"lastName": "$lastName",
										"joinDate": "$joinDate",
										"userName": "$userName",
										"email": "$email",
										"emailVerified": "$emailVerified",
										"emailOptIn": "$emailOptIn",
										"major": "$major",
										"startTerm": "$memPlanData.startTerm",
										"endTerm": "$memPlanData.endTerm",
										"doorcode": "$dcInfo.code",
										"gradDate": "$memPlanDatagradDate",
										"membershipStatus": "$memPlanData.membershipStatus"
									}
								}
							},
							{
								"$unwind": "$doorcode"
							},
							{
								"$unwind": "$membershipStatus"
							},
							{
								"$unwind": "$startTerm"
							},
							{
								"$unwind": "$endTerm"
							}
						]
					};

					// If the user doesn't have the "readWrite" role, this operation may not be possible!
					try {
						db.command(memberDossierCommand, null, function (error, result) {
							if (error) {
								console.log(`Error creating MemberDossier view: ${error}`);
								reject();
							} else {
								resolve();
							}
						});
					} catch (e) {
						console.log(`Error excuting db.command(): ${e}`);
						reject();
					}
				});

				var addOfficerDossierView = new Promise(function (resolve, reject) {
					var officerDossierCommand = {
						"create": "OfficerDossier",
						"viewOn": "Member",
						"pipeline": [
							{
								"$lookup": {
									"from": "MembershipData",
									"localField": "memberID",
									"foreignField": "memberID",
									"as": "memPlanData"
								}
							},
							{
								"$match": {
									"$or": [
										{
											"memPlanData.level": 0
										},
										{
											"memPlanData.level": 1
										}
									]
								}
							},
							{
								"$lookup": {
									"from": "ClearanceLevel",
									"localField": "memPlanData.level",
									"foreignField": "cID",
									"as": "clevel"
								}
							},
							{
								"$replaceRoot": {
									"newRoot": {
										"memberID": "$memberID",
										"fullName": {
											"$concat": ["$firstName"," ", "$middleInitial", " ", "$lastName"]
										},
										"userName": "$userName",
										"email": "$email",
										"lastLogin": "$lastLogin",
										"level": "$clevel.cID",
										"levelName": "$clevel.levelName",
										"abilities": "$clevel.abilities"
									}
								}
							},
							{
								"$unwind": "$levelName"
							},
							{
								"$unwind": "$level"
							},
							{
								"$unwind": "$abilities"
							}
						]
					};

					// If the user doesn't have the "readWrite" role, this operation may not be possible!
					try {
						db.command(officerDossierCommand, null, function (error, result) {
							if (error) {
								console.log(`Error creating OfficerDossier view: ${error}`);
								reject();
							} else {
								resolve();
							}
						});
					} catch (e) {
						console.log(`Error excuting db.command(): ${e}`);
						reject();
					}
				});

				var addCoreAccessView = new Promise(function (resolve, reject) {
					var coreAccessCommand = {
						"create": "CoreAccess",
						"viewOn": "Member",
						"pipeline": [
							{
								"$lookup": {
									"from": "MembershipData",
									"localField": "memberID",
									"foreignField": "memberID",
									"as": "memPlanData"
								}
							},
							{
								"$match": {
									"$or": [
										{
											"memPlanData.level": 0
										},
										{
											"memPlanData.level": 1
										}
									]
								}
							},
							{
								"$replaceRoot": {
									"newRoot": {
										"memberID": "$memberID",
										"userName": "$userName",
										"passWord": "$passWord",
										"level": "$memPlanData.level"
									}
								}
							},
							{
								"$unwind": "$level"
							}
						]
					};

					// If the user doesn't have the "readWrite" role, this operation may not be possible!
					try {
						db.command(coreAccessCommand, null, function (error, result) {
							if (error) {
								console.log(`Error creating CoreAccess view: ${error}`);
								reject();
							} else {
								resolve();
							}
						});
					} catch (e) {
						console.log(`Error excuting db.command(): ${e}`);
						reject();
					}
				});
				// END db views application promises

				// BEGIN add mock data routine
				var addMockData = function (messages) {
					console.log(`Root admin ${syskey.userName} successfully added...`);
					if (arg === "--mock") {
						console.log("Processing Option \"--mock\"...");
						var mockInitDb = new Promise(function (resolve, reject) {
							console.log("Mock-initializing...");
							mockInit(db, resolve, reject);
						});
						Promise.all([mockInitDb]).then(function (message) {
							console.log("Successfully initialized db with mock documents...");
							endSession(db);
						}).catch(function (error) {
							console.log("Mock-initialization was unsuccessful!");
							if (db) {
								endSession(db);
							}
						});
					} else {
						endSession(db);
					}
				};
				// END add mock data routine

				// BEGIN root user application routine
				var applyRootUser = function (messages) {
					console.log(`Database views successfully created...`);

					// Add the root admin user
					Promise.all([
						addAdminUser,
						addAdminMembership
					]).then(addMockData).catch(function (error) {
						console.log(`Failed to add root admin: ${error}`);
						if (db) {
							endSession(db);
						}
					});
				};
				// END root user application routine

				// BEGIN database view creation routine
				var applyViews = function () {
					console.log(`Database schema successfully applied...`);

					// Apply the various database views
					Promise.all([
						addMemberDossierView,
						addOfficerDossierView,
						addCoreAccessView
					]).then(applyRootUser).catch(function (error) {
						console.log(`Failed to create database views: ${error}`);
						if (db) {
							endSession(db);
						}
					});
				};
				// END database view creation routine

				// BEGIN schema application routine
				var applySchema = function () {
					Promise.all([
						addServerActivations,
						addMember,
						addMembershipData,
						addDoorCode,
						addClearanceLevel,
						addAbility,
						addSessionData,
						addAnnouncement,
						addOfficerApplication,
						addDefaultLevels,
						addDefaultAbilities
					]).then(applyViews).catch(function (error) {
						console.log(`Failed to apply database schema: ${error}`);
						if (db) {
							endSession(db);
						}
					});
				};
				// END schema application routine

				// Create database and apply schema
				applySchema();
			} else {
				help();
				if (db) {
					endSession(db);
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
	@function 	defineTextIndex
	@parameter 	database - the mongo database object from MongoClient.connect()
	@parameter 	settings - a JSON object of settings that define which collection (of the specified database) to apply the text index to. It must contain the following members:
					collection - the name of the collection to index
					iname - the text index name
					fields - a string array of field names to apply text indexes to (you can specify nested fields with dot-notation, i.e. "field.nestedfield")
	@parameter 	callback - a callback function to run when the operation attempt completes. It is passed two arguments:
					error - if there was no error, this value is null; otherwise, it is a MongoError object
					result - if there was an error, this value is null; otherwise, it is an object detailing the results of the operation
	@returns 	n/a
	@details 	This function defines a Text Index for the given database with the given settings. It enables partial text searching with the db.collection(...).find() function using the "{$text: {"$search": ... }}" filter.
*/
function defineTextIndex (database, settings, callback) {
	var indexFields = {};
	var indexSettings = {
		name: settings.iname
	};

	// Created index fields
	for (var i = 0; i < settings.fields.length; i++) {
		indexFields[settings.fields[i]] = "text";
	}

	database.collection(settings.collection).createIndex(indexFields, indexSettings, callback);
}

/*
	@function 	mockInit
	@parameter 	database - the mongo database object from MongoClient.connect()
	@parameter 	resolve - the resolve object passed on by a JavaScript Promise
	@parameter 	reject - the reject object passed on by a JavaScript Promise
	@returns 	n/a
	@details 	This function executes a mock initialization of the database
*/
function mockInit (database, resolve, reject) {
	// Insert Mock Members
	database.collection("Member").insertMany(mockMembers, function (err, response) {
		if (err) {
			console.log(`Failed to insert mock members!`);
			reject();
		} else {
			// Then, insert mock Announcements
			database.collection("Announcement").insertMany(mockAnnouncements, function (err, response) {
				if (err) {
					console.log("Failed to insert mock announcements!");
					reject();
				} else {
					// Then, insert mock DoorCodes
					database.collection("DoorCode").insertMany(mockDoorCodes, function (err, response) {
						if (err) {
							console.log("Failed to insert mock door codes!");
							reject();
						} else {
							// Then, insert mock MembershipData
							database.collection("MembershipData").insertMany(mockMemberData, function (err, response) {
								if (err) {
									console.log("Failed to insert mock member data!");
									reject();
								} else {
									console.log("Mock-initialization complete")
									resolve();
								}
							});
						}
					});
				}
			});
		}
	});
}

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
	console.log("\t--stats\n\t\tAcquires current MongoDB database statistics for the SCE database");
	console.log("\t--init\n\t\tThe default behavior; initializes the database to the structure described by schema_v0.js");
	console.log("\t--mock\n\t\tSame as the --init option, but adds numerous \"fake\" database documents for testing with a large database");
	console.log("\t--help\n\t\tRuns this help prompt");
	console.log("\t--format\n\t\tWARNING: This command does a complete wipe of the database (use only for debugging)");
}
// END Utility Functions



// END sce_db_setup_v0.js
