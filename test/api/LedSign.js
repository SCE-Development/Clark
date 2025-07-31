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
const SshTunnelFunctions = require('../../api/main_endpoints/util/LedSign');
const AuditLog = require('../../api/main_endpoints/models/AuditLog');
const AuditLogActions = require('../../api/main_endpoints/util/auditLogActions');
const mongoose = require('mongoose');

let app = null;
let test = null;
let sandbox = sinon.createSandbox();
const expect = chai.expect;

chai.should();
chai.use(chaiHttp);

const token = '';


describe('LED Sign', () => {
  let updateSignStub = null;
  let healthCheckStub = null;

  before(done => {
    initializeTokenMock();
    updateSignStub = sandbox.stub(SshTunnelFunctions, 'updateSign');
    healthCheckStub = sandbox.stub(SshTunnelFunctions, 'healthCheck');
    updateSignStub.resolves(false);
    healthCheckStub.resolves(false);
    app = tools.initializeServer(
      __dirname + '/../../api/main_endpoints/routes/LedSign.js');
    test = new SceApiTester(app);
    done();
  });

  after(done => {
    restoreTokenMock();
    if (updateSignStub) updateSignStub.restore();
    if (healthCheckStub) healthCheckStub.restore();
    sandbox.restore();
    tools.terminateServer(done);
  });

  beforeEach(() => {
    setTokenStatus(false);
    updateSignStub.resolves(false);
    healthCheckStub.resolves(false);
  });

  afterEach(() => {
    resetTokenMock();
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

    it('Should return 500 when the ssh tunnel is down', async () => {
      setTokenStatus(true);
      updateSignStub.resolves(false);
      const result = await test.sendPostRequestWithToken(token,
        '/api/LedSign/updateSignText');
      expect(result).to.have.status(SERVER_ERROR);
    });

    it('Should return 200 when the ssh tunnel is up', async () => {
      setTokenStatus(true);
      updateSignStub.resolves(true);
      const result = await test.sendPostRequestWithToken(token,
        '/api/LedSign/updateSignText');
      expect(result).to.have.status(OK);
    });

    describe('tests for audit log on sign text update', () => {
      const userId = new mongoose.Types.ObjectId();

      beforeEach(async () => {
        await AuditLog.deleteMany({});

        // test user
        setTokenStatus(true, {
          _id: userId,
          email: 'admin@test.com',
          accessLevel: 'ADMIN'
        });
      });

      afterEach(async () => {
        await AuditLog.deleteMany({});
      });

      it('Should create audit log when LED sign is successfully updated', async () => {
        updateSignStub.resolves(true);

        const signData = {
          text: 'Welcome to SCE!',
          duration: 5000
        };

        const result = await test.sendPostRequestWithToken(token,
          '/api/LedSign/updateSignText', signData);

        expect(result).to.have.status(OK);

        const auditEntry = await AuditLog.findOne({
          userId: userId,
          action: AuditLogActions.UPDATE_SIGN
        }).lean();

        expect(auditEntry).to.exist;
        expect(auditEntry.action).to.equal(AuditLogActions.UPDATE_SIGN);
        expect(auditEntry.details).to.have.property('newSignText', 'Welcome to SCE!');
      });

      it('Should create audit log with user information who updated the sign', async () => {
        updateSignStub.resolves(true);

        setTokenStatus(true, {
          _id: userId,
          email: 'admin@sce.edu',
          firstName: 'Ad',
          lastName: 'Min',
          accessLevel: 'ADMIN'
        });

        const signData = {
          text: 'Updated by admin',
          duration: 4000
        };

        const result = await test.sendPostRequestWithToken(token,
          '/api/LedSign/updateSignText', signData);

        expect(result).to.have.status(OK);

        const auditEntry = await AuditLog.findOne({
          userId: userId,
          action: AuditLogActions.UPDATE_SIGN
        }).lean();

        expect(auditEntry).to.exist;
        expect(auditEntry.userId.toString()).to.equal(userId.toString());
        expect(auditEntry.details).to.have.property('editedBy', 'admin@sce.edu');
      });

    });
  });

  describe('/GET healthCheck', () => {
    it('Should return 500 when the ssh tunnel is down', async () => {
      setTokenStatus(true);
      healthCheckStub.resolves(false);
      const result = await test.sendGetRequest('/api/LedSign/healthCheck');
      expect(result).to.have.status(SERVER_ERROR);
    });

    it('Should return 200 when the ssh tunnel is up', async () => {
      setTokenStatus(true);
      healthCheckStub.resolves(true);
      const result = await test.sendGetRequest('/api/LedSign/healthCheck');
      expect(result).to.have.status(OK);
    });
  });
});
