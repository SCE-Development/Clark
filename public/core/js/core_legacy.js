//	PROJECT: 		Core-v4
// 	Name: 			Rolando Javier
// 	File: 			core.js
// 	Date Created: 	January 25, 2018
// 	Last Modified: 	January 25, 2018
// 	Details:
// 					This file contains all front-end javascript for the core.html admin portal.
// 	Dependencies:
// 					AngularJS 1.6.7
'use strict'

$(document).ready(init())

// BEGIN init
function init() {
  console.log('You have launched the SCE Core v4 Admin Portal')
  setDebug(true) // have post() logging
}
// END init

// BEGIN Angular Controllers
/*
	@controller 	loginController
	@details 		This controller manages the login portion of the view
*/
var loginController = function($scope, $window, $location, $http, pageData) {
  var credentials = this
  credentials.user = ''
  credentials.pwd = ''
  credentials.status = ''
  credentials.response = ''
  credentials.redirect = ''
  credentials.token = ''
  credentials.submit = function() {
    var uri = 'https://localhost:8080/core/login'

    // Update UI with current status
    credentials.response = ''
    credentials.status = 'Submitting...'

    // Send login credentials
    post(
      uri,
      { user: credentials.user, pwd: credentials.pwd },
      function(response, status, jqxhr) {
        $scope.$apply(function() {
          var msgAsString

          // Clear status indicator
          credentials.status += 'Done'

          // Handle response
          if (typeof response.etype !== 'undefined') {
            // Show error to screen by updating model
            credentials.response =
              typeof response.emsg !== 'undefined'
                ? response.emsg
                : `A problem has occurred. Please notify an sce officer! ${response.etype}`
          } else if (typeof response.sessionID !== 'undefined') {
            var requestBody = {
              sessionID: credentials.token
            }
            var config = {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              }
            }
            // Login succeeded; Enter the site with your session token
            credentials.token = response.sessionID
            credentials.redirect = response.destination
            // $("#submissionForm").submit(function (event) {
            // 	// do nothing
            // 	console.log("submitted");
            // });
            $http
              .post(credentials.redirect, requestBody, config)
              .then(function(response) {
                console.log(response.data)
                pageData.set('html', response.data)
                return response
              })
              .catch(function(error) {
                throw error
              })
            // gotoDashboard(response.sessionID, $window, $location);
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
        })
      },
      true
    )
  }
}
loginController.$inject = [
  '$scope',
  '$window',
  '$location',
  '$http',
  'pageData'
]

/*
	@controller 	pageController
	@details 		This controller manages the view of the entire page. Use this controller to change views as you acquire html content from the server
*/
var pageController = function($scope, pageData) {
  $scope.$watch(
    function() {
      return pageData.get('html')
    },
    function(newVal, oldVal) {
      if (newVal !== oldVal) {
        $('#topLevelView').html(newVal)
      }
    }
  )

  var page = this
  page.url = ''
  page.printUrl = function() {
    console.log(`URL: ${page.url}`)
  }
}
pageController.$inject = ['$scope', 'pageData']
// END Angular Controllers

// BEGIN Angular App
// Declare app as a module
var ngapp = angular.module('adminPortal', [])

// Create a factory to share data between controllers
ngapp.factory('pageData', function() {
  var sharedData = {
    html: ''
  }

  var manipulators = {
    get: function(key) {
      var returnValue = null
      if (typeof sharedData[key] !== 'undefined') {
        returnValue = sharedData[key]
      }
      return returnValue
    },
    set: function(key, value) {
      sharedData[key] = value
    }
  }
  return manipulators
})

// Include controllers
ngapp.controller('loginCredentials', loginController)
ngapp.controller('pageController', pageController)
// END Angular App

// BEGIN Utility Functions
function gotoDashboard(sessionID, ngwindow, nglocation) {
  var dashboardUrl = 'https://localhost:8080/core/dashboard'
  var token = {
    sessionID: sessionID
  }
  // location = dashboardUrl;
  ngwindow.location.href = dashboardUrl
  // post(dashboardUrl, token, function (response, status, jqxhr) {
  // });
}
// END Utility Functions

// END core.js
