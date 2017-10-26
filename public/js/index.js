"use strict"

$(document).ready(init());

console.log("Welcome to the login portal");
doThing();

function init () {
	setDebug(true);
	$(document).off("keyup").on("keyup", function (event) {
		var enterPressed = pressingKey(KEY_ENTER, event);	// checks for enter key press
		if (enterPressed) {
			console.log("pressed ENTER");
			post("login", {
				"name": "hello",
				"password": "world"
			}, function (data,status,xhr) {
				console.log(data);
				console.log(status);
				console.log(xhr);
			});
		}
	});
}
