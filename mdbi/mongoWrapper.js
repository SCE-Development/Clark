//  PROJECT:        MEANserver
//  Name:           Rolando Javier
//  File:           mongoWrapper.js
//  Date Created:   January 8, 2018
//  Last Modified:  March 25, 2018
//  Details:
//                  This file contains all MongoDB Database wrapper functions meant to execute database queries to the Mongo Server Daemon.
//  Dependencies:
//                  logger.js (main system logger)

"use strict"

// Includes
var settings = require("../util/settings");         // import server system settings
var logger = require(`${settings.util}/logger`);    // import event log system
var ef = require(`${settings.util}/error_formats`); // import error formatting system
var cu = require(`${settings.util}/custom_utility`);// import custom utilities

// Container (Singleton)
const mdb = {};             // The mongodb wrapper class



// Constants
const ASC = 1;
const DESC = -1;



// BEGIN Members
/*
    @member     mdb.Database
    @details    A link to our MongoDB Database; initially set to null, so you'll have to initiate a mongodb connection externally before associating this variable with a database
*/
mdb.database = null;
// END Members



// BEGIN Database Functions
/*
    @function   insertDoc
    @parameter  collection - the string name of the database collection to write to
    @parameter  doc - the JSON object to write to the DB
    @parameter  callback - (optional) a callback function to run after writing to the database. It is passed two parameters:
                    error - if an error occurred, "error" is a MongoError object detailing the issue. Otherwise, it is null.
                    result - if insertion succeeded, "result" is a Collection~insertOneWriteOpResult object. Otherwise, it is null.
    @returns    n/a
    @details    This function inserts a single document to the destination collection and runs a callback indicating the status of the operation
*/
mdb.insertDoc = function (collection, doc, callback) {
    var handlerTag = {"src": "insertDoc"};
    // Check if database collection exists
    mdb.database.collection(collection, {strict: true}, function (error, result) {
        if (error != null) {
            // If an error occurred, log the error and run the callback with it
            logger.log(`Error looking up collection "${collection}": ` + error.toString(), handlerTag);
            if (typeof callback === "function") {
                callback(error, null);
            }
        } else {
            // Else, no error occurred, and the database collection was found; use it to write to the database
            logger.log(`Writing new document ${typeof doc} ${(typeof doc === "object") ? JSON.stringify(doc) : doc}`, handlerTag);
            result.insertOne(doc).then(function (promiseResult) {
                logger.log(`Promise Returned: ${(typeof promiseResult === "object") ? JSON.stringify(promiseResult) : promiseResult}`, handlerTag);
                callback(null, promiseResult);
            });
        }
    });
}

/*
    @function   findCollections
    @parameter  collectionName - a string specifying the name of the collection to find. Passing this parameter as null will force @function findCollections() to list all collections in the database
    @parameter  callback - a callback function to run after writing to the database. It is passed two parameters:
                    error - if an error occurred, "error" is an object detailing the issue. Otherwise, it is null.
                    list - the array list of collections returned by the search
    @returns    n/a
    @details    This function searches for collections fitting the filter criteria if given, or all existing collections if not.
    @note       See MongoDB's Db.listCollections API doc for more information regarding the parameters
*/
mdb.findCollections = function (collectionName, callback) {
    var handlerTag = {"src": "findCollections"};
    var searchCriteria = (collectionName != undefined && typeof collectionName === "string") ? {"name": collectionName} : undefined;

    switch (searchCriteria === undefined) {
        // Valid searchCriteria was given
        case false: {
            logger.log(`Returning search result for collection ${searchCriteria.name}`, handlerTag);
            mdb.database.listCollections(searchCriteria).toArray(callback);
            break;
        }

        // Otherwise, return the full list of database collections
        default: {
            logger.log(`Returning full collection list`, handlerTag);
            mdb.database.listCollections().toArray(callback);
        }
    }
}

/*
    @function   findDocs
    @parameter  collection - the string name of the collection to search through
    @paremeter  filter - a JSON object to filter which documents are returned (i.e. search criteria)
    @parameter  callback - (optional) a callback function to run after the search is performed. It is passed two parameters:
                    error - if an error occurred, "error" is an object detailing the issue. Otherwise, it is null;
                    list - the array list of documents matching the search criteria
    @parameter  constraints - (optional) a JSON object defining options to customize the search
    @returns    n/a
    @details    This function searches for documents fitting the filter criteria if given, or all documents in the collection if not (i.e. given an empty JSON object). The filter criteria is a JSON object which (if not empty) is expected to contain various parameters:
        {
            "someParam0": "criteria0",
            ...
            "someParamN": "criteriaN"
        }
    The parameters and criteria given in the object will vary depending on the structure of the collection you are searching.
    If given, the "constraints" parameter is a JSON object that can take any of the following parameters:
        {
            "limit": ...,       // a number
            "page": ...,        // a number
            "sort": {           // an object
                "asc": [...],   // an array of strings
                "desc": [...]   // an array of strings
            },
            "projection": {     // an object
                ...
            }
        }
    where "limit" is the maximum number of results to return per page, "page" is the number of the page to return, "sort" is an object describing the result set sorting (either ascending or descending order), and "projection" is a JSON object detailing the fields to project (analogous to the "SELECT [columnNames]" statement in SQL).
    If limit is not defined, the "page" parameter is IGNORED. Specifying a "limit" of 0 has the same effect as using no limit constraint at all, and a negative "limit" number is taken as its absolute value (i.e. internally transformed by the MongoDB NodeJS driver). Page numbers are zero-indexed. If either "limit" or "page" are not number types, this function will attempt to convert them to numbers. If the conversion fails, the database query is aborted, and an error is passed to the callback if it was given.
    If "sort" is given, it is checked for "asc" and "desc" as arrays of strings that specify fields to order by. Keys specified in "asc" will be sorted in ascending order, whereas keys specified in "desc" will be sorted in descending order. If neither asc or desc are given (or are not arrays), the database query is aborted, and an error is passed to the callback if it was given.
    @note       See MongoDB's Collection.find() API doc for more information regarding the parameters
*/
mdb.findDocs = function (collection, filter, callback, constraints) {
    var handlerTag = {"src": "findDocs"};

    // Begin by finding the collection
    mdb.database.collection(collection, {strict: true}, function (error, result) {
        if (error != null) {
            // Error? Must report it...
            logger.log(`Error looking up collection "${collection}": ` + error.toString(), handlerTag);
            if (typeof callback === "function") {
                callback(error, null);
            }
        } else {
            var queryCallback = function(err, docs) {
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
            };

            // If no error, then the collection exists. We must now find the document(s) by performing the query
            var queryFail = false;
            var limitMsg = "unlimited";
            var pageMsg = "unpaginated";
            var cursor = result.find(filter);

            // Customize the search with any specified constraints
            if (typeof constraints === "object") {
                var eobject = null;

                // Implement result set projection if specified
                if (!queryFail && typeof constraints.projection !== "undefined") {
                    // Handle any necessary type conversions
                    constraints.projection = cu.numerify(constraints.projection);

                    // Verify that the conversion worked
                    var keys = Object.keys(constraints.projection);
                    for (var i = 0; i < keys.length; i++) {
                        if (typeof constraints.projection[keys[i]] !== "number") {
                            // Number conversion failed; reply with error
                            logger.log(`Error: failed to convert projection values to numbers`, handlerTag);
                            eobject = ef.asCommonStr(ef.struct.convertErr, {"parameter": "constraints.projection"});
                            queryFail = true;
                            break;
                        }
                    }

                    // If no error, perform projection
                    if (!queryFail) {
                        cursor = cursor.project(constraints.projection);
                    }
                }

                // Implement result set limit constraint (and page) if specified
                if (!queryFail && typeof constraints.limit !== "undefined") {
                    // Handle any necessary type conversions
                    constraints = cu.numerify(constraints);

                    // Verify that the limit type conversion worked
                    if (typeof constraints.limit !== "number") {
                        // Conversion failed; respond with an error
                        logger.log(`Error: failed to convert limit constraint to number`, handlerTag);
                        eobject = ef.asCommonStr(ef.struct.convertErr, {"parameter": "constraints.limit"});
                        queryFail = true;
                    } else {
                        limitMsg = `at most ${constraints.limit}`;
                        // Modify cursor with a limit
                        cursor = cursor.limit(constraints.limit);

                        // Verify that the page type conversion worked (if page was specified at all, that is!)
                        var pageType = typeof constraints.page;
                        if (pageType !== "undefined") {
                            if (pageType !== "number") {
                                // Conversion failed; respond with an error
                                logger.log(`Error: failed to convert page constraint to number`, handlerTag);
                                eobject = ef.asCommonStr(ef.struct,convertErr, {"parameter": "constraints.page"});
                                queryFail = true;
                            } else {
                                pageMsg = `page ${constraints.page}`;

                                // Modify cursor with page (if any)
                                cursor = cursor.skip(constraints.limit * constraints.page);
                            }
                        }
                    }
                }

                // Implement result set sorting constraint if specified
                if (!queryFail && typeof constraints.sort === "object") {
                    var sortOrders = [];    // make an empty array of sort specs
                    var ascKeys = constraints.sort.asc;
                    var descKeys = constraints.sort.desc;

                    // Verify that the sort constraint is properly formatted
                    if (!Array.isArray(ascKeys) && !Array.isArray(descKeys)) {
                        // Invalid sort object provided; respond with error
                        logger.log(`Error: invalid sort order specified`, handlerTag);
                        eobject = ef.asCommonStr(ef.struct.unexpectedValue, {"parameter": "constraints.sort"});
                        queryFail = true;
                    } else {
                        // Compile ascending sort specs
                        if (Array.isArray(ascKeys)) {
                            for (var i = 0; i < ascKeys.length; i++) {
                                sortOrders.push([ascKeys[i], ASC]);
                            }
                        }

                        // Compile descending sort specs
                        if (Array.isArray(descKeys)) {
                            for (var i = 0; i < descKeys.length; i++) {
                                sortOrders.push([descKeys[i], DESC]);
                            }
                        }

                        // Modify cursor with the sort order spec
                        // logger.log(`order:${sortOrders.toString()}\ndlen:${(typeof descKeys !== "undefined") ? descKeys.length : 0}\nalen:${(typeof ascKeys !== "undefined") ? ascKeys.length : 0}`, handlerTag);   // debug
                        cursor = cursor.sort(sortOrders);
                    }
                }

                // Handle any query failure
                if (queryFail) {
                    // Pass an error to callback
                    queryCallback(eobject, null);
                }
            }

            // Compile query to an array and pass to callback
            if (!queryFail) {
                logger.log(`Finding ${limitMsg} docs matching ${typeof filter} ${(typeof filter === "object") ? JSON.stringify(filter) : filter} in collection "${collection}" (${pageMsg})`, handlerTag);
                cursor.toArray(queryCallback);
            }
        }
    });
}

/*
    @function   aggregateDocs
    @parameter  collection - the string name of the collection to search from
    @parameter  aggregation - the array of MongoDB JSON aggregation commands used to run the pipeline
    @parameter  callback - a callback function to run after an aggregation attempt is executed. It is passed two parameters:
        "error" - if no error occurred, this is null. Otherwise, it is an object detailing the issue.
        "list" - if no error occurred, this is the list (an array) of documents resulting from the aggregation. Otherwise, it is null.
    @parameter  agOptions - (optional) a JSON object containing parameters that customize how the aggregation is performed. See MongoDB's "Collection.aggregate()" for more info on what to provide the "agOptions" parameter
    @returns    n/a
    @details    This function makes use of the MongoDB Aggregation Pipeline, allowing the end user to perform custom queries without relying on a pre-determined implementation. Thus, this function offers the end user greater flexibility when search for (and performing calculations with) documents.
    @note       A great deal of care must be taken to ensure that only authorized users have access to this function. Without being restricted by RESTful endpoint implementations, this function's query versatility is a double-edged sword between user flexibility and database integrity/security.
*/
mdb.aggregateDocs = function (collection, aggregation, callback, agOptions) {
    var handlerTag = {"src": "aggregateDocs"};

    // Begin by finding the collection
    // callback(null, [{"memberID": 1}]);   // test
    mdb.database.collection(collection, {strict: true}, function (error, result) {
        if (error) {
            // Error? Must report it...
            logger.log(`Error looking up collection "${collection}": ${error.toString()}`, handlerTag);
            if (typeof callback === "function") {
                callback(error, null);
            }
        } else if (!Array.isArray(aggregation)) {
            // Not an array? Error
            logger.log(`Given aggregation is not an array of objects!`, handlerTag);
            if (typeof callback === "function") {
                var errStr = ef.asCommonStr(ef.struct.invalidDataType, {"parameter": "aggregation"});
                callback(errStr, null);
            }
        } else {
            var queryCallback = function(err, docs) {
                switch (err === null) {
                    // No error; proceed normally
                    case true: {
                        logger.log(`Document(s) aggregation succeeded`, handlerTag);
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
            };

            // Perform aggregation
            var customOptions = (typeof agOptions === "undefined") ? null : agOptions;
            logger.log(`Finding docs in collection "${collection}" using the Aggregation Pipeline`, handlerTag);
            result.aggregate(aggregation, function (err, list) {
                if (err !== null) {
                    logger.log(`Error performing aggregation: ${err.toString()}`, handlerTag);
                    queryCallback(err, null);
                } else {
                    queryCallback(null, list);
                }
            });
        }
    });
};

/*
    @function   findDocCount
    @parameter  collection - the string name of the collection to search from
    @parameter  filter - a JSON object to filter which documents are returned (i.e. search criteria)
    @parameter  callback - a callback function to run after a successful query count. It is passed two parameters
        "error" - if no error occurred, this is null. Otherwise it is an object detailing the issue.
        "count" - if no error occurred, this is the count of the result set from the query. Otherwise, it is null.
    @returns    n/a
    @details    This function acquires the count of all documents found with the given filter criteria and collection name specified. If the collection is not found in the database, the callback is passed an error.
    The filter criteria is a JSON object which is expected to contain various parameters:
        {
            "someParam0": "criteria0",
            ...
            "someParamN": "criteriaN"
        }
    The parameters and criteria given in the object will vary depending on the structure of the collection you are searching.
    @note       This function may seem redundant; you could naively count the number of elements in the array passed to the "findDocs()" callback. However, the "findDocs()" function employs the MongoDB "Cursor.toArray()" API, which can cause significant overhead (i.e. due to RAM allocation of the results) if you use it on a large result set. Thus, using the "findDocs()" function solely to count the number of results can be quite wasteful on time and resources. This function uses the MongoDB "Cursor.count()" function to acquire a result set count without RAM allocation, making it arguably faster and better-suited for result set counting than "findDocs()".
    @note       See MongoDB's Collection.find() API doc for more information regarding the parameters
*/
mdb.findDocCount = function (collection, filter, callback) {
    var handlerTag = {"src": "findDocCount"};
    var documentCount = -1;

    // Begin by finding the collection
    mdb.database.collection(collection, {"strict": true}, function (error, result) {
        if (error) {
            logger.log(`Error looking up collection "${collection}"`, handlerTag);
            if (typeof callback === "function") {
                callback(error, null);
            }
        } else {
            var cursor = result.find(filter);

            cursor.count(false, null, function (err, count) {
                if (err) {
                    logger.log(`Error: failed to acquire count`, handlerTag);
                    callback(err, null);
                } else {
                    logger.log(`Result set count is ${count}`, handlerTag);
                    callback(null, count);
                }
            });
        }
    });
};

/*
    @function   deleteOneDoc
    @parameter  collection - the string name of the collection to delete from
    @parameter  filter - a JSON object to filter which document is deleted (i.e. search criteria)
    @parameter  callback - a callback function to run after the deletion is performed. It is passed two parameters:
                    error - if an error occurred, "error" is a MongoError object detailing the isssue. Otherwise, it is null.
                    result - if delete was successful, "result" is a Mongo Collection~deleteWriteOpResult object. Otherwise, it is null.
    @returns    n/a
    @details    This function searches through the specified collection for the FIRST document fitting the search criteria specified in filter. If found, it deletes the entry and runs the callback after the attempt completed, regardless of a successful or failed delete operation
    @note       See MongoDB's collection.deleteOne() API doc for more information regarding the parameters
*/
mdb.deleteOneDoc = function (collection, filter, callback) {
    var handlerTag = {"src": "deleteOneDoc"};

    // Begin by finding the collection
    mdb.database.collection(collection, {strict: true}, function (error, result) {
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
    @function   deleteManyDocs
    @parameter  collection - the string name of the collection to delete from
    @parameter  filter - a JSON object to filter which documents are deleted (i.e. search criteria)
    @parameter  callback - a callback function to run after the deletion is performed. It is passed two parameters:
                    error - if an error occurred, "error" is a MongoError object detailing the issue. Otherwise, it is null.
                    result - if delete was successful, "result" is a Mongo Collection~deleteWriteOpResult object. Otherwise, it is null.
    @returns    n/a
    @details    This function searches through the specified collection for ALL documents matching the search criteria specified by filter (or all documents within the collection, if filter is an empty JSON object). If found, it deletes all the matched entries and runs the callback after the attempt completed, regardless of a successful of failed delete operation.
    @note       See MongoDB's collection.deleteMany() API doc for more information regarding the parameters
*/
mdb.deleteManyDocs = function (collection, filter, callback) {
    var handlerTag = {"src": "deleteManyDocs"};
    var hasFilter = (filter === {}) ? false : true;

    // Begin by finding the collection
    mdb.database.collection(collection, {strict: true}, function (error, result) {
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
    @function   updateOneDoc
    @parameter  collection - the string name of the collection to update from
    @parameter  filter - a JSON object to filter which document is updated (i.e. search criteria)
    @parameter  update - a JSON object describing how to update the document
    @parameter  callback - a callback function to run after the update is performed. It is passed two parameters:
                    error - if an error occurred, "error" is a MongoError object detailing the issue. Otherwise, it is null.
                    result - if update was successful, "result" is a Mongo Collection~updateWriteOpResult object. Otherwise, it is null.
    @returns    n/a
    @details    This function searches through the specified collection for the FIRST document matching the search criteria specified by filter. If found, it then updates the document in the way described by the update object (i.e. via various MongoDB update operators). Then, the function runs the callback, regardless of a successful or failed update operation.
    @note       See MongoDB's collection.updateOne() API doc for more information regarding the parameters 
*/
mdb.updateOneDoc = function (collection, filter, update, callback) {
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
    mdb.database.collection(collection, {strict: true}, function (error, result) {
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



module.exports = mdb;
// END mongoWrapper.js
