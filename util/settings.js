//	PROJECT: 		MEANserver
// 	Name: 			Rolando Javier
// 	File: 			settings.js
// 	Date Created: 	October 26, 2017
// 	Last Modified: 	January 9, 2018
// 	Details:
// 					This file contains all global server.js system settings
// 	Dependencies:
// 					NodeJS (using ECMAscript 6 style JS)
"use strict"

var defaults = {
	"port": 8080,
	"root": __dirname + "/../public",
	"util": __dirname,
	"logdir": __dirname + "/../log",
	"credentials": __dirname + "/common/credentials.json",
	"security": __dirname + "/common/security.js",
	"developmentMode": true,	// toggles the availability of certain development tools
	"sessionIdleTime": 20 	// minutes
};

module.exports = defaults;
// END settings.js
