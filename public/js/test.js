// PROJECT: 		MEANserver
// Name: 			Rolando Javier
// File: 			test.js
// Date Created: 	November 3, 2017
// Last Modified: 	November 3, 2017
// Details:
// 					This file contains the underlying javascript running the test.html page
"use strict"

$(document).ready(init());

console.log("Welcome to the Server Test Page");

function init() {
	setDebug(true);
	console.log("Hello World!");

	/* Setup WriteToMongoDB action */
	$("#testMongoWrite").on("click", function (event) {
		// Acquire JSON data to send
		var data = {
			"data": $("#jsonInputField").val()
		};
		console.log(`Writing "${data}" to Database...`);

		// Send to database using a RESTful POST request to the "/test/write" endpoint
		post("/test/write", data, function (reply, status, jqxhr) {
			if (status === "success") {
				console.log("Replied: " + reply.toString());
			} else {
				console.log("A Problem Occurred...");
				console.log(`Status: ${status.toString()}\nReply: ${reply.toString()}`);
			}
		});
	});

	/* Setup SearchFromMongoDB action */
	$("#testMongoSearch").on("click", function (event) {
		// Acquire data to send
		var data = ($("#dbCollectionNameField").val() != "") ? {"name": $("#dbCollectionNameField").val()} : null;
		console.log(`Finding ${(data === null) ? "null" : JSON.stringify(data)} in database...`);

		// Send the search request to database using a RESTful POST request to the "/test/find" endpoint
		post("/test/find", data, function (reply, status, jqxhr) {
			if (status === "success") {
				console.log("Replied: " + reply.toString());
			} else {
				console.log("A problem occurred");
				console.log(`Status: ${status.toString()}\n\nReply: ${reply.toString()}`);
			}
		});
	});
}
// END test.js