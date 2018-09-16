//	PROJECT: 		Core-v4
// 	Name: 			Rolando Javier
// 	File: 			test_api_legend.js
// 	Date Created: 	September 1, 2018
// 	Last Modified: 	September 1, 2018
// 	Details:
// 					This file contains unit tests for api_legend.js
// 	Dependencies:
// 					MochaJS v4.1.0
// 					ChaiJS v4.1.2

"use strict";

// Includes
var fs = require("fs");
var ejs = require("ejs");
var chai = require("chai");
var assert = chai.assert;
var al = require("../util/api_legend");
const ApiLegend = require( "../util/class/ApiLegend/ApiLegend.js" );		// class ApiLegend



// BEGIN API Legend

describe ( "API Legend", function () {
	
	// @test			createLegend()
	// @description		?
	describe ( "createLegend()", function () {

		var router = {};		// express.js Router emulator

		it ( "should return an ApiLegend with the given parameters (if any)", function (done) {

			var resultWithoutArgs = al.createLegend();
			var resultWithArgs = al.createLegend( "TestName", "TestDesc", router );

			// Check the type instances of the returned objects
			assert.instanceOf( resultWithoutArgs , ApiLegend, "resultWithoutArgs is an ApiLegend" );
			assert.instanceOf( resultWithArgs, ApiLegend, "resultWithArgs is an ApiLegend" );
			done();

		} );

	} );



	// @test			routerRef()
	// @description		?
	describe ( "routerRef()", function () {

		var router1 = {};		// express.js Router emulator
		var router2 = {};		// express.js Router emulator

		it ( "should return a reference to router1", function (done) {

			var result = al.createLegend( "TestName", "TestDesc", router1 );

			assert.strictEqual( result.routerRef(), router1 );
			done();
		} );

		it ( "should change the reference to router2", function (done) {

			var result = al.createLegend( "TestName", "TestDesc", router2 );

			// Check to see if its reference passes the strict equal test
			assert.strictEqual( result.routerRef( router2 ), router2 );

			// Change something in router 2 and check if the change is reflected in the returned
			// router reference
			router2.test = "hello world";
			assert.deepEqual( result.routerRef( router2 ), router2 );
			assert.strictEqual( result.routerRef( router2 ).test, "hello world" );
			done();

		} );

	} );



	// @test			register()
	// @description		?
	describe ( "register()", function () {

		it ( "should properly register an endpoint", function (done) {

			// Define test route data
			var testRoute = {
				"name": "some.route",
				"method": "GET",
				"route": "/some/route",
				"desc": "some description",
				"args": [
					{
						"name": "someArg",
						"type": "string",
						"desc": "some argument description"
					}
				],
				"returnVal": [
					{
						"condition": "some condition",
						"desc": "some return value description"
					}
				],
				"cb": function (request, response) {
					console.log("Hello World", request, response);
				}
			};

			// Create a router stub (testing with GET requests)
			var router = {
				"data": {
					"get": {}	// record all get endpoints
				},
				"get": function ( endpoint, callback ) {

					// Map the callback to the endpoint
					this.data.get[ endpoint ] = callback;

				}
			};

			// Run an endpoint registration
			var result = al.createLegend( "TestName", "TestDesc", router );
			result.register(
				testRoute.name,
				testRoute.method,
				testRoute.route,
				testRoute.desc,
				testRoute.args,
				testRoute.returnVal,
				testRoute.cb
			);

			// Check that the name parameters match up
			assert.strictEqual( result.endpoints[0].name, testRoute.name );

			// Check that the method matches
			assert.strictEqual( result.endpoints[0].method, testRoute.method );

			// Check that the desc matches
			assert.strictEqual( result.endpoints[0].desc, testRoute.desc );

			// Check that the args match
			assert.deepEqual( result.endpoints[0].args, testRoute.args );
			
			// Check that the returnVals match
			assert.deepEqual( result.endpoints[0].returnVal, testRoute.returnVal );

			// Check that the callback was properly passed
			assert.strictEqual( router.data.get[testRoute.route], testRoute.cb );
			done();
		} );

	} );



	// @test			getDoc()
	// @description		?
	describe ( "getDoc()", function () {

		var docTemplatePath = __dirname + "/../util/class/ApiLegend/template/docTemplate.ejs";
		var options = {
			"filename": docTemplatePath,
			"cache": true,
			"strict": true
		};
		var data = {
			"apiName": "TestName",
			"apiDesc": "TestDesc",
			"apiEndpoints": [
				{
					"name": "TestEndpoint",
					"route": "/testendpoint",
					"method": "GET",
					"desc": "This is a test endpoint",
					"args": [
						{
							"name": "test",
							"type": "boolean",
							"desc": "a test argument"
						}
					],
					"returnVal": [
						{
							"condition": "On success/failure:",
							"desc": "nothing is returned"
						}
					]
				}
			]
		}

		it ( "should return a pretty HTML page", function (done) {

			// Instantiate a mock express.js router
			var router = {
				"get": function (request, response) {
					// do nothing
				}
			};

			// Create an API Legend object
			var result = al.createLegend( data.apiName, data.apiDesc, router );

			// Create your own format string
			var docTemplate = fs.readFileSync(
				docTemplatePath,
				"utf-8"
			);
			var doc = ejs.render( docTemplate, data, options );
			
			// Register the test endpoint
			result.register(
				data.apiEndpoints[0].name,
				data.apiEndpoints[0].method,
				data.apiEndpoints[0].route,
				data.apiEndpoints[0].desc,
				data.apiEndpoints[0].args,
				data.apiEndpoints[0].returnVal,
				data.apiEndpoints[0].cb
			);

			// Check to make sure that the test-generated doc matches the one from the class
			assert.strictEqual( result.getDoc(true), doc );
			done();
		} );

		it ( "should return a JSON of the doc", function (done) {

			// Instantiate a mock express.js router
			var router = {
				"get": function (request, response) {
					// do nothing
				}
			};

			// Create an API Legend object
			var result = al.createLegend( data.apiName, data.apiDesc, router );

			// Create the expected JSON doc (should be an exact clone of "data")
			var doc = data;

			// Register the test endpoint
			result.register(
				data.apiEndpoints[0].name,
				data.apiEndpoints[0].method,
				data.apiEndpoints[0].route,
				data.apiEndpoints[0].desc,
				data.apiEndpoints[0].args,
				data.apiEndpoints[0].returnVal,
				data.apiEndpoints[0].cb
			);

			// Compare the two and ensure they are equal
			assert.deepEqual( result.getDoc(), doc );
			done();
		} );

	} );

} );

// END API Legend




// END test_api_legend.js
