process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const constants = require('../api/constants');
const { OK, BAD_REQUEST } = constants.STATUS_CODES;
const tools = require('./util/tools/tools.js');
const send3dPrintRequest =
  require('../api/printingRPC/client/printing_3d/print_3d_client');
const sinon = require('sinon');
const SceApiTester = require('./util/tools/SceApiTester');

let app = null;
let test = null;
const expect = chai.expect;

chai.should();
chai.use(chaiHttp);
const SUCCESS_MESSAGE = 'success';
const ERROR_MESSAGE = 'error';
const TEXT_REQUEST = {
  raw: '',
  name: 'cool guy evan',
  volume: 1,
  copies: 1
};
const INVALID_REQUEST = {copies: 1};

describe('3DPrinting', () => {
  const send3DPrintRequestMock = sinon
    .stub(send3dPrintRequest, 'send3dPrintRequest');

  before(done => {
    app = tools.initializeServer(__dirname + '/../api/routes/3DPrinter.js');
    test = new SceApiTester(app);
    done();
  });

  after(done => {
    send3DPrintRequestMock.restore();
    tools.terminateServer(done);
  });

  afterEach(() => {
    send3DPrintRequestMock.reset();
  });

  describe('/POST submit3D', () => {
    it('Should return statuscode 200 when request is completed', async () => {
      send3DPrintRequestMock.resolves(SUCCESS_MESSAGE);
      const result = await test.sendPostRequest(
        '/api/3DPrinter/submit3D', TEXT_REQUEST);
      expect(result).to.have.status(OK);
    });
    it('Should return statuscode 400 if the RPC fails', async () => {
      send3DPrintRequestMock.rejects(ERROR_MESSAGE);
      const result = await test.sendPostRequest(
        '/api/3DPrinter/submit3D', INVALID_REQUEST);
      expect(result).to.have.status(BAD_REQUEST);
    });
  });
});
