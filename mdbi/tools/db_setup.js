//	PROJECT: 		RJS
// 	Name: 			Rolando Javier
// 	File: 			db_setup.js
// 	Date Created: 	Decembers 9, 2018
// 	Last Modified: 	Decembers 9, 2018
// 	Details:
// 					This file contains a setup routine that automates the setup of the database.
//					It uses the schemaManager class to acquire a list of schemas that are required
//					in the database pointed to by "mongo_settings.js". The script can be run using
//					the command "node db_setup.js [option]", where various options can be used.
//					Use the "--help" option for more details on what options can be used in which
//					context.
// 	Dependencies:
//					mongo_settings.js
// 					MongoDB v3.4.x+
// TODO: Make server activations and autoincrement managed by this script or the schema manager class (We don't want users to have to manually add these collections, and update the autoincrementer's schema file whenever they add a new schema definition JSON file)

"use strict"

// Includes
var args = process.argv;
var mongo_settings = require("../mongo_settings");
var fs = require( "fs" );
var schemaManager = require( "../schemaManager/schemaManager" );	// acquire schemaManager class
var settings = require("../../util/settings");
var logger = require( `${settings.util}/logger` );
var ef = require( `${settings.util}/error_formats` );
var credentials = require(settings.credentials).mdbi;
var cryptic = require(`${settings.util}/cryptic`);
var syskey = require(settings.credentials).syskey;
var assert = require("assert");
var mongo = require("mongodb").MongoClient;
var mdb = require("../mongoWrapper");								// acquire MongoDB API Wrappers
var sm = new schemaManager();										// initialize a schema manager

// Globals
var mongoOptions = {
	"appname": "RJS DB Setup v0.0.0"
};
var url = `mongodb://${ encodeURIComponent(credentials.user) }:${ encodeURIComponent(credentials.pwd) }@${ mongo_settings.hostname }:${ mongo_settings.port }/${ mongo_settings.database }?authSource=${ mongo_settings.database }`;



// BEGIN Main Logic
// Ignore logger messages from the schema manager and auto incrementer routine
logger.ignore( [
	// "schemaManager.load()",
	"mongoWrapper.autoIncrement",
	"error_formats.common"
] );

// Load database schemas using the schema manager
sm.load();

// Determine appropriate action based on option argument
if( args.includes("--stats") ) {

	// If database statistics are requested, run the statistics routine
	getStats();
} else if( args.includes("--format") ) {

	// If database format is requested, destroy database
	formatDatabase();
} else if( args.includes("--init") ) {

	// If an init is requested, run the schema init routine
	initDatabase();
} else if( args.includes("--mock") ) {

	// If a mock init is requested, run the schema init routine with mocking enabled
	initDatabase( true );
} else {

	// Otherwise, print a help prompt
	help();
}
// END Main Logic

// BEGIN Option Logic
// @function		getStats()
// @description		This function contains the statistics acquisition logic
// @parameters		n/a
// @returns			n/a
function getStats() {
	
	// First, connect to the database
	console.log( "Connecting to MongoDB Server..." );
	mongo.connect( url, mongoOptions, function( err, db ) {

		// Check for successful database authentication
		if( err ) {

			// Report error if any
			console.log( `Auth Failed: ${err}` );
			if( db ) {
				endSession( db );
			}
		} else {

			// Issue command to acquire database statistics
			console.log( "Getting db statistics..." );
			db.command( {"dbStats": 1}, function( err, results ) {

				// Check for errors
				if( err ) {
					
					// If error, report it
					console.log( (typeof err === "object") ? JSON.stringify( err ) : err );
				} else {
					console.log( results );
				}

				// End database connection
				endSession( db );
			} );
		}
	} );
}

// @function		formatDatabase()
// @description		This function contains database formatting logic
// @parameters		n/a
// @returns			n/a
function formatDatabase() {

	// First, connect to the database
	console.log( "Connecting to MongoDB Server..." );
	mongo.connect( url, mongoOptions, function( err, db ) {

		// Check for successful database authentication
		if( err ) {

			// Report error if any
			console.log( `Auth Failed: ${err}` );
			if( db ) {
				endSession( db );
			}
		} else {

			// Acquire user confirmation
			console.log( `WARNING: You're about to delete all records in the ${ mongo_settings.database } database! Are you sure? (Yes/no)` );
			process.stdin.on( "readable", function() {
		
				// Process user input
				const chunk = process.stdin.read();
				if( chunk !== null ) {
		
					// Determine action based on user's answer
					var answer = chunk.slice( 0, chunk.length - 1 ).toString().toLowerCase();
                    console.log("This is the answer:", typeof answer, answer);
					if( answer.includes("no") ) {
		
						// On a no answer, don't do anything
						console.log( "Aborting...");
						process.kill( process.pid, "SIGINT" );
					} else if ( answer.includes("yes") ) {
						
						// On a yes answer, acquire a list of all collection names, and use it to create
						// promises that drop each collection
						var collectionNames = sm.getSchemaNames();
						var deletionPromises = [];
						collectionNames.forEach( function( name ) {
							
							// Create a promise that deletes the schema with name "name"
							var tempPromise = new Promise( function( resolve, reject ) {
		
								// In this promise, send a command to delete the specified collection
								db.dropCollection( name, null, function( err, result ) {
		
									// Check for errors in the collection drop
									if( err ) {
		
										// If error, print error
										console.log( `Failed to drop ${name} collection: ${err}` );
										
										// End promise with failure
										reject();
									} else {
		
										// Print result
										console.log( `Collection ${name} dropped?: ${JSON.stringify( result )}` );
		
										// End promise with success
										resolve();
									}
								} );
							} );
		
							// Append a new promise to the deletion promise array
							deletionPromises.push( tempPromise );
						} );
		
						// Finally, execute all generated promises
						Promise.all( deletionPromises ).then( function( results ) {
		
							// On success, end
							console.log( `Database format complete: ${results}` );
							endSession( db );
							process.kill( process.pid, "SIGINT" );
						} ).catch( function( err ) {
		
							// On failure, end
							console.log( `Failed to complete database format: ${ err ? err : "Unknown Cause; here are a few things you could check:\n\t1.) Ensure your configuration has the right database name and credentials\n\t2.) Check that at least one of the above collections exist before formatting\n\t3.) Check the above error messages for further clues" }` );
							endSession( db );
							process.kill( process.pid, "SIGINT" );
						} );

						// Bug Fix: Some Mongo Errors produce unhandled rejections that escape the
						// catch block. This block is a work-around
						process.on( "unhandledRejection", function( reason, promise ) {
							console.log( `Unhandled rejection: Promise ${promise}\nReason: ${reason}` );
							endSession( db );
							process.kill( process.pid, "SIGINT" );
						} );
					} else {
		
						// On an unexpected answer, do nothing and wait for a valid answer
						console.log( `Unexpected answer "${answer}". Please say "Yes" or "no"...` );
					}
				}
			} );
		}
	} );

}

// @function		initDatabase()
// @description		This function contains database initialization logic
// @parameters		(~boolean) mock		A boolean that controls whether to add any "fake" data to
//										each collection that has the "mock" member specified (see
//										mdbi/schemaManager/class/mdbiCollectionSchema.js source
//										code documentation for more details on the "mock" member).
//										If omitted, this defaults to false.
// @returns			n/a
function initDatabase( mock = false ) {

	// First, connect to the database
	console.log( "Connecting to MongoDB Server..." );
	mongo.connect( url, mongoOptions, function( err, db ) {

		// Check for successful database authentication
		if( err ) {

			// Report error if any
			console.log( `Auth Failed: ${err}` );
			if( db ) {
				endSession( db );
			}
		} else {

			// Store database reference to the loaded mongo wrapper module
			console.log( "Initializing db to requested specifications..." );
			mdb.database = db;

			// Acquire descriptions of the schemas and views to apply
			var schemas = sm.getSchemaDefinitions();	// views are also represented as schemas
            
            //DEBUG
//            console.log( "Schemas:", schemas );

			// Generate schema/view initialization promises, and any pretend data insertion
			// promises.
			var schemaPromises = [];
			var viewPromises = [];
			var mockPromises = [];
			Object.keys( schemas ).forEach( function( schemaName ) {

				// Determine action based on schema type
				var schemaDef = schemas[ schemaName ];
				if( schemaDef.type === "view" ) {

					// Generate a view creation promise
					viewPromises.push( getViewCreatorPromise(
						schemaDef,
						db
					) );
				} else {

					// Generate a collection creation promise and store it
					schemaPromises.push( getCollectionCreatorPromise(
						schemaDef,
						db,
						generatePlaceholder( schemaDef )
					) );
				}

				// Determine if mock promises are requested and mock data is defined in the schema
				if( mock && Array.isArray( schemaDef.mock ) ) {

					// Generate a mock promise
					mockPromises.push( getCollectionMockPromise(
						sm.getSchema( schemaName ),
						db
					) );
				}
			} );

			// Run schema promises and evaluate results
			Promise.all( schemaPromises ).then( function( message ) {
				
				// Run view promises next (since views require schemas to exist first)
				Promise.all( viewPromises ).then( function( message ) {
					
					// Check for mock promises
					if( mockPromises.length > 0 ) {

						// Run mock promises (if any)
						Promise.all( mockPromises ).then( function( message ) {

							// End with success
							console.log( `Successfully initialized database "${mongo_settings.database}" with mock documents...` );
							endSession( db );
						} ).catch( function( error ) {

							// End with failure
							console.log( `Successfully initialized database "${mongo_settings.database}", but encountered errors when inserting mock documents...` );
							if( db ) endSession( db );
						} );
					} else {

						// End with success
						console.log( `Successfully initialized database "${mongo_settings.database}"...` );
						endSession( db );
					}
				} ).catch( function( error ) {

					// End with failure
					console.log( `Failed to apply view(s): ${error}` );
					if( db ) endSession( db );
				} );
			} ).catch( function( error ) {

				// End with failure
				console.log( `Failed to apply schema(s): ${error}` );
				if( db ) endSession( db );
			} );
		}
	} );
}
// END Option Logic

// BEGIN Utility Functions
// @function		generatePlaceholder()
// @description		This function generates a placeholder that conforms to the given schema
//					definition object's members
// @parameters		(object) def		A schema definition object to use for placeholder creation
// @returns			(object) doc		A document that matches the generated schema
function generatePlaceholder( def ) {

	// Acquire the datatypes for the schema's members
	var memberTypes = def.members;

	// Generate the placeholder document
	var doc = {};
	Object.keys( memberTypes ).forEach( function( key ) {

		// Assign a value corresponding to the member's type
		switch( memberTypes[ key ] ) {

			// String
			case "string": {
				doc[ key ] = "placeholder";
				break;
			}

			// Boolean
			case "boolean": {
				doc[ key ] = false;
				break;
			}

			// Null
			case "null": {
				doc[ key ] = null;
				break;
			}

			// Undefined
			case "undefined": {
				doc[ key ] = undefined;
				break;
			}

			// Number
			case "number": {
				doc[ key ] = 0;
				break;
			}

			// Object
			case "object": {
				doc[ key ] = {};
				break;
			}

			// Symbol
			case "symbol": {
				doc[ key ] = Symbol();
				break;
			}
		}
	} );

	// Return the placeholder
	return doc;
}

// @function		getCollectionCreatorPromise()
// @description		This function creates a collection initialization Promise that simply creates
//					the specified collection with the given placeholder document.
// @parameters		(object) schemaDef	The schema definition object of the collection to create
//					(object) db			The MongoDB database object provided to the callback of
//										"mongo.connect()"
//					(object) doc		The document to insert as a placeholder
// @returns			(Promise) p			A promise that creates the specified collection
function getCollectionCreatorPromise( schemaDef, db, doc ) {

	return new Promise( function( resolve, reject ) {

		// Create the collection and insert the placeholder document
		db.collection( schemaDef.name ).insertOne( doc, null, function( error, result ) {

			// Check for errors
			if( error ) {

				// Log error and end with failure
				console.log( `Error creating collection "${schemaDef.name}": ${error}` );
				reject();
			} else {

				// Check if the collection requires a text-index
				if( schemaDef.type === "collection" && schemaDef.textIndex ) {

					// Create a text index with the specified settings
					defineTextIndex( db, schemaDef, function( err, res ) {

						// Check for errors
						if( err ) {

							// End with error
							console.log( `Created collection "${schemaDef.name}" (${result}), but failed to create text-index "${schemaDef.textIndex.iname}" (${err})` );
						} else {

							// End with success
							console.log( `Created collection "${schemaDef.name}" (${result}) with text-index "${schemaDef.textIndex.iname}" (${res})` );
							resolve();
						}
					} );
				} else {

					// End with success
					console.log( `Created collection "${schemaDef.name}": ${result}` );
					resolve();
				}
			}
		} );
	} );
}

// @function		getCollectionMockPromise()
// @description		This function creates a collection mock data insertion Promise that simply
//					inserts the specified mock data into the specified existing collection.
// @parameters		(object) schema		The mdbiCollectionSchema object of the collection to
//										insert into
//					(object) db			The MongoDB database object provided to the callback of
//										"mongo.connect()"
// @returns			(Promise) p			A promise that inserts the schema's test document set
function getCollectionMockPromise( schema, db ) {

	return new Promise( function( resolve, reject ) {

		// First, check if all mock documents conform to the schema
		var conforms = true;
		schema.mock.forEach( function( doc ) {

			// If conformity check fails, mark as a failure
			if( !schema.checkConformity( doc ) ) conforms = false;
		} );

		// Determine next course of action based on conformity
		if( conforms ) {

			// Attempt to insert all mock documents
			db.collection( schema.name ).insertMany( schema.mock, function( err, res ) {

				// Check for errors
				if( err ) {
					
					// End with failure
					console.log( `Failed to insert mock documents for collection "${schema.name}": ${err}` );
					reject();
				} else {

					// Attempt to auto-increment the corresponding collection
					autoIncrement( schema.name, function( error, result ) {

						// Check for errors
						if( error ) {

							// End with failure
							console.log( `Inserted mock documents for collection "${schema.name}" (${res}), but failed to update auto-increment record (${error})` );
							reject();
						} else {

							// End with success
							console.log( `Inserted mock documents for collection "${schema.name}" (${res}) and updated auto-increment record (${result})` );
							resolve();
						}
					}, schema.mock.length );
				}
			} );
		} else {

			// End with failure
			console.log( `Error: Conformity check failed for 1 or more mock documents in collection "${schema.name}"` );
			reject();
		}
	} );
}

// @function		getViewCreatorPromise()
// @description		This function creates a view initialization Promise that simply creates
//					the specified view with the given properties.
// @parameters		(object) schemaDef	The schema definition object of the view to create. This
//										MUST be of type "view"
//					(object) db			The MongoDB database object provided to the callback of
//										"mongo.connect()"
// @returns			(Promise) p			A promise that creates the specified view
function getViewCreatorPromise( schemaDef, db ) {

	return new Promise( function( resolve, reject ) {

		// Create a view creation command with the given properties
		var viewCreationCommand = {
			"create": schemaDef.name,
			"viewOn": schemaDef.view.source,
			"pipeline": schemaDef.view.pipeline
		};

		// Attempt to execute the view creation command; this may fail if the user doesn't have
		// the appropriate database privileges/roles
		try {
			db.command( viewCreationCommand, null, function( error, result ) {

				// Check for errors
				if( error ) {

					// End with failure
					console.log( `Error creating view "${schemaDef.name}: ${error}` );
					reject();
				} else {

					// End with success
					console.log( `Created view "${schemaDef.name}"...` );
					resolve();
				}
			} );
		} catch( e ) {

			// Handle any exception
			console.log( `Error executing view creation command: ${e}` );
			reject();
		}
	} );
}

// @function		autoIncrement()
// @description		This function increments the specified collection by cnt, or 1 if cnt is
//					omitted
// @parameters		(string) collection	The name of the MongoDB collection to auto-increment
//					(function) callback	A callback function to run after auto-incrementing. It is
//										passed two arguments:
//							(object) error		An error-formatted object if an error occurred;
//												otherwise, this is null
//							(number) result		The current value of the collection's auto-
//												increment record
//					(~number) cnt		The number to increment by. If omitted, this defaults to 1
// @returns			n/a
function autoIncrement ( collection, callback, cnt = 1 ) {
	var handlerTag = { "src": "mongoWrapper.autoIncrement" };
	var query = {
		"$inc": {}
	};
	query.$inc[collection] = cnt;	// increment the collection aincmt by "cnt"
	mdb.database.collection( "autoIncrements" ).updateOne( {
		"autoIncrements": 0
	}, query ).then( function ( mongoResult ) {

		// Determine what to do after the auto increment
		if ( mongoResult.modifiedCount !== 1 ) {

			// Log the error and pass it to callback
			var emsg = `Error auto-incrementing: ${mongoResult}`;
			logger.log( emsg, handlerTag );
			callback( ef.asCommonStr( ef.struct.mdbiNoEffect, {
				"msg": emsg
			} ) , null );
		} else {

			// Acquire the value of the set number
			mdb.database.collection( "autoIncrements" ).findOne( {
				"autoIncrements": 0
			} ).then( function ( result, error ) {

				// Check for errors
				if ( error ) {

					// Log the error
					var emsg = `Error acquiring autoIncrements snapshot: ${error}`;
					logger.log( emsg , handlerTag );

					// Pass it to the callback
					callback( JSON.parse( ef.asCommonStr( ef.struct.mdbiReadError, {
						"msg": emsg
					} ) ), null );
				} else {
					
					// Run callback and give it the new value of the auto incremented record
					// logger.log( JSON.stringify(result), handlerTag );	// DEBUG
					callback( null, result[ collection ] );
				}
			} );
		}
	} );
}

// @function		defineTextIndex()
// @description		This function creates a text index for a set of fields in an existing
//					collection, thereby enabling partial text searches with db.collection().find()
//					using the "{ "$text": { "$search": ... } }" filter;
// @parameters		(object) db			The MongoDB database object provided to the callback of
//										"mongo.connect()"
//					(object) schemaDef	The schema definition object of the collection whose text
//										index will be created. This object MUST have the member
//										"textIndex" defined.
//					(function) cb		A callback function that runs after the index creation is
//										attempted. It takes the following arguments:
//							(object) error		If an error occurred, this is a MongoError object,
//												otherwise it is null
//							(object) result		If an error occurred, this is null, otherwise it
//												is an object detailing the operation's results
function defineTextIndex( db, schemaDef, cb ) {
	
	// Create a place to store the text index fields and settings
	var indexFields = {};
	var indexSettings = {
		"name": schemaDef.textIndex.iname
	};

	// Traverse the list of index fields
	schemaDef.textIndex.fields.forEach( function( fieldName ) {

		// Specify the field "fieldName" index as a "text" index
		indexFields[ fieldName ] = "text";
	} );

	// Attempt to create the text index for the given collection
	db.collection( schemaDef.name ).createIndex( indexFields, indexSettings, cb );
}

// @function		endSession()
// @description		This function ends the MongoDB session by first logging the authenticated user
//					out and explicitly closing the connection.
// @parameters		(object) db			The MongoDB database object provided to the callback of
//										"mongo.connect()"
//					(~function) cb		An optional callback function to run after the session is
//										closed. It is not passed any arguments.
function endSession ( db, cb ) {
	console.log( "Ending session..." );

	db.logout();
	db.close();

	if ( typeof cb === "function" ) {
		cb();
	}
}

// @function		help()
// @description		This function prints the setup script's help prompt
// @parameters		n/a
// @returns			n/a
function help() {
	
	// Print logo
	console.log( fs.readFileSync( `${__dirname}/res/promptlogo.txt` ).toString() );

	// Generate help prompt message
	var msg = "";
	msg += "Command Synopsis:";
	msg += "\n\t\"node db_setup.js [option]\"";
	msg += "\n\nOptions:";
	msg += "\n\t--stats";
	msg += "\n\t\tAcquires current MongoDB database statistics for the database";
	msg += "\n\t\tpointed to by \"mdbi/schemaManager/schema_config.json\"";
	msg += "\n\t--init";
	msg += "\n\t\tInitializes the database with collections described by the schema";
	msg += "\n\t\tmanager in \"mdbi/schemaManager\". See the schemaManager source";
	msg += "\n\t\tcode documentation for more details.";
	msg += "\n\t--mock";
	msg += "\n\t\tSame as \"--init\", but adds various \"fake\" documents to the";
	msg += "\n\t\tdatabase for testing/simulation purposes";
	msg += "\n\t--help";
	msg += "\n\t\tThe default behavior if no options are given; runs this help";
	msg += "\n\t\tprompt";
	msg += "\n\t--format";
	msg += "\n\t\tWARNING: This command does a complete wipe of the database";
	msg += "\n";

	// Print help prompt message
	console.log(msg);
}
// END Utility Functions



// END db_setup.js
