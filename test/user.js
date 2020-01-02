/* global describe it before after */
// During the test the env variable is set to test
process.env.NODE_ENV = 'test'

const User = require('../api/models/User')

// Require the dev-dependencies
const chai = require('chai')
const chaiHttp = require('chai-http')

let app = null
const expect = chai.expect
// tools for testing
const tools = require('../util/testing-utils/tools.js')

chai.should()
chai.use(chaiHttp)

// Our parent block
describe('Users', () => {
  before(done => {
    app = tools.initializeServer()
    // Before each test we empty the database
    tools.emptySchema(User)
    done()
  })
  after(done => {
    tools.terminateServer(done)
  })

  let token = ''

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
    it('Should successfully register a user with email, password, firstname and lastname', done => {
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

    it('Should not allow a second registration with the same email as a user in the database', done => {
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
          expect(res).to.have.status(409)

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
          throw err
        })
    })
  })

  describe('/POST login', () => {
    it('Should return statusCode 400 if an email and/or password is not provided', done => {
      const user = {}
      chai
        .request(app)
        .post('/api/user/login')
        .send(user)
        .then(function (res) {
          expect(res).to.have.status(400)

          done()
        })
        .catch(err => {
          throw err
        })
    })

    it('Should return statusCode 401 if an email/pass combo does not match a record in the DB', done => {
      const user = {
        email: 'nota@b.c',
        password: 'notpass'
      }
      chai
        .request(app)
        .post('/api/user/login')
        .send(user)
        .then(function (res) {
          expect(res).to.have.status(401)

          done()
        })
        .catch(err => {
          throw err
        })
    })

    it('Should return statusCode 401 if the email exists but password is incorrect', done => {
      const user = {
        email: 'a@b.c',
        password: 'notpass'
      }
      chai
        .request(app)
        .post('/api/user/login')
        .send(user)
        .then(function (res) {
          expect(res).to.have.status(401)

          done()
        })
        .catch(err => {
          throw err
        })
    })

    it('Should return statusCode 200 and a JWT token if the email/pass is correct', done => {
      const user = {
        email: 'a@b.c',
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
  })

  describe('/POST verify', () => {
    it('Should return statusCode 401 when a token is not passed in', done => {
      chai
        .request(app)
        .post('/api/user/verify')
        .send({})
        .then(function (res) {
          expect(res).to.not.have.status(200)

          done()
        })
        .catch(err => {
          throw err
        })
    })

    it('Should return statusCode 401 when an invalid token is passed in', done => {
      chai
        .request(app)
        .post('/api/user/verify')
        .send({ token: 'Invalid Token' })
        .then(function (res) {
          expect(res).to.have.status(401)

          done()
        })
        .catch(err => {
          throw err
        })
    })

    it('Should return statusCode 200 when a valid token is passed in', done => {
      chai
        .request(app)
        .post('/api/user/verify')
        .send({ token: token })
        .then(function (res) {
          expect(res).to.have.status(200)
          res.body.should.be.a('object')
          res.body.should.have.property('name')
          res.body.should.have.property('email')
          res.body.should.have.property('accessLevel')

          done()
        })
        .catch(err => {
          throw err
        })
    })
  })

  describe('/POST search', () => {
    it('Should return statusCode 500 if no token is passed in', done => {
      const user = {
        email: 'a@b.c'
      }
      chai
        .request(app)
        .post('/api/user/users')
        .send(user)
        .then(function (res) {
          expect(res).to.not.have.status(200)

          done()
        })
        .catch(err => {
          throw err
        })
    })

    it('Should return statusCode 401 if an invalid token was passed in', done => {
      const user = {
        token: 'Invalid token'
      }
      chai
        .request(app)
        .post('/api/user/users')
        .send(user)
        .then(function (res) {
          expect(res).to.not.have.status(200)

          done()
        })
        .catch(err => {
          throw err
        })
    })

    it('Should return statusCode 200 and return an array of all objects in collection', done => {
      const form = {
        token: token
      }
      chai
        .request(app)
        .post('/api/user/users')
        .send(form)
        .then(function (res) {
          expect(res).to.have.status(200)
          res.body.should.be.a('array')
          expect(res.body).to.have.length(1)

          done()
        })
        .catch(err => {
          throw err
        })
    })
  })

  describe('/POST searchFor', () => {
    it('Should return statusCode 500 if no token is passed in', done => {
      const user = {
        email: 'a@b.c'
      }
      chai
        .request(app)
        .post('/api/user/search')
        .send(user)
        .then(function (res) {
          expect(res).to.not.have.status(200)

          done()
        })
        .catch(err => {
          throw err
        })
    })

    it('Should return statusCode 401 if an invalid token was passed in', done => {
      const user = {
        email: 'a@b.c',
        token: 'Invalid token'
      }
      chai
        .request(app)
        .post('/api/user/search')
        .send(user)
        .then(function (res) {
          expect(res).to.not.have.status(200)

          done()
        })
        .catch(err => {
          throw err
        })
    })

    it('Should return statusCode 404 if no user was found', done => {
      const user = {
        email: 'invalid@b.c',
        token: token
      }
      chai
        .request(app)
        .post('/api/user/search')
        .send(user)
        .then(function (res) {
          expect(res).to.have.status(404)

          done()
        })
        .catch(err => {
          throw err
        })
    })

    it('Should return statusCode 200 and a user if the query was found', done => {
      const user = {
        email: 'a@b.c',
        token: token
      }
      chai
        .request(app)
        .post('/api/user/search')
        .send(user)
        .then(function (res) {
          expect(res).to.have.status(200)
          res.body.should.be.a('object')
          res.body.should.have.property('firstName')
          res.body.should.have.property('middleInitial')
          res.body.should.have.property('lastName')
          res.body.should.have.property('email')
          res.body.should.have.property('emailVerified')
          res.body.should.have.property('emailOptIn')
          res.body.should.have.property('active')
          res.body.should.have.property('accessLevel')
          res.body.should.have.property('major')
          res.body.should.have.property('joinDate')
          res.body.should.have.property('lastLogin')

          done()
        })
        .catch(err => {
          throw err
        })
    })
  })

  describe('/POST edit', () => {
    it('Should return statusCode 500 if no token is passed in', done => {
      const user = {
        queryEmail: 'a@b.c'
      }
      chai
        .request(app)
        .post('/api/user/edit')
        .send(user)
        .then(function (res) {
          expect(res).to.not.have.status(200)

          done()
        })
        .catch(err => {
          throw err
        })
    })

    it('Should return statusCode 401 if an invalid token was passed in', done => {
      const user = {
        queryEmail: 'a@b.c',
        token: 'Invalid token'
      }
      chai
        .request(app)
        .post('/api/user/edit')
        .send(user)
        .then(function (res) {
          expect(res).to.not.have.status(200)

          done()
        })
        .catch(err => {
          throw err
        })
    })

    it('Should return statusCode 404 if no user was found', done => {
      const user = {
        queryEmail: 'invalid@b.c',
        token: token
      }
      chai
        .request(app)
        .post('/api/user/edit')
        .send(user)
        .then(function (res) {
          expect(res).to.have.status(404)

          done()
        })
        .catch(err => {
          throw err
        })
    })

    it('Should return statusCode 200 and a message if a user was edited', done => {
      const user = {
        queryEmail: 'a@b.c',
        token: token,
        firstName: 'pinkUnicorn',
        numberOfSemestersToSignUpFor: undefined
      }
      chai
        .request(app)
        .post('/api/user/edit')
        .send(user)
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
      const user = {
        email: 'a@b.c'
      }
      chai
        .request(app)
        .post('/api/user/delete')
        .send(user)
        .then(function (res) {
          expect(res).to.not.have.status(200)

          done()
        })
        .catch(err => {
          throw err
        })
    })

    it('Should return statusCode 401 if an invalid token was passed in', done => {
      const user = {
        email: 'a@b.c',
        token: 'Invalid token'
      }
      chai
        .request(app)
        .post('/api/user/delete')
        .send(user)
        .then(function (res) {
          expect(res).to.not.have.status(200)

          done()
        })
        .catch(err => {
          throw err
        })
    })

    it('Should return statusCode 404 if no user was found', done => {
      const user = {
        email: 'invalid@b.c',
        token: token
      }
      chai
        .request(app)
        .post('/api/user/delete')
        .send(user)
        .then(function (res) {
          expect(res).to.have.status(404)

          done()
        })
        .catch(err => {
          throw err
        })
    })

    it('Should return statusCode 200 and a message if a user was deleted', done => {
      const user = {
        email: 'a@b.c',
        token: token
      }
      chai
        .request(app)
        .post('/api/user/delete')
        .send(user)
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
