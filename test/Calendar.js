process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const constants = require('../api/util/constants');
const { OK, NOT_FOUND } = constants.STATUS_CODES;
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
  let calendarStub = null;
  before(done => {
    calendarStub = sandbox.stub(SceGoogleApiHandler.prototype,
      'getEventsFromCalendar');
    app = tools.initializeServer(
      __dirname + '/../api/google_api/routes/Calendar.js');
    test = new SceApiTester(app);
    done();
  });

  after(done => {
    if (calendarStub) calendarStub.restore();
    sandbox.restore();
    tools.terminateServer(done);
  });

  const CALENDAR_RESPONSE = 'Sample response';

  describe('/GET getCalendarEvents', () => {
    it('Should return 200 with a calendar event information when successful',
      async () => {
        calendarStub.resolves(CALENDAR_RESPONSE);
        const result = await test.sendGetRequest(
          '/api/Calendar/getCalendarEvents');
        expect(result.body).to.have.property('calendarEvents');
        expect(result.body.calendarEvents).to.equal(CALENDAR_RESPONSE);
        expect(result).to.have.status(OK);
      });

    it('Should return 404 when we cannot retrieve calendar events',
      async () => {
        calendarStub.rejects({});
        const result = await test.sendGetRequest(
          '/api/Calendar/getCalendarEvents');
        expect(result).to.have.status(NOT_FOUND);
      });
  });
});
