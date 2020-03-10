/* global describe it before after afterEach */
// During the test the env variable is set to test
process.env.NODE_ENV = 'test'
// Require the dev-dependencies
const chai = require('chai')
const chaiHttp = require('chai-http')
const constants = require('../api/constants')
const { OK, BAD_REQUEST, NOT_FOUND } = constants.STATUS_CODES
const tools = require('../util/testing-utils/tools.js')
const LedSignFunctions = require('../api/printingRPC/client/ledsign/led_sign_client')
const sinon = require('sinon')

let app = null
const expect = chai.expect

chai.should()
chai.use(chaiHttp)
const SUCCESS_MESSAGE = 'success'
const ERROR_MESSAGE = 'error'
const TEXT_REQUEST = {
  text: 'Hi thai',
  brightness: 50,
  scrollSpeed: 50,
  backgroundColor: '#00FF00',
  textColor: '#FF0000',
  borderColor: '#0000FF'
}

describe('LedSign', () => {
  const healthCheckMock = sinon.stub(LedSignFunctions, 'healthCheck')
  const updateSignTextMock = sinon.stub(LedSignFunctions, 'updateSignText')

  before(done => {
    app = tools.initializeServer()
    done()
  })

  after(done => {
    healthCheckMock.restore()
    updateSignTextMock.restore()
    tools.terminateServer(done)
  })

  afterEach(() => {
    healthCheckMock.reset()
    updateSignTextMock.reset()
  })

  describe('/POST healthCheck', () => {
    it('Should return statusCode 200 when the sign is up', done => {
      healthCheckMock.resolves(SUCCESS_MESSAGE)
      chai
        .request(app)
        .post('/api/LedSign/healthCheck')
        .then(function (res) {
          expect(res).to.have.status(OK)
          done()
        })
        .catch(err => {
          throw err
        })
    })
    it('Should return statusCode 404 when the sign is down', done => {
      healthCheckMock.rejects(ERROR_MESSAGE)
      chai
        .request(app)
        .post('/api/LedSign/healthCheck')
        .then(function (res) {
          expect(res).to.have.status(NOT_FOUND)
          done()
        })
        .catch(err => {
          throw err
        })
    })
  })

  describe('/POST updateSignText', () => {
    it('Should return statusCode 200 when the sign text is updated', done => {
      updateSignTextMock.resolves(SUCCESS_MESSAGE)
      chai
        .request(app)
        .post('/api/LedSign/updateSignText')
        .send(TEXT_REQUEST)
        .then(function (res) {
          expect(res).to.have.status(OK)
          done()
        })
        .catch(err => {
          throw err
        })
    })
    it('Should return statusCode 400 when the sign is down', done => {
      updateSignTextMock.rejects(ERROR_MESSAGE)
      chai
        .request(app)
        .post('/api/LedSign/updateSignText')
        .then(function (res) {
          expect(res).to.have.status(BAD_REQUEST)
          done()
        })
        .catch(err => {
          throw err
        })
    })
  })
})
