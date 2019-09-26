/* global angular, logDebug, $, sessionStorage */
// PROJECT:   Core-v4
//  Name:    R. Javier
//  File:    member_list.component.js
//  Date Created:  August 20, 2018
//  Last Modified:  August 20, 2018
//  Details:
//      This file contains the AngularJS component that provides officer administrative features
//  Dependencies:
//      AngularJS v1.6.x

angular.module('memberlist').component('memberlist', {
  templateUrl: 'components/member_list/member_list.template.html', // relative to dashboard.html file
  bindings: {
    self: '<self'
  },
  controller: function ($rootScope, $scope, $http, $window) {
    var ctl = this
    var dbgMode = true
    var hostname = dbgMode ? 'localhost:8080' : 'sce.engr.sjsu.edu'
    var urls = {
      search: `https://${hostname}/core/dashboard/search/members`
    }

    // BEGIN Model Data
    this.searchTerm = ''
    this.searchType = 'username'
    this.resultCount = 0
    this.results = [] // container for member search results
    // END Model Data

    // BEGIN Main Controllers
    this.$onInit = function () {
      // runs only once, when the module is fully loaded
      // var triggerElementShow = "#" + ctl.triggerShow;
      // var triggerElementHide = "#" + ctl.triggerHide;
      // console.log(`INIT member_list:`, triggerElementShow, triggerElementHide);
      // console.log(
      //  $(triggerElementShow).parent().children()[2].childNodes,
      //  $(triggerElementHide).parent().children()[2].childNodes[2]
      // );
      // // Bind click event listner for showing the memberlist
      // $(triggerElementShow).on("click", function() {
      //  // On click of the button, show this element's collapsible
      //  $(triggerElementShow).parent().children()[2].childNodes[2].collapse("show");
      // });
      // Bind click event listener for hiding the memberlist
      // $(triggerElementHide).on("click", function () {
      //  $(triggerElementHide).parent().children()[2].childNodes[2].collapse("hide");
      // });
      // Initially hide the collapsible, if not already hidden
      // $(triggerElementShow).parent().children()[2].childNodes[2].collapse("hide");
    }
    this.$onChanges = function () {
      console.log(ctl.bindings)
    }
    $rootScope.$on('showMemberListComponent', function (event, args) {
      // console.log(`Showing member list...`, args);
      console.log('Showing member list...')

      // Show the memberlist by revealing the collapsible
      $('#' + args.memberListID + ' > .collapse').collapse('show')

      // Run an initial search
      ctl.loadMembers()
    })
    $rootScope.$on('hideMemberListComponent', function (event, args) {
      console.log('Hiding member list...')

      // Hide the memberlist by collapsing the collapsible
      $('#' + args.memberListID + ' > .collapse').collapse('hide')
    })
    // END Main Controllers

    // BEGIN Utility Controllers
    this.loadMembers = function () {
      var requestBody = {
        sessionID: sessionStorage.getItem('sessionID'),
        searchType: ctl.searchType,
        searchTerm: ctl.searchTerm,
        options: {
          resultMax: 50,
          pageNumber: 0,
          regexMode: true
        }
      }
      var config = {
        headers: {
          'Content-Type': 'application/json'
        }
      }
      // var searchTypeStr = ''

      // Execute search
      console.log(`Searching by ${ctl.searchType} for ${ctl.searchTerm}`)
      $http
        .post(urls.search, requestBody, config)
        .then(response => {
          console.log(response.data) // debug
          switch (response.status) {
            case 200: {
              // Reset the error message
              ctl.errmsg = ''
              ctl.results = response.data

              // Log a message if the result set is empty
              if (ctl.results.length === 0) {
                console.log('No members matched your search criteria')
              }

              // Remove the placeholder if the result set has one
              for (var i = 0; i < ctl.results.length; i++) {
                if (ctl.results[i].memberID === -1) {
                  ctl.results.splice(i, 1)
                  break
                }
              }

              // Update the result count
              ctl.resultCount = response.data.length
              break
            }
            default: {
              ctl.errmsg = 'Unexpected response<<<'
              ctl.results = []
              break
            }
          }
        })
        .catch(function (errResponse) {
          logDebug(
            'ProfilerController',
            'search',
            `Error: ${JSON.stringify(errResponse)}`
          )
          ctl.errmsg = errResponse.data.emsg
        })
    }
    this.emitSelectionEvent = function (selection, selfID) {
      // Hide member list and send the member list selection
      console.log('SELF:', selfID)
      $rootScope.$emit('hideMemberListComponent', {
        memberListID: ctl.self
      })
      $rootScope.$emit('memberListSelection', { selection: selection })
    }
    // END Utility Controllers
  }
})

// END member_list.component.js
