/* global describe it before after */
// During the test the env variable is set to test
process.env.NODE_ENV = 'test'
const PrintingForm3D = require('../api/models/PrintingForm3D')
const User = require('../api/models/User')
// Require the dev-dependencies
const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../server')
let serverInstance = null
let app = null
const expect = chai.expect

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
describe('3DPrintingForm', () => {
  before(done => {
    initializeServer()
    // Before each test we empty the database
    PrintingForm3D.deleteMany({}, err => {
      if (err) {
        //
      }
    })
    User.deleteMany({}, err => {
      if (err) {
        //
      }
    })
    done()
  })
  after(done => {
    terminateServer(done)
  })

  let token = ''
  let date = 0

  describe('/POST submit', () => {
    it('Should not return statusCode 200 when the required fields are not set', done => {
      const form = {}
      chai
        .request(app)
        .post('/api/3DPrintingForm/submit')
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
        color: 'Rainbow',
        contact: 'a@b.c',
        email: 'a@a.com'
      }
      chai
        .request(app)
        .post('/api/3DPrintingForm/submit')
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
      const form = { email: 'a@a.com' }
      chai
        .request(app)
        .post('/api/3DPrintingForm/GetForm')
        .send(form)
        .then(function (res) {
          expect(res).to.have.status(200)
          res.body.should.be.a('array')
          date = res.body[0].date

          done()
        })
        .catch(err => {
          throw err
        })
    })
  })

  describe('/POST edit', () => {
    it('Should register a user', done => {
      const user = {
        email: 'b@b.c',
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
        email: 'b@b.c',
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

    it('Should return statusCode 500 if no token is passed in', done => {
      const form = {
        name: 'pinkUnicorn'
      }
      chai
        .request(app)
        .post('/api/3DPrintingForm/edit')
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
        name: 'pinkUnicorn',
        token: 'Invalid token',
        email: 'a@a.com'
      }
      chai
        .request(app)
        .post('/api/3DPrintingForm/edit')
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
        name: 'invalid-name',
        token: token,
        email: 'a@a.com'
      }
      chai
        .request(app)
        .post('/api/3DPrintingForm/edit')
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
        name: 'pinkUnicorn',
        color: 'NeonGhost',
        token: token,
        email: 'a@a.com',
        date: date
      }
      chai
        .request(app)
        .post('/api/3DPrintingForm/edit')
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
        color: 'invalid-color',
        email: 'a@a.com'
      }
      chai
        .request(app)
        .post('/api/3DPrintingForm/delete')
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
        name: 'invalid-name',
        color: 'invalid-color',
        token: 'Invalid token',
        email: 'a@a.com'
      }
      chai
        .request(app)
        .post('/api/3DPrintingForm/delete')
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
        name: 'invalid-name',
        color: 'invalid-color',
        token: token,
        email: 'a@a.com'
      }
      chai
        .request(app)
        .post('/api/3DPrintingForm/delete')
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
        name: 'pinkUnicorn',
        color: 'NeonGhost',
        token: token,
        email: 'a@a.com',
        date: date
      }
      chai
        .request(app)
        .post('/api/3DPrintingForm/delete')
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
