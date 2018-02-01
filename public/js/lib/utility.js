/*
	PROJECT: 		MEANserver
	Name: 			Rolando Javier
	File: 			utility.js
	Date Created: 	October 18, 2017
	Last Modified: 	November 5, 2017
	Details:
		This file comsists of all the common utility methods used by all pages (front-end).
	Dependencies:
		JQuery v1.12.4
*/

/* Constants & Globals */
// Debug Constants
var DEBUG_VERBOSE = false;

// Keyboard Codes
const KEY_ENTER = 13;

// Settings
var ROOT_OFFSET = "";	// Default: assumes this file is 2 directories below the server root
/* END Constants & Globals */





/* Methods */
/*
	@function	doThing
	@parameter	N/A
	@details 	This function simply prints to console. Used to
				test static resource distribution by ExpressJS.
*/
function doThing () {
	console.log("doThing");
}

/*
	@function	logDebug
	@parameter	name - name of the function logging the message
	@parameter	ctxt - description of the action being logged
	@parameter	msg - the message to log
	@details 	This function is used to neatly log debug
				messages when Verbose Debugging is enabled
*/
function logDebug (name, ctxt, msg) {
	if (DEBUG_VERBOSE) {
		console.log("[" + name + "] " + ctxt + ": " + msg);
	}
}

/*
	@function	setDebug
	@parameter	state - bool to enable/disable Verbose Debugging
	@details 	This function enables Verbose Debugging on a
				true state, and disables it on a false state
*/
function setDebug (state) {
	DEBUG_VERBOSE = state;
}

/*
	@function	pressingKey
	@parameter	key - the character to check for upon a keypress
	@parameter	event - the keyboard event from the document
	@details 	This function checks to see if the key that was
				pressed matches the keycode passed by the event
				(the event is given via the JQuery "on()" call,
				and thus this function is intended to be used 
				within the callback of the "on()" call)
*/
function pressingKey (key, event) {
	var unicodeVal = event.which || event.keyCode;
	var keyUnicodeVal = key;
	if (typeof key === "string") {
		keyUnicodeVal = key.charCodeAt(0);
	}
	return (unicodeVal == keyUnicodeVal);
}

/*
	@function	post
	@parameter	uri - the URI endpoint to send the request to
	@parameter	data - the JSON object or array containing the various data (i.e. key-value pairs) to send (null if no data is sent)
	@parameter	callback - an optional function to run on
				a successful AJAX request; is passed three
				arguements based on the request success:
				On AJAX success:
					callback(responseData, responseStatus, jqxhrObject)
				On AJAX error:
					callback(errMsg, "failure", null)
	@parameter 	ajaxMode - (optional) a boolean that, if true, uses JQuery.ajax() instead of JQuery.post()
	@details 	This function sends a post request using JQuery's ajax() API
	@note 		This function automatically converts the data parameter to query-string-like format, if data is not null. It does so using JQuery's param() API. Thus, if data is an array, it must be passed in the format that JQuery's serializeArray() API returns. See JQuery.param()'s API documentation for more information.
*/
function post (uri, data, callback, ajaxMode) {
	switch (ajaxMode === true) {
		case true: {
			logDebug("post()", "Sending in AJAX mode", (typeof data === "object") ? JSON.stringify(data) : data);
			$.ajax(ROOT_OFFSET + uri, {
				"async": true,
				"method": "POST",
				"data": jQuery.param(data),
				"contentType": 'application/x-www-form-urlencoded; charset=UTF-8',
				"success": function (data, status, jqxhr) {
					if (callback) {
						callback(data, status, jqxhr);
					}
					logDebug("post()", "ajax request result", "success");
				},
				"error": function (jqxhr, status, err) {
					if (callback) {
						callback(err, status, jqxhr);
					}
					logDebug("post()", "ajax request result", `failure -> ${err}`);
				}
			});
			break;
		}
		default: {
			var postData = (data == null) ? null : "?" + (jQuery.param(data));
			logDebug("post()", "Sending in POST mode", (typeof postData === "object") ? JSON.stringify(postData) : postData);
			$.post(ROOT_OFFSET + uri, postData, function (data, status, jqxhr) {	// success function
				if (callback) {
					callback(data, status, jqxhr);
					logDebug("post()", "AJAX request result", "success");
				}
			}).fail(function () {
				if (callback) {
					callback("Failed to reach " + uri, "failure", null);
					logDebug("post()", "POST Error", "failed to send to " + uri);
				}
			});
			break;
		}
	}
}

/*
	@function 	serializeArray
	@parameter 	arr - the input array to serialize
	@parameter 	callback - (optional) a callback function to run after the serialization is complete
	@returns 	If callback is undefined, returns the newly serialized array. Otherwise, it returns nothing
	@details 	(Intended for use with @function post() when passing data as an Array) This function serializes the "arr" in the manner that JQuery.serializeArray() serializes form data (see JQuery.serializeArray() API docs for more details) and either passes it to the callback (if it is specified), or returns the result.
*/
function serializeArray (arr, callback) {
	var newArray = [];
	for (var i = 0; i < arr.length + 1; i++) {
		switch (i) {
			case arr.length: {	// on last iteration, either run callback or explicitly return value
				if (typeof callback === "function") {
					callback(newArray);
				} else {
					return newArray;
				}
				break;
			}
			default: {
				newArray[i] = {"arrayKey": i.toString(), "arrayValue": arr[i]};
				break;
			}
		}
	}
}

/*
	@function 	storageAvailable
	@parameter 	type - the type of browser storage you want to check for (valid values are "sessionStorage" or "localStorage")
	@returns 	On success: true
				On failure: an error
	@details 	This function was provided by MDN (mozilla developer's network) as an example of how to verify if a browser supports storage
*/
function storageAvailable(type) {
    try {
        var storage = window[type],
            x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            storage.length !== 0;
    }
}
/* END Methods */
