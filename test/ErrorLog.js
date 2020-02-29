/* global describe it before after */
// During the test the env variable is set to test
process.env.NODE_ENV = 'test'
const ErrorLog = require('../api/models/ErrorLog')
const chai = require('chai')
const chaiHttp = require('chai-http')
const constants = require('../api/constants')
const { OK, BAD_REQUEST } = constants.STATUS_CODES

let app = null

const expect = chai.expect

const tools = require('../util/testing-utils/tools.js')
chai.should()
chai.use(chaiHttp)

describe('ErrorLog', () => {
  before(done => {
    app = tools.initializeServer()
    tools.emptySchema(ErrorLog)
    done()
  })

  after(done => {
    tools.terminateServer(done)
  })

  const INVALID_ERROR_LOG = {
    userEmail: 'fun@gmail.com'
  }

  const VALID_ERROR_LOG = {
    userEmail: 'fun@gmail.com',
    errorTime: new Date('01/01/2001'),
    apiEndpoint: 'san francisco',
    errorDescription: 'sce is cold'
  }

  describe('/POST addErrorLog', () => {
    it('Should return 400 when required fields are not filled in ', done => {
      chai
        .request(app)
        .post('/api/ErrorLog/addErrorLog')
        .send(INVALID_ERROR_LOG)
        .then(function (res) {
          expect(res).to.have.status(BAD_REQUEST)
          done()
        })
        .catch(err => {
          throw err
        })
    })
    it('Should return statusCode 200 when all required fields are filled in ', done => {
      chai
        .request(app)
        .post('/api/ErrorLog/addErrorLog')
        .send(VALID_ERROR_LOG)
        .then(function (res) {
          expect(res).to.have.status(OK)
          done()
        })
        .catch(err => {
          throw err
        })
    })
  })
  describe('/GET getErrorLogs', () => {
    it('Should return an object of all events', done => {
      chai
        .request(app)
        .get('/api/ErrorLog/getErrorLogs')
        .then(function (res) {
          expect(res).to.have.status(OK)
          const getEventsResponse = res.body
          getEventsResponse.should.be.a('array')
          expect(getEventsResponse).to.have.length(1)
          expect(getEventsResponse[0].userEmail).to.equal(
            VALID_ERROR_LOG.userEmail
          )
          expect(getEventsResponse[0].errorTime).to.equal(
            VALID_ERROR_LOG.errorTime.toISOString()
          )
          expect(getEventsResponse[0].apiEndpoint).to.equal(
            VALID_ERROR_LOG.apiEndpoint
          )
          expect(getEventsResponse[0].errorDescription).to.equal(
            VALID_ERROR_LOG.errorDescription
          )
          done()
        })
        .catch(err => {
          throw err
        })
    })
  })
})
