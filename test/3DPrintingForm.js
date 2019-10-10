/* global describe it before */
// During the test the env variable is set to test
process.env.NODE_ENV = 'test'

const PrintingForm3D = require('../api/models/PrintingForm3D')

// Require the dev-dependencies
const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../server')
const expect = chai.expect

chai.should()
chai.use(chaiHttp)

// Our parent block
describe('3DPrintingForm', () => {
  before(done => {
    // Before each test we empty the database
    PrintingForm3D.deleteMany({}, err => {
      if (err) {
        //
      }
      done()
    })
  })

  let token = ''

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
        contact: 'a@b.c'
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
      const form = {}
      chai
        .request(app)
        .post('/api/3DPrintingForm/GetForm')
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
        token: 'Invalid token'
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
        token: token
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
        token: token
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
        color: 'invalid-color'
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
        token: 'Invalid token'
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
        token: token
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
        token: token
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
