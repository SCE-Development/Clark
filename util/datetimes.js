//	PROJECT: 		MEANserver
// 	Name: 			Rolando Javier
// 	File: 			datetimes.js
// 	Date Created: 	January 31, 2018
// 	Last Modified: 	January 31, 2018
// 	Details:
// 					This file contains a suite of utility functions meant to perform various manipulations and comparisons with datetimes (i.e. JavaScript date objects)
// 	Dependencies:
// 					n/a

"use strict";

// Includes
var settings = require("./settings");
var logger = require(`${settings.util}/logger`);

// Container
var datetimes = {};



// BEGIN member functions
/*
	@function 	hasPassed
	@parameter 	date - the JavaScript date object to check against the current date
	@returns 	true if the date is passed; false otherwise
	@details 	This function determines if a the specified date has passed
*/
datetimes.hasPassed = function (date) {
	var handlerTag = {"src": "datetimes.hasPassed"};
	var now = new Date(Date.now());
	var expired = false;

	if ((now - date) > 0) {	// i.e. current date is passed the given date
		expired = true;
	}

	return expired;
}
// END member functions



module.exports = datetimes;

// END datetimes.js
