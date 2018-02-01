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

// Container
var datetimes = {};



/*
	@function 	hasPassed
	@parameter 	date - the JavaScript date object to check against the current date
	@returns 	true if the date is passed; false otherwise
	@details 	This function determines if a the specified date has passed
*/
datetimes.hasPassed = function (date) {
	var now = new Date(Date.now());
	var expired = false;

	if (now.getFullYear() > date.getFullYear()) {	// compare years
		expired = true;
	} else if (now.getMonth() > date.getMonth()) {	// compare month
		expired = true;
	} else if (now.getDate() > date.getDate()) {	// compare date
		expired = true;
	} else if (now.getHours() > date.getHours()) {	// compare hour
		expired = true;
	} else if (now.getMinutes() > date.getMinutes()) {	// compare minute
		expired = true;
	}

	return expired;
}



module.exports = datetimes;

// END datetimes.js
