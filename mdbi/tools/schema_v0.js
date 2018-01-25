//	PROJECT: 		Core_v4
// 	Name: 			Rolando Javier
// 	File: 			schema_v0.js
// 	Date Created: 	January 23, 2018
// 	Last Modified: 	January 23, 2018
// 	Details:
// 					This file contains the database schema v0 for the sce_core database. It is intended for use in verifying that a document entry (JSON object) fits the schema parameters before being added to its collection
// 	Dependencies:
// 					[Dependencies]

"use strict";

// Container
var schema = {
	/*
		@member 	collectionNames
		@details 	This member contains an array list of all collections comprising the schema
	*/
	"collectionNames": [
		"serverActivations",
		"Member",
		"MembershipData",
		"DoorCode",
		"ClearanceLevel",
		"Ability",
		"SessionData",
		"Announcement"
	],

	/*
		@member 	collectionMembers
		@details 	This member is a JSON object containing structural information about each collection, namely the collection's expected members and their types (only at top depth, though)
	*/
	"collectionMembers": {
		"serverActivations": {
			"login": "string"	// datetime
		},
		"Member": {
			"memberID": "number",
			"firstName": "string",
			"middleInitial": "string",
			"lastName": "string",
			"joinDate": "string",
			"userName": "string",
			"passWord": "string",
			"email": "string",
			"major": "string",
			"lastLogin": "string"
		},
		"MembershipData": {
			"memberID": "number",
			"startTerm": "string",
			"endTerm": "string",
			"doorCodeID": "string",
			"gradDate": "string",
			"level": "number",
			"membershipStatus": "boolean"
		},
		"DoorCode": {
			"dcID": "number",
			"code": "string"
		},
		"ClearanceLevel": {
			"cID": "number",
			"levelName": "string",
			"abilities": "array"
		},
		"Ability": {
			"abilityID": "number",
			"abilityName": "string"
		},
		"SessionData": {
			"sessionID": "number",
			"memberID": "number",
			"loginTime": "string",	// datetime
			"lastActivity": "string"	// datetime
		},
		"Announcement": {
			"aID": "number",
			"senderID": "number",
			"title": "string",
			"msgContent": "string",
			"imgPath": "string"
		}
	},

	/*
		@member 	utility
		@details 	This member contains a set of utility functions to manage the schema
	*/
	"utility": {
		/*
			@function 	addCollection
			@parameter 	name - the string name of the collection to add
			@parameter 	members - the JSON object of the collection's members as keys, and their data types as values (i.e. {"id": "number"})
			@parameter 	callback - the callback to run after the collection is added. It is passed two arguments:
							result - On success: this parameter a string representing the result of the operation. On failure: this parameter is null.
							error - On success: this parameter is null. On failure: this parameter is a string detailing the error
			@returns 	n/a
			@details 	This function adds a collection to the schema.
		*/
		"addCollection": function (name, members, callback) {
			var error = null;
			var result = null;

			// Check parameters
			if (typeof name !== "string" || name === "") {
				error = `Invalid name: ${name}`;
			}
			if (typeof members !== "object") {
				error = `Invalid member(s): must be a JSON object`;
			} else if (Object.keys(members) < 1) {
				error = `Invalid member(s): insufficient members`;
			}
			if (typeof callback !== "function") {
				error = `Invalid callback: expected "function", got "${typeof callback}"`;
			}

			switch (error === null) {
				case false: {
					console.log("Error parsing parameters");
					if (typeof callback === "function") {
						callback(null, error);
					}
					break;
				}
				default: {
					try {
						schema.collectionNames.push(name);
						schema.collectionMembers[name] = members;
						callback("success", null);
					} catch (e) {
						console.log("Error adding collection");
						callback(null, e);
					}
					break;
				}
			}
		},

		/*
			@function 	conformsWith
			@parameter 	name - the name of the destination collection
			@parameter 	doc - the JSON object of the entry to verify
			@returns 	true if the "doc" document fits the schema of the "name" collection, false otherwise
			@details 	This function is used to verify that the "doc" document conforms to the schema of the destination collection specified by "name".
		*/
		"conformsWith": function (name, doc) {
			var format = schema.collectionMembers[name];
			var formatKeys = Object.keys(format)
			var success = true;

			// Check for matching number of members
			if (Object.keys(doc).length !== formatKeys.length) {
				success = false;
			} else {
				// Check for matching member types
				for (var i = 0; i < formatKeys.length; i++) {
					if (typeof doc[formatKeys[i]] !== format[formatKeys[i]]) {
						success = false;
						break;
					}
				}
			}

			return success;
		}
	}
};


module.exports = schema;

// END schema_v0.js
