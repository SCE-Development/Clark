//	PROJECT: 		Core-v4
// 	Name: 			Rolando Javier
// 	File: 			ApiLegend.js
// 	Date Created: 	September 1, 2018
// 	Last Modified: 	September 1, 2018
// 	Details:
// 					This file houses the class definition of the ApiLegend object
// 	Dependencies:
// 					JavaScript ECMAScript 6 support
//					EJS v2.6.1

"use strict";

// Includes
var fs = require("fs");
var ejs = require("ejs");										// embedded javascript library
var settings = require( "../../settings.js" );					// import server settings
var logger = require( `${settings.util}/logger` );
var defaultTemplate = __dirname + "/template/docTemplate.ejs";	// default ApiLegend template



// BEGIN class ApiLegend

// @class			ApiLegend
// @description		This class constitutes an API legend that is viewable with a simple function
//					call
// @ctor args		(object) template	an object to configure the API legend. It takes the
//										following parameters:
//							(string) name			The name of the API Module
//							(string) desc			A brief description of the API Module
//							(string) template		The full path to an EJS template file
//							(object) router			Reference to an express router object
class ApiLegend {

	// Constructor
	constructor ( template ) {

		this.name = typeof template.name === "undefined" ? "" : template.name;
		this.desc = typeof template.desc === "undefined" ? "" : template.desc;
		this.router = typeof template.router === "undefined" ? undefined : template.router;
		this.template =
			typeof template.template === "undefined" ? defaultTemplate : template.template;
		this.endpoints = [];
	}
}

// @function		register()
// @description		This function catalogs an endpoint's information for the corresponding API
//					documentation, and registers the endpoint with the given router object
//					reference for the specified request method. Currently supported methods
//					include GET, POST, PUT, and DELETE
// @parameters		(string) name		the name of the API endpoint
//					(string) method		a string representing the request method to registers
//										this endpoint as. Currently supported values include
//										"get", "post", "put", "delete" (case-insensitive)
//					(string) route		the endpoint route path with respect to the API
//										Module's root endpoint
//					(string) desc		a brief description of the API endpoint
//					(array) args		an array describing the arguments of the endpoint. Each
//										array element describes a single argument and must be a
//										JSON object with the following parameters:
//							(string) name			the name of the argument
//							(string) type			the argument's (intended) data type
//							(string) desc			the argument's purpose or description
//					(array) returnVal	an array describing the endpoint's return value(s).
//										Each array element describes a single return value and
//										must be a JSON object with the following parameters:
//							(string) condition		a string describing the condition that
//													will return the following return value.
//							(string) desc			a string decribing what is being returned
//					(function) cb		a callback function to handle the request. It is given
//										two arguments:
//							(object) request		the request object from express.js
//							(object) response		the response object from express.js
// @returns			n/a
ApiLegend.prototype.register = function ( name, method, route, desc, args, returnVal, cb ) {
	
	var handlerTag = { "src": "ApiLegend.register" };
	
	try {

		// Create an endpoint descriptor object
		var endpoint = {
			"name": name,
			"route": route,
			"method": method.toUpperCase(),
			"desc": desc,
			"args": args,
			"returnVal": returnVal
		};

		// Catalog the endpoint's information and resort the array by endpoint name
		this.endpoints.push( endpoint );
		this.endpoints.sort( function ( a, b ) {

			var nameA = a.name.toLowerCase();
			var nameB = b.name.toLowerCase();

			// Iterate through the name strings looking for any difference in characters
			var i = 0;
			while ( i < nameA.length && i < nameB.length ) {

				if ( nameA.charCodeAt( i ) < nameB.charCodeAt( i ) ) {

					return -1;
				}
				if ( nameA.charCodeAt( i ) > nameB.charCodeAt( i ) ) {

					return 1;
				}
				i++;
			}

			return 0;
		} );

		// Register the endpoint with the router
		switch ( endpoint.method ) {

			case "GET": {
	
				this.router.get( endpoint.route, cb );
				break;
			}
	
			case "POST": {
	
				this.router.post( endpoint.route, cb );
				break;
			}
	
			case "PUT": {
	
				this.router.put( endpoint.route, cb );
				break;
			}
	
			case "DELETE": {
	
				this.router.delete( endpoint.route, cb );
				break;
			}
		}
		
		// Debug
		// logger.log( JSON.stringify( this.endpoints, ["name"], 4 ), handlerTag );
	} catch ( exception ) {
		
		logger.log( exception, handlerTag );
	}
};

// @function		routerRef()
// @description		This function has a contextual use. If not given any arguments, it will
//					return the reference to its current router. If given an argument, it
//					will set its current router reference to the given router and return
//					that router reference
// @parameters		~(string) router	a reference to the router for this API Module
// @returns			(object) router		the currently stored router reference
ApiLegend.prototype.routerRef = function ( r = false ) {

	// If router is given, set the router reference
	if ( r ) {
		this.router = r;
	}

	// Return the currently associated router reference
	return this.router;
};

// @function		getDoc()
// @description		This function has a contextual use. If not given any arguments, it returns the
//					API doc as raw JSON. If given "true", it returns the API doc as a pretty-
//					formatted HTML page
// @parameters		~(boolean) pretty	a boolean to determine how to return the API doc
// @returns			(mixed) apiDoc		If pretty is true, apiDoc is a string of raw HTML. If it
//										is false, apiDoc is a JSON object
ApiLegend.prototype.getDoc = function ( pretty = false ) {

	var doc = {};

	// Determine how to return the documentation
	switch ( pretty ) {

		// If pretty format is desired, return an HTML page with the documentation
		case true: {

			var data = {
				"apiName": this.name,
				"apiDesc": this.desc,
				"apiEndpoints": this.endpoints
			};
			var options = {
				"filename": this.template,
				"cache": true,		// enable render function caching for performance boost
				"strict": true		// force render fucntion to run in JS strict mode
			};

			// First, load the docTemplate
			var docTemplate = fs.readFileSync( this.template, "utf-8" );

			doc = ejs.render( docTemplate, data, options );
			break;
		}

		// If not, return a simple JSON object
		case false: {

			// Simply copy over the current API lengend info to the JSON doc
			doc.apiName = this.name;
			doc.apiDesc = this.desc;
			doc.apiEndpoints = this.endpoints;
			break;
		}
	}

	return doc;
};

// END class ApiLegend



module.exports = ApiLegend;
// END ApiLegend.js
