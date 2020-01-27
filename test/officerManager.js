/* global describe it before after */
// During the test the env variable is set to test
process.env.NODE_ENV = 'test'
const OfficerManager = require('../api/models/OfficerManager')
const User = require('../api/models/User')
const membershipState = require('../src/Enums').membershipState
const chai = require('chai')
const chaiHttp = require('chai-http')
const {
  OK,
  BAD_REQUEST,
  UNAUTHORIZED,
  NOT_FOUND,
  FORBIDDEN
} = require('../api/constants').STATUS_CODES

let app = null
const expect = chai.expect
// tools for testing
const tools = require('../util/testing-utils/tools.js')
const {
  setTokenStatus,
  resetMock,
  restoreMock
} = require('./mocks/TokenValidFunctions')

chai.should()
chai.use(chaiHttp)

// Our parent block
describe('OfficerManager', () => {
  before(done => {
    app = tools.initializeServer()
    // Before each test we empty the database
    tools.emptySchema(OfficerManager)
    tools.emptySchema(User)
    done()
  })
  after(done => {
    restoreMock()
    tools.terminateServer(done)
  })
  beforeEach(() => {
    setTokenStatus(false)
  })
  afterEach(() => {
    resetMock()
  })

  const token = ''

  describe('/POST submit', () => {
    it('Should return statusCode 400 when the required fields are not set', done => {
      const form = { token: token }
      setTokenStatus(true)
      chai
        .request(app)
        .post('/api/officerManager/submit')
        .send(form)
        .then(function (res) {
          expect(res).to.have.status(BAD_REQUEST)

          done()
        })
        .catch(err => {
          throw err
        })
    })

    it('Should return statusCode 403 when no token is submited', done => {
      const form = {
        name: 'pinkUnicorn',
        email: 'test@test.com',
        level: membershipState.ADMIN,
        team: 'dev',
        major: 'major'
      }
      chai
        .request(app)
        .post('/api/officerManager/submit')
        .send(form)
        .then(function (res) {
          expect(res).to.have.status(FORBIDDEN)

          done()
        })
        .catch(err => {
          throw err
        })
    })

    it('Should return statusCode 401 when invalid token is submited', done => {
      const form = {
        name: 'pinkUnicorn',
        email: 'test@test.com',
        level: membershipState.ADMIN,
        team: 'dev',
        major: 'major',
        token: 'Invalid-Token'
      }
      chai
        .request(app)
        .post('/api/officerManager/submit')
        .send(form)
        .then(function (res) {
          expect(res).to.have.status(UNAUTHORIZED)

          done()
        })
        .catch(err => {
          throw err
        })
    })

    it('Should return statusCode 200 when all required fields are filled in', done => {
      const form = {
        name: 'pinkUnicorn',
        email: 'test@test.com',
        level: membershipState.ADMIN,
        team: 'dev',
        major: 'major',
        token: token
      }
      setTokenStatus(true)
      chai
        .request(app)
        .post('/api/officerManager/submit')
        .send(form)
        .then(function (res) {
          expect(res).to.have.status(OK)

          done()
        })
        .catch(err => {
          throw err
        })
    })
  })

  describe('/POST GetForm', () => {
    it('Should return statusCode 403 when no token is submited', done => {
      const form = {
        email: 'test@test.com'
      }
      chai
        .request(app)
        .post('/api/officerManager/GetForm')
        .send(form)
        .then(function (res) {
          expect(res).to.have.status(FORBIDDEN)

          done()
        })
        .catch(err => {
          throw err
        })
    })

    it('Should return statusCode 401 when invalid token is submited', done => {
      const form = {
        email: 'test@test.com',
        token: 'Invalid-Token'
      }
      chai
        .request(app)
        .post('/api/officerManager/GetForm')
        .send(form)
        .then(function (res) {
          expect(res).to.have.status(UNAUTHORIZED)

          done()
        })
        .catch(err => {
          throw err
        })
    })

    it('Should return an object of all forms', done => {
      const form = { token: token }
      setTokenStatus(true)
      chai
        .request(app)
        .post('/api/officerManager/GetForm')
        .send(form)
        .then(function (res) {
          expect(res).to.have.status(OK)
          const response = res.body
          response.should.be.a('array')
          expect(response).to.have.length(1)
          expect(response[0].email).to.be.eql('test@test.com')
          expect(response[0].name).to.be.eql('pinkUnicorn')
          expect(response[0].level).to.be.eql(membershipState.ADMIN)
          expect(response[0].team).to.be.eql('dev')
          expect(response[0].major).to.be.eql('major')

          done()
        })
        .catch(err => {
          throw err
        })
    })

    it('Should return an object of only querried parameter', done => {
      const form = {
        email: 'test@test.com',
        token: token
      }
      setTokenStatus(true)
      chai
        .request(app)
        .post('/api/officerManager/GetForm')
        .send(form)
        .then(function (res) {
          expect(res).to.have.status(OK)
          res.body.should.be.a('array')
          // make sure all child has querries parameter
          res.body.forEach(obj => {
            expect(obj.email).to.be.eql('test@test.com')
          })

          done()
        })
        .catch(err => {
          throw err
        })
    })
  })

  describe('/POST edit', () => {
    it('Should return statusCode 403 if no token is passed in', done => {
      const form = {
        name: 'pinkUnicorn'
      }
      chai
        .request(app)
        .post('/api/officerManager/edit')
        .send(form)
        .then(function (res) {
          expect(res).to.have.status(FORBIDDEN)

          done()
        })
        .catch(err => {
          throw err
        })
    })

    it('Should return statusCode 401 if an invalid token was passed in', done => {
      const form = {
        token: 'Invalid token',
        email: 'test@test.com'
      }
      chai
        .request(app)
        .post('/api/officerManager/edit')
        .send(form)
        .then(function (res) {
          expect(res).to.have.status(UNAUTHORIZED)

          done()
        })
        .catch(err => {
          throw err
        })
    })

    it('Should return statusCode 404 if no form was found', done => {
      const form = {
        token: token,
        email: 'invalid-email'
      }
      setTokenStatus(true)
      chai
        .request(app)
        .post('/api/officerManager/edit')
        .send(form)
        .then(function (res) {
          expect(res).to.have.status(NOT_FOUND)

          done()
        })
        .catch(err => {
          throw err
        })
    })

    it('Should return statusCode 200 and a message if a form was edited', done => {
      const form = {
        token: token,
        email: 'test@test.com',
        name: 'new name'
      }
      setTokenStatus(true)
      chai
        .request(app)
        .post('/api/officerManager/edit')
        .send(form)
        .then(function (res) {
          expect(res).to.have.status(OK)
          res.body.should.be.a('object')
          res.body.should.have.property('message')

          done()
        })
        .catch(err => {
          throw err
        })
    })

    it('The update should be reflected in the database', done => {
      const form = {
        token: token,
        email: 'test@test.com'
      }
      setTokenStatus(true)
      chai
        .request(app)
        .post('/api/officerManager/GetForm')
        .send(form)
        .then(function (res) {
          expect(res).to.have.status(OK)
          expect(res.body[0].name).to.equal('new name')

          done()
        })
        .catch(err => {
          throw err
        })
    })
  })

  describe('/POST delete', () => {
    it('Should return statusCode 403 if no token is passed in', done => {
      const form = {
        name: 'invalid-name',
        email: 'test@test.com'
      }
      chai
        .request(app)
        .post('/api/officerManager/delete')
        .send(form)
        .then(function (res) {
          expect(res).to.have.status(FORBIDDEN)

          done()
        })
        .catch(err => {
          throw err
        })
    })

    it('Should return statusCode 401 if an invalid token was passed in', done => {
      const form = {
        token: 'Invalid token',
        email: 'test@test.com'
      }
      chai
        .request(app)
        .post('/api/officerManager/delete')
        .send(form)
        .then(function (res) {
          expect(res).to.have.status(UNAUTHORIZED)

          done()
        })
        .catch(err => {
          throw err
        })
    })

    it('Should return statusCode 404 if no form was found', done => {
      const form = {
        token: token,
        email: 'fsefvsf@dsges.csadw'
      }
      setTokenStatus(true)
      chai
        .request(app)
        .post('/api/officerManager/delete')
        .send(form)
        .then(function (res) {
          expect(res).to.have.status(NOT_FOUND)

          done()
        })
        .catch(err => {
          throw err
        })
    })

    it('Should return statusCode 200 and a message if a form was deleted', done => {
      const form = {
        token: token,
        email: 'test@test.com'
      }
      setTokenStatus(true)
      chai
        .request(app)
        .post('/api/officerManager/delete')
        .send(form)
        .then(function (res) {
          expect(res).to.have.status(OK)
          res.body.should.be.a('object')
          res.body.should.have.property('message')

          done()
        })
        .catch(err => {
          throw err
        })
    })

    it('The deleted item should be reflected in the database', done => {
      const form = {
        token: token,
        email: 'test@test.com'
      }
      setTokenStatus(true)
      chai
        .request(app)
        .post('/api/officerManager/GetForm')
        .send(form)
        .then(function (res) {
          expect(res).to.have.status(OK)
          expect(res.body).have.length(0)

          done()
        })
        .catch(err => {
          throw err
        })
    })
  })
})
