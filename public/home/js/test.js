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

	/* Initialize page tooltips */
	$(function () {
		$('[data-toggle="tooltip"]').tooltip();
	});

	/* BEGIN testing skillmatch */
	// Execute query
	// var testSkills = ["mysql","Python","Javascript","c"];
	// var testClasses = ["CMPE140","CMPE124","CMPE110"];
	// post("/skillmatch", {"skills": testSkills, "classes": testClasses}, function (reply, status, jqxhr) {
	// 	if (status === "success") {
	// 		console.log("Replied: " + reply.toString());
	// 	} else {
	// 		var errToLog = `Status: ${status.toString()}\nReply: ${reply.toString()}`;
	// 		console.log("A Problem Occurred...");
	// 		console.log(errToLog);
	// 		showError(errToLog);
	// 	}
	// }, true);	// run ajax() instead of post()
	/* END testing skillmatch */

	/* Setup WriteToMongoDB action */
	$("#testMongoWrite").on("click", function (event) {
		// Acquire JSON data to send
		var collectionName = $("#CollectionNameField").val();
		var newDoc = null
		
		if (collectionName === "") {
			var errToLog = `Error: No collection name given!`;
			console.log(errToLog);
			showError(errToLog);
		} else {
			try {
				newDoc = ($("#jsonInputField").val() === "") ? {} : JSON.parse($("#jsonInputField").val());
			} catch (err) {
				console.log(`Error: failed to parse raw JSON data "${jsonInputField}"`);
				console.log(err);
				showError(err);
				return;
			}

			var data = {
				"collection": collectionName,
				"data": newDoc
			};
			console.log(`Writing "${JSON.stringify(data)}" to Database...`);

			// Send to database using a RESTful POST request to the "/mdbi/write" endpoint
			post("/mdbi/write", data, function (reply, status, jqxhr) {
				if (status === "success") {
					console.log("Replied: " + reply.toString());
					showSingleWriteResults(reply);
				} else {
					var errToLog = `Status: ${status.toString()}\nReply: ${reply.toString()}`;
					console.log("A Problem Occurred...");
					console.log(errToLog);
					showError(errToLog);
				}
			});
		}
	});

	/* Setup SearchFromMongoDB action */
	$("#testMongoSearch").on("click", function (event) {
		// Acquire data to send
		var data = ($("#dbCollectionNameField").val() != "") ? {"name": $("#dbCollectionNameField").val()} : null;
		console.log(`Finding ${(data === null) ? "all collections" : JSON.stringify(data)} in database...`);

		// Send the search request to database using a RESTful POST request to the "/mdbi/search/collections" endpoint
		post("/mdbi/search/collections", data, function (reply, status, jqxhr) {
			if (status === "success") {
				console.log("Replied: " + reply.toString());
				showCollectionResults(JSON.parse(reply));
			} else {
				var errToLog = `Status: ${status.toString()}\n\nReply: ${reply.toString()}`;
				console.log("A problem occurred");
				console.log(errToLog);
				showError(errToLog);
			}
		});
	});

	/* Setup SearchDocFromMongoDB action */
	$("#testMongoDocSearch").on("click", function (event) {
		// Acquire data to send
		var collectionName = $("#dbDocCollectionNameField").val();
		var searchCriteria = null;

		if (collectionName === "") {
			var errToLog = `Error: No collection name given!`;
			console.log(errToLog);
			showError(errToLog);
		} else {
			try {
				searchCriteria = ($("#dbDocRawJsonField").val() === "") ? {} : JSON.parse($("#dbDocRawJsonField").val());
			} catch (err) {
				console.log("Error: failed to parse raw JSON data \"" + $("#dbDocRawJsonField").val() + "\"");
				console.log(err);
				showError(err);
				return;
			}

			var data = {
				"collection": collectionName,
				"search": searchCriteria
			};
			post("/mdbi/search/documents", data, function (reply, status, jqxhr) {
				if (status === "success") {
					console.log("Replied: " + reply.toString());
					showDocumentResults(JSON.parse(reply));
				} else {
					var errToLog = `Status: ${status.toString()}\n\nReply: ${reply.toString()}`;
					console.log("A problem occurred");
					console.log(errToLog);
					showError(errToLog);
				}
			});
		}
	});

	/* Setup DeletionQuantitySelection action */
	$("#dbDocDeleteQty").on("click", function (event) {
		var currentContent = $("#dbDocDeleteQty").html();
		switch (currentContent === "One") {
			case true:
				$("#dbDocDeleteQty").html("Many");
				break;
			default:
				$("#dbDocDeleteQty").html("One");
				break;
		}
	});

	/* Setup DeleteOneDocFromMongoDB action*/
	$("#testMongoDocDelete").on("click", function (event) {
		// Acquire data to send
		var collectionName = $("#dbDocDeleteCollectionNameField").val();
		var searchCriteria = null;
		var deleteQuantity = $("#dbDocDeleteQty").html();

		if (collectionName === "") {
			var errToLog = `Error: No collection name given!`;
			console.log(errToLog);
			showError(errToLog);
		} else {
			try {
				searchCriteria = ($("#dbDocDeleteRawJsonField").val() === "") ? {} : JSON.parse($("#dbDocDeleteRawJsonField").val());
			} catch (err) {
				console.log("Error: failed to parse raw JSON data \"" + $("#dbDocDeleteRawJsonField").val() + "\"");
				console.log(err);
				showError(err);
				return;
			}

			var data = {
				"collection": collectionName,
				"search": searchCriteria
			};
			post((deleteQuantity === "Many") ? "/mdbi/delete/documents" : "/mdbi/delete/document", data, function (reply, status, jqxhr) {
				if (status === "success") {
					console.log("Replied: " + reply.toString());
					showSingleDeleteResults(reply);
				} else {
					var errToLog = `Status: ${status.toString()}\n\nReply: ${reply.toString()}`;
					console.log("A problem occurred");
					console.log(errToLog);
					showError(errToLog);
				}
			});
		}
	});

	/* Setup UpdateOpSelection action */
	$(".updateOpSelectOption").on("click", function (event) {
		console.log(`Change update function to ${$(this).attr("name")}`);
		$("#updateOpName").html($(this).attr("name"));
	});

	/* Setup UpdateDocsInMongoDB action */
	$("#testMongoDocUpdate").on("click", function (event) {
		// Acquire data to send
		var collectionName = $("#dbDocUpdateCollectionNameField").val();
		var searchCriteria = null;
		var updateCriteria = null;
		var updateOp = $("#updateOpName").html();	// currently unused

		if (collectionName === "") {
			var errToLog = `Error: No collection name given!`;
			console.log(errToLog);
			showError(errToLog);
		} else {
			try {
				searchCriteria = ($("#dbDocUpdateRawJsonFilterField").val() === "") ? {} : JSON.parse($("#dbDocUpdateRawJsonFilterField").val());
				updateCriteria = ($("#dbDocUpdateRawJsonUpdateField").val() === "") ? {} : JSON.parse($("#dbDocUpdateRawJsonUpdateField").val());
			} catch (err) {
				console.log(`Error: failed to parse raw JSON data from either update or search criteria`);
				console.log(err);
				showError(err);
				return;
			}

			var data = {
				"collection": collectionName,
				"search": searchCriteria,
				"update": updateCriteria
			};
			post("/mdbi/update/documents", data, function (reply, status, jqxhr) {
				if (status === "success") {
					console.log(`Replied: ${reply.toString()}`);
					showSingleUpdateResults(reply);
				} else {
					var errToLog = `Status: ${status.toString()}\n\nReply: ${reply.toString()}`;
					console.log("A problem occurred");
					console.log(errToLog);
					showError(errToLog);
				}
			});
		}
	});
}
// END Init



// BEGIN Utility Functions
/*
	@function 	showError
	@parameter 	err - string or object detailing the error that occurred
	@returns 	n/a
	@details 	This function neatly shows error messages on the page for the User to see
*/
function showError (err) {
	console.log(`Logging ${(typeof err === "object") ? JSON.stringify(err) : err} to screen`);
	switch (typeof err) {
		case "string": {
			$("#content_panel").html("<h3>Error</h3>" + "<p>" + err + "</p>");
			break;
		}
		case "object": {
			try {
				var errObjAsString = JSON.stringify(err);
				$("#content_panel").html("<h3>Error</h3>" + "<p>" + errObjAsString + "</p>");
			} catch (err) {
				$("#content_panel").html("<h3>Error</h3>" + "<p>Attempted to convert error object to string, but failed: " + ((typeof err === "object") ? JSON.stringify(err) : err) + "</p>");
			}
			break;
		}
		default: {
			$("#content_panel").html("<h3>Error</h3>" + "<p>An unknown error occurred...</p>");
			break;
		}
	}
}

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

		// Add closing div tag
		content += accordionFooter;

		// Add box title
		var boxTitle = `<h3>${arr.length} Collections</h3>`;

		// Show panel group
		$("#content_panel").html(boxTitle + content);
	} else {
		$("#content_panel").html("No Collections Were Found...");
	}
}

/*
	@function 	showDocumentResults
	@parameter 	arr - the array of JSON-objects comprising the documents found from the "/mdbi/search/documents" search
	@returns 	n/a
	@details 	This function neatly displays the documents found from the "/mdbi/search/documents" endpoint request
*/
function showDocumentResults (arr) {
	if (arr.length > 0) {
		var accordionHeader = "<div id='fDR_Accordion' class='panel-group' role='tablist' aria-multiselectable='true'>";
		var accordionFooter = "</div>";
		var content = accordionHeader;	// prepend content with starting div tag

		// Compile all elements into a neat-looking panel group (forgive the tabbing)
		for (var i = 0; i < arr.length; i++) {
			content += `<div id="fDR_${i}_panel" class="panel panel-default">`;
				content += `<div id="fDR_${i}_panel_heading" class="panel-heading" role="tab">`;
					content += `<h4 class="panel-title">`;
						content += `<a role="button" data-toggle="collapse" data-parent="#fDR_Accordion" href="#fDR_${i}_collapsible">`;
							content += `Document ${i}`;
						content += `</a>`;
					content += `</h4>`;
				content += `</div>`;
				content += `<div id="fDR_${i}_collapsible" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="fDR_${i}_panel_heading">`;
					content += `<div class="panel-body">`;
						content += `<div class="container-fluid">`;
							content += `<div class="row">`;
								content += `<div class="col-sm-12">`;
									content += `<ul class="list-group">`;
									// Place a list item for each key in the first level
									content += `<li class="list-group-item"><div><strong>Top-Level Keys:</strong> ${Object.keys(arr[i]).toString()}</div><code style="overflow-wrap: break-word">${(typeof arr[i] === "object") ? JSON.stringify(arr[i]) : arr[i]}</code></li>`;
									content += `</ul>`;
								content += `</div>`;
							content += `</div>`;
						content += `</div>`;
					content += `</div>`;
				content += `</div>`;
			content += `</div>`;
		}

		// Add closing div tag
		content += accordionFooter;

		// Add box title
		var boxTitle = `<h3>${arr.length} Documents</h3>`;

		// Show panel group
		$("#content_panel").html(boxTitle + content);
	} else {
		$("#content_panel").html("No Documents Were Found...");
	}
}

/*
	@function 	showSingleDeleteResults
	@parameter 	result - the JSON object comprising the result of the single deletion
	@returns 	n/a
	@details 	This function neatly presents the status of the last deletion operation from the "/test/deletedoc" endpoint request
*/
function showSingleDeleteResults (result) {
	var content = `<h3>Deletion Results</h3><p>${(typeof result === "object") ? JSON.stringify(result) : result}</p>`;
	$("#content_panel").html(content);
}

/*
	@function 	showSingleUpdateResults
	@parameter 	result - the JSON object comprising the result of the single update
	@returns 	n/a
	@details 	This function neatly presents the status of the last update operation from the "/test/updatedoc" endpoint request
*/
function showSingleUpdateResults (result) {
	var content = `<h3>Update Results</h3><p>${(typeof result === "object") ? JSON.stringify(result) : result}</p>`;
	$("#content_panel").html(content);
}

/*
	@function 	showSingleWriteResults
	@parameter 	result - the JSON object comprising the result of the single update
	@returns 	n/a
	@details 	This function neatly presents the status of the last Write operation from the "/test/updatedoc" endpoint request
*/
function showSingleWriteResults (result) {
	var content = `<h3>Write Results</h3><p>${(typeof result === "object") ? JSON.stringify(result) : result}</p>`;
	$("#content_panel").html(content);
}
// END Utility Functions



// END test.js
