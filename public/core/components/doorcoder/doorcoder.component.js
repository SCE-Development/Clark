/* global angular, sessionStorage */
// PROJECT:   Core-v4
//  Name:    R. Javier
//  File:    profiler.component.js
//  Date Created:  April 16, 2018
//  Last Modified:  April 16, 2018
//  Details:
//      This file contains the AngularJS doorcoder component, whose purpose is to display and change a member's doorcode
//  Dependencies:
//      AngularJS v 1.6.x

angular.module('doorcoder').component('doorcoder', {
  templateUrl: 'components/doorcoder/doorcoder.template.html',
  controller: function ($http, $timeout) {
    var ctl = this
    var dbgMode = true // changes relevant parameters when doing debugging
    var hostname = dbgMode ? 'localhost:8080' : 'sce.engr.sjsu.edu'
    var links = {
      doorCodeGetAll: `https://${hostname}/core/dashboard/search/dc`,
      doorCodeEdit: `https://${hostname}/core/dashboard/edit/dc`
    }

    // BEGIN model
    this.errorMessage = ''
    this.doorCodeList = []
    this.userName = ''
    this.selectedDoorCode = 0
    // END model

    // BEGIN component controller functions
    this.init = function () {
      console.log('Door Coder Controller activated...')
      ctl.requestDoorCodeList()
    }
    this.setErrorMessage = function (em) {
      ctl.errorMessage = em
    }
    this.setUserName = function (un) {
      ctl.userName = un
    }
    this.clearPanel = function () {
      console.log('Clearing door coder panel...')
      ctl.errorMessage = ''
      ctl.doorCodeList = []
      ctl.userName = ''
      ctl.selectedDoorCode = 0
    }
    // END component controller functions

    // BEGIN process controller functions
    this.requestDoorCodeList = function () {
      var requestBody = {
        sessionID: sessionStorage.getItem('sessionID')
      }
      var config = {
        headers: {
          'Content-Type': 'application/json'
        }
      }

      // Clear error message first
      ctl.setErrorMessage('')

      // Then request door code list
      console.log('Requesting full door code list...')
      $http
        .post(links.doorCodeGetAll, requestBody, config)
        .then(response => {
          var result = response.data
          var status = response.status

          console.log(`Door Code List Request returned:\n${result}`)
          switch (status) {
            case 200: {
              // Check for the appropriate data in the list
              if (typeof result === 'undefined') {
                ctl.setErrorMessage('Error: No data received')
              } else if (!Array.isArray(result)) {
                ctl.setErrorMessage(
                  `Error: Expected array, got ${typeof result}`
                )
              } else {
                ctl.doorCodeList = result
              }
              break
            }
            case 499: {
              ctl.setErrorMessage(
                typeof result[0].emsg === 'undefined'
                  ? 'Session Token Rejected...'
                  : result[0].emsg
              )
              break
            }
            case 500: {
              ctl.setErrorMessage(
                typeof result[0].emsg === 'undefined'
                  ? 'An internal server error occurred...'
                  : result[0].emsg
              )
              break
            }
            default: {
              ctl.setErrorMessage(`Unexpected Response (Code ${status})`)
              break
            }
          }
        })
        .catch(function (errResponse) {
          console.log(
            `[DoorCoderController] requestDoorCodeList -> Problem: ${errResponse}`
          )
        })
    }
    this.setNewDoorCode = function (dcID) {
      ctl.selectedDoorCode = dcID
    }
    this.submitNewDoorCode = function () {
      var newDCID = ctl.selectedDoorCode
      var memberUserName = ctl.userName
      var requestBody = {
        sessionID: sessionStorage.getItem('sessionID'),
        username: memberUserName,
        doorcode: newDCID
      }
      var config = {
        headers: {
          'Content-Type': 'application/json'
        }
      }

      // First, clear the error message
      ctl.setErrorMessage('')

      // Submit new door code
      console.log('Submitting new door code')
      $http
        .post(links.doorCodeEdit, requestBody, config)
        .then(response => {
          var result = response.data
          var status = response.status
          var isArray = Array.isArray(result)
          var hasEmsg = !isArray ? false : typeof result[0].emsg !== 'undefined'

          console.log(result) // debug
          switch (status) {
            case 200: {
              console.log('Door code successfully updated!')
              ctl.clearPanel()
              ctl.requestDoorCodeList()
              ctl.setErrorMessage('Successfully updated!')
              $timeout(function () {
                // After 3000 ms, clear the error message
                ctl.setErrorMessage('')
              }, 5000)
              break
            }
            case 499: {
              ctl.setErrorMessage(
                hasEmsg ? result[0].emsg : 'Error: A core error occurred'
              )
              break
            }
            case 500: {
              ctl.setErrorMessage(
                hasEmsg
                  ? result[0].emsg
                  : 'Error: An internal server error occurred'
              )
              break
            }
            default: {
              ctl.setErrorMessage(`Unexpected Response (Code ${status})`)
              break
            }
          }
        })
        .catch(function (errResponse) {
          var msg = ''
          try {
            var hasData = typeof errResponse.data !== 'undefined'
            var hasEmsg = !hasData
              ? false
              : typeof errResponse.data.emsg !== 'undefined'

            msg = JSON.stringify(errResponse)
            if (hasEmsg) {
              ctl.setErrorMessage(errResponse.data.emsg)
            }
          } catch (e) {
            msg = `JSON.stringify() failed: ${e}`
            ctl.setErrorMessage(
              'A client-side error occurred: JSON.stringify()'
            )
          }
          console.log(
            `[DoorCoderController] submitNewDoorCode -> Problem: ${msg}`
          )
        })
    }
    // END process controller functions

    // Run initialization
    ctl.init()
  }
})

// END profiler.component.js
