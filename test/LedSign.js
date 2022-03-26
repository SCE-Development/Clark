process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const {
  OK, NOT_FOUND, BAD_REQUEST, UNAUTHORIZED
} = require('../api/util/constants').STATUS_CODES;
const SceApiTester = require('./util/tools/SceApiTester');
const {
  initializeMock,
  setTokenStatus,
  resetMock,
  restoreMock,
} = require('./util/mocks/TokenValidFunctions');
let app = null;
let test = null;
const expect = chai.expect;
const tools = require('./util/tools/tools');

chai.should();
chai.use(chaiHttp);

const token = '';

describe('LED Sign', () => {
  before(done => {
    initializeMock();
    app = tools.initializeServer(
      __dirname + '/../api/peripheral_api/routes/LedSign.js');
    test = new SceApiTester(app);
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

  describe('/POST updateSignText', () => {
    it('Should return 400 when token is not sent', async () => {
      const result = await test.sendPostRequest('/api/LedSign/updateSignText');
      expect(result).to.have.status(UNAUTHORIZED);
    });

    it('Should return 400 when invalid token is sent', async () => {
      const result = await test.sendPostRequestWithToken(token,
        '/api/LedSign/updateSignText');
      expect(result).to.have.status(UNAUTHORIZED);
    });
  });
});