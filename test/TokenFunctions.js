/* global describe it before after */
const sinon = require('sinon')
const chai = require('chai')
const expect = chai.expect
const {
  checkIfTokenSent,
  checkIfTokenValid
} = require('../util/api-utils/token-functions')

const jwt = require('jsonwebtoken')
const {
  setReturnOfTokenValidMock,
  resetMock,
  restoreMock
} = require('./mocks/TokenValidFunctions')

const requestWithToken = {
  body: {
    token: 'hi thai'
  }
}
const requestWithoutToken = {
  body: {}
}

describe('checkIfTokenSent', () => {
  it('Should return true if a token field exists in the request', done => {
    expect(checkIfTokenSent(requestWithToken)).to.equal(true)
    done()
  })
  it('Should return false if a token field does not exist in the request', done => {
    expect(checkIfTokenSent(requestWithoutToken)).to.equal(false)
    done()
  })
})

describe('checkIfTokenValid', () => {
  var stub = null
  before(done => {
    stub = sinon.stub(jwt, 'verify')
    stub.onCall(0).yields(false, 'decoded response')
    stub.onCall(1).yields(true, false)
    done()
  })
  after(done => {
    if (stub) stub.restore()
    restoreMock()
    done()
  })
  afterEach(() => {
    resetMock()
  })
  it('Should return the decoded response ', done => {
    setReturnOfTokenValidMock('decoded response')
    expect(checkIfTokenValid(requestWithToken)).to.equal('decoded response')
    done()
  })
  it('Should return false if a token field does not exist in the request', done => {
    setReturnOfTokenValidMock(false)
    expect(checkIfTokenValid(requestWithToken)).to.equal(false)
    done()
  })
})
