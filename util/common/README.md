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

(This file assumes that you have completed all necessary *setup and dependency* preparation described in the [Core v4 Readme](../../README.md))

This directory is primarily used to store system credentials (i.e. to allow db admin access). The following files need to be placed in this directory _**BEFORE**_ starting the MEANserver:

  - credentials.json
  - security.js

Read each files' setup instructions for detailed procedures on setting up both the files themselves and the modules they pertain to.

---




## Required Setup

### credentials.json

This file contains all credentials necessary for the entire system to function properly. The elements currently required in the file pertain to the MDBI module (i.e. db access credentials) and the sce admin portal (i.e. sce admin portal master key). By default, the repository does not come with this file included (for security purposes), and must therefore be created manually and placed in the directory described by your **settings.js** file (defaults to "\[name of project dir\]/util/common"). Below are setup instructions used to properly create the credentials.json file and associate all credentials to their relevant systems (assumes you are using Ubuntu Linux).

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
	},
	"mdbi": {
		...
	}
}
```

where "userName" and "email" can be replaced by any string value of your choosing (be wise about password complexity), and "joinDate" and "lastLogin" can be populated with the current datetime string returned by JavaScript's Date.toISOString() function. Note that the "passWord" field _**MUST**_ be a hashed password string using [cryptic.js's](../cryptic.js) hashPwd() function. **NEVER PUT PLAIN TEXT PASSWORDS IN THE syskey.passWord FIELD!!!**

Once the JSON is created and the following MDBI instructions are completed, use of the database setup script will automatically ensure that the database has this user on file as an administrator.

##### MDBI

The MDBI credential should have the module name "mdbi", and should be given the following credentials as members of a JSON object:

  - user - the username for db login
  - pwd - the un-hashed, plain-text password for db login
  - accessToken - a hash string used by all local system modules to grant database access rights

The structure as a whole should look like this:

```json
{
	"syskey": {
		...
	},
	"mdbi": {
		"user": "yourDbUsername",
		"pwd": "yourDbPassword",
		"accessToken": "yourAccessToken"
	}
}
```

Username and password selection is entirely up to you, but be sure to acquire a hash string from a secure hashing algorithm (i.e. sha256). (_**Aside:**_ If you wish, you can generate a hash string by using the [cryptic.js](../cryptic.js) functions "hashPwd()" or "hashSessionID()" on some plaintext of your choosing. Upon acquiring the generated hash, you may discard the original plaintext, as it is not useful for mdbi access clearance). Once you have selected a username, password, and hash string, they should be placed in the JSON structure above. Then, you must set the local MongoDB installation to enforce access control (see the [MongoDB Security Checklist](https://docs.mongodb.com/manual/administration/security-checklist/#enable-access-control-and-enforce-authentication)). Finally, you must add this user as an administrator using the methods described by [MongoDB Authentication Guide](https://docs.mongodb.com/manual/tutorial/enable-authentication/).

After the above steps are completed, the MDBI should automatically check that the relevant database collections exist and are formatted correctly.



### security.js

This file contains ssl-/tls-/https-related settings. Its primary function is to provide access to security keys and certificates to the modules that need it, all while maintaining system modularity. This justifies the need for a separate singleton solely for the aforementioned security credentials. Below is the format expected in the security.js file:

```javascript
"use strict";

// Constants
const certificateDir = "trustStore";		// the default folder storing the keys and certs below, relative to the current directory
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

It is worth noting that the ```const``` settings above can be modified to suit your server installation's needs; they only serve as factory defaults and are structured in this way to allow custom key/cert storage as desired. Be sure to set these parameters before starting up the server; software access to all modules will be *impossible* if this configuration is not correct.

At minimum, this file requires you to specify the following:
  - **certificateDir** - a directory path _relative_ to this file's containing directory
  - **privateKeyName** - the name of the rsa private key to use; must exist within the "certificateDir" directory
  - **publicKeyName** - the name of the rsa public key to use; must exist within the "certificateDir" directory
  - **certName** - the name of the rsa CA certificate to use; must exist within the "certificateDir" directory
  - **passphrase** - the rsa passphrase associated with your certificate

The files described above can be acquired or generated (depending on your situation) by following the steps below (based on instructions in the OpenSSL cookbook, 2nd Ed.):

##### If you are initializing a production version of Core-v4 and/or have an official CA certificate
1. **Using An Official Certificate:** This is the easier situation, as it assumes the bulk of the work was done by your CA (Certificate Authority). The CA will have signed the certificate, and you will typically not have access to the private key they used to generate it. Thus, you can simply leave ```publicKeyName``` and ```privateKeyName``` as empty strings (i.e. ```publicKeyName = ""```), and then have ```certName``` and ```certificateDir``` point to the corresponding CA certificate in your machine.

##### If you are creating a dev version of Core-v4 and/or don't have an official CA certificate
You will need to install openssl in your machine to perform the following instructions in command-line:

1. **Private Key Generation:** Create a RSA key using the following command:
    ```
    openssl genrsa -aes128 -out [privateKeyName].key 2048
    ```
    This step will ask you to enter a password for your key. It is _**recommended**_ to use the password specified by ```const passphrase``` (defined in your security.js file) as your key's password.
1. **Public Key Extraction:** Extract your public key using your private key in the following command:
    ```
    openssl rsa -in [privateKeyName].key -pubout -out [publicKeyName].key
    ```
    This command will ask you to enter your private key's password.
1. **Creating a Self-Signed Certificate:** First, you must create an OpenSSL certificate signing request file with the following command:
    ```
    openssl req -new -key [privateKeyName].key -out [someCsrName].csr
    ```
    This step will prompt you for some configuration info, but the only important things you need to enter are ```Country Name``` (i.e. US for United States), ```State or Province Name``` (i.e. California), ```Locality Name``` (i.e. San Jose, or whatever city you are in), and ```Organization Name``` (i.e. SCE, YourCompany, etc.). You can leave any other items blank by hitting "Enter" without entering anything.
    Then, you may proceed to sign your very own certificate signing request file using this command:
    ```
    openssl x509 -req -days 365 -in [someCsrName].csr -signkey [privateKeyName].key -out [certName].crt
    ```
    With all these files generated, be sure to place them in the directory specified by ```const certificateDir```. Not doing so will disallow any access to the database, since the MDBI requires RESTful requests to be done in *HTTPS* (a protocol that uses public key crytposystem security, i.e. RSA).
