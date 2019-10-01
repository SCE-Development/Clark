/* global angular, sessionStorage */
// PROJECT:   Core-v4
//  Name:    R. Javier
//  File:    membership_manager.component.js
//  Date Created:  April 21, 2018
//  Last Modified:  April 21, 2018
//  Details:
//      This file contains the AngularJS component that provides membership plan management features
//  Dependencies:
//      AngularJS v1.6.x

angular.module('membershipmanager').component('membershipmanager', {
  templateUrl: 'components/membership_manager/membership_manager.template.html', // relative to dashboard.html file
  bindings: {
    currentmember: '<currentmember'
  },
  controller: function ($http) {
    const ctl = this
    const dbgMode = true
    const hostname = dbgMode ? 'localhost:8080' : 'sce.engr.sjsu.edu'
    const urls = {
      editMemberDates: `http://${hostname}/core/dashboard/edit/memberdates`
    }
    let jdate = new Date(Date.now())
    let sdate = new Date(Date.now())
    let edate = new Date(Date.now())

    // BEGIN Model Data
    this.username = ''
    this.errorMessage = ''
    this.dateData = []
    this.validMonthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ]
    // END Model Data

    // BEGIN Main Controllers
    this.$onInit = function () {
      ctl.setErrorMessage('')
      ctl.loadData()
    }
    this.$onChanges = function () {
      ctl.setErrorMessage('')
      ctl.loadData()
    }
    this.loadData = function () {
      console.log(
        `Loading join date, term start, and term end of ${ctl.currentmember.userName}`
      )

      jdate = new Date(Date.parse(ctl.currentmember.joinDate))
      sdate = new Date(Date.parse(ctl.currentmember.startTerm))
      edate = new Date(Date.parse(ctl.currentmember.endTerm))

      ctl.dateData = [
        {
          name: 'Join Date',
          month: jdate.getMonth(),
          date: jdate.getDate(),
          year: jdate.getFullYear()
        },
        {
          name: 'Start Term',
          month: sdate.getMonth(),
          date: sdate.getDate(),
          year: sdate.getFullYear()
        },
        {
          name: 'End Term',
          month: edate.getMonth(),
          date: edate.getDate(),
          year: edate.getFullYear()
        }
      ]
    }
    this.submitNewDateData = function () {
      console.log(
        `Submitting new join date, term start, and term end of ${ctl.currentmember.userName}`
      )

      // Clear error message
      ctl.setErrorMessage('')

      // Create new date objects
      const newDates = {}
      for (let i = 0; i < ctl.dateData.length; i++) {
        const d = new Date(Date.now())
        d.setMonth(ctl.dateData[i].month)
        d.setDate(ctl.dateData[i].date - 1)
        d.setFullYear(ctl.dateData[i].year)
        newDates[ctl.dateData[i].name] = d
        console.log(d.toUTCString())
      }

      // Submit new dates here
      const requestBody = {
        sessionID: sessionStorage.getItem('sessionID'),
        username: ctl.currentmember.userName,
        start: newDates['Start Term'],
        end: newDates['End Term']
      }
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      }
      $http
        .post(urls.editMemberDates, requestBody, config)
        .then(response => {
          console.log(response.data) // debug
          switch (response.status) {
            case 200: {
              console.log('Date change successful')
              ctl.setErrorMessage('Date Change Successful')
              break
            }
            default: {
              ctl.setErrorMessage('Unexpected Response')
              break
            }
          }
        })
        .catch(function (errResponse) {
          const msg =
            typeof errResponse.data.emsg !== 'undefined'
              ? errResponse.data.emsg
              : 'Oops... Something went wrong!'
          ctl.setErrorMessage(msg)
        })
    }
    // END Main Controllers

    // BEGIN Utility Controllers
    this.setErrorMessage = function (val) {
      ctl.errorMessage = val
    }
    this.getValidDays = function (month) {
      if (month > 11 || month < 0) {
        return [0]
      } else {
        const thirtyDayMonths = [3, 5, 8, 10] // april, june, sept, nov
        let numberOfDays = 0
        const validDayArray = []

        // Determine number of days
        if (thirtyDayMonths.includes(month)) {
          numberOfDays = 30
        } else if (month === 1) {
          // february
          numberOfDays = 29 // I'll just add leap year day for compatibility
        } else {
          numberOfDays = 31
        }

        // Populate array
        for (let i = 0; i < numberOfDays; i++) {
          validDayArray.push(i + 1)
        }

        return validDayArray
      }
    }
    this.getListOfYears = function () {
      const d = new Date(Date.now())
      const year = Number.parseInt(d.getFullYear())
      const list = []

      // Add years as far back as 5 years ago
      for (let i = 5; i > 0; i--) {
        list.push(year - i)
      }

      // Then add current year and years as far as 10 years into the future
      for (let i = 0; i < 10; i++) {
        list.push(year + i)
      }

      return list
    }
    this.getMonthFromNumber = function (number) {
      if (number > 11 || number < 0) {
        ctl.setErrorMessage('An invalid month number was received')
        return 'Invalid'
      } else {
        return ctl.validMonthNames[number]
      }
    }
    this.setDateMonth = function (name, number) {
      let index = -1
      switch (name) {
        case 'Join Date': {
          index = 0
          break
        }
        case 'Start Term': {
          index = 1
          break
        }
        case 'End Term': {
          index = 2
          break
        }
        default: {
          ctl.setErrorMessage(`Invalid name "${name}"`)
          console.log(`Error: Invalid name "${name}"`)
          break
        }
      }

      if (index !== -1) {
        if (number > 11 || number < 0) {
          ctl.dateData[index].month = 0
        } else {
          ctl.dateData[index].month = number
        }
      }
    }
    this.setDateDay = function (name, number) {
      let index = -1
      switch (name) {
        case 'Join Date': {
          index = 0
          break
        }
        case 'Start Term': {
          index = 1
          break
        }
        case 'End Term': {
          index = 2
          break
        }
        default: {
          ctl.setErrorMessage(`Invalid name "${name}"`)
          console.log(`Error: Invalid name "${name}"`)
          break
        }
      }

      if (index !== -1) {
        ctl.dateData[index].date = number
      }
    }
    this.setYear = function (name, year) {
      let index = -1
      switch (name) {
        case 'Join Date': {
          index = 0
          break
        }
        case 'Start Term': {
          index = 1
          break
        }
        case 'End Term': {
          index = 2
          break
        }
        default: {
          ctl.setErrorMessage(`Invalid name "${name}"`)
          console.log(`Invalid name "${name}"`)
          break
        }
      }

      if (index !== -1) {
        ctl.dateData[index].year = year
      }
    }
    // END Utility Controllers
  }
})

// END membership_manager.component.js
