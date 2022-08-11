const consoleColors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  default: '\x1b[0m',
};

const util = require('util');
  
const LOG_LEVELS = {
  DEBUG: 'DEBUG',
  INFO: 'INFO',
  WARNING: 'WARNING',
  ERROR: 'ERROR',
};

function getLineOfCode() {
  const e = new Error();
  // point out that 2 is for parent, 3 for grandparent etc...
  // yields "at Object.<anonymous> (/path/to/file.js:7:1)"
  let backslash = '/';
  if (process.platform === 'win32') {
    backslash = '\\';
  }
  const parentFunc = e.stack.split('\n')[4];
  const fileAndLineOfCode = parentFunc
    .split(backslash) // yields "file.js:7:1)"
    .reverse()[0] // yields "file.js:7:1"
    .split(')')[0]; // yields "file.js:7:1"
  return fileAndLineOfCode;
}

// Do not call this function directly! Use the below factory
// functions instead
function printToConsole(level, ...message) {
  let formattedMessage = new Date().toISOString();
  const args = util.format(...message);
  formattedMessage += ` ${getLineOfCode()}`;
  formattedMessage += ` ${level}`;
  formattedMessage += ` ${args}`;
  // Print the log as red or green if the level is error or warning
  if (level === LOG_LEVELS.ERROR) {
    formattedMessage = `${consoleColors.red}${formattedMessage}${consoleColors.default}`;
  } else if (level === LOG_LEVELS.WARNING) {
    formattedMessage = `${consoleColors.yellow}${formattedMessage}${consoleColors.default}`;
  }
  console.log(formattedMessage);
}
  
function debug(...message) {
  printToConsole(LOG_LEVELS.DEBUG, ...message);
}
  
function info(...message) {
  printToConsole(LOG_LEVELS.INFO, ...message);
}
  
function warn(...message) {
  printToConsole(LOG_LEVELS.WARNING, ...message);
}

function error(...message) {
  printToConsole(LOG_LEVELS.ERROR, ...message);
}

module.exports = { debug, info, warn, error };
