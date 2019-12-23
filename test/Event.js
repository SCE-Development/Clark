/* global describe it before after */
// During the test the env variable is set to test
process.env.NODE_ENV = 'test'
const Event = require('../api/models/Event')
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

describe('Event', () => {
  before(done => {
    app = tools.initializeServer()
    // Before each test we empty the database
    tools.emptySchema(Event)
    tools.emptySchema(User)
    done()
  })
  after(done => {
    tools.terminateServer(done)
  })

  let token = ''
  let eventId = ''

  describe('/POST createEvent', () => {
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
    it('Should return 403 when an invalid token is supplied', done => {
      const event = {
        token: 'invalid'
      }
      chai
        .request(app)
        .post('/api/event/createEvent')
        .send(event)
        .then(function (res) {
          expect(res).to.have.status(403)
          done()
        })
        .catch(err => {
          throw err
        })
    })
    it("Should return 400 when the required fields aren't filled in", done => {
      const event = {
        token: token
      }
      chai
        .request(app)
        .post('/api/event/createEvent')
        .send(event)
        .then(function (res) {
          expect(res).to.have.status(400)
          done()
        })
        .catch(err => {
          throw err
        })
    })
    it('Should return statusCode 200 when all required fields are filled in', done => {
      const event = {
        token: token,
        title: 'ros masters united',
        eventLocation: 'SU 4A',
        eventDate: '5/25/20',
        startTime: '3:00',
        endTime: '13:00'
      }
      chai
        .request(app)
        .post('/api/event/createEvent')
        .send(event)
        .then(function (res) {
          expect(res).to.have.status(200)
          done()
        })
        .catch(err => {
          throw err
        })
    })
  })

  describe('/GET getEvents', () => {
    it('Should return an object of all events', done => {
      chai
        .request(app)
        .get('/api/event/getEvents')
        .then(function (res) {
          expect(res).to.have.status(200)
          const getEventsResponse = res.body
          getEventsResponse.should.be.a('array')
          expect(getEventsResponse).to.have.length(1)
          expect(getEventsResponse[0].title).to.equal('ros masters united') // ===
          expect(getEventsResponse[0].eventLocation).to.equal('SU 4A')
          expect(getEventsResponse[0].eventDate).to.equal('5/25/20')
          eventId = getEventsResponse[0]._id
          done()
        })
        .catch(err => {
          throw err
        })
    })
  })

  describe('/POST editEvent', () => {
    it('Should return 403 when an invalid token is supplied', done => {
      const event = {
        token: 'invalid'
      }
      chai
        .request(app)
        .post('/api/event/editEvent')
        .send(event)
        .then(function (res) {
          expect(res).to.have.status(403)
          done()
        })
        .catch(err => {
          throw err
        })
    })
    it("Should return 404 when an event by an invalid id isn't found", done => {
      const event = {
        id: 'strawberry',
        token: token
      }
      chai
        .request(app)
        .post('/api/event/editEvent')
        .send(event)
        .then(function (res) {
          expect(res).to.have.status(404)
          done()
        })
        .catch(err => {
          throw err
        })
    })
    it('Should return 200 when an event is sucessfully updated', done => {
      const event = {
        id: eventId,
        title: 'ros masters divided',
        eventLocation: 'SU 4B',
        token: token
      }
      chai
        .request(app)
        .post('/api/event/editEvent')
        .send(event)
        .then(function (res) {
          expect(res).to.have.status(200)
          done()
        })
        .catch(err => {
          throw err
        })
    })
    it('The update should be reflected in the database', done => {
      chai
        .request(app)
        .get('/api/event/getEvents')
        .then(function (res) {
          expect(res).to.have.status(200)
          const getEventsResponse = res.body
          expect(getEventsResponse).to.have.length(1)
          expect(getEventsResponse[0].title).to.equal('ros masters divided') // ===
          expect(getEventsResponse[0].eventLocation).to.equal('SU 4B')
          expect(getEventsResponse[0].eventDate).to.equal('5/25/20')
          done()
        })
        .catch(err => {
          throw err
        })
    })
  })

  describe('/POST deleteEvent', () => {
    it('Should return 403 when an invalid token is supplied', done => {
      const event = {
        token: 'invalid'
      }
      chai
        .request(app)
        .post('/api/event/deleteEvent')
        .send(event)
        .then(function (res) {
          expect(res).to.have.status(403)
          done()
        })
        .catch(err => {
          throw err
        })
    })
    it('Should return 400 when an event is unsucessfully deleted', done => {
      const event = {
        id: 'strwr',
        token: token
      }
      chai
        .request(app)
        .post('/api/event/deleteEvent')
        .send(event)
        .then(function (res) {
          expect(res).to.have.status(400)
          done()
        })
        .catch(err => {
          throw err
        })
    })
    it('Should return 200 when an event is sucessfully deleted', done => {
      const event = {
        id: eventId,
        token: token
      }
      chai
        .request(app)
        .post('/api/event/deleteEvent')
        .send(event)
        .then(function (res) {
          expect(res).to.have.status(200)
          done()
        })
        .catch(err => {
          throw err
        })
    })
    it('The deleted item should be reflected in the database', done => {
      chai
        .request(app)
        .get('/api/event/getEvents')
        .then(function (res) {
          expect(res).to.have.status(200)
          const getEventsResponse = res.body
          getEventsResponse.should.be.a('array')
          expect(getEventsResponse).to.have.length(0)
          done()
        })
        .catch(err => {
          throw err
        })
    })
  })
})
