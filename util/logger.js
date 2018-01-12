//	PROJECT: 		MEANserver
// 	Name: 			Rolando Javier
// 	File: 			logger.js
// 	Date Created: 	October 26, 2017
// 	Last Modified: 	January 9, 2018
// 	Details:
// 					This file provides server.js with a means to log events to log files in the log directory
// 	Dependencies:
// 					NodeJS (using ECMAscript 6 style JS)

"use strict"
var fs = require("fs");
var util = require("util");
var settings = require("./settings");



// Container (Singleton)
const logger = {};



// Members
/*
	@member 	logger.logHeader
	@details 	This member defines the heading prepended to each logfile's filename.
*/
logger.logHeader = "__scelog__";

/*
	@member 	logger.fileMutex
	@details 	This member signals when a file is being written to.
*/
logger.fileMutex = true;

/*
	@member 	logger.dataQueue
	@details 	This member is used as a queue for log data if a log was attempted while another log or process had the mutex
*/
logger.dataQueue = ["\n****\nInitializing event log system...\n****\n"];	// queue for data to be written, if logs were requested while a logger.fileMutex was unavailable

/*
	@member 	logger.logToConsole
	@details 	If true, this member will force the logger to log its message to both the logfile and the console. Defaults to true.
*/
logger.logToConsole = true;



// Methods
/*
	@function	logger.log
	@parameter	msg - the string message to log
	@parameter	options - (optional) JSON object of formatting options to customize how @parameter msg is written to the logfile
	@returns	An object detailing the message that was logged (i.e. placed in log queue), and its log settings:
				{
					"timestamp": [message's timestamp],
					"month": [message's log month],
					"day": [message's log day],
					"year": [message's log year],
					"src": [message's source]
				}
	@details 	
				This function is used to record server events in daily logfiles within the log directory (defined in settings.js). The function places the messages in a queue and processes them as they come along. As previously implied, this function will store the message in the log file corresponding to current date that @function logger.log was called. If a logfile with today's date does not exist, that log file will be automatically created and piped the message.
				Whenever @function log is called, it automatically tags @parameter msg with a timestamp in front, and places it at the end of the logfile. If options is specified, it may contain any or all of the following:

					{
						"addNL": [true | false],	// if true, automatically appends newline to @parameter msg; defaults to true
						"pad": [unsigned int],	// if > 0, adds the specified amount of newlines before writing the timestamp and msg; useful for placing separators in the logfile. Max is 50.
						"src": [string]	// if defined, adds this string before writing the msg; useful for indicating where the message is being logged from
					}
	@notes
				The logfiles will be named in this format: [logger.logHeader][current_date].
				In contrast to log file logging, all console.log() calls may or may not appear in the server console in the order they are written
*/
logger.log = function (msg, options = {
	"addNL": true,
	"pad": 0,
	"src": undefined
}) {
	// Determine current time information
	var date = new Date();
	var month = date.getMonth() + 1;
	var day = date.getDate();
	var year = date.getFullYear();
	var timestamp = "[" + date.toTimeString() + "] ";
	var padding = "";
	var sourceTag = "";

	// Handle options
	msg += (typeof options.addNL !== "undefined" && options.addNL === false) ? "" : "\n";
	if (typeof options.pad !== "undefined" && options.pad > 0) {
		for (var i = 0; i < options.pad; i++) {
			padding += "\n";
		}
	}
	sourceTag = (typeof options.src !== "undefined") ? `<${options.src}> ` : "";

	// Place msg in log queue
	logger.dataQueue.push(padding + timestamp + sourceTag + msg);

	// Set the message's detailed info
	var detailedInfo = {
		"timestamp": timestamp,
		"month": month,
		"day": day,
		"year": year,
		"src": options.src
	};

	// If no other process is using the file, take the file mutex so that no other log call can write. Then, flush all messages.
	if (logger.fileMutex === true) {
		// Take mutex
		logger.fileMutex = false;

		// Create date string for filename
		var datestr = "";
		datestr += (month < 10) ? "0" + month.toString() : month.toString();
		datestr += "-" + ((day < 10) ? "0" + day.toString() : day.toString());
		datestr += "-" + year.toString();

		// Create (absolute) filepath to search for
		var filename = `${logger.logHeader}${datestr}`;
		var filepath = `${settings.logdir}/${filename}`;

		// Flush dataQueue message(s) to logfile
		while (logger.dataQueue.length > 0) {
			var msgFromQueue = logger.dataQueue.shift();	// removes from front of array
			fs.appendFile(filepath, msgFromQueue, "utf8", function (error) {
				if (error) {
					if (logger.logToConsole === true) {
						console.log(`(Log Error occurred for ${filename}) [UNLOGGED] ${msgFromQueue}`);
						// console.log(error);
					}
				} else {
					if (logger.logToConsole === true) {
						console.log(`(Logged to ${filename} from queue) ${msgFromQueue}`);
					}
				}
			});
		}

		// Return mutex
		logger.fileMutex = true;
	}

	// Return background information about this log message
	return detailedInfo;
}


module.exports = logger;
// END logger.js
