//	PROJECT: 		Core-v4
// 	Name: 			Rolando Javier
// 	File: 			test_datetimes.js
// 	Date Created: 	January 31, 2018
// 	Last Modified: 	January 31, 2018
// 	Details:
// 					This file tests the datetime.js functions
// 	Dependencies:
// 					MochaJS v4.1.0
// 					ChaiJS v4.1.2

"use strict";

// Includes
var chai = require("chai");
var assert = chai.assert;
var dt = require("../util/datetimes");



// BEGIN datetimes.js test
describe("datetimes.js test", function () {
	describe("hasPassed()", function () {
		it("should correctly return false for a date that hasn't occurred yet (outside of a minute)", function () {
			var nearFuture = new Date(Date.now());

			// Note: JavaScript automatically handles minute/date/year/second overflows
			nearFuture.setMinutes(nearFuture.getMinutes() + 2);	// check 2 mins ahead
			var result = dt.hasPassed(nearFuture);

			assert.equal(result, false);
		});

		it("should correctly return true for a date hat has passed (outside of a minute)", function () {
			var nearPast = new Date(Date.now());

			nearPast.setMinutes(nearPast.getMinutes() - 2);	// check 2 minutes behind
			var result = dt.hasPassed(nearPast);

			assert.equal(result, true);
		});
	});
});
// END datetimes.js test




// END test_datetimes.js
