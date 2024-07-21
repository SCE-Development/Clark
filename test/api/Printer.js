/* global describe it before after */
process.env.NODE_ENV = 'test';

const User = require('../../api/main_endpoints/models/User');

const chai = require('chai');

const chaiHttp = require('chai-http');
const constants = require('../../api/util/constants.js');
const { OK, UNAUTHORIZED, NOT_FOUND, SERVER_ERROR, BAD_REQUEST } =
  require('../../api/util/constants').STATUS_CODES;
const sinon = require('sinon');
const SceApiTester = require('../util/tools/SceApiTester.js');
const fs = require('fs');

let app = null;
let test = null;
let sandbox = sinon.createSandbox();

const expect = chai.expect;
const tools = require('../util/tools/tools.js');
const {
  setTokenStatus,
  resetTokenMock,
  restoreTokenMock,
  initializeTokenMock,
} = require('../util/mocks/TokenValidFunctions');

chai.should();
chai.use(chaiHttp);
const SshTunnelFunctions = require('../../api/main_endpoints/util/Printer');

describe('Printer', () => {
  let healthCheckStub = null;
  let getFileAndFormDataStub = null;
  let userFindOneStub = null;
  let getPageCountStub = null;
  let fsStub = null;
  let printStub = null;
  let userUpdateOneStub = null;

  before((done) => {
    initializeTokenMock();
    healthCheckStub = sandbox.stub(SshTunnelFunctions, 'healthCheck');
    getFileAndFormDataStub = sandbox.stub(SshTunnelFunctions, 'getFileAndFormData');
    userFindOneStub = sandbox.stub(User, 'findOne');
    getPageCountStub = sandbox.stub(SshTunnelFunctions, 'getPageCount');
    fsStub = sandbox.stub(fs, 'unlink').resolves();
    printStub = sandbox.stub(SshTunnelFunctions, 'print');
    userUpdateOneStub = sandbox.stub(User, 'updateOne');
    app = tools.initializeServer(
      __dirname + '/../../api/main_endpoints/routes/Printer.js'
    );
    test = new SceApiTester(app);
    tools.emptySchema(User);
    done();
  });

  after((done) => {
    restoreTokenMock();
    if (healthCheckStub) healthCheckStub.restore();
    if (getFileAndFormDataStub) getFileAndFormDataStub.restore();
    if (userFindOneStub) userFindOneStub.restore();
    if (getPageCountStub) getPageCountStub.restore();
    if (printStub) printStub.restore();
    if (fsStub) fsStub.restore();
    if (userUpdateOneStub) userUpdateOneStub.restore();
    sandbox.restore();
    tools.terminateServer(done);
  });

  afterEach(() => {
    resetTokenMock();
  });

  // Test cases for /healthCheck endpoint
  describe('/GET healthCheck', () => {
    it('Should return 200 when printing is enabled and ssh tunnel is up ', async () => {
      healthCheckStub.resolves(true);
      const result = await test.sendGetRequest('/api/Printer/healthCheck');
      expect(result).to.have.status(OK);
    });

    it('Should return 404 when printing is enabled but ssh tunnel is down ', async () => {
      healthCheckStub.resolves(false);
      const result = await test.sendGetRequest('/api/Printer/healthCheck');
      expect(result).to.have.status(NOT_FOUND);
    });
  });


  const token = '';
  // Test cases for /sendPrintRequest endpoint
  describe('/POST sendPrintRequest', () => {
    it('Should return 401 when token is not sent ', async () => {
      const result = await test.sendPostRequest(
        '/api/Printer/sendPrintRequest'
      );
      expect(result).to.have.status(UNAUTHORIZED);
    });

    it('Should return 401 when invalid token is sent ', async () => {
      const result = await test.sendPostRequestWithToken(
        token,
        '/api/Printer/sendPrintRequest'
      );
      expect(result).to.have.status(UNAUTHORIZED);
    });

    it('Should return 400 when print request exceeds weekly limit', async () => {
      setTokenStatus(true, {email: 'print@test.com'});
      getFileAndFormDataStub.resolves({file: {path: 'temp', originalname: 'temp'}, data: 'mock-data'});
      userFindOneStub.resolves({ email: 'print@test.com', pagesPrinted: 25});
      getPageCountStub.resolves(6);
      const result = await test.sendPostRequestWithToken(
        token,
        '/api/Printer/sendPrintRequest',
        {
          copies: 1,
          sides: 'one-sided'
        }
      );
      expect(result).to.have.status(BAD_REQUEST);

    });

    it('Should return 200 when print request succeeds', async () => {
      setTokenStatus(true, {email: 'print@test.com'});
      getFileAndFormDataStub.resolves({file: {path: 'temp', originalname: 'temp'}, data: 'mock-data'});
      userFindOneStub.resolves({ email: 'print@test.com', pagesPrinted: 22});
      getPageCountStub.resolves(7);
      printStub.resolves();
      const result = await test.sendPostRequestWithToken(
        token,
        '/api/Printer/sendPrintRequest',
        {
          copies: 2,
          sides: 'two-sided'
        }
      );
      expect(result).to.have.status(OK);
      expect(userUpdateOneStub.calledWith({ email: 'print@test.com' }, { $inc: { pagesPrinted: 8 } })).to.be.true;
    });

    it('Should return 500 when print request fails', async () => {
      setTokenStatus(true, {email: 'print@test.com'});
      getFileAndFormDataStub.resolves({file: {path: 'temp', originalname: 'temp'}, data: 'mock-data'});
      userFindOneStub.resolves({ email: 'print@test.com', pagesPrinted: 25});
      getPageCountStub.resolves(5);
      printStub.rejects({});
      const result = await test.sendPostRequestWithToken(
        token,
        '/api/Printer/sendPrintRequest',
        {
          copies: 1,
          sides: 'one-sided'
        }
      );
      expect(result).to.have.status(SERVER_ERROR);
    });
  });
});
