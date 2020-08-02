process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const constants = require('../api/util/constants');
const { OK, NOT_FOUND, BAD_REQUEST } = constants.STATUS_CODES;
const SceApiTester = require('./util/tools/SceApiTester');
const { SceGoogleApiHandler } =
  require('../api/google_api/util/SceGoogleApiHandler');

let app = null;
let test = null;
let sandbox = sinon.createSandbox();
const expect = chai.expect;
const tools = require('./util/tools/tools.js');

chai.should();
chai.use(chaiHttp);

describe('Calendar', () => {
  let getCalendarEventStub = null;
  let addCalendarEventStub = null;
  before(done => {
    getCalendarEventStub = sandbox.stub(SceGoogleApiHandler.prototype,
      'getEventsFromCalendar');
    addCalendarEventStub = sandbox.stub(SceGoogleApiHandler.prototype,
      'addEventToCalendar');
    app = tools.initializeServer(
      __dirname + '/../api/google_api/routes/Calendar.js');
    test = new SceApiTester(app);
    done();
  });

  after(done => {
    sandbox.restore();
    tools.terminateServer(done);
  });

  const CALENDAR_RESPONSE = 'Sample response';

  describe('/GET getCalendarEvents', () => {
    it('Should return 200 with a calendar event information when successful',
      async () => {
        getCalendarEventStub.resolves(CALENDAR_RESPONSE);
        const result = await test.sendGetRequest(
          '/api/Calendar/getCalendarEvents');
        expect(result.body).to.have.property('calendarEvents');
        expect(result.body.calendarEvents).to.equal(CALENDAR_RESPONSE);
        expect(result).to.have.status(OK);
      });

    it('Should return 404 when we cannot retrieve calendar events',
      async () => {
        getCalendarEventStub.rejects({});
        const result = await test.sendGetRequest(
          '/api/Calendar/getCalendarEvents');
        expect(result).to.have.status(NOT_FOUND);
      });
  });

  describe('/POST addEventToCalendar', () => {
    it('Should return 200 with the added calendar event when successful',
      async () => {
        addCalendarEventStub.resolves(CALENDAR_RESPONSE);
        const result = await test.sendPostRequest(
          '/api/Calendar/addEventToCalendar');
        expect(result.body).to.have.property('event');
        expect(result.body.event).to.equal(CALENDAR_RESPONSE);
        expect(result).to.have.status(OK);
      });

    it('Should return 400 when the event cannot be added',
      async () => {
        addCalendarEventStub.rejects({});
        const result = await test.sendPostRequest(
          '/api/Calendar/addEventToCalendar');
        expect(result).to.have.status(BAD_REQUEST);
      });
  });
});
