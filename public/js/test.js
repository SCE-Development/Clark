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

// BEGIN Init
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
		console.log(`Finding ${(data === null) ? "all collections" : JSON.stringify(data)} in database...`);

		// Send the search request to database using a RESTful POST request to the "/test/find" endpoint
		post("/test/find", data, function (reply, status, jqxhr) {
			if (status === "success") {
				console.log("Replied: " + reply.toString());
				showCollectionResults(JSON.parse(reply));
			} else {
				console.log("A problem occurred");
				console.log(`Status: ${status.toString()}\n\nReply: ${reply.toString()}`);
			}
		});
	});

	/* Setup SearchDocFromMongoDB action */
	$("#testMongoDocSearch").on("click", function (event) {
		// Acquire data to send
		var collectionName = $("#dbDocCollectionNameField").val();
		var searchCriteria = {};

		if (collectionName === "") {
			console.log(`Error: No collection name given!`);
		} else {
			try {
				searchCriteria = ($("#dbDocRawJsonField").val() === "") ? {} : JSON.parse($("#dbDocRawJsonField").val());
			} catch (err) {
				console.log("Error: failed to parse raw JSON data \"" + $("#dbDocRawJsonField").val() + "\"");
				console.log(err);
				return;
			}

			var data = {
				"collection": collectionName,
				"search": searchCriteria
			};
			post("/test/finddoc", data, function (reply, status, jqxhr) {
				if (status === "success") {
					console.log("Replied: " + reply.toString());
				} else {
					console.log("A problem occurred");
					console.log(`Status: ${status.toString()}\n\nReply: ${reply.toString()}`);
				}
			});
		}
	});
}
// END Init



// BEGIN Utility Functions
/*
	@function 	showCollectionResults
	@parameter 	arr - the array-like JSON object of collections returned by the "/test/find" POST request
	@returns 	n/a
	@details 	This function places the results of the "/test/find" query nicely on the page. Intended for use within the post() callback of the "/test/find" post() request
*/
function showCollectionResults (arr) {
	if (arr.length > 0) {
		var accordionHeader = "<div id='fCR_Accordion' class='panel-group' role='tablist' aria-multiselectable='true'>";
		var accordionFooter = "</div>";
		var content = accordionHeader;	// prepend content with starting div tag
		
		// Compile all elements into a neat-looking panel group (forgive the tabbing)
		for (var i = 0; i < arr.length; i++) {
			content += `<div id="fCR_${i}_panel" class="panel panel-default">`;
				content += `<div id="fCR_${i}_panel_heading" class="panel-heading" role="tab">`;
					content += `<h4 class="panel-title">`;
						content += `<a role="button" data-toggle="collapse" data-parent="#fCR_Accordion" href="#fCR_${i}_collapsible">`;
							content += `${i}: ${arr[i].name}`;
						content += `</a>`;
					content += `</h4>`;
				content += `</div>`;
				content += `<div id="fCR_${i}_collapsible" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="fCR_${i}_panel_heading">`;
					content += `<div class="panel-body">`;
						content += `<div class="container-fluid">`;
							content += `<div class="row">`;
								content += `<div class="col-sm-12">`;
									content += `<ul class="list-group">`;
										content += `<li class="list-group-item"><strong>Type:</strong> ${arr[i].type}</li>`;
										content += `<li class="list-group-item"><strong>NS:</strong> ${arr[i].idIndex.ns}</li>`;
									content += `</ul>`;
								content += `</div>`;
							content += `</div>`;
						content += `</div>`;
					content += `</div>`;
				content += `</div>`;
			content += `</div>`;
		}

		// Show panel group
		$("#content_panel").html(content);
	} else {
		$("#content_panel").html("No Collections Were Found...");
	}
}
// END Utility Functions



// END test.js
