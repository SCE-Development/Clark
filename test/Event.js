/* global describe it before after */
// During the test the env variable is set to test
process.env.NODE_ENV = 'test';
const Event = require('../api/models/Event');
const User = require('../api/models/User');
const tokenValidMocker = require('./util/mocks/TokenValidFunctions');
// Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const constants = require('../api/constants');
const { OK, BAD_REQUEST, UNAUTHORIZED, NOT_FOUND } = constants.STATUS_CODES;
const { DEFAULT_PHOTO_URL } = constants;
const SceApiTester = require('./util/tools/SceApiTester');

let app = null;
let test = null;
const expect = chai.expect;
// tools for testing
const tools = require('./util/tools/tools.js');
const {
  initializeMock,
  setTokenStatus,
  resetMock,
  restoreMock,
} = require('./util/mocks/TokenValidFunctions');

chai.should();
chai.use(chaiHttp);

describe('Event', () => {
  before(done => {
    initializeMock();
    app = tools.initializeServer(__dirname + '/../api/routes/Event.js');
    test = new SceApiTester(app);
    // Before each test we empty the database
    tools.emptySchema(Event);
    tools.emptySchema(User);
    done();
  });

  after(done => {
    restoreMock();
    tools.terminateServer(done);
  });

  beforeEach(() => {
    setTokenStatus(false);
  });

  afterEach(() => {
    resetMock();
  });

  const token = '';
  let eventId = '';
  const VALID_NEW_EVENT = {
    title: 'ros masters united',
    eventLocation: 'SU 4A',
    eventDate: new Date('5/25/20'),
    startTime: '12:00',
    endTime: '13:00',
    eventCategory: 'workshop'
  };
  const EVENT_WITH_INVALID_TOKEN = {
    token: 'invalid'
  };
  const EVENT_WITHOUT_REQUIRED_FIELDS = {
    eventDate: new Date('5/25/20')
  };
  const EVENT_WITH_INVALID_ID = {
    id: 'strawberry'
  };
  const UPDATED_EVENT = {
    title: 'ros masters divided',
    eventLocation: 'SU 4B',
    eventDate: new Date('5/27/20'),
    startTime: '13:00',
    endTime: '14:00',
    eventCategory: 'game night',
    imageURL: 'https://link.to/pdf'
  };

  describe('/POST createEvent', () => {
    it('Should return 403 when an invalid token is supplied', async () => {
      const result = await test.sendPostRequest(
        '/api/event/createEvent', EVENT_WITH_INVALID_TOKEN);
      expect(result).to.have.status(UNAUTHORIZED);
    });
    it('Should return 400 when the required fields aren\'t filled in',
      async () => {
        setTokenStatus(true);
        const result = await test.sendPostRequestWithToken(
          token, '/api/event/createEvent', EVENT_WITHOUT_REQUIRED_FIELDS);
        expect(result).to.have.status(BAD_REQUEST);
      });
    it('Should return statusCode 200 when all required ' +
       'fields are filled in', async () => {
      setTokenStatus(true);
      const result = await test.sendPostRequestWithToken(
        token, '/api/event/createEvent', VALID_NEW_EVENT);
      expect(result).to.have.status(OK);
    });
  });

  describe('/GET getEvents', () => {
    it('Should return an object of all events', async () => {
      setTokenStatus(true);
      const result = await test.sendGetRequest(
        '/api/event/getEvents');
      expect(result).to.have.status(OK);
      const getEventsResponse = result.body;
      getEventsResponse.should.be.a('array');
      expect(getEventsResponse).to.have.length(1);
      expect(getEventsResponse[0].title).to.equal(VALID_NEW_EVENT.title);
      expect(getEventsResponse[0].eventLocation).to.equal(
        VALID_NEW_EVENT.eventLocation
      );
      expect(getEventsResponse[0].eventDate).to.equal(
        VALID_NEW_EVENT.eventDate.toISOString()
      );
      expect(getEventsResponse[0].startTime).to.equal(
        VALID_NEW_EVENT.startTime
      );
      expect(getEventsResponse[0].endTime).to.equal(
        VALID_NEW_EVENT.endTime
      );
      expect(getEventsResponse[0].eventCategory).to.equal(
        VALID_NEW_EVENT.eventCategory
      );
      expect(getEventsResponse[0].imageURL).to.equal(DEFAULT_PHOTO_URL);
      eventId = getEventsResponse[0]._id;
    });
  });

  describe('/POST editEvent', () => {
    it('Should return 403 when an invalid token is supplied', async () => {
      const result = await test.sendPostRequestWithToken(
        token, '/api/event/editEvent', EVENT_WITH_INVALID_TOKEN);
      expect(result).to.have.status(UNAUTHORIZED);
    });
    it('Should return 404 when an event by an ' +
       'invalid id isn\'t found', async () => {
      setTokenStatus(true);
      const result = await test.sendPostRequestWithToken(
        token, '/api/event/editEvent', EVENT_WITH_INVALID_ID);
      expect(result).to.have.status(NOT_FOUND);
    });
    it('Should return 200 when an event is sucessfully updated', done => {
      setTokenStatus(true);
      chai
        .request(app)
        .post('/api/event/editEvent')
        .send({ token, id: eventId, ...UPDATED_EVENT })
        .then(function(res) {
          expect(res).to.have.status(OK);
          done();
        })
        .catch(err => {
          throw err;
        });
    });
    it('The update should be reflected in the database', async () => {
      setTokenStatus(true);
      const result = await test.sendGetRequest(
        '/api/event/getEvents');
      expect(result).to.have.status(OK);
      const getEventsResponse = result.body;
      expect(getEventsResponse).to.have.length(1);
      expect(getEventsResponse[0].title).to.equal(UPDATED_EVENT.title);
      expect(getEventsResponse[0].eventLocation).to.equal(
        UPDATED_EVENT.eventLocation
      );
      expect(getEventsResponse[0].eventDate).to.equal(
        UPDATED_EVENT.eventDate.toISOString()
      );
      expect(getEventsResponse[0].startTime).to.equal(
        UPDATED_EVENT.startTime
      );
      expect(getEventsResponse[0].endTime).to.equal(UPDATED_EVENT.endTime);
      expect(getEventsResponse[0].eventCategory).to.equal(
        UPDATED_EVENT.eventCategory
      );
      expect(getEventsResponse[0].imageURL).to.equal(
        UPDATED_EVENT.imageURL
      );
    });
  });

  describe('/POST deleteEvent', () => {
    it('Should return 403 when an invalid token is supplied', async () => {
      const result = await test.sendPostRequestWithToken(
        token, '/api/event/deleteEvent', EVENT_WITH_INVALID_TOKEN);
      expect(result).to.have.status(UNAUTHORIZED);
    });
    it('Should return 400 when an event is unsucessfully deleted', async () => {
      setTokenStatus(true);
      const result = await test.sendPostRequestWithToken(
        token, '/api/event/deleteEvent', EVENT_WITH_INVALID_ID);
      expect(result).to.have.status(BAD_REQUEST);
    });
    it('Should return 200 when an event is sucessfully deleted', async () => {
      setTokenStatus(true);
      const result = await test.sendPostRequestWithToken(
        token, '/api/event/deleteEvent', {id: eventId});
      expect(result).to.have.status(OK);
    });
    it('The deleted item should be reflected in the database', async () => {
      setTokenStatus(true);
      const result = await test.sendGetRequest(
        '/api/event/getEvents');
      expect(result).to.have.status(OK);
      const getEventsResponse = result.body;
      getEventsResponse.should.be.a('array');
      expect(getEventsResponse).to.have.length(0);
    });
  });
});
