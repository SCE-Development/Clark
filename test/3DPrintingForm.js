/* global describe it before after */
// During the test the env variable is set to test
process.env.NODE_ENV = 'test';
const PrintingForm3D = require('../api/models/PrintingForm3D');
const tokenValidMocker = require('./util/mocks/TokenValidFunctions');
// Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const {
  OK,
  BAD_REQUEST,
  UNAUTHORIZED,
  FORBIDDEN,
  NOT_FOUND
} = require('../api/util/constants').STATUS_CODES;
const SceApiTester = require('../test/util/tools/SceApiTester');

let app = null;
let test = null;
const expect = chai.expect;
// tools for testing
const tools = require('./util/tools/tools.js');
const {
  setTokenStatus,
  resetMock,
  restoreMock,
  initializeMock
} = require('./util/mocks/TokenValidFunctions');

chai.should();
chai.use(chaiHttp);

// Our parent block
describe('3DPrintingForm', () => {
  before(done => {
    initializeMock();
    app = tools.initializeServer(
      __dirname + '/../api/routes/3DPrintingForm.js');
    test = new SceApiTester(app);
    tools.emptySchema(PrintingForm3D);
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

  const token = 'token';
  let date = 0;

  describe('/POST submit', () => {
    it('Should return statusCode 400 when the ' +
       'required fields are not set', async () => {
      const form = {};
      const result = await test.sendPostRequest(
        '/api/3DPrintingForm/submit', form);
      expect(result).to.have.status(BAD_REQUEST);
    });
    it('Should return statusCode 200 when all ' +
       'required fields are filled in', async () => {
      const form = {
        name: 'pinkUnicorn',
        color: 'Rainbow',
        contact: 'b@b.c',
        email: 'b@b.c'
      };
      const result = await test.sendPostRequest(
        '/api/3DPrintingForm/submit', form);
      expect(result).to.have.status(OK);
    });
  });

  describe('/POST GetForm', () => {
    it('Should return an object of all forms', async () => {
      const form = { email: 'b@b.c' };
      const result = await test.sendPostRequest(
        '/api/3DPrintingForm/GetForm', form);
      expect(result).to.have.status(OK);
      result.body.should.be.a('array');
      date = result.body[0].date;
    });
  });
  describe('/POST edit', () => {
    it('Should return statusCode 403 if no token is passed in', async () => {
      const form = {
        name: 'pinkUnicorn'
      };
      const result = await test.sendPostRequest(
        '/api/3DPrintingForm/edit', form);
      expect(result).to.have.status(FORBIDDEN);
    });
    it('Should return statusCode 401 if an invalid ' +
       'token was passed in', async () => {
      const form = {
        name: 'pinkUnicorn',
        token: 'Invalid token',
        email: 'b@b.c'
      };
      const result = await test.sendPostRequest(
        '/api/3DPrintingForm/edit', form);
      expect(result).to.have.status(UNAUTHORIZED);
    });

    it('Should return statusCode 404 if no form was found', async () => {
      const form = {
        name: 'invalid-name',
        token: token,
        email: 'b@b.c'
      };
      setTokenStatus(true);
      const result = await test.sendPostRequest(
        '/api/3DPrintingForm/edit', form);
      expect(result).to.have.status(NOT_FOUND);
    });
    it('Should return statusCode 200 and a message ' +
       'if a form was edited', async () => {
      const form = {
        name: 'pinkUnicorn',
        color: 'something else',
        token: token,
        email: 'b@b.c',
        date: date
      };
      setTokenStatus(true);
      const result = await test.sendPostRequest(
        '/api/3DPrintingForm/edit', form);
      expect(result).to.have.status(OK);
    });
  });

  describe('/POST delete', () => {
    it('Should return statusCode 403 if no token is passed in', async () => {
      const form = {
        name: 'invalid-name',
        color: 'invalid-color',
        email: 'b@b.c'
      };
      const result = await test.sendPostRequest(
        '/api/3DPrintingForm/delete', form);
      expect(result).to.have.status(FORBIDDEN);
    });
    it('Should return statusCode 401 if an invalid ' +
       'token was passed in', async () => {
      const form = {
        name: 'invalid-name',
        color: 'invalid-color',
        token: 'Invalid token',
        email: 'b@b.c'
      };
      const result = await test.sendPostRequest(
        '/api/3DPrintingForm/delete', form);
      expect(result).to.have.status(UNAUTHORIZED);
    });

    it('Should return statusCode 404 if no form was found', async () => {
      const form = {
        name: 'invalid-name',
        color: 'invalid-color',
        token: token,
        email: 'b@b.c'
      };
      setTokenStatus(true);
      const result = await test.sendPostRequest(
        '/api/3DPrintingForm/delete', form);
      expect(result).to.have.status(NOT_FOUND);
    });

    it('Should return statusCode 200 and a message ' +
       'if a form was deleted', async () => {
      const form = {
        name: 'pinkUnicorn',
        color: 'NeonGhost',
        token: token,
        email: 'b@b.c',
        date: date
      };
      setTokenStatus(true);
      const result = await test.sendPostRequest(
        '/api/3DPrintingForm/delete', form);
      expect(result).to.have.status(OK);
    });
  });
});
