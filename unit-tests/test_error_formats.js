//	PROJECT: 		Core-v4
// 	Name: 			Rolando Javier
// 	File: 			test_error_formats.js
// 	Date Created: 	January 27, 2018
// 	Last Modified: 	January 27, 2018
// 	Details:
// 					This file contains the unit tests for the error_formats.js file.
// 	Dependencies:
// 					MochaJS v4.1.0
// 					ChaiJS v4.1.2

"use strict";

// Includes
var chai = require("chai");
var assert = chai.assert;
var format = require("../util/error_formats");



// Test Control Settings
var tcontorl = {
	runAll: true
};



// BEGIN unit tests
describe("Error Formats", function () {
	// Common Errors
	describe(".common()", function () {
		var type = "SomeErrorType";
		var msg = "SomeErrorMessage/Description";
		var obj = {
			"some": "error object"
		}

		it("should return a type member if only given a type", function (done) {
			var expectedKeys = ["etype"];
			var result = format.common(type);

			assert.hasAllKeys(result, expectedKeys);
			done();
		});
		it("should return a type and msg if given them", function (done) {
			var expectedKeys = ["etype", "emsg"];
			var result = format.common(type, msg);

			assert.hasAllKeys(result, expectedKeys);
			done();
		});
		it("should return a type, msg, and obj if given them", function (done) {
			var expectedKeys = ["etype", "emsg", "eobj"];
			var result = format.common(type, msg, obj);

			assert.hasAllKeys(result, expectedKeys);
			done();
		});
		it("should return null if given an incorrect type or given nothing", function (done) {
			var result0 = format.common();
			var result1 = format.common({"hello": "world"});

			assert.isNull(result0);
			assert.isNull(result1);
			done();
		});
		it("should return a string if told to", function (done) {
			var result = format.common(type,msg,obj,true);

			assert.equal(typeof result, "string");
			done();
		});
	});
});



// END test_error_formats.js
