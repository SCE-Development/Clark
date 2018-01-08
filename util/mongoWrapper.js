//  PROJECT:        MEANserver
//  Name:           Rolando Javier
//  File:           mongoWrapper.js
//  Date Created:   January 8, 2018
//  Last Modified:  January 8, 2018
//  Details:
//                  This file contains all MongoDB Database wrapper functions meant to execute database queries to the Mongo Server Daemon.
//  Dependencies:
//                  logger.js (main system logger)

// Includes
var logger = require("./logger");

// Containers
const mdb = {};             // The mongo wrapper class (singleton)

// Members
/*
    @member     mdb.Database
    @details    A link to our MongoDB Database; initially set to null, so you'll have to initiate a mongodb connection externally before associating this variable with a database
*/
mdb.database = null;



// Database Functions
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
    @returns    n/a
    @details    This function searches for documents fitting the filter criteria if given, or all documents in the collection if not (i.e. given an empty JSON object). The filter criteria is a JSON object which (if not empty) is expected to contain various parameters:
        {
            "someParam0": "criteria0",
            ...
            "someParamN": "criteriaN"
        }
    The parameters and criteria given in the object will vary depending on the structure of the collection you are searching
    @note       See MongoDB's Collection.find() API doc for more information regarding the parameters
*/
mdb.findDocs = function (collection, filter, callback) {
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
    @parameter  collection - the string name of the collection to delete from
    @parameter  filter - a JSON object to filter which document is updated (i.e. search criteria)
    @parameter  update - a JSON object describing how to update the document
    @parameter  callback - a callback function to run after the update is performed. It is passed two parameters:
                    error - if an error occurred, "error" is a MongoError object detailing the issue. Otherwise, it is null.
                    result - if delete was successful, "result" is a Mongo Collection~updateWriteOpResult object. Otherwise, it is null.
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


module.exports = mdb;
// END mongoWrapper.js
