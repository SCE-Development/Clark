//	PROJECT: 		MEANserver
// 	Name: 			Rolando Javier
// 	File: 			server.js
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
	"logdir": __dirname + "/../log"
};

module.exports = defaults;
// END server.js
