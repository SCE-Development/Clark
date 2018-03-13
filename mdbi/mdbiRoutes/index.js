// PROJECT: 		MEANserver
// Name: 			Rolando Javier
// File: 			mdbi/mdbiRoutes/index.js
// Date Created: 	January 9, 2018
// Last Modified: 	February 12, 2018
// Details:
//				 	This file abstracts all MDBI routes and places them into a ExpressJS router to be used by the mdbi subapp (accessed under the "/mdbi" endpoint from server.js) and in test/app.js.
// Dependencies:
// 					JQuery v1.12.4?
// 					ExpressJS 4.x
// 					body-parser (NPM middleware req'd by ExpressJS 4.x to acquire POST data parameters: "npm install --save body-parser")

"use strict"

// BEGIN Includes
var express = require("express");
var assert = require("assert");
var router = express.Router();
var settings = require("../../util/settings");	// acquire server system settings
var logger = require(`${settings.util}/logger`);	// acquire event log system
var mdb = require("../mongoWrapper");	// acquire MongoDB API Wrappers
var credentials = require(settings.credentials);	// acquire db auth credentials
var ef = require(`${settings.util}/error_formats`);	// acquire error formatter
var mongo_settings = require("../mongo_settings");	// acquire MongoDB settings
var schema = require("../tools/schema_v0");	// acquire current db schema
// END Includes



// BEGIN Global Constants
const ALL_COLLECTIONS = null;
// END Global Constants



// BEGIN MongoDB client
var mongo = require("mongodb").MongoClient;
var mongoOptions = {
	"appname": "SCE Core v4"
};
var url = `mongodb://${encodeURIComponent(credentials.mdbi.user)}:${encodeURIComponent(credentials.mdbi.pwd)}@${mongo_settings.hostname}:${mongo_settings.port}/${mongo_settings.database}`;
mongo.connect(url, mongoOptions, function (err, db) {
	var handlerTag = {"src": "/mdbi"};

	// Log connection status, and error (if any)
	if (err) {
		logger.log("Could not connect to Mongo:\n" + err, handlerTag);
		if (db) {
			endSession(db);
		}
		throw err;	// throw error only after error logging was successful
	} else {
		logger.log("Connected to Mongo", handlerTag);

		// First, acquire link to database
		mdb.database = db;

		// Verify necessary collections are present. If not, throw error
		mdb.findCollections(null, function (error, list) {
			// Compile collection names from "list"
			var listOfNames = [];
			for (var i = 0; i < list.length; i++) {
				listOfNames.push(list[i].name);
			}

			// Verify that the necessary collections are present
			for (var i = 0; i < schema.collectionNames.length; i++) {
				if (listOfNames.indexOf(schema.collectionNames[i]) === -1) {
					logger.log(`Error: Collection ${schema.collectionNames[i]} not found`, handlerTag);
					endSession(db);
					throw new Error(`Collection ${schema.collectionNames[i]} not found`);
				}
			}

			// Then, write server connection information
			var postmark = logger.log("Database connection established", handlerTag);
			mdb.insertDoc("serverActivations", {"login": postmark}, function (error, result) {
				if (error != null) {
					logger.log("Postmark not written to database", handlerTag);
				} else {
					logger.log("Postmark successfully written to database", handlerTag);
				}
			});
		});
	}
});
// END MongoDB Client



// BEGIN MDBI Routes
/*
	@endpoint 	write
	@parameter	request - the web request object provided by express.js
	@parameter	response - the web response object provided by express.js
	@returns	To Client: If successful, returns a success status (200). If access authentication fails, returns a server error 499 and a JSON description of the error. Otherwise, returns a server error status (500) and populates the reponse header with the error's details (i.e. an error_formats object)
	@details 	This function performs a database write to the db for all "/mdbi/write" endpoint requests. Used on a POST request, it requires that the Request body be a JSON object in the following format:
		{
			"accessToken": "access token string",
			"collection": "string name of collection",
			"data": {...}
		}
	where the "accessToken" parameter is the string access token located in credentials.json for security purposes (i.e. enforces local-only db access), and the "data" parameter is a JSON object containing the doc parameter expected by the insertDoc() function. Read the insertDoc() description for more deatils on what to give to the "data" parameter.
*/
router.post("/write", function (request, response) {
	var handlerTag = {"src": "mdbi/write"};
	var hasBody = (Object.keys(request.body).length > 0);
	var searchCriteria = (hasBody) ? numerify(delintRequestBody(request.body)) : {};

	// Perform Write
	if (!checkAuth(request.body.accessToken)) {
		logger.log(`Invalid db access token`, handlerTag);
		response.set("Content-Type", "application/json");
		response.send(ef.asCommonStr(ef.struct.mdbiAccessDenied)).status(499).end();
	} else {
		logger.log(`Client @ ip ${request.ip} is requesting to write a new document of ${typeof searchCriteria.data} ${(typeof searchCriteria.data === "object") ? JSON.stringify(searchCriteria.data) : searchCriteria.data} to the ${searchCriteria.collection} collection in the database`, handlerTag);
		mdb.insertDoc(searchCriteria.collection, searchCriteria.data, function (error, result) {
		// Note: I really should validate this data before passing it to the db
			if (error != null) {
				logger.log(`An error occurred`, handlerTag);
				response.status(500).send(error).end();
			} else {
				logger.log(`A result was returned`, handlerTag);
				response.status(200).send((typeof result === "object") ? JSON.stringify(result) : result).end();
			}
		});
	}
});

/*
	@endpoint 	search/collections
	@parameter	request - the web request object provided by express.js
	@parameter	response - the web response object provided by express.js
	@returns	To Client: If successful, returns a success status (200) and the list of collections found. If access authentication fails, returns a server error 499 and a JSON description of the error. Otherwise, returns a server error status (500) and populates the response header with the error's details
	@details 	This function serves any and all requests to the "/mdbi/search/collections" endpoint by performing a search of any collections matching the search parameters given in the request body's JSON data. This data is exepected to appear in the following format:
		{
			"accessToken": "access token string",
			"name": "string of the collection name to find"
		}
	Where "accessToken" is the string access token located in credentials.json for security purposes (i.e. enforces local-only db access). If this data is given, the function will search for the collection whose name matches the object's "name" member.
	If the data field is not given (i.e. instead of a JSON object in the Request body, we have null), the function will return a list of all collections
*/
router.post("/search/collections", function (request, response) {
	var handlerTag = {"src": "mdbi/search/collections"};
	var hasBody = (Object.keys(request.body).length > 0);
	var searchCriteria = (hasBody && typeof request.body.name !== "undefined") ? delintRequestBody(request.body).name : ALL_COLLECTIONS;

	// Perform collection search
	if (!checkAuth(request.body.accessToken)) {
		logger.log(`Invalid db access token`, handlerTag);
		response.set("Content-Type", "application/json");
		response.send(ef.asCommonStr(ef.struct.mdbiAccessDenied)).status(499).end();
	} else {
		logger.log(`Client @ ip ${request.ip} is requesting to find ${(searchCriteria === ALL_COLLECTIONS) ? "all collections" : ("collection " + JSON.stringify(searchCriteria))} from the database`, handlerTag);

		mdb.findCollections(searchCriteria, function (err, list) {
			if (err == null) {
				logger.log(`A result was returned`, handlerTag);
				response.status(200).send(JSON.stringify(list)).end();
			} else {
				logger.log(`An error occurred`, handlerTag);
				response.status(500).send(err).end();
			}
		});
	}
});

/*
	@endpoint 	search/documents
	@parameter	request - the web request object provided by express.js
	@parameter	response - the web response object provided by express.js
	@returns	To Client: If successful, returns a success status (200) and the list of documents found. If access authentication fails, returns a server error 499 and a JSON description of the error. Otherwise, returns a server error status (500) and populates the response header with the error's details
	@details 	(Intended for use in testing the database querying functions) This function handles all endpoint requests to the "/mdbi/search/documents" endpoint. It performs a query on the database and returns any results matching the search criteria given by the Request header's data field. The data field is expected to be a JSON object in the following format:
		{
			"accessToken": "access token string",
			"collection": "string name of collection",
			"search": {...},
			"options": {...}
		}
	where "accessToken" is the string access token stored in credentials.json for security purposes (i.e. enforces local-only db access), the "search" parameter is a JSON object containing the search parameters expected by the findDocs() function (read the findDocs() description for more details on what to give to the "search" parameter), and the "options" parameter is an optional object containing result set formatting options. The "options" parameter can contain any of the following:
		{
			"projection": {...}	// a MongoDB Projection Specifier Object
		}
*/
router.post("/search/documents", function (request, response) {
	var handlerTag = {"src": "mdbi/search/documents"};
	var hasBody = (Object.keys(request.body).length > 0);
	var hasOptions = (!hasBody) ? false : (typeof request.body.options === "object") ? true : false;
	var searchCriteria = (hasBody) ? numerify(delintRequestBody(request.body)) : {};	// either the filter, or empty JSON

	// Find documents
	if (!hasBody) {
		logger.log(`Error: no request body found`, handlerTag);
		response.set("Content-Type", "application/json");
		response.send(ef.asCommonStr(ef.struct.invalidBody)).status(499).end();
	} else if (!checkAuth(request.body.accessToken)) {
		logger.log(`Invalid db access token`, handlerTag);
		response.set("Content-Type", "application/json");
		response.send(ef.asCommonStr(ef.struct.mdbiAccessDenied)).status(499).end();
	} else {
		var projection = (!hasOptions) ? null : (typeof request.body.options.projection === "object") ? request.body.options.projection : null;
		var queryCallback = function (error, list) {
			if (error != null) {
				logger.log(`An error occurred`, handlerTag);
				response.status(500).send(error).end();
			} else {
				logger.log(`A result was returned`, handlerTag);
				response.status(200).send(JSON.stringify(list)).end();
			}
		};

		logger.log(`Client @ ip ${request.ip} is requesting to find ${(searchCriteria === {}) ? "all documents" : ("documents matching \"" + ((typeof searchCriteria.search === "object") ? JSON.stringify(searchCriteria.search) : searchCriteria.search) + "\"")} from the ${searchCriteria.collection} collection in the database`, handlerTag);
		if (projection !== null) {
			mdb.findAndProjectDocs(searchCriteria.collection, searchCriteria.search, projection, queryCallback);
		} else {
			mdb.findDocs(searchCriteria.collection, searchCriteria.search, queryCallback);
		}
	}
});

/*
	@endpoint 	delete/document
	@parameter	request - the web request object provided by express.js
	@parameter	response - the web response object provided by express.js
	@returns 	To Client: If successful, returns a success status (200) and an object detailing the result of the operation. If access authentication fails, returns a server error 499 and a JSON description of the error. Otherwise, returns a server error status (500) and populates the response header with the error's details
	@details 	(Intended for use in testing the database single-deleting function) This function handles all endpoint requests to the "/mdbi/delete/document" endpoint. It performs a deletion request to the database using the Request header's data field as search criteria to select which document to delete. The data field is expected to be a JSON object with the following format:
		{
			"accessToken": "access token string",
			"collection": "string name of collection",
			"search": {...}
		}
	where "accessToken" is the string access token stored in credentials.json for security purposes (i.e. enforces local-only db access), and the "search" parameter is a JSON object containing the search parameters expected by the deleteOneDoc() function. Read the deleteOneDoc() description for more details on what to give the "search" parameter
*/
router.post("/delete/document", function (request, response) {
	var handlerTag = {"src": "mdbi/delete/document"};
	var hasBody = (Object.keys(request.body).length > 0);
	var searchCriteria = (hasBody) ? numerify(delintRequestBody(request.body)) : {};

	// Find documents
	if (!checkAuth(request.body.accessToken)) {
		logger.log(`Invalid db access token`, handlerTag);
		response.set("Content-Type", "application/json");
		response.send(ef.asCommonStr(ef.struct.mdbiAccessDenied)).status(499).end();
	} else {
		logger.log(`Client @ ip ${request.ip} is requesting to delete a document matching ${(typeof searchCriteria.search === "object") ? JSON.stringify(searchCriteria.search) : searchCriteria.search} from the ${searchCriteria.collection} collection in the database`, handlerTag);
		mdb.deleteOneDoc(searchCriteria.collection, searchCriteria.search, function (error, result) {
			if (error != null) {
				logger.log(`An error occurred`, handlerTag);
				response.status(500).send(error).end();
			} else {
				logger.log(`A result was returned`, handlerTag);
				response.status(200).send((typeof result === "object") ? JSON.stringify(result) : result).end();
			}
		});
	}
});

/*
	@function 	delete/documents
	@parameter	request - the web request object provided by express.js
	@parameter	response - the web response object provided by express.js
	@returns 	To Client: If successful, returns a success status (200) and an object detailing the result of the operation. If access authentication fails, returns a server error 499 and a JSON description of the error. Otherwise, returns a server error status (500) and populates the response header with the error's details
	@details 	(Intended for use in testing the database multi-deleting function) This function handles all endpoint requests to the "/mdbi/delete/documents" endpoint. It performs a deletion request to the database using the Request header's data field as search criteria to select which document to delete. The data field is expected to be a JSON object with the following format:
		{
			"accessToken": "access token string",
			"collection": "string name of collection",
			"search": {...}
		}
	where "accessToken" is the string access token stored in credentials.json for security purposes (i.e. enforces local-only db access), and the "search" parameter is a JSON object containing the search parameters expected by the deleteManyDocs() function. Read the deleteManyDocs() description for more details on what to give the "search" parameter
*/
router.post("/delete/documents", function (request, response) {
	var handlerTag = {"src": "mdbi/delete/documents"};
	var hasBody = (Object.keys(request.body).length > 0);
	var searchCriteria = (hasBody) ? numerify(delintRequestBody(request.body)) : {};

	// Find documents
	if (!checkAuth(request.body.accessToken)) {
		logger.log(`Invalid db access token`, handlerTag);
		response.set("Content-Type", "application/json");
		response.send(ef.asCommonStr(ef.struct.mdbiAccessDenied)).status(499).end();
	} else {
		logger.log(`Client @ ip ${request.ip} is requesting to delete all documents ${(searchCriteria.search == {}) ? "" : ("matching " + ((typeof searchCriteria.search === "object") ? JSON.stringify(searchCriteria.search) : searchCriteria.search))} from the ${searchCriteria.collection} collection in the database`, handlerTag);
		mdb.deleteManyDocs(searchCriteria.collection, searchCriteria.search, function (error, result) {
			if (error != null) {
				logger.log(`An error occurred`, handlerTag);
				response.status(500).send(error).end();
			} else {
				logger.log(`A result was returned`, handlerTag);
				response.status(200).send((typeof result === "object") ? JSON.stringify(result) : result).end();
			}
		});
	}
});

/*
	@function 	update/documents
	@parameter	request - the web request object provided by express.js
	@parameter	response - the web response object provided by express.js
	@returns 	To Client: If successful, returns a success status (200). If access authentication fails, returns a server error 499 and a JSON description of the error. Otherwise, returns a server error status (500) and populates the response header with the error's details
	@details 	(Intended for use in testing the database single-update function) This function handles all endpoint requests to the "/mdbi/update/documents" endpoint. It performs an update request to the database using the Request header's data field as search criteria to select which document to update. The data field is expected to be a JSON object with the following format:
		{
			"accessToken": "access token string",
			"collection": "string name of collection",
			"search": {...},
			"update": {...}
		}
	where "accessToken" is the string access token stored in credentials.json for security purposes (i.e. enforces local-only db access), the "search" parameter is a JSON object containing the filter parameters expected by the updateOneDoc() function, and "update" is a JSON object containing the update commands expected by the updateOneDoc() function. Read the updateOneDoc() description for more details on what to give the "search" parameter
*/
router.post("/update/documents", function (request, response) {
	var handlerTag = {"src": "mdbi/update/documents"};
	var hasBody = (Object.keys(request.body).length > 0);
	var searchCriteria = (hasBody) ? numerify(delintRequestBody(request.body)) : {};

	// Find documents
	if (!checkAuth(request.body.accessToken)) {
		logger.log(`Invalid db access token`, handlerTag);
		response.set("Content-Type", "application/json");
		response.send(ef.asCommonStr(ef.struct.mdbiAccessDenied)).status(499).end();
	} else {
		logger.log(`Client @ ip ${request.ip} is requesting to update a document matching ${typeof searchCriteria.search} ${(typeof searchCriteria.search === "object") ? JSON.stringify(searchCriteria.search) : searchCriteria.search} from the ${searchCriteria.collection} collection in the database using ${typeof searchCriteria.update} ${(typeof searchCriteria.update === "object") ? JSON.stringify(searchCriteria.update) : searchCriteria.update}`, handlerTag);
		mdb.updateOneDoc(searchCriteria.collection, searchCriteria.search, searchCriteria.update, function (error, result) {
			if (error != null) {
				logger.log(`An error occurred`, handlerTag);
				response.status(500).send(error).end();
			} else {
				logger.log(`A result was returned`, handlerTag);
				response.status(200).send((typeof result === "object") ? JSON.stringify(result) : result).end();
			}
		});
	}
});
// END MDBI Routes



// BEGIN Error Handling Routes
/*
	@endpoint 	NOTFOUND (404)
	@parameter 	n/a
	@returns 	n/a
	@details 	This function handles any endpoint requests that do not exist under the "/test" endpoint
*/
router.use(function (request, response) {
	var handlerTag = {"src": "mdbi/NOTFOUND"};
	logger.log(`Non-existent endpoint "${request.path}" requested from client @ ip ${request.ip}`, handlerTag);
	response.status(404).json({
		"status": 404,
		"subapp": "mdbi",
		"err": "Non-Existent Endpoint"
	});
});

/*
	@endpoint 	ERROR (for any other errors)
	@parameter 	n/a
	@returns 	n/a
	@details 	This function sends an error status (500) if an error occurred forcing the other methods to not run.
*/
router.use(function (err, request, response) {
	var handlerTag = {"src": "mdbi/ERROR"};
	logger.log(`Mdbi error occurred with request from client @ ip ${request.ip}`);
	response.status(500).json({
		"status": 500,
		"subapp": "mdbi",
		"err": err.message
	});
});
// END Error Handling Routes



// BEGIN Utility Methods
/*
	@function 	endSession
	@parameter 	mongoDatabase - the MongoDB database object returned from MongoClient.connect()
	@parameter 	(optional) callback - a callback to run after completing the operation. This function is not passed any arguments.
	@returns 	n/a
	@details 	This function ends the MongoDB session by first logging out the authenticated user and closing the connection directly.
*/
function endSession(mongoDatabase, callback) {
	console.log("Ending session...");

	mongoDatabase.logout();
	mongoDatabase.close();

	if (typeof callback === "function") {
		callback();
	}
}

/*
	@function 	checkAuth
	@parameter mongoDatabase - the MongoDB database object returned from MongoClient.connect()
	@parameter 	token - the db access token used to authenticate the mdbi user
	@parameter 	(optional) callback - a callback to run after completing verification. It is passed one argument:
					result - a boolean representing whether or not the mdbi user is authorized to manipulate the database
	@returns 	A boolean representing whether or not the mdbi user is authorized to manipulate the database
*/
function checkAuth (token, callback) {
	var success = false;

	if (token === credentials.mdbi.accessToken) {
		success = true;
	}
	if (typeof callback === "function") {
		callback(success);
	}

	return success;
}

/*
	@function 	delintRequestBody
	@parameter 	body - the JSON object forming the POST request body
	@parameter 	callback - (optional) a callback function to run after delinting. It is passed the delinted request body object
	@returns 	If callback is undefined, returns the delinted request body object
	@details 	This function is intended for use on the ExpressJS request.body parameter. Since body-parser seems to allow the output JSON's keys to include the starting "?" from the querystring, it needs to be removed from the key. This function does precisely that by adding a new parameter to the object before returning it
	@note		The "?" seems to only appear in the first key passed, and always seems to start at the front of the key.
*/
function delintRequestBody (body, callback) {
	var handlerTag = {"src": "delintRequestBody"};
	logger.log(`Delinting ${JSON.stringify(body)}`, handlerTag);	// Debug
	var newBody = body;
	var newBodyKeys = Object.keys(newBody);	// array of keys
	for(var i = 0; i < newBodyKeys.length; i++) {
		var qmarkIndex = newBodyKeys[i].indexOf("?");
		if (qmarkIndex !== -1) {
			logger.log(`Lint found at ${newBodyKeys[i]} index ${qmarkIndex}`, handlerTag);	// Debug
			// If the key has a "?", create a new property without it.
			var newKeyName = newBodyKeys[i].substring(qmarkIndex+1);	// acquires the string without "?" in it
			newBody[newKeyName] = newBody[newBodyKeys[i]];		// copy the original value over
			// logger.log(`New key: ${typeof newKeyName} ${newKeyName}\nNew object: ${JSON.stringify(newBody)}`);	// Debug

			// Since we know there is only one key with the "?", we no longer need to go through the array
			if (typeof callback === "undefined") {
				return newBody;
			} else {
				callback(newBody);
			}
			break;
		}
	}
	// If lint was not found at all, simply return the untouched stuff
	logger.log(`Lint was not found!`, handlerTag);	// Debug
	if (typeof callback === "undefined") {
		return newBody;
	} else {
		callback(newBody);
  }
}

/*
	@function 	numerify
	@parameter 	obj - the JSON object to numerify
	@returns 	The numerified JSON object
	@details 	This function takes a JSON object and converts to numbers any (and all) string member-values whose characters are all numeric
*/
function numerify (obj) {
	var handlerTag = {"src": "numerify"};

	try {
		// Convert obj to string first...
		var objAsString = JSON.stringify(obj);

		// Then reparse it with a reviver function
		var newObj = JSON.parse(objAsString,
			(key, value) => {
				var handlerTag = {"src": "bodyParser.json.Reviver"};
				// Attempt to convert string into number
				if (typeof value === "string" && Number.isNaN(Number(value)) === false) {
					logger.log(`Converting string ${value} into number ${Number(value)}`, handlerTag);
					return Number(value);
				} else {
					logger.log(`Leaving ${typeof value} ${(typeof value === "object") ? JSON.stringify(value) : value} as is`, handlerTag);
					return value;
				}
			}
		);
		return newObj;
	} catch (err) {
		logger.log(`Unable to numerify ${typeof obj} ${JSON.stringify(obj)}:\n${err}`, handlerTag);
		return obj;
	}
}

/*
	@function 	extractFromObjectArray
	@parameter 	arr - the array of JSON objects to extract from
	@parameter 	key - the string specifying the key to extract a value from
	@parameter 	callback - (optional) a callback function to run after extraction completes. It is passed the resulting array
	@returns 	If callback is undefined, returns the resulting array
	@details 	This function takes an array of JSON objects "arr" and iterates through it, extracting from each object the value associated with "key" and placing it into an array, which is either passed to the callback parameter (if defined), or returned to the caller. If the "arr" contains objects that do not have the same set of keys, any objects that do not have the member "key" will cause this function to populate the corresponding array index with "null". As an example, running this section of code:
		var myArrayOfObjects = [{"a":0, "b":1}, {"a":2, "b":3}, {"a":4, "c":5}, {"a":6, "b":7}];
		var theKeyToFind = "b"
		var result = extractFromObjectArray(myArrayOfObjects, theKeyToFind);
	will populate the result with the follwing array:
		[1,3,null,7]
	since myArrayOfObjects[2] does NOT contain a member "b". This is also the function's exact behavior when it encounters incorrectly-typed "arr" member (i.e. one that is NOT of type "object").
	@note 		This function returns an array whose values are placed in the order that the objects of "arr" are sequenced.
*/
function extractFromObjectArray (arr, key, callback) {
	var result = [];
	for (var i = 0; i < arr.length + 1; i++) {
		switch (i) {
			case arr.length: {
				if (typeof callback === "function") {
					callback(result);
				} else {
					return result;
				}
				break;
			}
			default: {
				switch (typeof arr[i][key]) {
					case "object": {
						result[i] = arr[i][key];
						break;
					}
					default: {
						result[i] = null;
						break;
					}
				}
				break;
			}
		}
	}
}

/*
	@function 	hashString
	@parameter 	string - the string needing to be encoded
	@returns 	An encoded string used for hashing.
	@details 	This function takes a string and encrypts it using caesars cipher. This encryption is used for hashing.
*/
function hashString(unhashed_string) {
	
	// Make an output variable
	var output = '';

	//Declare number of letters to shift by
	var amount = 13;

	// Go through each character
	for (var i = 0; i < unhashed_string.length; i ++) {
		// Get the character we'll be appending
		var c = unhashed_string[i];
		// If it's a letter...
		if (c.match(/[a-z]/i)) {
			// Get its code
			var code = unhashed_string.charCodeAt(i);
			// Uppercase letters
			if ((code >= 65) && (code <= 90))
				c = String.fromCharCode(((code - 65 + amount) % 26) + 65);
			// Lowercase letters
			else if ((code >= 97) && (code <= 122))
				c = String.fromCharCode(((code - 97 + amount) % 26) + 97);
		}
		// Append
		output += c;
	}

	// All done!
	return output;
}

/*
	@object 	introSorter
	@details 	This object contains code that performs introsort on our custom array of objects
*/
var introSorter = (function () {
	/*
		@function 	swap
		@parameter 	arr - the array to sort
		@parameter 	a - index a
		@parameter 	b - index b
		@returns 	n/a
	*/
	function swap (arr, a, b) {
		var temp = arr[a];
		arr[a] = arr[b];
		arr[b] = temp;
	}

	/*
		@function 	partition
		@parameter 	arr - the array to sort
		@parameter 	low - the lower bound of the array
		@parameter 	high - the higher bound of the array
		@parameter 	options - (optional) a JSON object specifying any or all of the following special control paramters:
			{
				msMode: ...,
				reverse: ...
			}
		where "msMode" is a boolean for Mean Skills Mode (performs special comparison on MeanSkills skillmatch object arrays), and "reverse" is a boolean that, if true, orders the array in DESCENDING order.
		@returns 	The index of the pivot after partitioning occurs
		@details	
	*/
	function partition(arr, low, high, options) {
		var pivotIndex = 0;
		var pivotValue = 0;
		var smallIndex;
		var ptrIndex;
		var pivotNewIndex = low;

		// Determine pseudo-random pivot index
		pivotIndex = Math.floor(Math.random() * (high - low) + low);

		// Get value of pivot
		pivotValue = (options.msMode === true) ? arr[pivotIndex].total : arr[pivotIndex];

		// console.log(`Parititioning ${((high - low + 1) % 2) ? "odd" : "even"} Arr[${low}:${high}] ${arr} @ pivotIndex ${pivotIndex}`);
		
		// Swap pivot with 0'th element of the (sub)array
		swap(arr, low, pivotIndex);

		// Start small index at pivot's position
		smallIndex = pivotNewIndex;

		// Paritition (sub)array into two sublists
		for (var i = low; i <= high; i++) {
			ptrIndex = i;

			var compareVal = ((options.msMode === true) ? arr[ptrIndex].total : arr[ptrIndex]);

			if ((options.reverse === true) ? (pivotValue < compareVal) : (compareVal < pivotValue)) {
				smallIndex++;
				swap(arr, ptrIndex, smallIndex);
			}
		}

		// Return pivot to small Index position
		swap(arr, low, smallIndex);

		// Update new position of pivot
		pivotNewIndex = smallIndex;

		return pivotNewIndex;
	}

	/*
		@function 	introSort
		@parameter 	arr - the array to sort
		@parameter 	start - starting index of the array/subarray
		@parameter 	end - ending index of the array/subarray
		@parameter 	depth - the depth at which to switch from quicksort to heapsort
		@parameter 	options - a JSON object specifying any or all of the following special control parameters in the partition() function's options argument. Read that description for more details
		@returns 	n/a
		@details 	This function is called recursively to sort an array introspectively
	*/
	function introSort(arr, start, end, depth, options) {
		console.log(`introsorting Array[${start}:${end}] ${arr} (${depth} lvls above limit)`);
		
		if (start < end) {	// base case: if start greater than or equal to end, don't do this
			if (depth > 0) {	// if we have yet to reach depth limit, continue with quicksort
				var pivotIndex = partition(arr, start, end, options);
				introSort(arr, start, pivotIndex - 1, depth - 1, options);
				introSort(arr, pivotIndex + 1, end, depth - 1, options);
			} else {
				console.log("Switching to HeapSort");
				heapSorter.heapSort(arr);
			}
		}
	}

	return {
		introSort: introSort
	};
})();


/*
	@object 	heapSorter
	@details 	This object contains code that performs a MIN heaport (to sort array in DESCENDING order) on our custom array of objects
*/
var heapSorter = (function() {
	/*
		@function 	heapSort
		@parameter 	arr - the array to sort
		@returns 	n/a
		@details 	This function performs a heapsort on an array by first building a max heap, and recursively calling maxHeapify on a continuously decreasing recorded array size.
	*/
	function heapSort (arr) {
		// buildMaxHeap(arr);
		// for (var i = arr.length - 1; i >= 0; i--) {
		// 	swap(arr, 0, i);
		// 	maxHeapify(arr, 0, i);
		// }

		buildMinHeap(arr);
		for (var i = arr.length - 1; i >= 0; i--) {
			swap(arr, 0, i);
			minHeapify(arr, 0, i);
		}
	}

	/*
		@function 	buildMaxHeap
		@parameter 	arr - the array to build into a max heap
		@returns 	n/a
		@details	This function builds a max heap out of an array of elements
	*/
	function buildMaxHeap (arr) {
		for (var i = Math.floor(arr.length / 2) - 1; i >= 0; i--) {
			maxHeapify(arr, i, arr.length);
		}
	}

	/*
		@function 	buildMinHeap
		@parameter 	arr - the array to build into a min heap
		@returns 	n/a
		@details	This function builds a min heap out of an array of elements
	*/
	function buildMinHeap (arr) {
		for (var i = Math.floor(arr.length / 2) - 1; i >= 0; i--) {
			minHeapify(arr, i, arr.length);
		}
	}

	/*
		@function 	maxHeapify
		@parameter 	arr - the array to max-heapify
		@parameter 	index - the index to start from (i.e. the root reference)
		@parameter 	n - The last index of the arr
		@returns 	n/a
		@details 	?
	*/
	function maxHeapify (arr, index, n) {
		var largestChildIndex = index;
		var leftChildIndex = lchild(index);
		var rightChildIndex = rchild(index);
		
		// Look for largest child between index and its left child
		if (leftChildIndex < n && arr[leftChildIndex].total > arr[largestChildIndex].total) {
			largestChildIndex = leftChildIndex;
		}

		// Look for largest child between the current largest and index's right child
		if (rightChildIndex < n && arr[rightChildIndex].total > arr[largestChildIndex].total) {
			largestChildIndex = rightChildIndex;
		}

		// Final check to see if node i is larger than its direct children
		if (largestChildIndex !== index) {
			swap(arr, index, largestChildIndex);
			maxHeapify(arr, largestChildIndex, n);
		}
	}

	/*
		@function 	minHeapify
		@parameter 	arr - the array to min-heapify
		@parameter 	index - the index to start from (i.e. the root reference)
		@parameter 	n - The last index of the arr
		@returns 	n/a
		@details 	?
	*/
	function minHeapify (arr, index, n) {
		var smallestChildIndex = index;
		var leftChildIndex = lchild(index);
		var rightChildIndex = rchild(index);
		
		// Look for largest child between index and its left child
		if (leftChildIndex < n && arr[leftChildIndex].total < arr[smallestChildIndex].total) {
			smallestChildIndex = leftChildIndex;
		}

		// Look for largest child between the current largest and index's right child
		if (rightChildIndex < n && arr[rightChildIndex].total < arr[smallestChildIndex].total) {
			smallestChildIndex = rightChildIndex;
		}

		// Final check to see if node i is larger than its direct children
		if (smallestChildIndex !== index) {
			swap(arr, index, smallestChildIndex);
			minHeapify(arr, smallestChildIndex, n);
		}
	}

	/*
		@function 	swap
		@parameter 	arr - the array to sort
		@parameter 	a - index a
		@parameter 	b - index b
		@returns 	n/a
	*/
	function swap (arr, a, b) {
		var temp = arr[a];
		arr[a] = arr[b];
		arr[b] = temp;
	}

	/*
		@function 	lchild
		@parameter 	index - the array index of the node to acquire a left child from
		@returns 	The index of the left child for node i
		@details 	?
	*/
	function lchild (index) {
		return 2*index + 1;
	}

	/*
		@function 	rchild
		@parameter 	index - the array index of the node to acquire a right child from
		@returns 	The index of the right child for node i
		@details 	?
	*/
	function rchild (index) {
		return 2*index + 2;
	}

	/*
		@function 	parent
		@parameter 	index - the index to acquire a parent from
		@returns 	The index of the parent for node i
		@details 	?
	*/
	function parent (index) {
		return Math.floor((i - 1) / 2);
	}

	return {
		heapSort: heapSort
	};
})();
// END Utility Methods



module.exports = router;
// END mdbi/mdbiRoutes/index.js
