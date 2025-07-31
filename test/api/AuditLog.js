process.env.NODE_ENV = 'test';

const User = require('../../api/main_endpoints/models/User.js');
const AuditLog = require('../../api/main_endpoints/models/AuditLog.js');

const chai = require('chai');

const chaiHttp = require('chai-http');
const sinon = require('sinon');
const {
  OK,
  BAD_REQUEST,
  UNAUTHORIZED,
  FORBIDDEN,
  NOT_FOUND,
  CONFLICT,
  SERVER_ERROR,
} = require('../../api/util/constants.js').STATUS_CODES;
const SceApiTester = require('../util/tools/SceApiTester.js');

let app = null;
let test = null;
let sandbox = sinon.createSandbox();
const expect = chai.expect;
const tools = require('../util/tools/tools.js');
const {
  setTokenStatus,
  resetTokenMock,
  restoreTokenMock,
  initializeTokenMock
} = require('../util/mocks/TokenValidFunctions.js');
const {
  setDiscordAPIStatus,
  resetDiscordAPIMock,
  restoreDiscordAPIMock,
  initializeDiscordAPIMock
} = require('../util/mocks/DiscordApiFunction.js');
const { MEMBERSHIP_STATE } = require('../../api/util/constants.js');
const { getMemberExpirationDate } = require('../../api/main_endpoints/util/userHelpers.js');
const AuditLogActions = require('../../api/main_endpoints/util/auditLogActions.js');

chai.should();
chai.use(chaiHttp);

describe('AuditLog', () => {
  before(done => {
    initializeTokenMock();
    initializeDiscordAPIMock();
    app = tools.initializeServer([
      __dirname + '/../../api/main_endpoints/routes/AuditLog.js'
    ]);
    test = new SceApiTester(app);

    tools.emptySchema(User);
    tools.emptySchema(AuditLog);
    const testUser = new User({
      email: 'audit@b.c',
      password: 'Passw0rd',
      firstName: 'firstName',
      lastName: 'lastName',
      major: 'Software Engineering',
    });
    testUser.save();
    const testLog = new AuditLog({
      userId: testUser._id,
      action: AuditLogActions.LOG_IN,
      documentId: testUser._id,
      details: {email: testUser.email },
    });
    testLog.save();
    done();
  });

  after(done => {
    resetTokenMock();
    restoreDiscordAPIMock();
    tools.terminateServer(done);
  });

  beforeEach(() => {
    setTokenStatus(false);
    setDiscordAPIStatus(false);
  });

  afterEach(async () => {
    restoreTokenMock();
    resetTokenMock();
    restoreDiscordAPIMock();
    resetDiscordAPIMock();
  });

  const token = '';

  describe('GET /getAuditLogs', () => {
    const url = '/api/AuditLog/getAuditLogs/';

    it('Should return status code 401 if no token is passed through', async () => {
      setTokenStatus(false);
      const result = await test.sendGetRequest(url);
      expect(result).to.have.status(UNAUTHORIZED);
    });

    it('Should return status code 401 if access level is invalid', async () => {
      setTokenStatus(false, { accessLevel: MEMBERSHIP_STATE.MEMBER });
      const result = await test.sendGetRequestWithToken(token, url);
      expect(result).to.have.status(UNAUTHORIZED);
    });

    describe('When token and access level is valid - status code 200', () => {
      beforeEach(() => {
        setTokenStatus(true, { accessLevel: MEMBERSHIP_STATE.OFFICER });
      });

      before(async () => {
        const newUser = new User({
          email: 'auditLog@b.c',
          password: 'Passw0rd',
          firstName: 'first name',
          lastName: 'last name',
          major: 'Software Engineering',
        });
        newUser.save();

        for (let i = 0; i < 3; i++) {
          await AuditLog.create({
            userId: newUser._id,
            action: AuditLogActions.RESET_PW,
            documentId: newUser._id,
            details: {email: newUser.email },
          });
        }

        for (let i = 0; i < 60; i++) {
          await AuditLog.create({
            userId: newUser._id,
            action: AuditLogActions.EMAIL_SENT,
            documentId: newUser._id,
            details: {email: newUser.email },
          });
        }
      });

      it('Should return at most 50 records when query is empty', async () => {
        const result = await test.sendGetRequestWithToken(token, url);
        expect(result.body.items).that.is.an('array');
        expect(result.body.items.length).at.most(50);
      });

      it('Should return the testUser when query is "audit@b.c"', async () => {
        const search = 'audit@b.c';
        const fullUrl = `/api/AuditLog/getAuditLogs?search=${encodeURIComponent(search)}`;
        const result = await test.sendGetRequestWithToken(token, fullUrl);
        expect(result.body.items).that.is.an('array').to.have.lengthOf(1);
        expect(result.body.items[0].userId.email).to.eql('audit@b.c');
      });

      it('Should return an empty array when the query matches no record: "randome@e.f"', async () => {
        const search = 'randome@e.f';
        const fullUrl = `/api/AuditLog/getAuditLogs?search=${encodeURIComponent(search)}`;
        const result = await test.sendGetRequestWithToken(token, fullUrl);
        expect(result.body.items).that.is.an('array').that.is.empty;
      });

      after(async () => {
        await User.deleteMany({});
        await AuditLog.deleteMany({});
      });
    });
  });
});
