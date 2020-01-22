const TokenFunctions = require('../../util/api-utils/token-functions')
const sinon = require('sinon')

const checkifTokenValidMock = sinon.stub(TokenFunctions, 'checkIfTokenValid')

function restoreMock () {
  checkifTokenValidMock.restore()
}

function resetMock () {
  checkifTokenValidMock.reset()
}

function setReturnOfTokenValidMock (returnValue) {
  checkifTokenValidMock.onCall(0).returns(returnValue)
}

module.exports = { setReturnOfTokenValidMock, resetMock, restoreMock }
