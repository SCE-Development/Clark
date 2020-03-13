// PROJECT:   MEANserver
//  Name:    Rolando Javier
//  File:    logger.js
//  Date Created:  October 26, 2017
//  Last Modified:  January 27, 2018
//  Details:
//      This file provides server.js with a means to log 
//      events to log files in the log directory
//  Dependencies:
//      NodeJS (using ECMAscript 6 style JS)
// Note:
//     It is important to note that the idea of a 
//     "const" in JS doesn't mean "is constant", but rather, 
//     that "it can only be assigned ONCE", and thus all references 
//     to the "logger" singleton are "constant" (i.e. referencing the 
//     exact same object in memory). The logger singleton is still, 
//     therefore, not immutable, unless frozen with object.freeze().

const fs = require('fs');
// const util = require('util')
const settings = require('./settings');

// Container (Singleton)
const logger = {};

const testEnv = process.env.NODE_ENV === 'test';

// Members
/*
 @member  logger.logHeader
 @details  This member defines the heading 
 prepended to each logfile's filename.
*/
logger.logHeader = '__scelog__';

/*
 @member  logger.fileMutex
 @details  This member signals when a file is being written to.
*/
logger.fileMutex = true;

/*
 @member  logger.dataQueue
 @details  This member is used as a queue for log data if a log was 
 attempted while another log or process had the mutex
*/
// queue for data to be written, if logs were requested 
// while a logger.fileMutex was unavailable
logger.dataQueue = ['\n****\nInitializing event log system...\n****\n'];


/*
 @member  logger.logToConsole
 @details  If true, this member will force the logger 
 to log its message to both the logfile and the console. Defaults to true.
*/
logger.logToConsole = !testEnv;

// @member   logger.blacklist
// @details   This member is used to list which 
// handlers' messages should be ignored
logger.blacklist = [];

// Methods
// @function  logger.ignore()
// @description  This function tells the logger module to 
//     ignore certain messages for logging (both to
//     console and to log file). If an message has a handler 
//     tag with a "src" attribute
//     whose name is specified within the tagName(s), that 
//     message is ignored and not logged
//     This function has a contextual usage. If no arguments 
//     are given, this function returns
//     the current blacklist. If parameter tagNames is 
//     given, the specified tagName is added to
//     the message black list, and this function then 
//     returns the new blacklist.
// @parameters  (~array) tagNames  An (optional) array 
// listing the handler tag names to ignore
// @returns   (array) blacklist  The current message tags blacklist
logger.ignore = function(tagNames = []) {
  // Add tag names to the current blacklist if they don't already exist in it
  tagNames.forEach(function(tag) {
    // Check if the tag already exists. If not, then add it
    if (!logger.blacklist.includes(tag)) {
      logger.blacklist.push(tag);
    }
  });

  // Return the latest version of the blacklist
  return logger.blacklist;
};

// @function  logger.interpret()
// @description  This function tells the logger to 
//   interpret certain messages for logging (both
//     to console and to log file) by removing it 
//     from the blacklist (if it exists).
// @parameter  (array) tagNames  An array listing 
// the handler tag names to remove from
//           the blacklist
// @returns   n/a
logger.interpret = function(tagNames) {
  // If tagNames is not an array, convert it to one
  if (!Array.isArray(tagNames)) {
    // Convert to an array
    tagNames = [tagNames];
  }

  // Remove tagNames from the blacklist
  tagNames.forEach(function(tagName) {
    // Check if the tagName exists within the array
    const index = logger.blacklist.indexOf(tagName);
    if (index !== -1) {
      // Remove the index from the blacklist
      logger.blacklist.splice(index, 1);
    }
  });
};

/*
 @function logger.log
 @parameter msg - the string message to log
 @parameter options - (optional) JSON object of 
 formatting options to customize how @parameter msg is written to the logfile
 @returns An object detailing the message that was 
 logged (i.e. placed in log queue), and its log settings:
    {
     "timestamp": [message's timestamp],
     "month": [message's log month],
     "day": [message's log day],
     "year": [message's log year],
     "src": [message's source]
    }
 @details
    This function is used to record server events in daily 
    logfiles within the log directory (defined in settings.js). 
    The function places the messages in a queue and processes 
    them as they come along. As previously implied, this function 
    will store the message in the log file corresponding to current 
    date that @function logger.log was called. If a logfile with today's 
    date does not exist, that log file will be automatically created and 
    piped the message.
    Whenever @function log is called, it automatically tags @parameter 
    msg with a timestamp in front, and places it at the end of the 
    logfile. If options is specified, it may contain any or 
    all of the following:

     {
      "addNL": [true | false], // if true, automatically appends 
      newline to @parameter msg; defaults to true
      "pad": [unsigned int], // if > 0, adds the specified amount of 
      newlines before writing the timestamp and msg; 
      useful for placing separators in the logfile. Max is 50.
      "src": [string] // if defined, adds this string before writing the 
      msg; useful for indicating where the message is being logged from
     }
 @notes
    The logfiles will be named in this format: [logger.logHeader][current_date].
    In contrast to log file logging, all console.log() calls
    may or may not appear in the server console in the order they are written
*/
logger.log = function(
  msg,
  options = {
    addNL: true,
    pad: 0,
    src: undefined
  }
) {
  // Determine current time information
  const date = new Date();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear();
  const timestamp = '[' + date.toTimeString() + '] ';
  let padding = '';
  let sourceTag = '';

  // Return if unit-tests are being performed
  if (testEnv) return;

  // Handle options
  msg +=
    typeof options.addNL !== 'undefined' && options.addNL === false ? '' : '\n';
  if (typeof options.pad !== 'undefined' && options.pad > 0) {
    for (let i = 0; i < options.pad; i++) {
      padding += '\n';
    }
  }
  sourceTag = typeof options.src !== 'undefined' ? `<${options.src}> ` : '';

  // Determine if the message source is in the blacklist
  const srcIsBlacklisted = logger.blacklist.includes(options.src);

  // Place msg in log queue if the log src is not blacklisted
  if (!srcIsBlacklisted) {
    // If the log src is not blacklisted, place the message on the queue
    logger.dataQueue.push(padding + timestamp + sourceTag + msg);
  }

  // Set the message's detailed info
  const detailedInfo = {
    timestamp: timestamp,
    month: month,
    day: day,
    year: year,
    src: options.src
  };

  // If this message's tag is in the black list, 
  // don't log it or print it out at all!
  if (srcIsBlacklisted) {
    detailedInfo.ignored = true;
  }

  // If no other process is using the file, take the file mutex so 
  // that no other log call can write. Then, flush all messages.
  if (logger.fileMutex === true && !srcIsBlacklisted) {
    // Take mutex
    logger.fileMutex = false;

    // Create date string for filename
    let datestr = '';
    datestr += month < 10 ? '0' + month.toString() : month.toString();
    datestr += '-' + (day < 10 ? '0' + day.toString() : day.toString());
    datestr += '-' + year.toString();

    // Create (absolute) filepath to search for
    const filename = `${logger.logHeader}${datestr}`;
    const filepath = `${settings.logdir}/${filename}`;

    // Flush dataQueue message(s) to logfile
    while (logger.dataQueue.length > 0) {
      // removes from front of array
      const msgFromQueue = logger.dataQueue.shift();
      fs.appendFile(filepath, msgFromQueue, 'utf8', function(error) {
      });
    }

    // Return mutex
    logger.fileMutex = true;
  }

  // Return background information about this log message
  return detailedInfo;
};

module.exports = logger;
// END logger.js
