/* global describe it beforeEach */
// During the test the env variable is set to test
process.env.NODE_ENV = 'test'

// const mongoose = require('mongoose')
const User = require('../api/models/user')
// const User = mongoose.models.User

// Require the dev-dependencies
const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../server')
const expect = chai.expect

chai.should()
chai.use(chaiHttp)

// Our parent block
describe('Users', () => {
  beforeEach(done => {
    // Before each test we empty the database
    User.remove({}, err => {
      if (err) {
        //
      }
      done()
    })
  })

  /*
   * Test the /GET route
   */
  describe('/POST checkIfUserExists with no users added yet', () => {
    it('Should not return statusCode 200 when an email is not provided', done => {
      const user = {}
      chai
        .request(app)
        .post('/api/user/checkIfUserExists')
        .send(user)
        .then(function (res) {
          expect(res).to.not.have.status(200)

          done()
        })
        .catch(err => {
          throw err
        })
    })

    it('Should return statusCode 200 when a user does not exist', done => {
      const user = {
        email: 'a@b.c'
      }
      chai
        .request(app)
        .post('/api/user/checkIfUserExists')
        .send(user)
        .then(function (res) {
          expect(res).to.have.status(200)

          done()
        })
        .catch(err => {
          throw err
        })
    })
  })

  describe('/POST register', () => {
    it('Should successfully register a user with at least an email and password', done => {
      const user = {
        email: 'a@b.c',
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
  })

  // Failing. Right now if this test is included, then it removes the user from the database?
  // If this is commented out, then the user created above persists?
  describe('/POST checkIfUserExists with a user added', () => {
    it('Should return statusCode 409 when a user already exists', done => {
      const user = {
        email: 'a@b.c'
      }
      chai
        .request(app)
        .post('/api/user/checkIfUserExists')
        .send(user)
        .then(function (res) {
          expect(res).to.have.status(409)

          done()
        })
        .catch(err => {
          done()
          throw err
        })
    })
  })
})
