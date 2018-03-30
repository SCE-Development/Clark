//	PROJECT: 		Core-v4
// 	Name: 			Rolando Javier
// 	File: 			sce_db_setup_v0.js
// 	Date Created: 	January 22, 2018
// 	Last Modified: 	March 29, 2018
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
		"doorCodeID": -1,
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

// Mock Data (member ids foreign key constraint: 0-12 are the only existing memberIDs)
var mockMembers = [
	{
		"memberID": 1,
		"firstName": "John",
		"middleInitial": "J.",
		"lastName": "Doe",
		"joinDate": (new Date(Date.now())).toISOString(),
		"userName": "johnjdoe",
		"passWord": cryptic.hashPwd("johnjdoe","johnjdoe"),
		"email": "johnjdoe@email.com",
		"major": "CMPE",
		"lastLogin": ""
	},
	{
		"memberID": 2,
		"firstName": "Jane",
		"middleInitial": "J.",
		"lastName": "Doe",
		"joinDate": (new Date(Date.now())).toISOString(),
		"userName": "janejdoe",
		"passWord": cryptic.hashPwd("janejdoe","janejdoe"),
		"email": "janejdoe@email.com",
		"major": "SE",
		"lastLogin": ""
	},
	{
		"memberID": 3,
		"firstName": "Jack",
		"middleInitial": "B.",
		"lastName": "Bower",
		"joinDate": (new Date(Date.now())).toISOString(),
		"userName": "jackbower",
		"passWord": cryptic.hashPwd("jackbower","jackbower"),
		"email": "jackbower@email.com",
		"major": "Forensic Science",
		"lastLogin": ""
	},
	{
		"memberID": 4,
		"firstName": "Cati",
		"middleInitial": "A.",
		"lastName": "Abbott",
		"joinDate": (new Date(Date.now())).toISOString(),
		"userName": "catiaabbott",
		"passWord": cryptic.hashPwd("catiaabbott","catiaabbott"),
		"email": "catiaabbott@email.com",
		"major": "n/a",
		"lastLogin": ""
	},
	{
		"memberID": 5,
		"firstName": "Charles",
		"middleInitial": "C.",
		"lastName": "Smith",
		"joinDate": (new Date(Date.now())).toISOString(),
		"userName": "ccsmith",
		"passWord": cryptic.hashPwd("ccsmith","ccsmith"),
		"email": "charles.smith@email.com",
		"major": "CMPE",
		"lastLogin": ""
	},
	{
		"memberID": 6,
		"firstName": "Chris",
		"middleInitial": "J.",
		"lastName": "Kringle",
		"joinDate": (new Date(Date.now())).toISOString(),
		"userName": "cjkringle",
		"passWord": cryptic.hashPwd("cjkringle","christmas"),
		"email": "kringle.cj@email.com",
		"major": "Hospitality",
		"lastLogin": ""
	},
	{
		"memberID": 7,
		"firstName": "Alice",
		"middleInitial": "D.",
		"lastName": "Everett",
		"joinDate": (new Date(Date.now())).toISOString(),
		"userName": "adeverett",
		"passWord": cryptic.hashPwd("adeverett","alice in wonderland"),
		"email": "alice.everett@email.com",
		"major": "Undeclared",
		"lastLogin": ""
	},
	{
		"memberID": 8,
		"firstName": "Robert",
		"middleInitial": "G.",
		"lastName": "Parr",
		"joinDate": (new Date(Date.now())).toISOString(),
		"userName": "mrIncredible",
		"passWord": cryptic.hashPwd("mrIncredible","i work alone"),
		"email": "incredibleRParr@email.com",
		"major": "Physical Therapy",
		"lastLogin": ""
	},
	{
		"memberID": 9,
		"firstName": "Khalil",
		"middleInitial": "M.",
		"lastName": "Estell",
		"joinDate": (new Date(Date.now())).toISOString(),
		"userName": "kammce",
		"passWord": cryptic.hashPwd("kammce","sleep is for the weak"),
		"email": "kammce.corp@email.com",
		"major": "CMPE",
		"lastLogin": ""
	},
	{
		"memberID": 10,
		"firstName": "John",
		"middleInitial": "J.",
		"lastName": "Jameson",
		"joinDate": (new Date(Date.now())).toISOString(),
		"userName": "jamesonsr",
		"passWord": cryptic.hashPwd("jamesonsr","i want spiderman!"),
		"email": "jjjameson@email.com",
		"major": "Journalism",
		"lastLogin": ""
	},
	{
		"memberID": 11,
		"firstName": "Anthony",
		"middleInitial": "E.",
		"lastName": "Stark",
		"joinDate": (new Date(Date.now())).toISOString(),
		"userName": "stark5",
		"passWord": cryptic.hashPwd("stark5","cool facial hair bros"),
		"email": "stark.ironman@email.com",
		"major": "CMPE",
		"lastLogin": ""
	},
	{
		"memberID": 12,
		"firstName": "Bruce",
		"middleInitial": "",
		"lastName": "Wayne",
		"joinDate": (new Date(Date.now())).toISOString(),
		"userName": "thebatman",
		"passWord": cryptic.hashPwd("thebatman","because i'm batman"),
		"email": "wayne.enterprises@email.com",
		"major": "Business",
		"lastLogin": ""
	}
];
var mockMemberData = [
	{
		"memberID": 1,
		"startTerm": new Date(Date.now()),
		"endTerm": new Date(Date.UTC(2018 + Math.floor(Math.random() * 10 % 50),0 + Math.floor(Math.random() * 10 % 12))),
		"doorCodeID": 3,
		"gradDate": new Date(Date.UTC(2018 + Math.floor(Math.random() * 10 % 50), 5)),
		"level": 2,
		"membershipStatus": true
	},
	{
		"memberID": 2,
		"startTerm": new Date(Date.now()),
		"endTerm": new Date(Date.UTC(2018 + Math.floor(Math.random() * 10 % 50),0 + Math.floor(Math.random() * 10 % 12))),
		"doorCodeID": 3,
		"gradDate": new Date(Date.UTC(2018 + Math.floor(Math.random() * 10 % 50), 5)),
		"level": 2,
		"membershipStatus": true
	},
	{
		"memberID": 3,
		"startTerm": new Date(Date.now()),
		"endTerm": new Date(Date.UTC(2018 + Math.floor(Math.random() * 10 % 50),0 + Math.floor(Math.random() * 10 % 12))),
		"doorCodeID": 3,
		"gradDate": new Date(Date.UTC(2018 + Math.floor(Math.random() * 10 % 50), 5)),
		"level": 2,
		"membershipStatus": true
	},
	{
		"memberID": 4,
		"startTerm": new Date(Date.now()),
		"endTerm": new Date(Date.UTC(2018 + Math.floor(Math.random() * 10 % 50),0 + Math.floor(Math.random() * 10 % 12))),
		"doorCodeID": 3,
		"gradDate": new Date(Date.UTC(2018 + Math.floor(Math.random() * 10 % 50), 5)),
		"level": 2,
		"membershipStatus": true
	},
	{
		"memberID": 5,
		"startTerm": new Date(Date.now()),
		"endTerm": new Date(Date.UTC(2018 + Math.floor(Math.random() * 10 % 50),0 + Math.floor(Math.random() * 10 % 12))),
		"doorCodeID": 3,
		"gradDate": new Date(Date.UTC(2018 + Math.floor(Math.random() * 10 % 50), 5)),
		"level": 2,
		"membershipStatus": true
	},
	{
		"memberID": 6,
		"startTerm": new Date(Date.now()),
		"endTerm": new Date(Date.UTC(2018 + Math.floor(Math.random() * 10 % 50),0 + Math.floor(Math.random() * 10 % 12))),
		"doorCodeID": 3,
		"gradDate": new Date(Date.UTC(2018 + Math.floor(Math.random() * 10 % 50), 5)),
		"level": 2,
		"membershipStatus": true
	},
	{
		"memberID": 7,
		"startTerm": new Date(Date.now()),
		"endTerm": new Date(Date.UTC(2018 + Math.floor(Math.random() * 10 % 50),0 + Math.floor(Math.random() * 10 % 12))),
		"doorCodeID": 3,
		"gradDate": new Date(Date.UTC(2018 + Math.floor(Math.random() * 10 % 50), 5)),
		"level": 2,
		"membershipStatus": true
	},
	{
		"memberID": 8,
		"startTerm": new Date(Date.now()),
		"endTerm": new Date(Date.UTC(2018 + Math.floor(Math.random() * 10 % 50),0 + Math.floor(Math.random() * 10 % 12))),
		"doorCodeID": 3,
		"gradDate": new Date(Date.UTC(2018 + Math.floor(Math.random() * 10 % 50), 5)),
		"level": 2,
		"membershipStatus": true
	},
	{
		"memberID": 9,
		"startTerm": new Date(Date.now()),
		"endTerm": new Date(Date.UTC(2018 + Math.floor(Math.random() * 10 % 50),0 + Math.floor(Math.random() * 10 % 12))),
		"doorCodeID": 3,
		"gradDate": new Date(Date.UTC(2018 + Math.floor(Math.random() * 10 % 50), 5)),
		"level": 2,
		"membershipStatus": false
	},
	{
		"memberID": 10,
		"startTerm": new Date(Date.now()),
		"endTerm": new Date(Date.UTC(2018 + Math.floor(Math.random() * 10 % 50),0 + Math.floor(Math.random() * 10 % 12))),
		"doorCodeID": 3,
		"gradDate": new Date(Date.UTC(2018 + Math.floor(Math.random() * 10 % 50), 5)),
		"level": 2,
		"membershipStatus": true
	},
	{
		"memberID": 11,
		"startTerm": new Date(Date.now()),
		"endTerm": new Date(Date.UTC(2018 + Math.floor(Math.random() * 10 % 50),0 + Math.floor(Math.random() * 10 % 12))),
		"doorCodeID": 3,
		"gradDate": new Date(Date.UTC(2018 + Math.floor(Math.random() * 10 % 50), 5)),
		"level": 1,
		"membershipStatus": true
	},
	{
		"memberID": 12,
		"startTerm": new Date(Date.now()),
		"endTerm": new Date(Date.UTC(2018 + Math.floor(Math.random() * 10 % 50),0 + Math.floor(Math.random() * 10 % 12))),
		"doorCodeID": 3,
		"gradDate": new Date(Date.UTC(2018 + Math.floor(Math.random() * 10 % 50), 5)),
		"level": 1,
		"membershipStatus": true
	}
];
var mockAnnouncements = [
	{
		"aID": 0,
		"senderID": 12,
		"title": "Why am I awesome?",
		"msgContent": "...because I'm <strong>BATMAAAAAAN!!!!</strong>",
		"imgPath": ""
	},
	{
		"aID": 1,
		"senderID": 10,
		"title": "Coldplay is awesome when LIVE! (Said no one ever... hehe)",
		"msgContent": "I used to rule the world. Seas would rise when I gave the word. <strong>Now in the moment I sleeeeep alone</strong>. Sweep the streets I used to own. <p>*Sad Violin Solo*</p>",
		"imgPath": ""
	},
	{
		"aID": 2,
		"senderID": 3,
		"title": "A great poem",
		"msgContent": "Two roads diverged in a yellow wood, and sorry I could not travel both. And be it there,.... how does the rest of it go again?",
		"imgPath": ""
	},
	{
		"aID": 3,
		"senderID": 0,
		"title": "Official SCE Welcome",
		"msgContent": "<strong>Welcome</strong> to SCE's new Core-v4 site. Make sure to check out your profiles for your doorcodes and any other services available to you. Thanks, and have a great semester!!!",
		"imgPath": ""
	},
	{
		"aID": 4,
		"senderID": 7,
		"title": "The typical 9-5",
		"msgContent": "<strong>Life. What is life?</strong> Is it a meaningless existence in which we do nothing but suffer the everyday burdens of morning traffic, midday tirades from our bosses, or the late-night blues of having no meaninful purpose, of not making a different, and of not even mattering? Why, then, do we exist? It certainly wasn't by our choice. But unbeknownst to many, to spend your days doing something you do not like and doesn't align to your goals warrants precisely this type of situation. Therefore, you must ask yourself this question: What do I desire?",
		"imgPath": ""
	},
	{
		"aID": 5,
		"senderID": 8,
		"title": "Response to The typical 9-5",
		"msgContent": "<strong>Hey,</strong> get back to work!",
		"imgPath": ""
	},
	{
		"aID": 6,
		"senderID": 7,
		"title": "Response to Response to The typical 9-5",
		"msgContent": "...yes boss...",
		"imgPath": ""
	},
	{
		"aID": 7,
		"senderID": 3,
		"title": "The late Chris Cornell",
		"msgContent": "<strong>I am saddened</strong> by the loss of one of this world's greatest Rock Musicians of our time...",
		"imgPath": ""
	},
	{
		"aID": 8,
		"senderID": 2,
		"title": "Plans for the break",
		"msgContent": "<strong>Hi all!</strong> As you know, the Christmas break is fast-approaching, and thus it is time to assign your hours with next year's work plan. The company is experiencing several internal changes, and we need to get all these technical action items out of the way as fast as reasonably possible! Please contact your department head to schedule your annual review meeting ASAP!",
		"imgPath": ""
	},
	{
		"aID": 9,
		"senderID": 11,
		"title": "Avengers Infinity War",
		"msgContent": "<strong>Hey all,</strong> the Infinity Wars premier date has been changed to April 27th, earlier than previously expected! Yay!",
		"imgPath": ""
	}
];
var mockDoorCodes = [
	{"dcID": 0, "code": "000-0000"},
	{"dcID": 1, "code": "000-0001"},
	{"dcID": 2, "code": "000-0002"},
	{"dcID": 3, "code": "000-0003"},
	{"dcID": 4, "code": "000-0004"},
	{"dcID": 5, "code": "000-0005"},
	{"dcID": 6, "code": "000-0006"},
	{"dcID": 7, "code": "000-0007"},
	{"dcID": 8, "code": "000-0008"},
	{"dcID": 9, "code": "000-0009"},
	{"dcID": 10, "code": "000-0010"},
	{"dcID": 11, "code": "000-0011"},
	{"dcID": 12, "code": "000-0012"},
	{"dcID": 13, "code": "000-0013"},
	{"dcID": 14, "code": "000-0014"},
	{"dcID": 15, "code": "000-0015"},
	{"dcID": 15, "code": "000-0016"},
	{"dcID": 17, "code": "000-0017"},
	{"dcID": 18, "code": "000-0018"},
	{"dcID": 19, "code": "000-0019"},
	{"dcID": 20, "code": "000-0020"},
	{"dcID": 21, "code": "000-0021"},
	{"dcID": 22, "code": "000-0022"},
	{"dcID": 23, "code": "000-0023"}
];
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
													console.log(`Collection ${target} result: ${JSON.stringify(result)}`);
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
						addMemberDossierView
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
