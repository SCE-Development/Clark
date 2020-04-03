// PROJECT:   MEANserver
//  Name:    Rolando Javier
//  File:    settings.js
//  Date Created:  October 26, 2017
//  Last Modified:  January 9, 2018
//  Details:
//      This file contains all global server.js system settings
//  Dependencies:
//      NodeJS (using ECMAscript 6 style JS)

const path = require('path');

const defaults = {
  port: 8080,
  root: path.join(__dirname, '/../public'),
  util: __dirname,
  logdir: path.join(__dirname, '/../log'),
  // toggles the availability of certain development tools
  developmentMode: true,
  sessionIdleTime: 20 // minutes
};

module.exports = defaults;
// END settings.js
