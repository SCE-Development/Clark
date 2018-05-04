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
};

/*
	@function 	niceDateStr
	@parameter 	date - a JavaScript date object
	@parameter 	separator - any character or string to separate the different elements of the date (defaults to "-")
	@returns 	a date string in the format "mm-dd-yyyy" where "-" separators can be replaced by the specified separator character
	@details 	This generates a neat date string that is customized with any specified separator character or string 
*/
datetimes.niceDateStr = function (date, separator = "-") {
	var handlerTag = {"src": "datetimes.niceDateStr"};
	var month = (9 < date.getMonth() + 1) ? `0${date.getMonth() + 1}` : `${date.getMonth() + 1}`;
	var day = (9 < date.getDate()) ? `0${date.getDate()}` : `${date.getDate()}`;
	var year = `${date.getFullYear()}`;
	return `${month}${separator}${day}${separator}${year}`;
};

/*
	@function 	niceTimeStr
	@parameter 	date - a JavaScript date object
	@parameter 	separator - any character or string to separate the different elements of the time (defaults to ":")
	@returns 	a date string in the format "hh:mm:ss" where ":" separators can be replaced by the specified separator character
	@details 	This generates a neat date string that is customized with any specified separator character or string 
*/
datetimes.niceTimeStr = function (date, separator = ":") {
	var handlerTag = {"src": "datetimes.niceTimeStr"};
	var hour = `${date.getHours()}`;
	var minute = `${date.getMinutes()}`;
	var second = `${date.getSeconds()}`;
	return `${hour}${separator}${minute}${separator}${second}`;
};
// END member functions



module.exports = datetimes;

// END datetimes.js
