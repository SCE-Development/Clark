process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const tools = require('../util/tools/tools');
const SceApiTester = require('../util/tools/SceApiTester');
const {
  OK,
  SERVER_ERROR,
  UNAUTHORIZED,
} = require('../../api/util/constants').STATUS_CODES;
const {
  initializeTokenMock,
  setTokenStatus,
  resetTokenMock,
  restoreTokenMock,
} = require('../util/mocks/TokenValidFunctions');
const SshTunnelFunctions = require('../../api/peripheral_api/util/Speaker.js');


let app = null;
let test = null;
let sandbox = sinon.createSandbox();
const expect = chai.expect;

chai.should();
chai.use(chaiHttp);

const token = '';


describe('Speaker', () => {
  let sendSpeakerRequestStub = null;

  before(done => {
    initializeTokenMock();
    sendSpeakerRequestStub = sandbox.stub(SshTunnelFunctions, 'sendSpeakerRequest');

    app = tools.initializeServer(
      __dirname + '/../../api/peripheral_api/routes/Speaker.js');
    test = new SceApiTester(app);
    done();
  });

  after(done => {
    restoreTokenMock();
    if (sendSpeakerRequestStub) sendSpeakerRequestStub.restore();
    sandbox.restore();
    tools.terminateServer(done);
  });

  beforeEach(() => {
    setTokenStatus(false);
  });

  afterEach(() => {
    resetTokenMock();
  });

  describe('/POST stream', () => {
    it('Should return 400 when token is not sent', async () => {
      const result = await test.sendPostRequest('/api/Speaker/stream');
      expect(result).to.have.status(UNAUTHORIZED);
    });

    it('Should return 400 when invalid token is sent', async () => {
      const result = await test.sendPostRequestWithToken(token,
        '/api/Speaker/stream');
      expect(result).to.have.status(UNAUTHORIZED);
    });

    it('Should return 500 when the ssh tunnel is down', async () => {
      setTokenStatus(true);
      sendSpeakerRequestStub.resolves(false);
      const result = await test.sendPostRequestWithToken(token,
        '/api/Speaker/stream');
      expect(result).to.have.status(SERVER_ERROR);
    });

    it('Should return 200 when the ssh tunnel is up', async () => {
      setTokenStatus(true);
      sendSpeakerRequestStub.resolves(true);
      const result = await test.sendPostRequestWithToken(token,
        '/api/Speaker/stream');
      expect(result).to.have.status(OK);
    });
  });

  describe('/POST pause', () => {
    it('Should return 400 when token is not sent', async () => {
      const result = await test.sendPostRequest('/api/Speaker/pause');
      expect(result).to.have.status(UNAUTHORIZED);
    });

    it('Should return 400 when invalid token is sent', async () => {
      const result = await test.sendPostRequestWithToken(token,
        '/api/Speaker/pause');
      expect(result).to.have.status(UNAUTHORIZED);
    });

    it('Should return 500 when the ssh tunnel is down', async () => {
      setTokenStatus(true);
      sendSpeakerRequestStub.resolves(false);
      const result = await test.sendPostRequestWithToken(token,
        '/api/Speaker/pause');
      expect(result).to.have.status(SERVER_ERROR);
    });

    it('Should return 200 when the ssh tunnel is up', async () => {
      setTokenStatus(true);
      sendSpeakerRequestStub.resolves(true);
      const result = await test.sendPostRequestWithToken(token,
        '/api/Speaker/pause');
      expect(result).to.have.status(OK);
    });
  });

  describe('/POST skip', () => {
    it('Should return 400 when token is not sent', async () => {
      const result = await test.sendPostRequest('/api/Speaker/skip');
      expect(result).to.have.status(UNAUTHORIZED);
    });

    it('Should return 400 when invalid token is sent', async () => {
      const result = await test.sendPostRequestWithToken(token,
        '/api/Speaker/skip');
      expect(result).to.have.status(UNAUTHORIZED);
    });

    it('Should return 500 when the ssh tunnel is down', async () => {
      setTokenStatus(true);
      sendSpeakerRequestStub.resolves(false);
      const result = await test.sendPostRequestWithToken(token,
        '/api/Speaker/skip');
      expect(result).to.have.status(SERVER_ERROR);
    });

    it('Should return 200 when the ssh tunnel is up', async () => {
      setTokenStatus(true);
      sendSpeakerRequestStub.resolves(true);
      const result = await test.sendPostRequestWithToken(token,
        '/api/Speaker/skip');
      expect(result).to.have.status(OK);
    });
  });

  describe('/POST resume', () => {
    it('Should return 400 when token is not sent', async () => {
      const result = await test.sendPostRequest('/api/Speaker/resume');
      expect(result).to.have.status(UNAUTHORIZED);
    });

    it('Should return 400 when invalid token is sent', async () => {
      const result = await test.sendPostRequestWithToken(token,
        '/api/Speaker/resume');
      expect(result).to.have.status(UNAUTHORIZED);
    });

    it('Should return 500 when the ssh tunnel is down', async () => {
      setTokenStatus(true);
      sendSpeakerRequestStub.resolves(false);
      const result = await test.sendPostRequestWithToken(token,
        '/api/Speaker/resume');
      expect(result).to.have.status(SERVER_ERROR);
    });

    it('Should return 200 when the ssh tunnel is up', async () => {
      setTokenStatus(true);
      sendSpeakerRequestStub.resolves(true);
      const result = await test.sendPostRequestWithToken(token,
        '/api/Speaker/resume');
      expect(result).to.have.status(OK);
    });
  });
});
