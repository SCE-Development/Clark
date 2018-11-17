//	PROJECT: 		Core-v4
// 	Name: 			Rolando Javier
// 	File: 			mongo_settings.js
// 	Date Created: 	January 22, 2018
// 	Last Modified: 	January 22, 2018
// 	Details:
// 					This file contains the default settings associated with the SCE Mongo Database
// 	Dependencies:
// 					[Dependencies]

"use strict"

// Container (Singleton)
const mongo_settings = {};

// BEGIN members
/*
	@member 	hostname
	@details 	The string name of the host running the database
*/
mongo_settings.hostname = "localhost";

/*
	@member 	port
	@details 	The string representing the port number where the mongo daemon is listening in
*/
mongo_settings.port = "27017";

/*
	@member 	database
	@details 	The string name of the database to connect to
*/
mongo_settings.database = "sce_core";
// END members

// Freeze object
Object.freeze(mongo_settings);

module.exports = mongo_settings;

// END mongo_settings.js
