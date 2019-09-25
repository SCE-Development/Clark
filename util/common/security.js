//	PROJECT: 		Core-v4
// 	Name: 			Rolando Javier
// 	File: 			security.js
// 	Date Created: 	September 24, 2018
// 	Last Modified:  September 24, 2018
// 	Details:
// 					This file contains sst-/tls-/https-related settings. Its primary function is
//					to provided modules with access to security keys and certificates
// 	Dependencies:
// 					Javascript ECMAScript 6 (String Templating)

"use strict";

// Contants
"use strict";

// Constants
const certificateDir = "trustStore";		// the default folder storing the keys and certs below, relative to the current directory
const privateKeyName = "sce_engr_sjsu_edu.key";			// the name of your private rsa key (for ssl/https)
const publicKeyName = "sce_engr_sjsu_edu.public.key";		// the name of your public rsa key (for ssl/https)
const certName = "sce_engr_sjsu_edu.crt";					// the name of your ca certificate (for ssl/https)
const passphrase = "sce_engr_sjsu_edu_passphrase";	// your rsa passphrase (for ssl/https)



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
