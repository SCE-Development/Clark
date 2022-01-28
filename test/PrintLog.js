/* global describe it before after */
// During the test the env variable is set to test
process.env.NODE_ENV = 'test';
const PrintLog = require('../api/peripheral_api/models/PrintLog');
const chai = require('chai');
const chaiHttp = require('chai-http');
const constants = require('../api/util/constants');
const { OK, BAD_REQUEST } = constants.STATUS_CODES;
const SceApiTester = require('../test/util/tools/SceApiTester');

let app = null;
let test = null;
const expect = chai.expect;
const tools = require('./util/tools/tools.js');
chai.should();
chai.use(chaiHttp);

describe('PrintLog', () => {
  before(done => {
    app = tools.initializeServer(
      __dirname + '/../api/peripheral_api/routes/PrintLog.js');
    test = new SceApiTester(app);
    tools.emptySchema(PrintLog);
    done();
  });

  after(done => {
    tools.terminateServer(done);
  });

  const INVALID_PRINT_LOG = {
    numPages: 3,
  };

  const VALID_PRINT_LOG = {
    numPages: 2,
    destination: 'HP-LaserJet-p2015dn-right',
    printedDate: new Date(),
    memberName: 'Bob',
  };

  describe('/POST addPrintLog', () => {
    it('Should return 400 when required fields aren\'t filled in', async () => {
      const result = await test.sendPostRequest(
        '/api/PrintLog/addPrintLog',
        INVALID_PRINT_LOG
      );
      expect(result).to.have.status(BAD_REQUEST);
    });

    it('Should return statusCode 200 when all required ' +
    'fields are filled in', async () => {
      const result = await test.sendPostRequest(
        '/api/PrintLog/addPrintLog',
        VALID_PRINT_LOG
      );
      expect(result).to.have.status(OK);
    });
  });

  describe('/GET getPrintLogs', () => {
    it('Should return an object of all events', async () => {
      const result = await test.sendGetRequest('/api/PrintLog/getPrintLogs');
      expect(result).to.have.status(OK);
      const getEventsResponse = result.body;
      getEventsResponse.should.be.a('array');
      expect(getEventsResponse).to.have.length(1);
      expect(getEventsResponse[0].numPages).to.equal(VALID_PRINT_LOG.numPages);
      expect(getEventsResponse[0].chosenPrinter).to.equal(
        VALID_PRINT_LOG.destination
      );
      expect(getEventsResponse[0].printedDate).to.equal(
        VALID_PRINT_LOG.printedDate.toISOString()
      );
      expect(getEventsResponse[0].memberName).to.equal(
        VALID_PRINT_LOG.memberName
      );
    });
  });
});
