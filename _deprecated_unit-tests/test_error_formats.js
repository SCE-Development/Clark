/* global describe, it */
// PROJECT:   Core-v4
//  Name:    Rolando Javier
//  File:    test_error_formats.js
//  Date Created:  January 27, 2018
//  Last Modified:  January 27, 2018
//  Details:
//      This file contains the unit tests for the error_formats.js file.
//  Dependencies:
//      MochaJS v4.1.0
//      ChaiJS v4.1.2

'use strict'

// Includes
const chai = require('chai')
const assert = chai.assert
const format = require('../util/error_formats')

// Test Control Settings
// const tcontorl = {
//   runAll: true
// }

// BEGIN unit tests
describe('Error Formats', function () {
  // Common Errors
  describe('.common()', function () {
    const type = 'SomeErrorType'
    const msg = 'SomeErrorMessage/Description'
    const obj = {
      some: 'error object'
    }

    it('should return a type member if only given a type', function (done) {
      const expectedKeys = ['etype']
      const result = format.common(type)

      assert.hasAllKeys(result, expectedKeys)
      done()
    })
    it('should return a type and msg if given them', function (done) {
      const expectedKeys = ['etype', 'emsg']
      const result = format.common(type, msg)

      assert.hasAllKeys(result, expectedKeys)
      done()
    })
    it('should return a type, msg, and obj if given them', function (done) {
      const expectedKeys = ['etype', 'emsg', 'eobj']
      const result = format.common(type, msg, obj)

      assert.hasAllKeys(result, expectedKeys)
      done()
    })
    it('should return null if given an incorrect type or given nothing', function (done) {
      const result0 = format.common()
      const result1 = format.common({ hello: 'world' })

      assert.isNull(result0)
      assert.isNull(result1)
      done()
    })
    it('should return a string if told to', function (done) {
      const result = format.common(type, msg, obj, true)

      assert.equal(typeof result, 'string')
      done()
    })
  })
})

// END test_error_formats.js
