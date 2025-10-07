/* global describe it before after beforeEach afterEach */
process.env.NODE_ENV = 'test';
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../../api/main_endpoints/models/User');
const PasswordReset = require('../../api/main_endpoints/models/PasswordReset');
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

const {decodeToken} = require('../../api/main_endpoints/util/token-functions.js');

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
const { MEMBERSHIP_STATE } = require('../../api/util/constants');

const AuditLogActions = require('../../api/main_endpoints/util/auditLogActions.js');
const AuditLog = require('../../api/main_endpoints/models/AuditLog.js');

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
    tools.emptySchema(PasswordReset);
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
    it('Should allow login with correct credentials after registering a user', async () => {
      const user = {
        email: 'logintest@gmail.com',
        password: 'ValidTestPass123!',
        firstName: 'Test',
        lastName: 'User'
      };

      try {
      // register the user first
        const registerUser = await test.sendPostRequest('/api/Auth/register', user);
        expect(registerUser).to.have.status(OK);

        // verify the email
        await User.updateOne({email: user.email}, {$set: {emailVerified: true}});

        // then try logging in with the same credentials
        const loginUser = await test.sendPostRequest('/api/Auth/login', {
          email: user.email,
          password: user.password
        });

        expect(loginUser).to.have.status(OK);
        expect(loginUser.body).to.have.property('token');

        const token = loginUser.body.token;
        expect(token).to.be.a('string');
        expect(token.startsWith('JWT ')).to.be.true;

        const mockRequest = {
          headers: {
            authorization: `Bearer ${token}`
          }
        };

        const decodedPayload = await decodeToken(mockRequest);
        const expectedPayload = {
          firstName: 'Test',
          lastName: 'User',
          email: 'logintest@gmail.com',
          accessLevel: MEMBERSHIP_STATE.PENDING,
          pagesPrinted: 0,
          _id: decodedPayload._id,
          iat: decodedPayload.iat,
          exp: decodedPayload.exp,
        };

        expect(decodedPayload).to.deep.equal(expectedPayload);
      } finally {
        await User.deleteOne({email: user.email});
      }
    });

    it('Should create an audit log entry on successful signup', async () => {
      const registerPayload = {
        email: 'newuser@example.com',
        password: 'Passw0rd123!',
        firstName: 'Testfirst',
        lastName: 'Testlast'
      };

      // ensure Audit log and User DB starts fresh before this test
      await AuditLog.deleteMany({});
      await User.deleteOne({email: registerPayload.email});

      const res = await test.sendPostRequest('/api/Auth/register', registerPayload);
      expect(res).to.have.status(OK);

      const auditEntry = await AuditLog.findOne().lean();

      expect(auditEntry).to.exist;
      expect(auditEntry).to.have.property('userId');
      expect(auditEntry.details).to.have.property('email', registerPayload.email);
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

    describe('with an existing user', () => {
      let user;

      before(async () => {
        user = new User({
          _id: new mongoose.Types.ObjectId(),
          firstName: 'Test',
          lastName: 'User',
          email: 'logintest@gmail.com',
          password: 'Passw0rd',
          emailVerified: true,
          accessLevel: MEMBERSHIP_STATE.MEMBER,
          apiKey: null
        });
        await user.save();
      });

      after(async () => {
        await User.deleteOne({ email: 'logintest@gmail.com' });
      });

      beforeEach(async () => {
        await AuditLog.deleteMany({});
      });

      afterEach(async () => {
        await AuditLog.deleteMany({});
        sinon.restore();
      });

      it('Should create an audit log entry on successful login', async () => {
        const loginPayload = {
          email: 'logintest@gmail.com',
          password: 'Passw0rd',
        };

        const res = await test.sendPostRequest('/api/Auth/login', loginPayload);
        expect(res).to.have.status(OK);
        expect(res.body).to.have.property('token');

        const auditEntry = await AuditLog.findOne({
          action: AuditLogActions.LOG_IN,
          details: {email: loginPayload.email},
        });

        expect(auditEntry).to.exist;
        expect(auditEntry).to.have.property('userId');
        expect(auditEntry.details).to.have.property('email', loginPayload.email);
      });

      it('Should return 200 even if audit logging fails', async () => {
        const auditStub = sinon.stub(AuditLog, 'create').rejects(new Error('Simulated audit log failure'));

        const loginPayload = {
          email: 'logintest@gmail.com',
          password: 'Passw0rd',
        };

        try {

          const res = await test.sendPostRequest('/api/Auth/login', loginPayload);
          expect(res).to.have.status(OK);
          expect(res.body).to.have.property('token');

          const auditEntry = await AuditLog.findOne({
            action: AuditLogActions.LOG_IN,
            'details.email': loginPayload.email,
          });

          expect(auditEntry).to.not.exist;
        } finally {
          auditStub.restore();
        }
      });
    });
  });

  describe('/POST sendPasswordReset', () => {
    it('Should return statusCode 401 if the email is invalid', async () => {
      const data = {
        email: 'notanemail',
      };
      const result = await test.sendPostRequest('/api/Auth/sendPasswordReset', data);
      expect(result).to.have.status(BAD_REQUEST);
    });

    it('Should return statusCode 200 if the email does not exist in the database', async () => {
      const data = {
        email: 'test122342423@gmail.com',
      };
      const result = await test.sendPostRequest('/api/Auth/sendPasswordReset', data);
      expect(result).to.have.status(OK);
    });

    it('Should return statusCode 200 if the email does exist in the database', async () => {
      const user = new User({
        _id: new mongoose.Types.ObjectId(),
        firstName: 'first-name',
        lastName: 'last-name',
        email: 'existing-member@gmail.com',
        password: 'Passw0rd',
        emailVerified: true,
        accessLevel: MEMBERSHIP_STATE.MEMBER,
        apiKey: null
      });
      await user.save();
      const data = {
        email: 'existing-member@gmail.com',
      };
      const result = await test.sendPostRequest('/api/Auth/sendPasswordReset', data);
      expect(result).to.have.status(OK);
    });

    it('Should return statusCode 401 if the user is banned', async () => {
      user = new User({
        _id: new mongoose.Types.ObjectId(),
        firstName: 'first-name',
        lastName: 'last-name',
        email: 'banned-member@gmail.com',
        password: 'Passw0rd',
        emailVerified: true,
        accessLevel: MEMBERSHIP_STATE.BANNED,
        apiKey: null
      });
      await user.save();
      const data = {
        email: 'banned-member@gmail.com',
      };
      const result = await test.sendPostRequest('/api/Auth/sendPasswordReset', data);
      expect(result).to.have.status(UNAUTHORIZED);
    });

    describe('Password reset email audit log tests', () => {
      beforeEach(async () => {
        await AuditLog.deleteMany({});
      });

      afterEach(async () => {
        await AuditLog.deleteMany({});
      });

      it('Should create audit log when password reset email is sent', async () => {
        const user = new User({
          _id: new mongoose.Types.ObjectId(),
          firstName: 'Test',
          lastName: 'User',
          email: 'reset-audit@test.com',
          password:'Passw0rd',
          emailVerified: true,
          accessLevel: MEMBERSHIP_STATE.MEMBER
        });
        await user.save();

        const result = await test.sendPostRequest('/api/Auth/sendPasswordReset', user);
        expect(result).to.have.status(OK);

        const auditEntry = await AuditLog.findOne({
          userId: user._id,
          action: AuditLogActions.SEND_RESET_PW_EMAIL
        });

        expect(auditEntry).to.exist;
        expect(auditEntry).to.have.property('userId');
        expect(auditEntry.userId.toString()).to.equal(user._id.toString());
        expect(auditEntry).to.have.property('action', AuditLogActions.SEND_RESET_PW_EMAIL);
        expect(auditEntry).to.have.property('details');
        expect(auditEntry.details).to.have.property('email', user.email);

        await User.deleteOne({ _id: user._id});
      });

      it('Should not create audit log when password reset email fails for non-existent user', async () => {
        const data = {
          email: 'nonexistent@test.com',
        };

        const result = await test.sendPostRequest('/api/Auth/sendPasswordReset', data);
        expect(result).to.have.status(OK); // Still returns 200 for security

        const auditEntry = await AuditLog.findOne({
          action: AuditLogActions.SEND_RESET_PW_EMAIL,
          'details.email': 'nonexistent@test.com'
        });

        expect(auditEntry).to.not.exist;
      });
    });
  });

  describe('/POST validatePasswordReset', () => {
    before(async () => {
      await new PasswordReset({
        resetToken: 'valid token',
        userId: 'valid id 321',
      }).save();
    });

    it('Should return statusCode 404 if the token is invalid', async () => {
      const data = {
        resetToken: 'invalid token'
      };
      const result = await test.sendPostRequest('/api/Auth/validatePasswordReset', data);
      expect(result).to.have.status(404);
    });

    it('Should return statusCode 200 if the token is valid', async () => {
      const data = {
        resetToken: 'valid token'
      };
      const result = await test.sendPostRequest('/api/Auth/validatePasswordReset', data);
      expect(result).to.have.status(OK);
    });
  });

  describe('/POST resetPassword', () => {
    let createdId = new mongoose.Types.ObjectId();
    let createdUser = null;

    beforeEach(async () => {
      await PasswordReset.deleteMany({});
      await User.deleteMany({});
      createdId = new mongoose.Types.ObjectId();
      await new PasswordReset({
        resetToken: 'valid token',
        userId: String(createdId),
      }).save();
      const newUser = new User({
        _id: createdId,
        email: 'abcdef123@gmail.com',
        password: 'Passw0rd',
        firstName: 'first-name',
        lastName: 'last-name',
      });
      createdUser = await newUser.save();
    });

    after(async () => {
      if (createdUser) await User.deleteOne({ _id: createdUser._id});
      await PasswordReset.deleteMany({});
    });

    it('Should return statusCode 401 if the password is too weak', async () => {
      const data = {
        password: 'weak password',
      };
      const result = await test.sendPostRequest('/api/Auth/resetPassword', data);
      expect(result).to.have.status(BAD_REQUEST);
    });

    it('Should return statusCode 404 if the password rest token is invalid', async () => {
      const data = {
        password: 'Passw0rd',
        resetToken: 'invalid token',
      };
      const result = await test.sendPostRequest('/api/Auth/resetPassword', data);
      expect(result).to.have.status(404);
    });

    it('Should return statusCode 401 if the user id hash is not matching', async () => {
      const data = {
        password: 'Passw0rd',
        resetToken: 'valid token',
        hashedId: 'invalid id',
      };
      const result = await test.sendPostRequest('/api/Auth/resetPassword', data);
      expect(result).to.have.status(BAD_REQUEST);
    });

    it('Should return statusCode 200 if the password was reset', async () => {
      const data = {
        password: 'Passw0rd',
        resetToken: 'valid token',
        hashedId: await bcrypt.hash(String(createdId), await bcrypt.genSalt(10)),
      };
      const result = await test.sendPostRequest('/api/Auth/resetPassword', data);
      expect(result).to.have.status(OK);
    });

    describe('Reset password audit log tests', async () => {
      beforeEach(async () => {
        await AuditLog.deleteMany({});
      });

      afterEach(async () => {
        await AuditLog.deleteMany({});
      });

      it('Should create audit log on successful password reset', async () => {
        const data = {
          password: 'Passw0rd',
          resetToken: 'valid token',
          hashedId: await bcrypt.hash(String(createdId), await bcrypt.genSalt(10)),
        };
        const result = await test.sendPostRequest('/api/Auth/resetPassword', data);
        expect(result).to.have.status(OK);

        const auditEntry = await AuditLog.findOne({ userId: createdUser._id, action: AuditLogActions.RESET_PW});

        expect(auditEntry).to.exist;
        expect(auditEntry).to.have.property('userId');
        expect(auditEntry.userId.toString()).to.equal(createdUser._id.toString());
        expect(auditEntry).to.have.property('action', AuditLogActions.RESET_PW);
      });
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
      setTokenStatus(true, { _id: 'some id' });
      const result = await test.sendPostRequestWithToken(
        token, '/api/Auth/verify');
      expect(result).to.have.status(OK);
    });
  });

  describe('checkIfPageCountResets()', () => {
    it('Should reset page count when the last login was over 7 days ago',
      async () => {
        // mock current day to January 10th, 2023 (Tuesday)
        const mockCurrentDate = mockDayMonthAndYear(10, 0, 2023);
        // mock last login to January 1st, 2023 (Sunday)
        const mockLastLogin = new Date(2023, 0, 1);
        const result = checkIfPageCountResets(mockLastLogin);
        expect(result).to.be.true;
      });

    it('Should reset page count when there is a Sunday between last login and now',
      async () => {
        // mock current day to January 8th, 2023 (Sunday)
        const mockCurrentDate = mockDayMonthAndYear(9, 0, 2023);
        // mock last login to January 7th, 2023 (Saturday)
        const mockLastLogin = new Date(2023, 0, 7);
        const result = checkIfPageCountResets(mockLastLogin);
        expect(result).to.be.true;
      });

    it('Should not reset page count when the last login was less than 7 days ago ' +
      'and there is no Sunday between logins', async () => {
      // mock current day to January 2nd, 2023 (Monday)
      const mockCurrentDate = mockDayMonthAndYear(2, 0, 2023);
      // mock last login to January 1st, 2023 (Sunday)
      const mockLastLogin = new Date(2023, 0, 1);
      const result = checkIfPageCountResets(mockLastLogin);
      expect(result).to.be.false;
    });

    it('Should not reset page count if today is Sunday, user has logged in once, ' +
      'and user logs in a second time', async () => {
      const mockCurrentDate = mockDayMonthAndYear(1, 0, 2023);
      const mockLastLogin = new Date(2023, 0, 1);
      const result = checkIfPageCountResets(mockLastLogin);
      expect(result).to.be.false;
    });
  });
});
