/* global describe, it */
// PROJECT:   Core-v4
//  Name:    Rolando Javier
//  File:    test_datetimes.js
//  Date Created:  January 31, 2018
//  Last Modified:  January 31, 2018
//  Details:
//      This file tests the datetime.js functions
//  Dependencies:
//      MochaJS v4.1.0
//      ChaiJS v4.1.2

'use strict'

// Includes
const chai = require('chai')
const assert = chai.assert
const dt = require('../util/datetimes')

// BEGIN datetimes.js test
describe('datetimes.js test', function () {
  describe('hasPassed()', function () {
    it("should correctly return false for a date that hasn't occurred within the same hour (outside of a minute)", function (done) {
      const nearFuture = new Date(Date.now())

      // Note: JavaScript automatically handles minute/date/year/second overflows
      for (let i = 2; i < 60; i++) {
        nearFuture.setMinutes(nearFuture.getMinutes() + i) // check 2 mins ahead
        const result = dt.hasPassed(nearFuture)

        // console.log(nearFuture.toISOString()); // debug
        assert.equal(result, false)
      }

      done()
    })

    it('should correctly return true for a date that has passed within the same hour (outside of a minute)', function (done) {
      const nearPast = new Date(Date.now())

      for (let i = 2; i < 60; i++) {
        nearPast.setMinutes(nearPast.getMinutes() - i) // check 2 minutes behind
        const result = dt.hasPassed(nearPast)

        // console.log(nearPast.toISOString()); // debug
        assert.equal(result, true)
      }

      done()
    })

    it("should correctly return false for a date that hasn't occurred within a given month", function (done) {
      const future = new Date(Date.now())

      for (let i = 1; i < 32; i++) {
        future.setDate(future.getDate() + i)
        const result = dt.hasPassed(future)

        // console.log(future.toISOString()); // debug
        assert.equal(result, false)
      }

      done()
    })

    it('should correctly return true for a date that has passed within the same month', function (done) {
      const past = new Date(Date.now())

      for (let i = 1; i < 60; i++) {
        past.setDate(past.getDate() - i)
        const result = dt.hasPassed(past)

        // console.log(past.toISOString()); // debug
        assert.equal(result, true)
      }

      done()
    })
  })
})
// END datetimes.js test

// END test_datetimes.js
