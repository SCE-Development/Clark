//	PROJECT: 		Core-v4
// 	Name: 			Rolando Javier
// 	File: 			system_setup.js
// 	Date Created: 	September 23, 2018
// 	Last Modified: 	September 23, 2018
// 	Details:
// 					This file contains a setup script to automate the development environment
//					initialization process. This entails setting up a self-signed CA certificate,
//					creating the system key, creating mdbi and MongoDB credentials, and running
//					an install of all required NodeJS modules
// 	Dependencies:
// 					JavaScript ECMAScript 6
//					NodeJS v8.9.1+

"use strict";

// Includes
var settings = require( "../settings" );



// Globals
var args = process.argv;



// BEGIN main
// Check if there are any arguments
if ( args.length <= 2 ) {

	// If no arguments were given other than "node" and "system_settings.js", show help
	showHelp();
} else {

	// Otherwise, ?
	console.log( "Args:", args );
}
// END main



// BEGIN utility functions
// @function		showHelp()
// @description		?
// @parameters		?
// @returns			?
function showHelp() {

	console.log( "===============================" );
	console.log( "SCE Core-v4 System Setup v0.0.0" );
	console.log( "===============================" );
	console.log( "\nSynopsis:" );
	console.log( "    node system_setup.js [options]" );
	console.log( "\nOptions:" );
	console.log( "    --help");
	console.log( "        Shows this help dialog");
	console.log( "    --all" );
	console.log( "        The default action; Runs all required setup below" );
}
// END utility functions

// END system_setup.js
