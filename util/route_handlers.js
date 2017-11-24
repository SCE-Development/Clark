// PROJECT: 		MEANserver
// Name: 			Rolando Javier
// File: 			route_handlers.js
// Date Created: 	October 26, 2017
// Last Modified: 	November 5, 2017
// Details:
//				 	This file abstracts all route handler functions to be used by server.js. The server.js file
//				 	takes these and places them to their desired endpoints. This frees up the server code from
//				 	the clutter introduced by placing all route handlers in server.js. All functions defined here
// 					are written to service requests for their corresponding endpoints (defined in server.js)
// Dependencies:
// 					JQuery v1.12.4
// 					ExpressJS 4.x
// 					body-parser (NPM middleware req'd by ExpressJS 4.x to acquire POST data parameters: "npm install --save body-parser")

"use strict"

// Includes
var settings = require("./settings");	// acquire system settings
var logger = require("./logger");		// acquire main system logger
var assert = require("assert");

// Global Constants
const ALL_COLLECTIONS = null;

// Containers
var handle_map = {};		// A map of all endpoint handlers
var database = null;		// A link to our MongoDB database

// ExpressJS transaction options
var options = {
	root: settings.root,	// Server root directory (i.e. where server.js is located)
	dotfiles: "deny",
	headers: {
		"x-timestamp": Date.now(),
		"x-sent": true
	}
};

// MongoDB client
var mongo = require("mongodb").MongoClient;
mongo.connect("mongodb://localhost:27017/testdb", function (err, db) {
	// Log connection status, and error (if any)
	if (err) {
		logger.log("Could not connect to Mongo:\n" + err);
		assert.equal(err, null);	// will throw error if not null
	} else {
		logger.log("Connected to Mongo");

		// First, acquire link to database
		database = db;

		// Then, write server connection information
		var postmark = logger.log("Database connection established");
		insertDoc("serverStarts", {"login": postmark}, function (error) {
			if (error != null) {
				logger.log("Postmark not written to database");
			} else {
				logger.log("Postmark successfully written to server");
			}
		});
	}
});



// BEGIN Handler Functions
/*	
	@function	rootHandler
	@parameter	request - the web request object provided by express.js
	@parameter	response - the web response object provided by express.js
	@returns	n/a
	@details 	This function handles all requests for the server root (i.e. "/"). Used on a GET request
*/
handle_map.rootHandler = function (request, response) {			// GET request on root dir (login page-> index.html)
	response.set("Content-Type", "text/html");
	response.sendFile("index.html", options, function (error) {
		if (error) {
			logger.log(error);
			response.status(500).end();
		} else {
			logger.log(`Sent index.html to ${settings.port}`);
			response.end();
		}
	});
};

/*
	@function	loginHandler
	@parameter	request - the web request object provided by express.js
	@parameter	response - the web response object provided by express.js
	@returns	n/a
	@details 	This function handles login endpoint requests (i.e. for login). Used on a POST request
*/
handle_map.loginHandler = function (request, response) {			// POST request: RESTful login
	var handlerTag = {"src": "loginHandler"};
	logger.log(`Login request from ip ${request.ip}`, handlerTag);
	logger.log(request.toString(), handlerTag);
	response.set("Content-Type", "text/javascript");
	response.sendFile("js/index.js", options, function (error) {
		if (error) {
			logger.log(error, handlerTag);
			response.status(500).end();
		} else {
			logger.log(`Login successful for client on ${settings.port}`, handlerTag);
			response.end();
		}
	});
};

/*
	@function	testHandler
	@parameter	request - the web request object provided by express.js
	@parameter	response - the web response object provided by express.js
	@returns	n/a
	@details 	This function serves the test page for all "/test" endpoint requests. Used on a GET request
*/
handle_map.testHandler = function (request, response) {
	var handlerTag = {"src": "testHandler"};
	logger.log(`Test page requested from ip ${request.ip}`, handlerTag);
	logger.log(request.toString(), handlerTag);
	response.set("Content-Type", "text/html");	// forces the browser to interpret the file as an interactive webpage
	response.sendFile("test.html", options, function (error) {
		if (error) {
			logger.log(error, handlerTag);
			response.status(500).end();
		} else {
			logger.log(`Test Handler passed to client ip ${request.ip} on port ${settings.port}`, handlerTag);
			response.end();
		}
	});
};

/*
	@function 	testWriteHandler
	@parameter	request - the web request object provided by express.js
	@parameter	response - the web response object provided by express.js
	@returns	To Client: If successful, returns a success status (200). Otherwise, returns a server error status (500) and populates the reponse header with the error's details
	@details 	This function performs a database write to the db from the test page for all "/test/write" endpoint requests. Used on a POST request
*/
handle_map.testWriteHandler = function (request, response) {
	var handlerTag = {"src": "testWriteHandler"};
	logger.log(`Client @ ip ${request.ip} is requesting to write to the database`, handlerTag);
	
	// Perform Write
	insertDoc("testMsg", {"sender": "RJ", "msg": "hi"}, function (error) {	// Note: I really should validate this data before passing it to the db
		// Will put inside insertDoc's callback:
		if (error == null) {
			response.status(200).send("Wrote to database").end();
		} else {
			response.status(500).send("Couldn't write to database").end();
		}
	});
};

/*
	@function 	testFindHandler
	@parameter	request - the web request object provided by express.js
	@parameter	response - the web response object provided by express.js
	@returns	To Client: If successful, returns a success status (200) and the list of collections found. Otherwise, returns a server error status (500) and populates the response header with the error's details
	@details 	This function serves any and all requests to the "/test/find" endpoint by performing a search of any collections matching the search parameters given in the request body's JSON data. This data is exepected to appear in the following format:
		{
			"name": "string of the collection name to find"
		}
	If this data is given, the function will search for the collection whose name matches the object's "name" member.
	If the data field is not given (i.e. instead of a JSON object in the Request body, we have null), the function will return a list of all collections
*/
handle_map.testFindHandler = function (request, response) {
	var handlerTag = {"src": "testFindHandler"};
	var hasBody = (Object.keys(request.body).length > 0);
	var searchCriteria = (hasBody) ? delintRequestBody(request.body).name : ALL_COLLECTIONS;

	logger.log(`Client @ ip ${request.ip} is requesting to find ${(searchCriteria === ALL_COLLECTIONS) ? "all collections" : ("collection " + JSON.stringify(searchCriteria))} from the database`, handlerTag);

	// Testing
	// logger.log(`REQ ROUTE: ${JSON.stringify(request.route)}`);
	// logger.log(`REQ QUERY: ${JSON.stringify(request.query)}`);
	// logger.log(`REQ BODY: ${JSON.stringify(searchCriteria)}`);
	// response.status(200).send("Testing").end();

	findCollections(searchCriteria, function (err, list) {
		if (err == null) {
			logger.log(`A result was returned`, handlerTag);
			response.status(200).send(JSON.stringify(list)).end();
		} else {
			logger.log(`An error occurred`, handlerTag);
			response.status(500).send(err).end();
		}
	});
};

/*
	@function 	testFindDocHandler
	@parameter	request - the web request object provided by express.js
	@parameter	response - the web response object provided by express.js
	@returns	To Client: If successful, returns a success status (200) and the list of documents found. Otherwise, returns a server error status (500) and populates the response header with the error's details
	@details 	(Intended for use in testing the database querying functions) This function handles all endpoint requests to the "/test/finddoc" endpoint. It performs a query on the database and returns any results matching the search criteria given by the Request header's data field. The data field is expected to be a JSON object in the following format:
		{
			"collection": "string name of collection",
			"search": {...}
		}
	where the "search" parameter is a JSON object containing the search parameters expected by the findDocs() function. Read the findDocs() description for more details on what to give to the "search" parameter.
*/
handle_map.testFindDocHandler = function (request, response) {
	var handlerTag = {"src": "testFindDocHandler"};
	var hasBody = (Object.keys(request.body).length > 0);
	var searchCriteria = (hasBody) ? numerify(delintRequestBody(request.body)) : {};	// either the filter, or empty JSON
	// response.status(200).send(`Test: ${JSON.stringify(searchCriteria)}`).end();	// test

	// Find documents
	logger.log(`Client @ ip ${request.ip} is requesting to find ${(searchCriteria === {}) ? "all documents" : ("documents matching \"" + ((typeof searchCriteria.search === "object") ? JSON.stringify(searchCriteria.search) : searchCriteria.search) + "\"")} from the ${searchCriteria.collection} collection in the database`, handlerTag);
	findDocs(searchCriteria.collection, searchCriteria.search, function (error, list) {
		if (error != null) {
			logger.log(`An error occurred`, handlerTag);
			response.status(500).send(error).end();
		} else {
			logger.log(`A result was returned`, handlerTag);
			response.status(200).send(JSON.stringify(list)).end();
		}
	});
};

/*
	@function 	testDeleteOneDocHandler
	@parameter	request - the web request object provided by express.js
	@parameter	response - the web response object provided by express.js
	@returns 	To Client: If successful, returns a success status (200) and an object detailing the result of the operation. Otherwise, returns a server error status (500) and populates the response header with the error's details
	@details 	(Intended for use in testing the database single-deleting function) This function handles all endpoint requests to the "/test/deletedoc" endpoint. It performs a deletion request to the database using the Request header's data field as search criteria to select which document to delete. The data field is expected to be a JSON object with the following format:
		{
			"collection": "string name of collection",
			"search": {...}
		}
	where the "search" parameter is a JSON object containing the search parameters expected by the deleteOneDoc() function. Read the deleteOneDoc() description for more details on what to give the "search" parameter
*/
handle_map.testDeleteOneDocHandler = function (request, response) {
	var handlerTag = {"src": "testDeleteOneDocHandler"};
	var hasBody = (Object.keys(request.body).length > 0);
	var searchCriteria = (hasBody) ? numerify(delintRequestBody(request.body)) : {};

	// Find documents
	logger.log(`Client @ ip ${request.ip} is requesting to delete a document matching ${(typeof searchCriteria.search === "object") ? JSON.stringify(searchCriteria.search) : searchCriteria.search} from the ${searchCriteria.collection} collection in the database`, handlerTag);
	deleteOneDoc(searchCriteria.collection, searchCriteria.search, function (error, result) {
		if (error != null) {
			logger.log(`An error occurred`, handlerTag);
			response.status(500).send(error).end();
		} else {
			logger.log(`A result was returned`, handlerTag);
			response.status(200).send((typeof result === "object") ? JSON.stringify(result) : result).end();
		}
	});
};

/*
	@function 	testDeleteManyDocsHandler
	@parameter	request - the web request object provided by express.js
	@parameter	response - the web response object provided by express.js
	@returns 	To Client: If successful, returns a success status (200) and an object detailing the result of the operation. Otherwise, returns a server error status (500) and populates the response header with the error's details
	@details 	(Intended for use in testing the database multi-deleting function) This function handles all endpoint requests to the "/test/deletemanydocs" endpoint. It performs a deletion request to the database using the Request header's data field as search criteria to select which document to delete. The data field is expected to be a JSON object with the following format:
		{
			"collection": "string name of collection",
			"search": {...}
		}
	where the "search" parameter is a JSON object containing the search parameters expected by the deleteManyDocs() function. Read the deleteManyDocs() description for more details on what to give the "search" parameter
*/
handle_map.testDeleteManyDocsHandler = function (request,response) {
	var handlerTag = {"src": "testDeleteOneDocHandler"};
	var hasBody = (Object.keys(request.body).length > 0);
	var searchCriteria = (hasBody) ? numerify(delintRequestBody(request.body)) : {};

	// Find documents
	logger.log(`Client @ ip ${request.ip} is requesting to delete all documents ${(searchCriteria.search == {}) ? "" : ("matching " + ((typeof searchCriteria.search === "object") ? JSON.stringify(searchCriteria.search) : searchCriteria.search))} from the ${searchCriteria.collection} collection in the database`, handlerTag);
	deleteManyDocs(searchCriteria.collection, searchCriteria.search, function (error, result) {
		if (error != null) {
			logger.log(`An error occurred`, handlerTag);
			response.status(500).send(error).end();
		} else {
			logger.log(`A result was returned`, handlerTag);
			response.status(200).send((typeof result === "object") ? JSON.stringify(result) : result).end();
		}
	});
};

/*
	@function 	testUpdateOneDocHandler
	@parameter	request - the web request object provided by express.js
	@parameter	response - the web response object provided by express.js
	@returns 	To Client: If successful, returns a success status (200). Otherwise, returns a server error status (500) and populates the response header with the error's details
	@details 	(Intended for use in testing the database single-update function) This function handles all endpoint requests to the "/test/updatedoc" endpoint. It performs an update request to the database using the Request header's data field as search criteria to select which document to update. The data field is expected to be a JSON object with the following format:
		{
			"collection": "string name of collection",
			"search": {...},
			"update": {...}
		}
	where the "search" parameter is a JSON object containing the filter parameters expected by the updateOneDoc() function, and "update" is a JSON object containing the update commands expected by the updateOneDoc() function. Read the updateOneDoc() description for more details on what to give the "search" parameter
*/
handle_map.testUpdateOneDocHandler = function (request, response) {
	var handlerTag = {"src": "testUpdateOneDocHandler"};
	var hasBody = (Object.keys(request.body).length > 0);
	var searchCriteria = (hasBody) ? numerify(delintRequestBody(request.body)) : {};

	// Find documents
	logger.log(`Client @ ip ${request.ip} is requesting to update a document matching ${typeof searchCriteria.search} ${(typeof searchCriteria.search === "object") ? JSON.stringify(searchCriteria.search) : searchCriteria.search} from the ${searchCriteria.collection} collection in the database using ${typeof searchCriteria.update} ${(typeof searchCriteria.update === "object") ? JSON.stringify(searchCriteria.update) : searchCriteria.update}`, handlerTag);
	updateOneDoc(searchCriteria.collection, searchCriteria.search, searchCriteria.update, function (error, result) {
		if (error != null) {
			logger.log(`An error occurred`, handlerTag);
			response.status(500).send(error).end();
		} else {
			logger.log(`A result was returned`, handlerTag);
			response.status(200).send((typeof result === "object") ? JSON.stringify(result) : result).end();
		}
	});
};
// END Handler Functions



// BEGIN Database Functions
/*
	@function 	insertDoc
	@parameter	collection - the string name of the database collection to write to
	@parameter	doc - the JSON object to write to the DB
	@parameter 	callback - (optional) a callback function to run after writing to the database. It is passed two parameters:
					error - if an error occurred, "error" is an object detailing the issue. Otherwise, it is null.
	@returns	n/a
	@details 	This function inserts a single document to the destination collection
*/
function insertDoc (collection, doc, callback) {
	var handlerTag = {"src": "insertDoc"};
	var validInput = (collection !== null && doc !== null && (typeof doc) === "object") ? true : false;

	// Make sure that the parameters are not invalid
	if (validInput) {
		// Check if database collection exists
		// database.collection(collection).insertOne(doc);
		database.collection(collection, {strict: true}, function (error, result) {
			if (error != null) {
				// If an error occurred, log the error and 
				logger.log(`Error looking up collection "${collection}": ` + error.toString(), handlerTag);
				if (typeof callback === "function") {
					callback(error);
				}
			} else {
				// Else, no error occurred, and the database collection was found; use it to write to the database
				result.insertOne(doc);
				logger.log(`Successfully wrote "${JSON.stringify(doc)}" to collection "${collection}"`, handlerTag);
				if (typeof callback === "function") {
					callback(null);
				}
			}
		});
	} else {
		logger.log(`Error: Invalid input`, handlerTag);
	}
}

/*
	@function 	findCollections
	@parameter	collectionName - a string specifying the name of the collection to find. Passing this parameter as null will force @function findCollections() to list all collections in the database
	@parameter 	callback - a callback function to run after writing to the database. It is passed two parameters:
					error - if an error occurred, "error" is an object detailing the issue. Otherwise, it is null.
					list - the array list of collections returned by the search
	@returns	n/a
	@details 	This function searches for collections fitting the filter criteria if given, or all existing collections if not.
	@note 		See MongoDB's Db.listCollections API doc for more information regarding the parameters
*/
function findCollections (collectionName, callback) {
	var handlerTag = {"src": "findCollections"};
	var searchCriteria = (collectionName != undefined && typeof collectionName === "string") ? {"name": collectionName} : undefined;

	switch (searchCriteria === undefined) {
		// Valid searchCriteria was given
		case false: {
			logger.log(`Returning search result for collection ${searchCriteria.name}`, handlerTag);
			database.listCollections(searchCriteria).toArray(callback);
			break;
		}

		// Otherwise, return the full list of database collections
		default: {
			logger.log(`Returning full collection list`, handlerTag);
			database.listCollections().toArray(callback);
		}
	}
}

/*
	@function 	findDocs
	@parameter 	collection - the string name of the collection to search through
	@paremeter 	filter - a JSON object to filter which documents are returned (i.e. search criteria)
	@parameter 	callback - (optional) a callback function to run after the search is performed. It is passed two parameters:
					error - if an error occurred, "error" is an object detailing the issue. Otherwise, it is null;
					list - the array list of documents matching the search criteria
	@returns	n/a
	@details 	This function searches for documents fitting the filter criteria if given, or all documents in the collection if not (i.e. given an empty JSON object). The filter criteria is a JSON object which (if not empty) is expected to contain various parameters:
		{
			"someParam0": "criteria0",
			...
			"someParamN": "criteriaN"
		}
	The parameters and criteria given in the object will vary depending on the structure of the collection you are searching
	@note 		See MongoDB's Collection.find() API doc for more information regarding the parameters
*/
function findDocs (collection, filter, callback) {
	var handlerTag = {"src": "findDocs"};

	// Begin by finding the collection
	database.collection(collection, {strict: true}, function (error, result) {
		if (error != null) {
			// Error? Must report it...
			logger.log(`Error looking up collection "${collection}": ` + error.toString(), handlerTag);
			if (typeof callback === "function") {
				callback(error, null);
			}
		} else {
			// If no error, then the collection exists. We must now find the document(s)
			logger.log(`Finding docs matching ${typeof filter} ${(typeof filter === "object") ? JSON.stringify(filter) : filter} in collection "${collection}"`, handlerTag);
			result.find(filter).toArray(function(err, docs) {
				switch (err === null) {
					// No error; proceed normally
					case true: {
						logger.log(`Document(s) search succeeded`, handlerTag);
						if (typeof callback === "function") {
							callback(null,docs);
						}
						break;
					}

					// Err was present
					default: {
						logger.log(`Document(s) search failed`, handlerTag);
						if (typeof callback === "function") {
							callback(err,null);
						}
						break;
					}
				}
			});
		}
	});
}

/*
	@function 	deleteOneDoc
	@parameter 	collection - the string name of the collection to delete from
	@parameter 	filter - a JSON object to filter which document is deleted (i.e. search criteria)
	@parameter 	callback - a callback function to run after the deletion is performed. It is passed two parameters:
					error - if an error occurred, "error" is a MongoError object detailing the isssue. Otherwise, it is null.
					result - if delete was successful, "result" is a Mongo Collection~deleteWriteOpResult object. Otherwise, it is null.
	@returns 	n/a
	@details 	This function searches through the specified collection for the FIRST document fitting the search criteria specified in filter. If found, it deletes the entry and runs the callback after the attempt completed, regardless of a successful or failed delete operation
	@note 		See MongoDB's collection.deleteOne() API doc for more information regarding the parameters
*/
function deleteOneDoc (collection, filter, callback) {
	var handlerTag = {"src": "deleteOneDoc"};

	// Begin by finding the collection
	database.collection(collection, {strict: true}, function (error, result) {
		if (error != null) {
			// If error, report the error
			logger.log(`Error looking up collection "${collection}": ${error.toString()}`, handlerTag);
			if (typeof callback === "function") {
				callback(error, null);
			}
		} else {
			// If no error, search for and delete the FIRST relevant doc within the collection
			logger.log(`Deleting first doc matching ${typeof filter} ${(typeof filter === "object") ? JSON.stringify(filter) : filter} in collection "${collection}"`, handlerTag);
			result.deleteOne(filter).then(function (promiseResult) {
				logger.log(`Promise Returned: ${(typeof promiseResult === "object") ? JSON.stringify(promiseResult) : promiseResult}`, handlerTag);
				if (typeof callback === "function") {
					callback(null, promiseResult);
				}
			});
		}
	});
}

/*
	@function 	deleteManyDocs
	@parameter 	collection - the string name of the collection to delete from
	@parameter 	filter - a JSON object to filter which documents are deleted (i.e. search criteria)
	@parameter 	callback - a callback function to run after the deletion is performed. It is passed two parameters:
					error - if an error occurred, "error" is a MongoError object detailing the issue. Otherwise, it is null.
					result - if delete was successful, "result" is a Mongo Collection~deleteWriteOpResult object. Otherwise, it is null.
	@returns 	n/a
	@details 	This function searches through the specified collection for ALL documents matching the search criteria specified by filter (or all documents within the collection, if filter is an empty JSON object). If found, it deletes all the matched entries and runs the callback after the attempt completed, regardless of a successful of failed delete operation.
	@note 		See MongoDB's collection.deleteMany() API doc for more information regarding the parameters
*/
function deleteManyDocs (collection, filter, callback) {
	var handlerTag = {"src": "deleteManyDocs"};
	var hasFilter = (filter === {}) ? false : true;

	// Begin by finding the collection
	database.collection(collection, {strict: true}, function (error, result) {
		if (error != null) {
			// If error, report the error
			logger.log(`Error looking up collection "${collection}": ${error.toString()}`, handlerTag);
			if (typeof callback === "function") {
				callback(error, null);
			}
		} else {
			// If no error, search for and delete ALL relevant docs within the collection
			logger.log(`Deleting all docs ${(hasFilter) ? ("matching " + typeof filter + " " + (typeof filter === "object") ? JSON.stringify(filter) : filter) : ""} in collection "${collection}"`, handlerTag);
			result.deleteMany(filter).then(function (promiseResult) {
				logger.log(`Promise Returned: ${(typeof promiseResult === "object") ? JSON.stringify(promiseResult) : promiseResult}`, handlerTag);
				callback(null, promiseResult);
			});
		}
	});
}

/*
	@function 	updateOneDoc
	@parameter 	collection - the string name of the collection to delete from
	@parameter 	filter - a JSON object to filter which document is updated (i.e. search criteria)
	@parameter 	update - a JSON object describing how to update the document
	@parameter 	callback - a callback function to run after the update is performed. It is passed two parameters:
					error - if an error occurred, "error" is a MongoError object detailing the issue. Otherwise, it is null.
					result - if delete was successful, "result" is a Mongo Collection~updateWriteOpResult object. Otherwise, it is null.
	@returns 	n/a
	@details 	This function searches through the specified collection for the FIRST document matching the search criteria specified by filter. If found, it then updates the document in the way described by the update object (i.e. via various MongoDB update operators). Then, the function runs the callback, regardless of a successful or failed update operation.
	@note 		See MongoDB's collection.updateOne() API doc for more information regarding the parameters 
*/
function updateOneDoc (collection, filter, update, callback) {
	var handlerTag = {"src": "updateOneDoc"};
	var hasFilter = (filter === {} || filter === null || filter === undefined || typeof filter !== "object") ? false : true;
	var hasUpdate = (update === {} || update === null || update === undefined || typeof update !== "object") ? false : true;

	// Enforce the definition of filter and update objects
	if (!hasFilter || !hasUpdate) {
		logger.log(`Error before updating: Operation ineffective with undefined filter and update objects`, handlerTag);
		if (typeof callback === "function") {
			callback({
				"error": `Error before updating: Operation ineffective with undefined filter and update objects`
			}, null);
		}
		return;
	}

	// Begin by finding the collection
	database.collection(collection, {strict: true}, function (error, result) {
		if (error != null) {
			// If error, report the error
			logger.log(`Error looking up collection "${collection}": ${error.toString()}`, handlerTag);
			if (typeof callback === "function") {
				callback(error, null);
			}
		} else {
			// If no error, search for and update the FIRST relevant doc within the collection
			logger.log(`Updating first doc matching ${typeof filter} ${filter} in collection "${collection}"`, handlerTag);
			result.updateOne(filter, update).then(function (promiseResult) {
				logger.log(`Promise Returned: ${(typeof promiseResult === "object") ? JSON.stringify(promiseResult) : promiseResult}`, handlerTag);
				if (typeof callback === "function") {
					callback(null, promiseResult);
				}
			});
		}
	});
}
// END Database Functions



// BEGIN Utility Methods
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
	// logger.log(`Delinting ${JSON.stringify(body)}`, handlerTag);	// Debug
	var newBody = body;
	var newBodyKeys = Object.keys(newBody);	// array of keys
	for(var i = 0; i < newBodyKeys.length; i++) {
		var qmarkIndex = newBodyKeys[i].indexOf("?");
		if (qmarkIndex !== -1) {
			// logger.log(`Lint found at ${newBodyKeys[i]} index ${qmarkIndex}`, handlerTag);	// Debug
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
// END Utility Methods



module.exports = handle_map;
// END route_handlers.js 