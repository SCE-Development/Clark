/* global describe it before after */
// During the test the env variable is set to test
process.env.NODE_ENV = 'test'
const OfficerManager = require('../api/models/OfficerManager')
const User = require('../api/models/User')
// Require the dev-dependencies
const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../server')
let serverInstance = null
let app = null
const expect = chai.expect
// tools for testing
const tools = require('../util/testing-utils/tools.js')

chai.should()
chai.use(chaiHttp)

function initializeServer () {
  serverInstance = new server.Server()
  serverInstance.openConnection()
  app = serverInstance.getServerInstance()
}

function terminateServer (done) {
  serverInstance.closeConnection(done)
}

// Our parent block
describe('OfficerManager', () => {
  before(done => {
    initializeServer(app)

    // Before each test we empty the database
    tools.emptySchema(OfficerManager)
    tools.emptySchema(User)
    done()
  })
  after(done => {
    terminateServer(done)
  })

  let token = ''

  describe('/POST submit', () => {
    it('Should register a user', done => {
      const user = {
        email: 'test@test.com',
        password: 'pass',
        firstName: 'first-name',
        lastName: 'last-name'
      }

      chai
        .request(app)
        .post('/api/user/register')
        .send(user)
        .then(function (res) {
          expect(res).to.have.status(200)

          done()
        })
        .catch(err => {
          throw err
        })
    })

    it('Should log a user in and get a token', done => {
      const user = {
        email: 'test@test.com',
        password: 'pass'
      }
      chai
        .request(app)
        .post('/api/user/login')
        .send(user)
        .then(function (res) {
          expect(res).to.have.status(200)
          res.body.should.be.a('object')
          res.body.should.have.property('token')
          token = res.body.token

          done()
        })
        .catch(err => {
          throw err
        })
    })

    it('Should not return statusCode 200 when the required fields are not set', done => {
      const form = {}
      chai
        .request(app)
        .post('/api/officerManager/submit')
        .send(form)
        .then(function (res) {
          expect(res).to.not.have.status(200)

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
        level: 2,
        team: 'dev',
        major: 'major',
        token: token
      }
      chai
        .request(app)
        .post('/api/officerManager/submit')
        .send(form)
        .then(function (res) {
          expect(res).to.have.status(200)

          done()
        })
        .catch(err => {
          throw err
        })
    })
  })

  describe('/POST GetForm', () => {
    it('Should return an object of all forms', done => {
      const form = { token: token }
      chai
        .request(app)
        .post('/api/officerManager/GetForm')
        .send(form)
        .then(function (res) {
          expect(res).to.have.status(200)
          res.body.should.be.a('array')

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
      chai
        .request(app)
        .post('/api/officerManager/GetForm')
        .send(form)
        .then(function (res) {
          expect(res).to.have.status(200)
          res.body.should.be.a('array')
          // make sure all child has querries parameter
          res.body.forEach(obj => {
            if (obj.email !== 'test@test.com') {
              throw new Error(
                'failed query, one or more object did not have query parameter'
              )
            }
          })

          done()
        })
        .catch(err => {
          throw err
        })
    })
  })

  describe('/POST edit', () => {
    it('Should return statusCode 500 if no token is passed in', done => {
      const form = {
        name: 'pinkUnicorn'
      }
      chai
        .request(app)
        .post('/api/officerManager/edit')
        .send(form)
        .then(function (res) {
          expect(res).to.not.have.status(200)

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
          expect(res).to.not.have.status(200)

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
      chai
        .request(app)
        .post('/api/officerManager/edit')
        .send(form)
        .then(function (res) {
          expect(res).to.have.status(404)

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
      chai
        .request(app)
        .post('/api/officerManager/edit')
        .send(form)
        .then(function (res) {
          expect(res).to.have.status(200)
          res.body.should.be.a('object')
          res.body.should.have.property('message')

          done()
        })
        .catch(err => {
          throw err
        })
    })
  })

  describe('/POST delete', () => {
    it('Should return statusCode 500 if no token is passed in', done => {
      const form = {
        name: 'invalid-name',
        email: 'test@test.com'
      }
      chai
        .request(app)
        .post('/api/officerManager/delete')
        .send(form)
        .then(function (res) {
          expect(res).to.not.have.status(200)

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
          expect(res).to.not.have.status(200)

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
      chai
        .request(app)
        .post('/api/officerManager/delete')
        .send(form)
        .then(function (res) {
          expect(res).to.have.status(404)

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
      chai
        .request(app)
        .post('/api/officerManager/delete')
        .send(form)
        .then(function (res) {
          expect(res).to.have.status(200)
          res.body.should.be.a('object')
          res.body.should.have.property('message')

          done()
        })
        .catch(err => {
          throw err
        })
    })
  })
})
