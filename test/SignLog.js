/* global describe it before after */
process.env.NODE_ENV = 'test'
const SignLog = require('../api/models/SignLog')
const chai = require('chai')
const chaiHttp = require('chai-http')
const constants = require('../api/constants')
const { OK, BAD_REQUEST } = constants.STATUS_CODES

let app = null

const expect = chai.expect

const tools = require('../util/testing-utils/tools.js')
chai.should()
chai.use(chaiHttp)

describe('SignLog', () => {
  before(done => {
    app = tools.initializeServer()
    tools.emptySchema(SignLog)
    done()
  })

  after(done => {
    tools.terminateServer(done)
  })

  const INVALID_SIGN_LOG = {
    firstName: 'John Doe'
  }

  const VALID_SIGN_LOG = {
    signTitle: 'Big Oof',
    firstName: 'John Doe',
    email: 'bigoof@gmail.com',
    timeOfPosting: new Date('01/01/2001')
  }

  describe('/POST addSignLog', () => {
    it('Should return 400 when required fields are not filled in ', done => {
      chai
        .request(app)
        .post('/api/SignLog/addSignLogs')
        .send(INVALID_SIGN_LOG)
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
        .post('/api/SignLog/addSignLogs')
        .send(VALID_SIGN_LOG)
        .then(function (res) {
          expect(res).to.have.status(OK)
          done()
        })
        .catch(err => {
          throw err
        })
    })
  })
  describe('/GET getSignLogs', () => {
    it('Should return an object of all events', done => {
      chai
        .request(app)
        .get('/api/SignLog/getSignLogs')
        .then(function (res) {
          expect(res).to.have.status(OK)
          const getSignResponse = res.body
          getSignResponse.should.be.a('array')
          expect(getSignResponse).to.have.length(1)
          expect(getSignResponse[0].signTitle).to.equal(
            VALID_SIGN_LOG.signTitle
          )
          expect(getSignResponse[0].firstName).to.equal(
            VALID_SIGN_LOG.firstName
          )
          expect(getSignResponse[0].email).to.equal(VALID_SIGN_LOG.email)
          expect(getSignResponse[0].timeOfPosting).to.equal(
            VALID_SIGN_LOG.timeOfPosting.toISOString()
          )
          done()
        })
        .catch(err => {
          throw err
        })
    })
  })
})
