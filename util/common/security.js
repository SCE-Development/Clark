//	PROJECT: 		Core-v4
// 	Name: 			Rolando Javier
// 	File: 			security.js
// 	Date Created: 	January 27, 2018
// 	Last Modified: 	January 27, 2018
// 	Details:
// 					This file houses the locations of the required ca certificates to enable the use of https in transporting secure internet traffic
// 	Dependencies:
// 					?

"use strict";

// Constants
const certificateDir = "trustStore";
const privateKeyName = "rj_rsa.key";
const publicKeyName = "rj_rsa_public.key";
const certName = "rj_rsa.crt";
const passphrase = "@sce123_gettingSchwifty"



// Container (Singleton)
const security = {
	"prvkey": `${__dirname}/${certificateDir}/${privateKeyName}`,
	"pubkey": `${__dirname}/${certificateDir}/${publicKeyName}`,
	"passphrase": passphrase,
	"cert": `${__dirname}/${certificateDir}/${certName}`
};
Object.freeze(security);



module.exports = security;

// END security.js
