// PROJECT:   Core-v4
//  Name:    Rolando Javier
//  File:    system_setup.js
//  Date Created:  September 23, 2018
//  Last Modified:  September 23, 2018
//  Details:
//      This file contains a setup script to automate the development environment
//     initialization process. This entails setting up a self-signed CA certificate,
//     creating the system key, creating mdbi and MongoDB credentials, and running
//     an install of all required NodeJS modules
//  Dependencies:
//      JavaScript ECMAScript 6
//     NodeJS v8.9.1+

'use strict'

// Includes
const cp = require('child_process')
// const fs = require('fs')
const settings = require('../settings')
const cryptic = require(`${settings.util}/cryptic.js`)
const securityConf = require(`${settings.util}/tools/res/system_setup_defaults.json`)

// Globals
const args = process.argv
const command = args[2]
const options = {
  verbose: false
}
const colors = {
  // Text Color Codes for Any Terminal; based on the ANSI standard
  Reset: '\x1b[0m',
  Bright: '\x1b[1m',
  Dim: '\x1b[2m',
  Underscore: '\x1b[4m',
  Blink: '\x1b[5m',
  Reverse: '\x1b[7m',
  Hidden: '\x1b[8m',

  FgBlack: '\x1b[30m',
  FgRed: '\x1b[31m',
  FgGreen: '\x1b[32m',
  FgYellow: '\x1b[33m',
  FgBlue: '\x1b[34m',
  FgMagenta: '\x1b[35m',
  FgCyan: '\x1b[36m',
  FgWhite: '\x1b[37m',

  BgBlack: '\x1b[40m',
  BgRed: '\x1b[41m',
  BgGreen: '\x1b[42m',
  BgYellow: '\x1b[43m',
  BgBlue: '\x1b[44m',
  BgMagenta: '\x1b[45m',
  BgCyan: '\x1b[46m',
  BgWhite: '\x1b[47m'
}
const styles = {
  // Text Decoration Codes for Any Terminal; based on the ANSI standard
  Bold: '\u001b[1m',
  Underline: '\u001b[4m',
  Reverse: '\u001b[7m'
}

// BEGIN main
// Check if there are any arguments
if (args.length <= 2) {
  // If no arguments were given other than "node" and "system_settings.js", show help
  console.log('\nError: Please specify a command\n')
  showHelp()
} else {
  // Acquire any general options
  if (args.includes('--verbose')) {
    // If verbose logging is requested, enable verbose logging
    options.verbose = true
  }

  // Otherwise, proceed to determine what to do based on the given command
  switch (command) {
    // If command is "help"
    case 'help': {
      // Show the help dialog and exit
      showHelp()
      break
    }

    // If the command is "all"
    case 'all': {
      // Check for any configuration action options
      if (args.includes('--manual')) {
        // Perform the manual installations
      } else {
        // If only the command was given, assume "default" credentials are requested and
        // run the setup scripts using prescribed defaults. First, acquire NodeJS modules
        setupNodeModules()
          .then(function () {
            // If the npm install completed, then run the credentials setup
            return setupCredentials()
          })
          .then(function () {
            // If the credentials setup worked, check for OpenSSL
            return checkForOpenSSL()
          })
          .then(function () {
            // If the OpenSSL check worked, use OpenSSL to create a private key
            return createPrivateKey()
          })
          .then(function () {
            // If the private key was created, get its corresponding public key
            return extractPublicKey()
          })
          .then(function () {
            // If the public key was acquired, generate a CSR
            return createCsr()
          })
          .then(function () {
            // If the CSR was created, use it to create a self-signed certificate
            return createSelfSignedCertificate()
          })
          .then(function () {
            // If the self-signed cert was generated, configure security parameters
            return setupSecurity()
          })
          .then(function () {
            // If security configuration completed, run MongoDB installation
            return checkMongoDB()
          })
          .catch(function (err) {
            // If any promise failed, report the error
            throw err
          })
      }
      break
    }

    // If the command is unrecognized
    default: {
      console.log('\nUnknown Command "' + command + '"\n')
      showHelp()
      break
    }
  }
}
// END main

// BEGIN setup scripts
// @function  checkForOpenSSL
// @description  This function returns a promise that checks for OpenSSL installations
// @parameters  n/a
// @returns   (Promise)
function checkForOpenSSL () {
  // Return a promise
  return new Promise(function (resolve, reject) {
    // Run a check for openssl
    colorLog('Configuring HTTPS web security...\n')
    cp.exec('which openssl', function (error, stdout, stderr) {
      // Check for errors
      if (error) {
        // If error, then openssl wasn't found; throw error
        colorLog('FAILURE (setupSecurity)\n', {
          append:
            '\nUnable to find OpenSSL! Ensure you have it installed before proceeding',
          theme: 'danger',
          style: ['bold']
        })
        reject(new Error(error))
      } else {
        // Otherwise, if openssl exists, resolve the promise
        if (stdout && options.verbose) console.log('STDOUT:', stdout)
        if (stderr && options.verbose) console.log('STDERR:', stderr)
        colorLog('COMPLETE\n', {
          theme: 'complete',
          append: '\n\n'
        })
        resolve()
      }
    })
  })
}

// @function  checkMongoDB
// @description  This function attempts to install and setup a local installation of MongoDB
// @parameters  n/a
// @returns   (Promise)
function checkMongoDB () {
  // Return a Promise
  return new Promise(function (resolve, reject) {
    // Run a command to install MongoDB
    colorLog('Checking for MongoDB...\n')
    cp.exec('which mongo mongod', function (error, stdout, stderr) {
      // Check for errors
      if (error) {
        // If error, throw error
        colorLog('FAILURE (checkMongoDB)\n', {
          append:
            '\nIt seems you don\'t have MongoDB installed and accessible via alias. Please install MongoDB manually before completing setup, and ensure that is is accessible via the alias "mongod" (i.e. create an alias in your .bashrc or .bash-profile and restart your command line)',
          theme: 'danger',
          style: ['bold']
        })
        reject(new Error(error))
      } else {
        // Otherwise, check that we have both Mongo Shell and Mongo Daemon
        if (stderr && options.verbose) console.log('STDERR:', stderr)
        if (stdout && options.verbose) console.log('STDOUT:', stdout)

        // Otherwise, proceed
        colorLog('COMPLETE\n', {
          theme: 'complete',
          append: '\n\n'
        })
        resolve()
      }
    })
  })
}

// @function  createCsr
// @description  This function returns a promise that creates a certificate signing request
//     for the PKI key pair generated by createPrivateKey() and extractPublicKey()
// @parameters  n/a
// @returns   (Promise)
function createCsr () {
  // Return a promise
  return new Promise(function (resolve, reject) {
    // Acquire the security config details
    const sInfo = securityConf.commonResources['security.js']

    // Generate file storage path
    const path = `${settings.util}/common/${sInfo.certificateDir}`

    // Run a command that generates a CSR
    const cmd = `openssl req -new -passin pass:'${sInfo.passphrase}' -subj '/CN=localhost/OU=Development Team/O=Software and Computer Engineering Society/C=US/ST=California/L=San Jose/emailAddress=dev.sce.sjsu@gmail.com' -key ${path}/${sInfo.privateKeyName} -out ${path}/${sInfo.csrName}`
    colorLog('Creating Certificate Signing Request...\n')
    cp.exec(cmd, function (error, stdout, stderr) {
      // Check for errors
      if (error) {
        // If error, then the CSR was not created; throw an error
        colorLog('FAILURE (createCsr)\n', {
          append: '\nCSR generation incomplete due to an unhandled error!',
          theme: 'danger',
          style: ['bold']
        })
        reject(new Error(error))
      } else {
        // Otherwise, resolve the promise
        if (stdout && options.verbose) console.log('STDOUT:', stdout)
        if (stderr && options.verbose) console.log('STDERR:', stderr)
        colorLog('COMPLETE\n', {
          theme: 'complete',
          append: '\n\n'
        })
        colorLog(
          "\n\n\nNOTE: Remember the challenge password you created, and keep it in a safe place! You won't be able to use this CSR if you lose it!\n\n\n",
          {
            prepend: '\n\n\n',
            append: '\n\n\n',
            theme: 'warning',
            style: ['bold', 'underline']
          }
        )
        resolve()
      }
    })
  })
}

// @function  createPrivateKey
// @description  This function returns a Promise that creates and configures the server's
//     private key using openssl.
// @parameters  n/a
// @returns   (Promise)
function createPrivateKey () {
  // Return a promise
  return new Promise(function (resolve, reject) {
    // Acquire the security config details
    const sInfo = securityConf.commonResources['security.js']

    // Generate file storage path
    const path = `${settings.util}/common/${sInfo.certificateDir}`

    // Run a command to generate a private key using openssl
    const cmd = `openssl genrsa -aes128 -passout pass:'${sInfo.passphrase}' -out ${path}/${sInfo.privateKeyName} 2048`
    colorLog('Creating Private Key...\n')
    cp.exec(cmd, function (error, stdout, stderr) {
      // Check for errors
      if (error) {
        // If error, then the private key was not generated. Throw an error
        colorLog('FAILURE (createPrivateKey)\n', {
          append:
            "\nAn error occurred while creating the server's private key!",
          theme: 'danger',
          style: ['bold']
        })
        reject(new Error(error))
      } else {
        // Otherwise, resolve the promise
        if (stdout && options.verbose) console.log('STDOUT:', stdout)
        if (stderr && options.verbose) console.log('STDERR:', stderr)
        colorLog('COMPLETE\n', {
          theme: 'complete',
          append: '\n\n'
        })
        resolve()
      }
    })
  })
}

// @function  createSelfSignedCertificate
// @description  This function returns a promise that signs the CSR generated from createCsr()
//     and thereby creates a self-signed certificate
// @parameters  n/a
// @returns   (Promise)
function createSelfSignedCertificate () {
  // Return a promise
  return new Promise(function (resolve, reject) {
    // Acquire the security config details
    const sInfo = securityConf.commonResources['security.js']

    // Generate file storage path
    const path = `${settings.util}/common/${sInfo.certificateDir}`

    // Run a command to generate a self-signed certificate from the generated csr
    const cmd = `openssl x509 -req -days 365 -in ${path}/${sInfo.csrName} -passin pass:'${sInfo.passphrase}' -signkey ${path}/${sInfo.privateKeyName} -out ${path}/${sInfo.certName}`
    colorLog('Acquiring self-signed certificate...\n')
    cp.exec(cmd, function (error, stdout, stderr) {
      // Check for errors
      if (error) {
        // If error, then the certificate was not created; throw an error
        colorLog('FAILURE (createSelfSignedCertificate)\n', {
          append:
            '\nAn error occurred while signing the CSR to generate a certificate!',
          theme: 'danger',
          style: ['bold']
        })
        reject(new Error(error))
      } else {
        // Otherwise, resolve the promise
        if (stdout && options.verbose) console.log('STDOUT:', stdout)
        if (stderr && options.verbose) console.log('STDERR:', stderr)
        colorLog('COMPLETE\n', {
          theme: 'complete',
          append: '\n\n'
        })
        resolve()
      }
    })
  })
}

// @function  extractPublicKey
// @description  This function returns a Promise that derives a public key from a private
//     key generated by createPrivateKey()
// @parameters  n/a
// @returns   (Promise)
function extractPublicKey () {
  // Return a promise
  return new Promise(function (resolve, reject) {
    // Acquire the security config details
    const sInfo = securityConf.commonResources['security.js']

    // Generate file storage path
    const path = `${settings.util}/common/${sInfo.certificateDir}`

    // Run a command to extract the public key
    const cmd = `openssl rsa -in ${path}/${sInfo.privateKeyName} -pubout -out ${path}/${sInfo.publicKeyName} -passin pass:'${sInfo.passphrase}'`
    colorLog('Generating Public Key...\n')
    cp.exec(cmd, function (error, stdout, stderr) {
      // Check for errors
      if (error) {
        // If error, then the public key wasn't extracted; throw an error
        colorLog('FAILURE (extractPublicKey)\n', {
          append: "\nAn error occurred while acquire the server's public key!",
          theme: 'danger',
          style: ['bold']
        })
        reject(new Error(error))
      } else {
        // Otherwise, resolve the promise
        if (stdout && options.verbose) console.log('STDOUT:', stdout)
        if (stderr && options.verbose) console.log('STDERR:', stderr)
        colorLog('COMPLETE\n', {
          theme: 'complete',
          append: '\n\n'
        })
        resolve()
      }
    })
  })
}

// @function  setupCredentials
// @description  This function attempts to setup the security credentials file
//     "credentials.json"
// @parameters  n/a
// @returns   (Promise)
function setupCredentials () {
  // Return a Promise
  return new Promise(function (resolve, reject) {
    // Acquire the credential config defaults
    const credentials = securityConf.commonResources['credentials.json']

    // Generate file storage path
    const filepath = `${settings.credentials}`

    // Perform credential preparation by hashing the password and creating a MDBI
    // access token
    credentials.syskey.passWord = cryptic.hashPwd(
      credentials.syskey.userName,
      credentials.syskey.passWord
    )
    credentials.mdbi.accessToken = cryptic.hashPwd(
      credentials.mdbi.user,
      credentials.mdbi.pwd
    )

    // Generate a credntials.json template
    const jsonTemplate = `{\n\t"syskey": {\n\t\t"memberID": ${credentials.syskey.memberID},\n\t\t"firstName": "${credentials.syskey.firstName}",\n\t\t"middleInitial": "${credentials.syskey.middleInitial}",\n\t\t"lastName": "${credentials.syskey.lastName}",\n\t\t"joinDate": "${credentials.syskey.joinDate}",\n\t\t"userName": "${credentials.syskey.userName}",\n\t\t"passWord": "${credentials.syskey.passWord}",\n\t\t"email": "${credentials.syskey.email}",\n\t\t"emailVerified": ${credentials.syskey.emailVerified},\n\t\t"emailOptIn": ${credentials.syskey.emailOptIn},\n\t\t"major": "${credentials.syskey.major}",\n\t\t"lastLogin": "${credentials.syskey.lastLogin}"\n\t},\n\t"mdbi": {\n\t\t"user": "${credentials.mdbi.user}",\n\t\t"pwd": "${credentials.mdbi.pwd}",\n\t\t"accessToken": "${credentials.mdbi.accessToken}"\n\t}\n}`

    // Run a command to create the config file using the default template (perhaps use EJS?)
    colorLog('Configuring security credentials...\n')
    // cp.exec( "echo '" + jsonTemplate + "' > " + settings.credentials, function( error, stdout, stderr ) {
    cp.exec("echo '" + jsonTemplate + "' > " + filepath, function (
      error,
      stdout,
      stderr
    ) {
      // Check for errors
      if (error) {
        // If error, throw error
        colorLog('FAILURE (setupCredentials)\n', {
          theme: 'danger',
          style: ['bold']
        })
        reject(new Error(error))
      } else {
        // Otherwise, proceed
        if (stdout && options.verbose) console.log('STDOUT:', stdout)
        if (stderr && options.verbose) console.log('STDERR:', stderr)
        colorLog('COMPLETE\n', {
          theme: 'complete',
          append: '\n\n'
        })
        resolve()
      }
    })
  })
}

// @function  setupNodeModules
// @description  This function returns a Promise that runs the "npm install" command to install
//     the required NodeJS libraries and packages
// @parameters  n/a
// @returns   (Promise)
function setupNodeModules () {
  // Return a promise
  return new Promise(function (resolve, reject) {
    // Run a command to install all node modules
    colorLog('Installing NodeJS modules...\n')
    cp.exec('npm install', function (error, stdout, stderr) {
      // Check for errors
      if (error) {
        // If error, throw error
        colorLog('FAILURE (setupNodeModules)\n', {
          theme: 'danger',
          style: ['bold']
        })
        reject(new Error(error))
      } else {
        // Othwerwise, proceed to create security conifg file
        if (stdout && options.verbose) console.log('STDOUT:', stdout)
        if (stderr && options.verbose) console.log('STDERR:', stderr)
        colorLog('COMPLETE\n', {
          theme: 'complete',
          append: '\n\n'
        })
        resolve()
      }
    })
  })
}

// @function  setupSecurity
// @description  This function sets up the security.js file required by the server to use HTTPS
// @parameters  n/a
// @returns   (Promise)
function setupSecurity () {
  // Return a promise
  return new Promise(function (resolve, reject) {
    // Acquire the security config details
    const sInfo = securityConf.commonResources['security.js']

    // Generate file storage path
    const filepath = `${settings.security}`

    // Generate a security template
    const fileTemplate = `// PROJECT:   Core-v4\n//  Name:    Rolando Javier\n//  File:    security.js\n//  Date Created:  September 24, 2018\n//  Last Modified:  September 24, 2018\n//  Details:\n//      This file contains sst-/tls-/https-related settings. Its primary function is\n//     to provided modules with access to security keys and certificates\n//  Dependencies:\n//      Javascript ECMAScript 6 (String Templating)\n\n"use strict";\n\n// Contants\n"use strict";\n\n// Constants\nconst certificateDir = "trustStore";  // the default folder storing the keys and certs below, relative to the current directory\nconst privateKeyName = "${sInfo.privateKeyName}";   // the name of your private rsa key (for ssl/https)\nconst publicKeyName = "${sInfo.publicKeyName}";  // the name of your public rsa key (for ssl/https)\nconst certName = "${sInfo.certName}";     // the name of your ca certificate (for ssl/https)\nconst passphrase = "${sInfo.passphrase}"; // your rsa passphrase (for ssl/https)\n\n\n\n// Container (Singleton)\nconst security = {\n\t"prvkey": \`\${__dirname}/\${certificateDir}/\${privateKeyName}\`,\n\t"pubkey": \`\${__dirname}/\${certificateDir}/\${publicKeyName}\`,\n\t"passphrase": passphrase,\n\t"cert": \`\${__dirname}/\${certificateDir}/\${certName}\`\n};\nObject.freeze(security);\n\n\n\nmodule.exports = security;\n\n// END security.js`

    // Run a command to extract the public key
    const cmd = `echo '${fileTemplate}' > ${filepath}`
    colorLog('Configuring security settings...\n')
    cp.exec(cmd, function (error, stdout, stderr) {
      // Check for errors
      if (error) {
        // If error, then the public key wasn't extracted; throw an error
        colorLog('FAILURE (setupSecurity)\n', {
          append: '\nAn error occurred while configuring security settings!',
          theme: 'danger',
          style: ['bold']
        })
        reject(new Error(error))
      } else {
        // Otherwise, resolve the promise
        if (stdout && options.verbose) console.log('STDOUT:', stdout)
        if (stderr && options.verbose) console.log('STDERR:', stderr)
        colorLog('COMPLETE\n', {
          theme: 'complete',
          append: '\n\n'
        })
        resolve()
      }
    })
  })
}
// END setup scripts

// BEGIN utility functions
// @function  showHelp()
// @description  This function shows the help dialog
// @parameters  n/a
// @returns   n/a
function showHelp () {
  console.log('===============================')
  console.log('SCE Core-v4 System Setup v0.0.0')
  console.log('===============================')
  console.log('\nSynopsis:')
  console.log('    node system_setup.js command [options]')
  console.log('\nCommands:')
  console.log('    help')
  console.log('        Shows this help dialog')
  console.log('    all')
  console.log('        The default action; Runs all required setup procedures')
  console.log('\nOptions:')
  console.log('    --default')
  console.log(
    '        The default option; Creates credentials with default settings'
  )
  console.log('    --manual')
  console.log(
    '        Creates credentials with custom settings (requires user input)'
  )
}

// @function  colorLog
// @description  This function is a wrapper for basic terminal log message coloring.
// @parameters  (string) message
//     (~object) options A JSON object to configure how the color logger logs
//          messages. It may have any or all of the following:
//       (~string) append A string to append after the formatted message
//            This is typically used to add breaks and spacing
//            after the nicely formatted message
//       (~string) prepend A string to prepend before the formatted message
//            This is useful if you want to place some normal
//            style text before the nicely formatted message
//       (~string) theme  The type of message coloring theme to apply.
//            Currently supported message color theme classes
//            include:
//            "complete" black background, green font
//            "danger" red background, white font
//            "info"  cyan background, white font
//            "primary" blue background, white font
//            "success" green background, white font
//            "warning" yellow background, black font
//            If this parameter is omitted, this defaults to
//            the "primary" theme
//       (~array) style  An array housing any text styling to apply to
//            the message. Currently supported style decorations
//            include:
//            "bold"  Bolded Text
//            "underline" Underlined Text
//            "reverse" Reversed Color Text
//            You can apply an or all of these styles by placing
//            the desired style name(s) in this array.
//            If omitted, no style is applied to the text
// @returns   n/a
function colorLog (message, options = {}) {
  // Acquire theme customizations, if any
  const theme = typeof options.theme === 'undefined' ? 'primary' : options.theme
  const decor = typeof options.style === 'undefined' ? [] : options.style

  // Acquire strings to append or prepend, if any
  const prepend = typeof options.prepend === 'undefined' ? '' : options.prepend
  const append = typeof options.append === 'undefined' ? '' : options.append

  // Define base colors (defaults to "primary" theme) and styles
  let fgColor = colors.FgWhite
  let bgColor = colors.BgBlue
  let fontStyle = ''

  // Make color changes by class, if necessary
  switch (theme) {
    case 'complete': {
      fgColor = colors.FgGreen
      bgColor = colors.BgBlack
      break
    }
    case 'danger': {
      bgColor = colors.BgRed
      break
    }
    case 'info': {
      bgColor = colors.BgCyan
      break
    }
    case 'primary': {
      // do nothing; the primary color theme is already applied
      break
    }
    case 'success': {
      bgColor = colors.BgGreen
      break
    }
    case 'warning': {
      fgColor = colors.FgBlack
      bgColor = colors.BgYellow
      break
    }
  }

  // Make style changes if necessary
  if (decor.includes('bold')) {
    // If bolding is requested, add bolding
    fontStyle += styles.Bold
  }
  if (decor.includes('underline')) {
    // If underlining is requested, add underlines
    fontStyle += styles.Underline
  }
  if (decor.includes('reverse')) {
    // If color reversing is requested, add color reversing
    fontStyle += styles.Reverse
  }

  // Compile the message into a template
  const template = `%s${fgColor}${bgColor}${fontStyle}%s${colors.Reset}%s`

  // Log to console
  console.log(template, prepend, message, append)
}
// END utility functions

// END system_setup.js
