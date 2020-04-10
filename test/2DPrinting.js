/* global describe it before after afterEach */
// During the test the env variable is set to test
process.env.NODE_ENV = 'test';
// Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const constants = require('../api/constants');
const { OK, BAD_REQUEST } = constants.STATUS_CODES;
const tools = require('./util/tools/tools.js');
const PrintFunctions =
require('../api/printingRPC/client/printing/print_client');
const sinon = require('sinon');
const SceApiTester = require('../test/util/tools/SceApiTester');

let app = null;
let test = null;
const expect = chai.expect;

chai.should();
chai.use(chaiHttp);
const SUCCESS_MESSAGE = 'success';
const ERROR_MESSAGE = 'error';
const TEXT_REQUEST = {
  raw: '',
  copies: 1,
  pageRanges: 'NA',
  sides: 'one-sided',
  destination: 'HP-LaserJet-p2015dn'
};
const INVALID_REQUEST = {copies: 1};

describe('2DPrinting', () => {
  const sendPrintRequestMock = sinon.stub(PrintFunctions, 'sendPrintRequest');

  before(done => {
    app = tools.initializeServer(__dirname + '/../api/routes/print.js');
    test = new SceApiTester(app);
    done();
  });

  after(done => {
    sendPrintRequestMock.restore();
    tools.terminateServer(done);
  });

  afterEach(() => {
    sendPrintRequestMock.reset();
  });

  describe('/POST submit', () => {
    it('Should return statuscode 200 when it prints', async () => {
      sendPrintRequestMock.resolves(SUCCESS_MESSAGE);
      const result = await test.sendPostRequest(
        '/api/print/submit', TEXT_REQUEST);
      expect(result).to.have.status(OK);
    });
    it('Should return statuscode 400 when there is an error', async () => {
      sendPrintRequestMock.rejects(ERROR_MESSAGE);
      const result = await test.sendPostRequest(
        '/api/print/submit', INVALID_REQUEST);
      expect(result).to.have.status(BAD_REQUEST);
    });
  });
});
