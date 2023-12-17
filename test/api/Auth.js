/* global describe it before after beforeEach afterEach */
process.env.NODE_ENV = 'test';
const User = require('../../api/main_endpoints/models/User');
const EmailHelpers = require('../../api/main_endpoints/util/emailHelpers');
// Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const {
  OK,
  BAD_REQUEST,
  UNAUTHORIZED,
  CONFLICT
} = require('../../api/util/constants').STATUS_CODES;
const SceApiTester = require('../util/tools/SceApiTester');

let app = null;
let test = null;
let sandbox = sinon.createSandbox();
const expect = chai.expect;
// tools for testing
const tools = require('../util/tools/tools.js');
const {
  setTokenStatus,
  resetTokenMock,
  restoreTokenMock,
  initializeTokenMock
} = require('../util/mocks/TokenValidFunctions');
const { checkIfPageCountResets } = require('../../api/main_endpoints/util/userHelpers.js');
const { mockDayMonthAndYear, revertClock } = require('../util/mocks/Date.js');

chai.should();
chai.use(chaiHttp);

// Our parent block
describe('Auth', () => {
  let sendVerificationEmailStub = null;
  before(done => {
    sendVerificationEmailStub = sandbox.stub(
      EmailHelpers,
      'sendVerificationEmail',
    );
    initializeTokenMock();
    app = tools.initializeServer(__dirname +
      '/../../api/main_endpoints/routes/Auth.js');
    test = new SceApiTester(app);
    // Before each test we empty the database
    tools.emptySchema(User);
    done();
  });

  after(done => {
    if(sendVerificationEmailStub) sendVerificationEmailStub.restore();
    restoreTokenMock();
    tools.terminateServer(done);
  });

  beforeEach(() => {
    if(sendVerificationEmailStub) sendVerificationEmailStub.reset();
    setTokenStatus(false);
  });

  afterEach(() => {
    resetTokenMock();
    revertClock();
  });

  const token = '';

  describe('/POST register', () => {
    it('Should successfully register a user with email, ' +
      'password, firstname and lastname', async () => {
      const user = {
        email: 'a@b.c',
        password: 'Passw0rd',
        firstName: 'first-name',
        lastName: 'last-name'
      };
      const result = await test.sendPostRequest(
        '/api/Auth/register', user);
      expect(result).to.have.status(OK);
    });

    it('Should not allow a second registration with the same ' +
      'email as a user in the database', async () => {
      const user = {
        email: 'a@b.c',
        password: 'Passw0rd',
        firstName: 'first-name',
        lastName: 'last-name'
      };
      const result = await test.sendPostRequest(
        '/api/Auth/register', user);
      expect(sendVerificationEmailStub.called).to.be.false;
      expect(result).to.have.status(CONFLICT);
    });
    it('Should not allow registration with a password without' +
      'a number', async () => {
      const user = {
        email: 'd@e.f',
        password: 'Password',
        firstName: 'first-name',
        lastName: 'last-name'
      };
      const result = await test.sendPostRequest(
        '/api/Auth/register', user);
      expect(sendVerificationEmailStub.called).to.be.false;
      expect(result).to.have.status(BAD_REQUEST);
    });

    it('Should not allow registration with a password without ' +
      'an uppercase character', async () => {
      const user = {
        email: 'd@e.f',
        password: 'password1',
        firstName: 'first-name',
        lastName: 'last-name'
      };
      const result = await test.sendPostRequest(
        '/api/Auth/register', user);
      expect(sendVerificationEmailStub.called).to.be.false;
      expect(result).to.have.status(BAD_REQUEST);
    });
    it('Should send a verification email after user signs up', async () => {
      const user = {
        email: 'x1@y.z',
        password: 'Passw00rd',
        firstName: 'first-name',
        lastName: 'last-name'
      };
      const result = await test.sendPostRequest(
        '/api/Auth/register', user);
      expect(sendVerificationEmailStub.called).to.be.true;
      const verificationArgs = sendVerificationEmailStub.getCall(-1).args;
      expect(verificationArgs).to.eql([user.firstName + ' ' + user.lastName, user.email]);
      expect(result).to.have.status(OK);
    });
  });

  describe('/POST login', () => {
    it('Should return statusCode 400 if an email and/or ' +
      'password is not provided', async () => {
      const user = {};
      const result = await test.sendPostRequest(
        '/api/Auth/login', user);
      expect(result).to.have.status(BAD_REQUEST);
    });

    it('Should return statusCode 401 if an email/pass combo ' +
      'does not match a record in the DB', async () => {
      const user = {
        email: 'nota@b.c',
        password: 'Passwd'
      };
      const result = await test.sendPostRequest(
        '/api/Auth/login', user);
      expect(result).to.have.status(UNAUTHORIZED);
    });

    it('Should return statusCode 401 if the email exists ' +
      'but password is incorrect', async () => {
      const user = {
        email: 'a@b.c',
        password: 'password'
      };
      const result = await test.sendPostRequest(
        '/api/Auth/login', user);
      expect(result).to.have.status(UNAUTHORIZED);
    });
  });

  describe('/POST verify', () => {
    it('Should return statusCode 401 when a token is not passed in',
      async () => {
        const result = await test.sendPostRequest('/api/Auth/verify', {});
        expect(result).to.have.status(UNAUTHORIZED);
      });

    it('Should return statusCode 401 when a token is invalid',
      async () => {
        const result = await test.sendPostRequestWithToken(
          token, '/api/Auth/verify', {});
        expect(result).to.have.status(UNAUTHORIZED);
      });

    it('Should return statusCode 200 when a ' +
      'token is passed in', async () => {
      setTokenStatus(true);
      const result = await test.sendPostRequestWithToken(
        token, '/api/Auth/verify', {});
      expect(result).to.have.status(OK);
    });
  });

  describe('checkIfPageCountResets()', () => {
    it('Should reset user\'s page count when last login was over 7 days ago',
      async () => {
        // mock current day to January 10th, 2023 (Tuesday)
        const mockCurrentDate = mockDayMonthAndYear(10, 0, 2023);
        // mock last login to January 1st, 2023 (Sunday)
        const mockLastLogin = new Date(2023, 0, 1);
        const result = checkIfPageCountResets(mockLastLogin);
        expect(result).to.be.true;
      });

    it('Should reset user\'s page count when there\s a Sunday between last login and now',
      async () => {
        // mock current day to January 8th, 2023 (Sunday)
        const mockCurrentDate = mockDayMonthAndYear(9, 0, 2023);
        // mock last login to January 7th, 2023 (Saturday)
        const mockLastLogin = new Date(2023, 0, 7);
        const result = checkIfPageCountResets(mockLastLogin);
        expect(result).to.be.true;
      });

    it('Should not reset user\'s page count when last login was less than 7 days ago ' +
      'and there isn\'t a Sunday between logins', async () => {
      // mock current day to January 2nd, 2023 (Monday)
      const mockCurrentDate = mockDayMonthAndYear(2, 0, 2023);
      // mock last login to January 1st, 2023 (Sunday)
      const mockLastLogin = new Date(2023, 0, 1);
      const result = checkIfPageCountResets(mockLastLogin);
      expect(result).to.be.false;
    });

    it('Should not reset user\'s page count if today is Sunday, user has logged in once, ' +
      'and user logs in a second time', async () => {
      const mockCurrentDate = mockDayMonthAndYear(1, 0, 2023);
      const mockLastLogin = new Date(2023, 0, 1);
      const result = checkIfPageCountResets(mockLastLogin);
      expect(result).to.be.false;
    });
  });

});
