# Core-v4 Common Resources
A directory housing all common resources required by the server and all sub-apps

---

## Table of Contents
- [Description](#description)
- [Required Setup](#required-setup)
  - [credentials.json](#credentialsjson)
    - [Credentials Setup](#credentials-setup)
      - [System Key](#system-key)
      - [MDBI](#mdbi)
  - [security.js](#securityjs)

---

## Description

(This file assumes that you have completed all necessary setup and dependency preparation described in the [Core v4 Readme](../../README.md))

This directory is primarily used to store system credentials (i.e. to allow db admin access). The following files need to be placed in this directory _**BEFORE**_ starting the MEANserver:

  - credentials.json
  - security.js

Read each files' setup instructions for detailed procedures on setting up both the files themselves and the modules they pertain to.

---




## Required Setup

### credentials.json

This file contains all credentials necessary for the entire system to function properly. The elements currently required in the file pertain to the MDBI module (i.e. db access credentials) and the sce admin portal (i.e. sce admin portal master key). By default, the repository does not come with this file included (for security purposes), and must therefore be created manually. Below are setup instructions used to properly create the credentials.json file and associate all credentials to their relevant systems (assumes you are using Ubuntu Linux).

#### Credentials Setup

The credentials.json file is a JSON object with the following format:

```json
{
	"moduleName": "some credentials as specified by the relevant application",
	"module2Name": "some other credentials..."
}
```

It currently requires two members: "syskey" and "mdbi".

##### System Key

The system key credential creates the "root" user (so to speak) of the SCE Core v4 system. It is given the module name "syskey", and should be set to match the following JSON object:

```json
{
	"syskey": {
		"memberID": 0,
		"firstName": "s",
		"middleInitial": "c",
		"lastName": "e",
		"joinDate": "",
		"userName": "sce_admin",
		"passWord": "@sce123",
		"email": "dev.sce.sjsu@gmail.com",
		"major": "Admin",
		"lastLogin": ""
	}
}
```

where "userName" and "email" can be replaced by any string value of your choosing (be wise about password complexity), and "joinDate" and "lastLogin" can be populated with the current datetime string returned by JavaScript's Date.toISOString() function. Note that the "passWord" field _**MUST**_ be a hashed password string using [cryptic.js's](../cryptic.js) hashPwd() function. **DO NOT PUT PLAIN TEXT PASSWORDS IN THAT FIELD!!!**

Once the JSON is created and the following MDBI instructions are completed, use of the database setup script will automatically ensure that the database has this user on file as an administrator.

##### MDBI

The MDBI credential should have the module name "mdbi", and should be given the following credentials as members of a JSON object:

  - user - the username for db login
  - pwd - the password for db login

The structure as a whole should look like this:

```json
{
	"mdbi": {
		"user": "yourDbUsername",
		"pwd": "yourDbPassword"
	}
}
```

Once you have selected a username and password, they should be placed in the JSON structure above. Then, you must set the local MongoDB installation to enforce access control (see the [MongoDB Security Checklist](https://docs.mongodb.com/manual/administration/security-checklist/#enable-access-control-and-enforce-authentication)). Finally, you must add this user as an administrator using the methods described by [MongoDB Authentication Guide](https://docs.mongodb.com/manual/tutorial/enable-authentication/).

After the above steps are completed, the MDBI should automatically check that the relevant database collections exist and are formatted correctly.



### security.js

This file contains ssl-/tls-/https-related settings. Its primary function is to provide access to security keys and certificates to the modules that need it, all while maintaining system modularity. This justifies the need for a separate singleton solely for the aforementioned security credentials. Below is the format expected in the security.js file:

```javascript
"use strict";

// Constants
const certificateDir = "trustStore";		// the default folder storing the keys and certs below
const privateKeyName = "your_rsa.key";		// the name of your private rsa key (for ssl/https)
const publicKeyName = "your_rsa_public.key";	// the name of your public rsa key (for ssl/https)
const certName = "your_rsa.crt";		// the name of your ca certificate (for ssl/https)
const passphrase = "your_passphrase"		// your rsa passphrase (for ssl/https)



// Container (Singleton)
const security = {
	"prvkey": `${__dirname}/${certificateDir}/${privateKeyName}`,
	"pubkey": `${__dirname}/${certificateDir}/${publicKeyName}`,
	"passphrase": passphrase,
	"cert": `${__dirname}/${certificateDir}/${certName}`
};
Object.freeze(security);



module.exports = security;
```

It is worth noting that the ```const``` settings above can be modified to suit your server installation's needs; they only serve as factory defaults and are structured in this way to allow custom key/cert storage as desired. Be sure to set these parameters before starting up the server; access to all modules will be impossible if this configuration is not correct.
