/* global describe it before after */
// During the test the env variable is set to test
process.env.NODE_ENV = 'test'
const Event = require('../api/models/Event')
const User = require('../api/models/User')
// Require the dev-dependencies
const chai = require('chai')
const chaiHttp = require('chai-http')
const constants = require('../api/constants')
const { OK, BAD_REQUEST, UNAUTHORIZED, NOT_FOUND } = constants.STATUS_CODES
const { DEFAULT_PHOTO_URL } = constants
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
  const VALID_NEW_EVENT = {
    title: 'ros masters united',
    eventLocation: 'SU 4A',
    eventDate: '5/25/20',
    startTime: '12:00',
    endTime: '13:00',
    eventCategory: 'workshop'
  }
  const EVENT_WITH_INVALID_TOKEN = {
    token: 'invalid'
  }
  const EVENT_WITHOUT_REQUIRED_FIELDS = {
    eventDate: '5/25/20'
  }
  const EVENT_WITH_INVALID_ID = {
    id: 'strawberry'
  }
  const UPDATED_EVENT = {
    title: 'ros masters divided',
    eventLocation: 'SU 4B',
    eventDate: '5/27/20',
    startTime: '13:00',
    endTime: '14:00',
    eventCategory: 'game night',
    imageURL: 'https://link.to/pdf'
  }

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
          expect(res).to.have.status(OK)
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
          expect(res).to.have.status(OK)
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
      chai
        .request(app)
        .post('/api/event/createEvent')
        .send(EVENT_WITH_INVALID_TOKEN)
        .then(function (res) {
          expect(res).to.have.status(UNAUTHORIZED)
          done()
        })
        .catch(err => {
          throw err
        })
    })
    it("Should return 400 when the required fields aren't filled in", done => {
      chai
        .request(app)
        .post('/api/event/createEvent')
        .send({ token, ...EVENT_WITHOUT_REQUIRED_FIELDS })
        .then(function (res) {
          expect(res).to.have.status(BAD_REQUEST)
          done()
        })
        .catch(err => {
          throw err
        })
    })
    it('Should return statusCode 200 when all required fields are filled in', done => {
      chai
        .request(app)
        .post('/api/event/createEvent')
        .send({ token, ...VALID_NEW_EVENT })
        .then(function (res) {
          expect(res).to.have.status(OK)
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
          expect(res).to.have.status(OK)
          const getEventsResponse = res.body
          getEventsResponse.should.be.a('array')
          expect(getEventsResponse).to.have.length(1)
          expect(getEventsResponse[0].title).to.equal(VALID_NEW_EVENT.title)
          expect(getEventsResponse[0].eventLocation).to.equal(
            VALID_NEW_EVENT.eventLocation
          )
          expect(getEventsResponse[0].eventDate).to.equal(
            VALID_NEW_EVENT.eventDate
          )
          expect(getEventsResponse[0].startTime).to.equal(
            VALID_NEW_EVENT.startTime
          )
          expect(getEventsResponse[0].endTime).to.equal(VALID_NEW_EVENT.endTime)
          expect(getEventsResponse[0].eventCategory).to.equal(
            VALID_NEW_EVENT.eventCategory
          )
          expect(getEventsResponse[0].imageURL).to.equal(DEFAULT_PHOTO_URL)
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
      chai
        .request(app)
        .post('/api/event/editEvent')
        .send({ eventId, ...EVENT_WITH_INVALID_TOKEN })
        .then(function (res) {
          expect(res).to.have.status(UNAUTHORIZED)
          done()
        })
        .catch(err => {
          throw err
        })
    })
    it("Should return 404 when an event by an invalid id isn't found", done => {
      chai
        .request(app)
        .post('/api/event/editEvent')
        .send({ token, ...EVENT_WITH_INVALID_ID })
        .then(function (res) {
          expect(res).to.have.status(NOT_FOUND)
          done()
        })
        .catch(err => {
          throw err
        })
    })
    it('Should return 200 when an event is sucessfully updated', done => {
      chai
        .request(app)
        .post('/api/event/editEvent')
        .send({ token, id: eventId, ...UPDATED_EVENT })
        .then(function (res) {
          expect(res).to.have.status(OK)
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
          expect(res).to.have.status(OK)
          const getEventsResponse = res.body
          expect(getEventsResponse).to.have.length(1)
          expect(getEventsResponse[0].title).to.equal(UPDATED_EVENT.title)
          expect(getEventsResponse[0].eventLocation).to.equal(
            UPDATED_EVENT.eventLocation
          )
          expect(getEventsResponse[0].eventDate).to.equal(
            UPDATED_EVENT.eventDate
          )
          expect(getEventsResponse[0].startTime).to.equal(
            UPDATED_EVENT.startTime
          )
          expect(getEventsResponse[0].endTime).to.equal(UPDATED_EVENT.endTime)
          expect(getEventsResponse[0].eventCategory).to.equal(
            UPDATED_EVENT.eventCategory
          )
          expect(getEventsResponse[0].imageURL).to.equal(UPDATED_EVENT.imageURL)
          done()
        })
        .catch(err => {
          throw err
        })
    })
  })

  describe('/POST deleteEvent', () => {
    it('Should return 403 when an invalid token is supplied', done => {
      chai
        .request(app)
        .post('/api/event/deleteEvent')
        .send(EVENT_WITH_INVALID_TOKEN)
        .then(function (res) {
          expect(res).to.have.status(UNAUTHORIZED)
          done()
        })
        .catch(err => {
          throw err
        })
    })
    it('Should return 400 when an event is unsucessfully deleted', done => {
      chai
        .request(app)
        .post('/api/event/deleteEvent')
        .send({ token, ...EVENT_WITH_INVALID_ID })
        .then(function (res) {
          expect(res).to.have.status(BAD_REQUEST)
          done()
        })
        .catch(err => {
          throw err
        })
    })
    it('Should return 200 when an event is sucessfully deleted', done => {
      chai
        .request(app)
        .post('/api/event/deleteEvent')
        .send({ token, id: eventId })
        .then(function (res) {
          expect(res).to.have.status(OK)
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
          expect(res).to.have.status(OK)
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
