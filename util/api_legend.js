//	PROJECT: 		Core-v4
// 	Name: 			Rolando Javier
// 	File: 			util/api_legend.js
// 	Date Created: 	September 1, 2018
// 	Last Modified: 	September 1, 2018
// 	Details:
// 					This file contains utility functions for API registration and mini-doc (minimal-documentation) writing. The API legend is a convenient development tool that allows the generation of API documentation accessible to clients. This is done via routing an endpoint to a router API module and invoking an ApiLegend's getDoc() function within the endpoint handler
// 	Dependencies:
// 					ExpressJS 4.x
// 					body-parser (NPM middleware req'd by ExpressJS 4.x to acquire POST data parameters: "npm install --save body-parser")

"use strict";

// Includes
var settings = require( "./settings" );
var logger = require( `${settings.util}/logger` );
const ApiLegend = require( `${settings.util}/class/ApiLegend/ApiLegend.js` );		// class ApiLegend

// Containers
var al = {};



// BEGIN member functions

// @function		createLegend()
// @description		This function creates and initializes an empty legend object for the specified
//					application
// @parameters		(string) name		the name of the API Module (to show in the API legend)
//					(string) desc		a brief description of the API module
//					(object) router		a reference to an express.js router object
// @returns			(object) legend		an API legend object
al.createLegend = function ( name, desc, router ) {

	var handlerTag = { "src": "util.api_legend.createLegend" };
	// logger.log( `Creating legend for API module ${name}`, handlerTag );

	// Return a blank API legend for the specified API module
	return new ApiLegend( {
		"name": name,
		"desc": desc,
		"router": router
	} );
}

// END member functions



module.exports = al;
// END util/api_legend.js
