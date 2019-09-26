/* global $, storageAvailable, setDebug, post, sessionStorage, logDebug */
// PROJECT:   Core-v4
//  Name:    Rolando Javier
//  File:    core.js
//  Date Created:  January 25, 2018
//  Last Modified:  January 25, 2018
//  Details:
//      This file contains all front-end javascript for the core.html admin portal.
//  Dependencies:
//      AngularJS 1.6.7

'use strict'

$(document).ready(init())

// BEGIN init
const sessionStorageSupported = !!storageAvailable('sessionStorage')
function init () {
  console.log('You have launched the SCE Core v4 Admin Portal')
  setDebug(true) // have post() logging
}
// END init

// BEGIN jquery controllers
$('#submitBtn').on('click', function () {
  const uri = 'https://localhost:8080/core/login' // change later
  const packet = {
    user: $('#usr').val(),
    pwd: $('#pwd').val(),
    sessionStorageSupport: sessionStorageSupported
  }

  // Clear messages
  setError('')

  // Send login credentials
  console.log('Submitting...')
  setStatus('Submitting...')
  post(
    uri,
    packet,
    function (response, status, jqxhr) {
      let msgAsString

      // Clear status indicator
      appendStatus('Done')
      console.log('Done')

      // Handle response
      if (typeof response.etype !== 'undefined') {
        // Show error to screen by updating model
        const emsg =
          typeof response.emsg !== 'undefined'
            ? response.emsg
            : `A problem has occurred. Please notify an sce officer! ${response.etype}`
        setError(emsg)
      } else if (typeof response.sessionID !== 'undefined') {
        const redirect = response.destination
        const token = response.sessionID
        const uname = response.username
        console.log(`SENDING: ${uname}\n${redirect}\n${token}`)
        // const requestBody = {
        //   sessionID: token
        // }

        // Login succeeded; Enter the site with your session token
        if (sessionStorageSupported) {
          // Store token in session storage
          // console.log(`Yay! Session storage is good!`); // debug
          sessionStorage.setItem('sessionID', token)
          sessionStorage.setItem('username', uname)
        } else {
          // Cookie should've been sent via the headers
          // console.log(`Darn...`); // debug
        }
        $('#submissionForm').attr('action', redirect)
        $('#receivedToken').attr('value', token)
        $('#submissionForm').submit()
      }

      // BEGIN debug
      try {
        msgAsString = JSON.stringify(response)
      } catch (e) {
        logDebug(
          'submit()',
          'parseError',
          `Could not parse response ${response}: ${e}`
        )
        msgAsString = response.toString()
      }
      logDebug('submit()', 'reply', `Status: ${status} -> ${msgAsString}`)
      // END debug
    },
    true
  )
})
// END jquery controllers

// BEGIN utility functions
/*
 @function  setStatus
 @parameter  str - the string to set the status message to
 @returns n/a
 @details  This function sets the UI's status message area to "str"
*/
function setStatus (str) {
  $('#statusMsg').html(str)
}

/*
 @function  appendStatus
 @parameter  str - the string to append to the status message
 @returns  n/a
 @details  This function appends "str" to the UI's status message
*/
function appendStatus (str) {
  const old = $('#statusMsg').html()
  $('#statusMsg').html(old + str)
}

/*
 @function  getStatus
 @parameter  n/a
 @returns  n/a
 @details  This function acquires the html content in the status message area
*/
// function getStatus () {
//   return $('#statusMsg').html()
// }

/*
 @function  setError
 @parameter  str - the string to set the error message to
 @returns  n/a
 @details  This function sets the UI's error message to "str"
*/
function setError (str) {
  $('#errorMsg').html(str)
}
// END utility functions

// END core.js
