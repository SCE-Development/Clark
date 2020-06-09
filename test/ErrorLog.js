/* global describe it before after */
// During the test the env variable is set to test
process.env.NODE_ENV = 'test';
const ErrorLog = require('../api/models/ErrorLog');
const chai = require('chai');
const chaiHttp = require('chai-http');
const constants = require('../api/constants');
const { OK, BAD_REQUEST } = constants.STATUS_CODES;
const SceApiTester = require('../test/util/tools/SceApiTester');

let app = null;
let test = null;
const expect = chai.expect;
const tools = require('./util/tools/tools.js');
chai.should();
chai.use(chaiHttp);

describe('ErrorLog', () => {
  before(done => {
    app = tools.initializeServer(__dirname + '/../api/routes/ErrorLog.js');
    test = new SceApiTester(app);
    tools.emptySchema(ErrorLog);
    done();
  });

  after(done => {
    tools.terminateServer(done);
  });

  const INVALID_ERROR_LOG = {
    userEmail: 'fun@gmail.com'
  };

  const VALID_ERROR_LOG = {
    userEmail: 'fun@gmail.com',
    errorTime: new Date('01/01/2001'),
    apiEndpoint: 'san francisco',
    errorDescription: 'sce is cold'
  };

  describe('/POST addErrorLog', () => {
    it('Should return 400 when required fields are not filled in ',
      async () => {
        const result = await test.sendPostRequest(
          '/api/ErrorLog/addErrorLog', INVALID_ERROR_LOG);
        expect(result).to.have.status(BAD_REQUEST);
      });
    it('Should return statusCode 200 when all required ' +
      'fields are filled in ', async () => {
      const result = await test.sendPostRequest(
        '/api/ErrorLog/addErrorLog', VALID_ERROR_LOG);
      expect(result).to.have.status(OK);
    });
  });
  describe('/GET getErrorLogs', () => {
    it('Should return an object of all events', async () => {
      const result = await test.sendGetRequest(
        '/api/ErrorLog/getErrorLogs');
      expect(result).to.have.status(OK);
      const getEventsResponse = result.body;
      getEventsResponse.should.be.a('array');
      expect(getEventsResponse).to.have.length(1);
      expect(getEventsResponse[0].userEmail).to.equal(
        VALID_ERROR_LOG.userEmail
      );
      expect(getEventsResponse[0].errorTime).to.equal(
        VALID_ERROR_LOG.errorTime.toISOString()
      );
      expect(getEventsResponse[0].apiEndpoint).to.equal(
        VALID_ERROR_LOG.apiEndpoint
      );
      expect(getEventsResponse[0].errorDescription).to.equal(
        VALID_ERROR_LOG.errorDescription
      );
    });
  });
});
