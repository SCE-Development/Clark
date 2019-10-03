/* global angular, logDebug, $ */
// PROJECT:   Core-v4
//  Name:    R. Javier
//  File:    admin_tools.component.js
//  Date Created:  May 3, 2018
//  Last Modified:  May 3, 2018
//  Details:
//      This file contains the AngularJS component that provides officer administrative features
//  Dependencies:
//      AngularJS v1.6.x

angular.module('admintools').component('admintools', {
  templateUrl: 'components/admin_tools/admin_tools.template.html', // relative to dashboard.html file
  bindings: {
    currentuser: '<currentuser',
    sessionID: '<sid'
  },
  controller: function ($rootScope, $http, $window) {
    var ctl = this
    var dbgMode = true
    var hostname = dbgMode ? 'localhost:8080' : 'sce.engr.sjsu.edu'
    var urls = {
      getOfficerList: `http://${hostname}/core/dashboard/search/officerlist`,
      getOfficerAbilities: `http://${hostname}/core/dashboard/search/officerabilities`,
      editOfficerClearance: `http://${hostname}/core/dashboard/edit/officerclearance`,
      getClearanceLevels: `http://${hostname}/core/dashboard/search/clearancelevels`,
      getAvailableAbilities: `http://${hostname}/core/ability/getAll`
    }

    // BEGIN Model Data
    ctl.error_message = ''
    ctl.officerList = []
    ctl.selectedClearanceLevel = {}
    ctl.clearanceLevelList = []
    ctl.currentlyAssignedAbilities = {}
    ctl.abilityList = []
    // END Model Data

    // BEGIN Main Controllers
    this.$onInit = function () {
      // runs only once, when the module is fully loaded
    }
    this.$onChanges = function () {
      // runs when one of the binding's parents changes the value of the binding
      ctl.loadData()
    }
    this.loadData = function () {
      console.log(
        `Officer Manager Current User: ${ctl.currentuser}, ${ctl.sessionID}`
      )
    }
    this.loadOfficerRoster = function () {
      var requestBody = {
        sessionID: ctl.sessionID,
        currentUser: ctl.currentuser
      }
      var config = {
        headers: {
          'Content-Type': 'application/json'
        }
      }

      ctl.setError('')
      console.log('Loading officer roster list...')
      $http
        .post(urls.getOfficerList, requestBody, config)
        .then(response => {
          console.log(response.data)
          switch (response.status) {
            case 200: {
              console.log('Officer list acquired')
              ctl.officerList = response.data
              break
            }
            default: {
              logDebug(
                'OfficerManagementController',
                'request officer list',
                `Unable to acquire officer list (${response.status})`
              )
              console.log(
                `Unexpected response (${response.status}): ${response.data}`
              )
              break
            }
          }
        })
        .catch(function (errResponse) {
          logDebug(
            'OfficerManagementController',
            'request officer list',
            `Error: ${JSON.stringify(errResponse)}`
          )
          ctl.setError(errResponse.data.emsg)
        })
    }
    this.loadClearanceLevels = function () {
      var requestBody = {
        sessionID: ctl.sessionID,
        currentUser: ctl.currentuser
      }
      var config = {
        headers: {
          'Content-Type': 'application/json'
        }
      }

      // TODO: Load all clearance levels
      ctl.setError('')
      console.log('Loading all clearance levels...')
      $http
        .post(urls.getClearanceLevels, requestBody, config)
        .then(function (response) {
          console.log(response.data)

          // Update clearance levels list
          ctl.clearanceLevelList = response.data

          // Initialize UI with data on the first listed clearance level
          ctl.selectClearanceLevel(0)
        })
        .catch(function (errResponse) {
          logDebug(
            'ClearanceManagementController',
            'request clearance level list',
            `Error: ${JSON.stringify(errResponse)}`
          )
          ctl.setError(errResponse.data.emsg)
        })
    }
    this.loadOfficerAbilities = function (index) {
      var officer = ctl.officerList[index]
      var requestBody = {
        sessionID: ctl.sessionID,
        officerID: officer.memberID,
        getInfo: true
      }
      var config = {
        headers: {
          'Content-Type': 'application/json'
        }
      }

      console.log(
        `Loading ${
          ctl.officerList[index].userName
        }'s abilities (${JSON.stringify(ctl.officerList[index].abilities)})`
      )
      $http
        .post(urls.getOfficerAbilities, requestBody, config)
        .then(response => {
          console.log(response.data)
          switch (response.status) {
            case 200: {
              console.log('Officer data acquired')

              // Replace the current officer's ability data in the model
              ctl.officerList[index].abilityInfo = response.data
              break
            }
            default: {
              logDebug(
                'OfficerManagementController',
                'request officer ability names',
                `Unable to acquire officer abilities (${response.status})`
              )
              console.log(
                `Unexpected response (${response.status}): ${response.data}`
              )
              break
            }
          }
        })
        .catch(function (errResponse) {
          logDebug(
            'OfficerManagementController',
            'request officer ability names',
            `Error: ${JSON.stringify(errResponse)}`
          )
          ctl.setError(errResponse.data.emsg)
        })
    }
    this.loadAvailableAbilities = function () {
      var qParams = `?sessionID=${ctl.sessionID}&currentUser=${ctl.currentuser}`
      var config = {
        headers: {
          'Content-Type': 'application/json'
        }
      }

      ctl.setError('')
      console.log('Loading all available abiltiies...')
      $http
        .get(urls.getAvailableAbilities + qParams, config)
        .then(function (response) {
          console.log('response.data:', response.data)

          // Determine if each ability is in the selected clearance level
          try {
            var i = 0
            response.data.forEach(ability => {
              console.log(ability)
              if (
                ctl.searchClearanceAbilities(
                  ctl.selectedClearanceLevel,
                  ability.abilityID
                ) === true
              ) {
                // ctl.currentlyAssignedAbilities[ability.abilityName] = true;
                response.data[i].isInClvl = true
              } else {
                // ctl.currentlyAssignedAbilities[ability.abilityName] = false;
                response.data[i].isInClvl = false
              }

              i++
            })
          } catch (err) {
            console.log(err)
          }

          // console.log(ctl.currentlyAssignedAbilities);

          // Refresh available abilities UI
          ctl.abilityList = response.data
        })
        .catch(function (errResponse) {
          // Let the user know there was an error
          logDebug(
            'Clearance Level Controller',
            'request available abiltiies',
            `Unable to acquire available abilities list (${errResponse.status}): ${errResponse.data}`
          )
          console.log(
            `Unexpected errResponse (${errResponse.status}): ${errResponse.data}`
          )
        })
    }
    this.changeClearance = function (
      officerID,
      officerLevel,
      officerLevelName = false
    ) {
      // every officer will have only one clearance level
      var requestBody = {
        sessionID: ctl.sessionID,
        currentUser: ctl.currentuser,
        officerID: officerID,
        level: officerLevel
      }
      var config = {
        headers: {
          'Content-Type': 'application/json'
        }
      }

      console.log(
        `Changing clearance level ${officerLevel}${
          officerLevelName ? ' (' + officerLevelName + ')' : ''
        } from officer "${officerID}"`
      )
      $http
        .post(urls.editOfficerClearance, requestBody, config)
        .then(response => {
          console.log(response.data)
        })
        .catch(function (errResponse) {
          logDebug(
            'OfficerManagementController',
            'change officer clearance level',
            `Error: ${JSON.stringify(errResponse)}`
          )
          ctl.setError(errResponse.data.emsg)
        })
    }
    this.revokeClearance = function (
      officerID,
      officerLevel,
      officerLevelName = false
    ) {
      // every officer will have only one clearance level
      var requestBody = {
        sessionID: ctl.sessionID,
        currentUser: ctl.currentuser,
        officerID: officerID,
        level: 2 // set the officer as a member
      }
      var config = {
        headers: {
          'Content-Type': 'application/json'
        }
      }

      console.log(
        `Revoking clearance level ${officerLevel}${
          officerLevelName ? ' (' + officerLevelName + ')' : ''
        } from officer "${officerID}"`
      )
      $http
        .post(urls.editOfficerClearance, requestBody, config)
        .then(response => {
          console.log(response.data)
          ctl.loadOfficerRoster()
        })
        .catch(function (errResponse) {
          logDebug(
            'OfficerManagementController',
            'revoke officer clearance level',
            `Error: ${JSON.stringify(errResponse)}`
          )
          ctl.setError(errResponse.data.emsg)
        })
    }
    // END Main Controllers

    // BEGIN Utility Controllers
    this.setError = function (msg) {
      ctl.error_message = msg
    }
    this.launchOfficerManagementModal = function () {
      console.log('Launching officer management modal')

      // Load the officer roster
      ctl.loadOfficerRoster()

      // Select all div.officer-management-modal decendants in admintools tag (i.e. direct or indirect child of admintools component tag), and show them
      $('admintools div.officer-management-modal').modal('show')
    }
    this.launchClearanceControlModal = function () {
      console.log('Launching clearance control modal')

      // TODO: Load the all clearance levels
      ctl.loadClearanceLevels()

      // Select all div.officer-management-modal decendants in admintools tag (i.e. direct or indirect child of admintools component tag), and show them
      $('admintools div.clearance-control-modal').modal('show')
    }
    this.selectClearanceLevel = function (index) {
      // Set the selected clearance level
      ctl.selectedClearanceLevel = ctl.clearanceLevelList[index]
      console.log('Selected Clearance Level:', ctl.selectedClearanceLevel)

      // Populate the clearance level control panel with this clearance level's
      // currently-assigned abilities
      ctl.populateControlPanel(index)
    }
    this.populateControlPanel = function (index) {
      console.log(
        `Setting up control panel for clearance level ${JSON.stringify(
          ctl.clearanceLevelList[index].levelName
        )}`
      )

      // Populate control panel
      ctl.loadAvailableAbilities()
    }
    this.showMemberList = function (memberListID) {
      console.log('Firing event "showMemberListComponent"')

      // Fire event
      $rootScope.$emit('showMemberListComponent', {
        memberListID: memberListID
      })
    }
    this.hideMemberList = function (memberListID) {
      console.log('Firing event "hideMemberListComponent"')

      // Fire event
      $rootScope.$emit('hideMemberListComponent', {
        memberListID: memberListID
      })
    }

    // @function  searchClearanceAbilities()
    // @description  This function searches the indicated clearance level for the
    //     ability with the provided abilityID
    // @parameters  (object) clearance level JSON object
    //     (number) ability id number to search for
    // @returns   true, if the clearance level contains the specified ability
    //     false, otherwise
    this.searchClearanceAbilities = function (clvl, abilityID) {
      var found = false

      console.log('clvl:', clvl)
      console.log('abilityID:', abilityID)

      // console.log(`Searching for abilityID ${abilityID} in clearance level ${clvl.levelName} (aID: ${ JSON.stringify( clvl.abilities[0] ) } )`);
      clvl.abilities.forEach(function (ability) {
        if (ability.abilityID === abilityID) {
          found = true
        }
      })

      return found
    }
    // END Utility Controllers

    // BEGIN Global Event Listeners
    $rootScope.$on('memberListSelection', function (event, arg) {
      // test
      // console.log(`Caught memberListSelection:`, arg);
      var requestBody = {
        sessionID: ctl.sessionID,
        currentUser: ctl.currentuser,
        officerID: arg.selection.memberID,
        level: 1 // promote to officer level
      }
      var config = {
        headers: {
          'Content-Type': 'application/json'
        }
      }

      // Promote the selected member to an officer
      console.log(
        `Promoting "${arg.selection.userName}" clearance level to Officer...`
      )
      $http
        .post(urls.editOfficerClearance, requestBody, config)
        .then(response => {
          console.log(response.data)
          ctl.loadOfficerRoster()
        })
        .catch(function (errResponse) {
          logDebug(
            'OfficerManagementController',
            'promote officer clearance level',
            `Error: ${JSON.stringify(errResponse)}`
          )
          ctl.setError(errResponse.data.emsg)
        })
    })
    // END Global Event Listeners
  }
})

// END admin_tools.component.js
