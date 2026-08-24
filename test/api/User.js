/* global describe it before after beforeEach afterEach */
// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

const User = require('../../api/main_endpoints/models/User.js');

// Require the dev-dependencies
const chai = require('chai');
const mongoose = require('mongoose');
let id = new mongoose.Types.ObjectId();

const chaiHttp = require('chai-http');
const {
  OK,
  UNAUTHORIZED,
  NOT_FOUND,
  FORBIDDEN,
  BAD_REQUEST
} = require('../../api/util/constants').STATUS_CODES;
const sinon = require('sinon');
const SceApiTester = require('../util/tools/SceApiTester');
const {mockDayMonthAndYear, revertClock} = require('../util/mocks/Date.js');

const AuditLog = require('../../api/main_endpoints/models/AuditLog.js');
const AuditLogActions = require('../../api/main_endpoints/util/auditLogActions.js');

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
} = require('../util/mocks/TokenValidFunctions');

const { MEMBERSHIP_STATE } = require('../../api/util/constants');
const { getMemberExpirationDate } = require('../../api/main_endpoints/util/userHelpers.js');

chai.should();
chai.use(chaiHttp);

// Our parent block
describe('User', () => {
  before(done => {
    initializeTokenMock();
    app = tools.initializeServer([
      __dirname + '/../../api/main_endpoints/routes/User.js',
      __dirname + '/../../api/main_endpoints/routes/Auth.js'
    ]);
    test = new SceApiTester(app);
    // Before each test we empty the database
    tools.emptySchema(User);
    const testUser = new User({
      email: 'a@b.c',
      password: 'Passw0rd',
      firstName: 'first-name',
      lastName: 'last-name',
      major: 'Computer Science',
    });
    testUser.save();
    done();
  });

  after(done => {
    restoreTokenMock();
    tools.terminateServer(done);
  });

  beforeEach(() => {
    setTokenStatus(false);
  });

  afterEach(() => {
    resetTokenMock();
  });

  const token = '';

  describe('/POST search', () => {
    it('Should return statusCode 401 if no token is passed in', async () => {
      const user = {
        email: 'a@b.c'
      };
      const result = await test.sendPostRequest(
        '/api/User/users', user);
      expect(result).to.have.status(UNAUTHORIZED);
    });

    it('Should return statusCode 403 if an invalid ' +
      'token was passed in', async () => {
      const user = {
        token: 'Invalid token'
      };
      setTokenStatus(null);
      const result = await test.sendPostRequestWithToken(
        token, '/api/User/users', user);
      expect(result).to.have.status(FORBIDDEN);
    });

    it('Should return statusCode 200 and return an array ' +
      'of all objects in collection', async () => {
      const form = {
        token: token
      };
      setTokenStatus(true);
      const result = await test.sendPostRequestWithToken(
        token, '/api/User/users', form);
      id = result.body.items[0]._id;
      expect(result).to.have.status(OK);
    });
  });

  describe('/POST searchFor', () => {
    it('Should return statusCode 401 if no token is passed in', async () => {
      const user = {
        email: 'a@b.c'
      };
      const result = await test.sendPostRequest(
        '/api/User/search', user);
      expect(result).to.have.status(UNAUTHORIZED);
    });

    it('Should return statusCode 403 if an invalid ' +
      'token was passed in', async () => {
      const user = {
        email: 'a@b.c',
        token: 'Invalid token'
      };
      setTokenStatus(null);
      const result = await test.sendPostRequestWithToken(
        token, '/api/User/search', user);
      expect(result).to.have.status(FORBIDDEN);
    });

    it('Should return statusCode 404 if no user was found', async () => {
      const user = {
        email: 'invalid@b.c',
        token: token
      };
      setTokenStatus(true);
      const result = await test.sendPostRequestWithToken(
        token, '/api/User/search', user);
      expect(result).to.have.status(NOT_FOUND);
    });

    it('Should return statusCode 200 and a user if ' +
      'the query was found', async () => {
      const user = {
        email: 'a@b.c',
        token: token
      };
      setTokenStatus(true);
      const result = await test.sendPostRequestWithToken(
        token, '/api/User/search', user);
      expect(result).to.have.status(OK);
      result.body.should.be.a('object');
      result.body.should.have.property('firstName');
      result.body.should.have.property('lastName');
      result.body.should.have.property('email');
      result.body.should.have.property('emailVerified');
      result.body.should.have.property('emailOptIn');
      result.body.should.have.property('accessLevel');
      result.body.should.have.property('major');
      result.body.should.have.property('joinDate');
      result.body.should.have.property('lastLogin');
      result.body.should.have.property('discordID');
    });
  });

  describe('/POST admins/validate', () => {
    it('Should return statusCode 401 if no token is passed in', async () => {
      const result = await test.sendPostRequest(
        '/api/User/admins/validate', { ids: [] });
      expect(result).to.have.status(UNAUTHORIZED);
    });

    it('Should return statusCode 403 if an invalid token was passed in', async () => {
      setTokenStatus(null);
      const result = await test.sendPostRequestWithToken(
        token, '/api/User/admins/validate', { ids: [] });
      expect(result).to.have.status(FORBIDDEN);
    });

    it('Should return statusCode 400 if ids is not an array', async () => {
      setTokenStatus(true, { accessLevel: MEMBERSHIP_STATE.ADMIN });
      const result = await test.sendPostRequestWithToken(
        token, '/api/User/admins/validate', { ids: 'not-array' });
      expect(result).to.have.status(BAD_REQUEST);
    });

    it('Should return valid admin users and invalid ids', async () => {
      await User.deleteMany({});

      const admin = await new User({
        email: 'admin@sce.dev',
        password: 'Passw0rd',
        firstName: 'Ada',
        lastName: 'Admin',
        major: 'Computer Science',
        accessLevel: MEMBERSHIP_STATE.ADMIN,
      }).save();
      const officer = await new User({
        email: 'officer@sce.dev',
        password: 'Passw0rd',
        firstName: 'Ollie',
        lastName: 'Officer',
        major: 'Computer Science',
        accessLevel: MEMBERSHIP_STATE.OFFICER,
      }).save();
      const missingId = new mongoose.Types.ObjectId().toString();

      setTokenStatus(true, { accessLevel: MEMBERSHIP_STATE.ADMIN });
      const result = await test.sendPostRequestWithToken(
        token,
        '/api/User/admins/validate',
        {
          ids: [
            admin._id.toString(),
            officer._id.toString(),
            missingId,
            'not-object-id',
            admin._id.toString()
          ]
        }
      );

      expect(result).to.have.status(OK);
      expect(result.body.validAdmins).to.have.length(2);
      expect(result.body.validAdmins).to.deep.include.members([
        {
          _id: admin._id.toString(),
          firstName: 'Ada',
          lastName: 'Admin',
          email: 'admin@sce.dev',
          accessLevel: MEMBERSHIP_STATE.ADMIN
        },
        {
          _id: officer._id.toString(),
          firstName: 'Ollie',
          lastName: 'Officer',
          email: 'officer@sce.dev',
          accessLevel: MEMBERSHIP_STATE.OFFICER
        }
      ]);
      expect(result.body.invalidIds).to.have.members([
        missingId,
        'not-object-id'
      ]);
    });
  });

  describe('/POST edit', () => {
    it('Should return statusCode 401 if no token is passed in', async () => {
      const user = {
        _id: id,
      };
      const result = await test.sendPostRequest(
        '/api/User/edit', user);
      expect(result).to.have.status(UNAUTHORIZED);
    });

    it('Should return statusCode 403 if an invalid ' +
      'token was passed in', async () => {
      const user = {
        email: 'a@b.c',
        token: 'Invalid token'
      };
      setTokenStatus(null);
      const result = await test.sendPostRequestWithToken(
        token, '/api/User/edit', user);
      expect(result).to.have.status(FORBIDDEN);
    });

    it('Should return statusCode 404 if no user was found', async () => {
      const user = {
        _id: '63142b88a13c29e00b22d1f6',
        token: token
      };
      setTokenStatus(true);
      const result = await test.sendPostRequestWithToken(
        token, '/api/User/edit', user);
      expect(result).to.have.status(NOT_FOUND);
    });

    describe('create audit log on user change', async () => {

      // create clean testUser before each test
      let testUser;

      beforeEach(async () => {
        await User.deleteMany({});
        testUser = await new User({
          email: 'a@b.c',
          password: 'Passw0rd',
          firstName: 'first-name',
          lastName: 'last-name',
          major: 'Computer Science',
          accessLevel: MEMBERSHIP_STATE.OFFICER,
        }).save();

        setTokenStatus(true, testUser);
      });

      afterEach(async () => {
        await AuditLog.deleteMany({});
      });

      it('Should create an audit log when a user is updated (no password change)' + 'not create an audit log for password change', async () => {
        const res = await test.sendPostRequestWithToken(token, '/api/User/edit', {
          _id: testUser._id.toString(),
          firstName: 'Newname',
          email: 'a@b.c',
          token
        });

        expect(res).to.have.status(OK);
        res.body.should.be.a('object');
        res.body.should.have.property('message');

        const auditEntry = await AuditLog.findOne({ userId: testUser._id }).lean();
        expect(auditEntry).to.exist;
        const fieldChanges = JSON.parse(auditEntry.details.fieldChanges);
        expect(fieldChanges.firstName).to.have.deep.equal({
          from: 'first-name',
          to: 'Newname'
        });

        // make sure pw change log doesn't exist
        const changePWlog = await AuditLog.findOne({
          userId: id,
          action: AuditLogActions.CHANGE_PW
        }).lean();
        expect(changePWlog).to.not.exist;
      });

      it('Should create an audit log when a user changes their password (no profile update)', async () => {
        const res = await test.sendPostRequestWithToken(token, '/api/User/edit', {
          _id: testUser._id.toString(),
          firstName: 'first-name',
          email: 'a@b.c',
          password: 'Newpassw0rd',
          token
        });

        expect(res).to.have.status(OK);

        const auditEntry = await AuditLog.findOne({ userId: testUser._id }).lean();
        expect(auditEntry).to.exist;
        expect(auditEntry.action).to.equal(AuditLogActions.CHANGE_PW);
        expect(auditEntry).to.not.have.property('password');
      });

      it('Should create both audit logs when password and profile info are updated', async () => {
        const res = await test.sendPostRequestWithToken(token, '/api/User/edit', {
          _id: testUser._id.toString(),
          firstName: 'Newname',
          email: 'a@b.c',
          password: 'Newpassword1',
          discordID: 'anotherID',
          token
        });

        expect(res).to.have.status(OK);

        const changePwLog = await AuditLog.findOne({ action: AuditLogActions.CHANGE_PW }).lean();
        const updateUserLog = await AuditLog.findOne({ action: AuditLogActions.UPDATE_USER }).lean();

        expect(changePwLog).to.exist;
        expect(updateUserLog).to.exist;
      });

      it('Should track profile changes in audit log with correct from/to values', async () => {
        const res = await test.sendPostRequestWithToken(token, '/api/User/edit', {
          _id: testUser._id.toString(),
          firstName: 'Newname',
          lastName: 'Newlastname',
          email: 'a@b.c',
          password: 'Newpassword1',
          discordID: 'anotherID',
          major: 'Software Engineering',
          token
        });

        expect(res).to.have.status(OK);

        const auditEntry = await AuditLog.findOne({
          action: AuditLogActions.UPDATE_USER,
          documentId: testUser._id
        }).lean();

        expect(auditEntry).to.exist;
        expect(auditEntry.details).to.have.property('fieldChanges');

        const fieldChanges = JSON.parse(auditEntry.details.fieldChanges);
        // track firstName change
        expect(fieldChanges).to.have.property('firstName');
        expect(fieldChanges.firstName).to.have.deep.equal({
          from: 'first-name',
          to: 'Newname'
        });

        // track lastName change
        expect(fieldChanges).to.have.property('lastName');
        expect(fieldChanges.lastName).to.have.deep.equal({
          from: 'last-name',
          to: 'Newlastname'
        });

        // track major change
        expect(fieldChanges).to.have.property('major');
        expect(fieldChanges.major).to.have.deep.equal({
          from: 'Computer Science',
          to: 'Software Engineering'
        });

        // Should NOT track unchanged fields + password field
        expect(fieldChanges).to.not.have.property('password');
        expect(fieldChanges).to.not.have.property('email');
      });

      it('Should not create audit log when no fields actually change', async () => {
        const res = await test.sendPostRequestWithToken(token, '/api/User/edit', {
          _id: testUser._id.toString(),
          email: 'a@b.c',
          password: 'Passw0rd',
          firstName: 'first-name',
          lastName: 'last-name',
          major: 'Computer Science'
        });

        expect(res).to.have.status(OK);

        const auditEntry = await AuditLog.findOne({
          action: AuditLogActions.UPDATE_USER || AuditLogActions.CHANGE_PW,
          documentId: testUser._id
        }).lean();

        expect(auditEntry).to.not.exist;
      });
    });
  });

  describe('/POST getUserById', () => {
    it('Should return status code 401 if no token was passed in', async () => {
      const user = {
        userID: id,
      };
      const result = await test.sendPostRequest('/api/user/getUserById', user);
      expect(result).to.have.status(UNAUTHORIZED);
    });
    it('Should return status code 403 if' +
      ' an invalid token was passed in', async () => {
      const user = {
        userID: id,
        token: 'Invalid Token'
      };
      setTokenStatus(null);
      const result = await test.sendPostRequestWithToken(token, '/api/user/getUserById', user);
      expect(result).to.have.status(FORBIDDEN);
    });
    it('Should return status code 404 if user is not found', async () => {
      const user = {
        userID: new mongoose.Types.ObjectId(),
        token: token,
      };
      setTokenStatus(true);
      const result =
        await test.sendPostRequestWithToken(token, '/api/user/getUserById', user);
      expect(result).to.have.status(NOT_FOUND);
    });
    it('Should return status code 200 if user is found', async () => {

      const testUser = await new User({
        email: 'getuser@test.com',
        password: 'Passw0rd',
        firstName: 'Get',
        lastName: 'User',
        accessLevel: MEMBERSHIP_STATE.ADMIN,
        emailVerified: true
      }).save();

      // Set token mock for this user
      setTokenStatus(true, { _id: testUser._id, accessLevel: MEMBERSHIP_STATE.ADMIN });

      const res = await test.sendPostRequestWithToken('', '/api/User/getUserById', {
        userID: testUser._id,
        token: ''
      });

      expect(res).to.have.status(OK);
      res.body.should.have.property('email').eql('getuser@test.com');
      res.body.should.not.have.property('password');
    });
  });

  describe('/POST delete', () => {
    let userAdmin;

    const userId = new mongoose.Types.ObjectId();

    before(async () => {
      userAdmin = new User({
        _id: userId,
        firstName: 'first-name',
        lastName: 'last-name',
        email: 'test@user.com',
        password: 'Passw0rd',
        emailVerified: true,
        accessLevel: MEMBERSHIP_STATE.ADMIN,
        apiKey: null
      });
      await userAdmin.save();
    });

    it('Should return statusCode 401 if no token is passed in', async () => {
      const user = {
        _id : id
      };
      const result = await test.sendPostRequest(
        '/api/User/delete', user);
      expect(result).to.have.status(UNAUTHORIZED);
    });

    it('Should return statusCode 403 if an invalid ' +
      'token was passed in', async () => {
      const user = {
        _id: id,
        token: 'Invalid token'
      };
      setTokenStatus(null);
      const result = await test.sendPostRequestWithToken(
        token, '/api/User/delete', user);
      expect(result).to.have.status(FORBIDDEN);
    });

    it('Should return statusCode 404 if no user was found', async () => {
      const user = {
        _id: '63142b88a13c29e00b22d1f6',
        token: token
      };
      setTokenStatus(true);
      const result = await test.sendPostRequestWithToken(
        token, '/api/User/delete', user);
      expect(result).to.have.status(NOT_FOUND);
    });

    it('Should return statusCode 200 and a message ' +
      'if a user was deleted', async () => {
      const user = await new User({
        _id : id,
        email: 'delete@test.com',
        password: 'Passw0rd',
        firstName: 'Delete',
        lastName: 'Me',
        token: token
      }).save();
      setTokenStatus(true, { _id: user._id, accesslevel: MEMBERSHIP_STATE.ADMIN });
      const result = await test.sendPostRequestWithToken(
        token, '/api/User/delete', { _id: user._id, token: token } );
      expect(result).to.have.status(OK);
    });

    it('Should return statusCode 200 if user deletes themself', async () => {
      setTokenStatus(true, {accessLevel: MEMBERSHIP_STATE.MEMBER});
      const deleteUser = {
        email: 'h@i.j',
        password: 'Passw0rd',
        firstName: 'first-name',
        lastName: 'last-name',
      };
      const searchUser = {
        email: 'h@i.j',
        token: token
      };
      await test.sendPostRequest('/api/Auth/register', deleteUser);
      const getUser = await test.sendPostRequestWithToken(
        token, '/api/User/search', searchUser);
      const user = {
        _id: getUser.body._id,
        token: token
      };
      setTokenStatus(true, {accessLevel: MEMBERSHIP_STATE.MEMBER, _id: getUser.body._id});
      const result = await test.sendPostRequestWithToken(
        token, '/api/User/delete', user);
      expect(result).to.have.status(OK);
    });

    it('Should return statusCode 403 if a member deletes another member', async () => {
      setTokenStatus(true, { accessLevel: MEMBERSHIP_STATE.MEMBER });
      // Define credentials for the Member (the deleting user)
      const memberCredentials = {
        email: 'member@test.com',
        password: 'Passw0rd',
        firstName: 'Member',
        lastName: 'User',
      };

      // Define credentials for the Target User (the user being deleted)
      const targetCredentials = {
        email: 'target@test.com',
        password: 'TargetPassw0rd',
        firstName: 'Target',
        lastName: 'User',
      };

      // Register the Target User (the one to be deleted)
      await test.sendPostRequest('/api/Auth/register', targetCredentials);

      // Register the Member and get their JWT and decoded token data
      await test.sendPostRequest('/api/Auth/register', memberCredentials);

      // Find the Target User to get their _id
      // Use the *real* member token to perform the search
      const targetSearchResponse = await test.sendPostRequestWithToken(
        token,
        '/api/User/search',
        { email: targetCredentials.email }
      );
      const memberSearchResponse = await test.sendPostRequestWithToken(
        token,
        '/api/User/search',
        { email: memberCredentials.email }
      );

      // The target user ID is what we want to delete
      const targetUserId = targetSearchResponse.body._id;
      const memberUserId = memberSearchResponse.body._id;


      // Member attempts to delete the Target User using the Target User's ID
      const deletePayload = {
        _id: targetUserId, // ID of the user to delete (NOT the member's ID)
      };

      setTokenStatus(true, { accessLevel: MEMBERSHIP_STATE.MEMBER, _id: memberUserId });

      const result = await test.sendPostRequestWithToken(
        token, '/api/User/delete', deletePayload);

      // Verification
      expect(result).to.have.status(FORBIDDEN); // Expect 403
      result.body.should.have.property('message');
      result.body.message.should.equal(
        'you must be an officer or admin to delete other users',
      );
    });

    // New test case for lower privileges
    it('Should return statusCode 403 if users with lower privileges tries to delete accounts with higher privileges', async () => {
      setTokenStatus(true, {accessLevel: MEMBERSHIP_STATE.OFFICER});

      const user = {
        _id: userAdmin.id,
        token: token
      };
      const result = await test.sendPostRequestWithToken(
        token, '/api/User/delete', user);

      expect(result).to.have.status(FORBIDDEN);
      result.body.should.have.property('message');
      result.body.message.should.equal(
        'you must have higher privileges to delete users with lower privileges'
      );
    });
  });

  describe('POST /apikey', () => {
    let user;
    let usertoken;

    before(async () => {
      user = new User({
        _id: id,
        firstName: 'first-name',
        lastName: 'last-name',
        email: 'test@test.com',
        password: 'Passw0rd',
        emailVerified: true,
        accessLevel: MEMBERSHIP_STATE.MEMBER,
        apiKey: null
      });
      await user.save();

      const loginResponse = await test.sendPostRequest('/api/Auth/login', {
        email: user.email,
        password: 'Passw0rd'
      });
      usertoken = loginResponse.body.token;
    });

    // valid token
    it('Should return status code 200 and valid token was sent', async () => {
      setTokenStatus(true, { _id: id });
      const result = await test.sendPostRequestWithToken(usertoken, '/api/user/apikey', {});
      expect(result).to.have.status(OK);
    });

    // no token
    it('Should return status code 401 if no token is passed through', async () => {
      const result = await test.sendPostRequest('/api/user/apikey', {});
      expect(result).to.have.status(UNAUTHORIZED);
    });

    // invalid token
    it('Should return statusCode 403 if an invalid ' +
      'token was passed in', async () => {
      const user = {
        _id: id,
        token: 'Invalid token'
      };
      setTokenStatus(null);
      const result = await test.sendPostRequestWithToken(
        token, '/api/User/apikey', user);
      expect(result).to.have.status(FORBIDDEN);
    });
  });

  describe('GET getNewPaidMembersThisSemester', () => {
    it('Should return status code 200 and valid token sent', async () => {
      setTokenStatus(true);
      const result = await test.sendGetRequestWithToken(token, '/api/user/getNewPaidMembersThisSemester');
      expect(result).to.have.status(OK);
    });

    it('Should return statusCode 401 if no token is passed in', async () => {
      const result = await test.sendGetRequest('/api/user/getNewPaidMembersThisSemester');
      expect(result).to.have.status(UNAUTHORIZED);
    });

    it('Should return statusCode 403 if an invalid' +
      'token was passed in', async () => {
      setTokenStatus(null);
      const result = await test.sendGetRequestWithToken(token, '/api/user/getNewPaidMembersThisSemester');
      expect(result).to.have.status(FORBIDDEN);
    });

    describe('1st Semester Mock Test', () => {
      before(async () => {
        setTokenStatus(true);
        mockDayMonthAndYear(20, 3, 2015);
        await User.deleteMany({});
        const users = [
          {
            firstName: 'Test1',
            lastName: 'MemberNew',
            email: 'test1@test.com',
            password: 'Passw0rd',
            emailVerified: true,
            accessLevel: MEMBERSHIP_STATE.MEMBER,
            joinDate: new Date('2015-03-01'), // This Semester
            membershipValidUntil: getMemberExpirationDate(1), // Semester Plan
          },
          {
            firstName: 'Test2',
            lastName: 'MemberOld',
            email: 'test2@test.com',
            password: 'Passw0rd',
            emailVerified: true,
            accessLevel: MEMBERSHIP_STATE.MEMBER,
            joinDate: new Date('2014-09-10'), // Previous Semester
            membershipValidUntil: getMemberExpirationDate(2), // Annual Plan
          },
          {
            firstName: 'Test3',
            lastName: 'ExpiredNow',
            email: 'test3@test.com',
            password: 'Passw0rd',
            emailVerified: true,
            accessLevel: MEMBERSHIP_STATE.MEMBER,
            joinDate: new Date('2015-03-10'), // This Semester
            membershipValidUntil: getMemberExpirationDate(2) // Annual Plan
          },
          {
            firstName: 'Test4',
            lastName: 'NotMemberButValid',
            email: 'test4@test.com',
            password: 'Passw0rd',
            emailVerified: true,
            accessLevel: MEMBERSHIP_STATE.NON_MEMBER, // Not a Member
            joinDate: new Date('2015-03-15'), // This Semester
            //  Expiration Date Unchanged
          },
          {
            firstName: 'Test5',
            lastName: 'NotMemberExpired',
            email: 'test5@test.com',
            password: 'Passw0rd',
            emailVerified: true,
            accessLevel: MEMBERSHIP_STATE.NON_MEMBER, // Not a Member
            joinDate: new Date('2014-06-10'), // Previous Semester
            membershipValidUntil: getMemberExpirationDate(0), // Expired

          },
          {
            firstName: 'Test6',
            lastName: 'LongTerm',
            email: 'test6@test.com',
            password: 'Passw0rd',
            emailVerified: true,
            accessLevel: MEMBERSHIP_STATE.MEMBER,
            joinDate: new Date('2015-03-05'), // This Semester
            membershipValidUntil: getMemberExpirationDate(2), // Annual Plan
          },
          {
            firstName: 'Test7',
            lastName: 'ExpiredOld',
            email: 'test7@test.com',
            password: 'Passw0rd',
            emailVerified: true,
            accessLevel: MEMBERSHIP_STATE.MEMBER,
            joinDate: new Date('2015-02-15'), // This Semester
            membershipValidUntil: getMemberExpirationDate(1), // Semester Plan
          },
        ];
        await User.insertMany(users);
      });

      beforeEach(() => {
        setTokenStatus(true);
      });

      it('Should return response with newMembersThisYear count of 4', async () => {
        const result = await test.sendGetRequestWithToken(token, '/api/user/getNewPaidMembersThisSemester');
        expect(result.body.newMembersThisYear).to.equal(4);
      });
      it('Should return response with currentActiveMembers count of 5', async () => {
        const result = await test.sendGetRequestWithToken(token, '/api/user/getNewPaidMembersThisSemester');
        expect(result.body.currentActiveMembers).to.equal(5);
      });
      it('Should return response with newSingleSemesterMembers count of 2', async () => {
        const result = await test.sendGetRequestWithToken(token, '/api/user/getNewPaidMembersThisSemester');
        expect(result.body.newSingleSemesterMembers).to.equal(2);
      });
      it('Should return response with newAnnualMembers count of 2', async () => {
        const result = await test.sendGetRequestWithToken(token, '/api/user/getNewPaidMembersThisSemester');
        expect(result.body.newAnnualMembers).to.equal(2);
      });

      after(() => {
        revertClock();
        User.deleteMany({});
      });
    });

    describe('2nd Semester Mock Test', () => {
      before(async () => {
        mockDayMonthAndYear(20, 6, 2021);
        await User.deleteMany({});
        const users = [
          {
            firstName: 'Test1',
            lastName: 'MemberNew',
            email: 'test1@test.com',
            password: 'Passw0rd',
            emailVerified: true,
            accessLevel: MEMBERSHIP_STATE.MEMBER,
            joinDate: new Date('2021-10-05'), // This Semester
            membershipValidUntil: getMemberExpirationDate(1), // Semester Plan
          },
          {
            firstName: 'Test2',
            lastName: 'MemberOld',
            email: 'test2@test.com',
            password: 'Passw0rd',
            emailVerified: true,
            accessLevel: MEMBERSHIP_STATE.MEMBER,
            joinDate: new Date('2021-02-10'), // Previous Semester
            membershipValidUntil: getMemberExpirationDate(2), // Annual Plan
          },
          {
            firstName: 'Test3',
            lastName: 'ExpiredNow',
            email: 'test3@test.com',
            password: 'Passw0rd',
            emailVerified: true,
            accessLevel: MEMBERSHIP_STATE.MEMBER,
            joinDate: new Date('2021-09-10'), // This Semester
            membershipValidUntil: getMemberExpirationDate(2) // Annual Plan
          },
          {
            firstName: 'Test4',
            lastName: 'NotMemberButValid',
            email: 'test4@test.com',
            password: 'Passw0rd',
            emailVerified: true,
            accessLevel: MEMBERSHIP_STATE.NON_MEMBER, // Not a Member
            joinDate: new Date('2021-12-15'), // This Semester
            //  Expiration Date Unchanged
          },
          {
            firstName: 'Test5',
            lastName: 'NotMemberExpired',
            email: 'test5@test.com',
            password: 'Passw0rd',
            emailVerified: true,
            accessLevel: MEMBERSHIP_STATE.NON_MEMBER, // Not a Member
            joinDate: new Date('2021-04-10'), // Previous Semester
            membershipValidUntil: getMemberExpirationDate(0), // Expired

          },
          {
            firstName: 'Test6',
            lastName: 'LongTerm',
            email: 'test6@test.com',
            password: 'Passw0rd',
            emailVerified: true,
            accessLevel: MEMBERSHIP_STATE.MEMBER,
            joinDate: new Date('2021-07-05'), // This Semester
            membershipValidUntil: getMemberExpirationDate(2), // Annual Plan
          },
          {
            firstName: 'Test7',
            lastName: 'ExpiredOld',
            email: 'test7@test.com',
            password: 'Passw0rd',
            emailVerified: true,
            accessLevel: MEMBERSHIP_STATE.MEMBER,
            joinDate: new Date('2021-08-15'), // This Semester
            membershipValidUntil: getMemberExpirationDate(1), // Semester Plan
          },
        ];
        await User.insertMany(users);
      });

      beforeEach(() => {
        setTokenStatus(true);
      });

      it('Should return response with newMembersThisYear count of 5', async () => {
        const result = await test.sendGetRequestWithToken(token, '/api/user/getNewPaidMembersThisSemester');
        expect(result.body.newMembersThisYear).to.equal(5);
      });
      it('Should return response with currentActiveMembers count of 5', async () => {
        const result = await test.sendGetRequestWithToken(token, '/api/user/getNewPaidMembersThisSemester');
        expect(result.body.currentActiveMembers).to.equal(5);
      });
      it('Should return response with newSingleSemesterMembers count of 2', async () => {
        const result = await test.sendGetRequestWithToken(token, '/api/user/getNewPaidMembersThisSemester');
        expect(result.body.newSingleSemesterMembers).to.equal(2);
      });
      it('Should return response with newAnnualMembers count of 2', async () => {
        const result = await test.sendGetRequestWithToken(token, '/api/user/getNewPaidMembersThisSemester');
        expect(result.body.newAnnualMembers).to.equal(2);
      });

      after(() => {
        revertClock();
        User.deleteMany({});
      });
    });
  });

  describe('/POST bulkEdit', () => {
    let member;
    let officer;
    let admin;

    const editorOfficer = {
      _id: new mongoose.Types.ObjectId().toString(),
      accessLevel: MEMBERSHIP_STATE.OFFICER,
    };
    const editorAdmin = {
      _id: new mongoose.Types.ObjectId().toString(),
      accessLevel: MEMBERSHIP_STATE.ADMIN,
    };

    beforeEach(async () => {
      await User.deleteMany({});
      await AuditLog.deleteMany({});
      member = await new User({
        email: 'bulk-member@sce.dev',
        password: 'Passw0rd',
        firstName: 'Mem',
        lastName: 'Ber',
        major: 'Computer Science',
        accessLevel: MEMBERSHIP_STATE.MEMBER,
      }).save();
      officer = await new User({
        email: 'bulk-officer@sce.dev',
        password: 'Passw0rd',
        firstName: 'Off',
        lastName: 'Icer',
        major: 'Computer Science',
        accessLevel: MEMBERSHIP_STATE.OFFICER,
      }).save();
      admin = await new User({
        email: 'bulk-admin@sce.dev',
        password: 'Passw0rd',
        firstName: 'Ad',
        lastName: 'Min',
        major: 'Computer Science',
        accessLevel: MEMBERSHIP_STATE.ADMIN,
      }).save();
    });

    after(async () => {
      await User.deleteMany({});
      await AuditLog.deleteMany({});
    });

    it('Should return statusCode 401 if no token is passed in', async () => {
      const result = await test.sendPostRequest('/api/User/bulkEdit', {
        ids: [member._id.toString()],
        accessLevel: MEMBERSHIP_STATE.OFFICER,
      });
      expect(result).to.have.status(UNAUTHORIZED);
    });

    it('Should return statusCode 403 if an invalid token was passed in',
      async () => {
        setTokenStatus(null);
        const result = await test.sendPostRequestWithToken(
          token, '/api/User/bulkEdit', {
            ids: [member._id.toString()],
            accessLevel: MEMBERSHIP_STATE.OFFICER,
          });
        expect(result).to.have.status(FORBIDDEN);
      });

    it('Should return statusCode 400 if ids is not a non-empty array',
      async () => {
        setTokenStatus(true, editorOfficer);
        for (const ids of [undefined, [], 'not-an-array', {}]) {
          const result = await test.sendPostRequestWithToken(
            token, '/api/User/bulkEdit', {
              ids,
              accessLevel: MEMBERSHIP_STATE.MEMBER,
            });
          expect(result).to.have.status(BAD_REQUEST);
        }
      });

    it('Should return statusCode 400 for an invalid access level',
      async () => {
        setTokenStatus(true, editorOfficer);
        for (const accessLevel of [99, -7, 'OFFICER', undefined]) {
          const result = await test.sendPostRequestWithToken(
            token, '/api/User/bulkEdit', {
              ids: [member._id.toString()],
              accessLevel,
            });
          expect(result).to.have.status(BAD_REQUEST);
        }
      });

    it('Should return statusCode 401 if an officer tries to grant admin',
      async () => {
        setTokenStatus(true, editorOfficer);
        const result = await test.sendPostRequestWithToken(
          token, '/api/User/bulkEdit', {
            ids: [member._id.toString()],
            accessLevel: MEMBERSHIP_STATE.ADMIN,
          });
        expect(result).to.have.status(UNAUTHORIZED);
      });

    it('Should let an admin grant admin', async () => {
      setTokenStatus(true, editorAdmin);
      const result = await test.sendPostRequestWithToken(
        token, '/api/User/bulkEdit', {
          ids: [member._id.toString()],
          accessLevel: MEMBERSHIP_STATE.ADMIN,
        });
      expect(result).to.have.status(OK);
      const updated = await User.findById(member._id).lean();
      expect(updated.accessLevel).to.equal(MEMBERSHIP_STATE.ADMIN);
    });

    it('Should return statusCode 403 if an officer includes themselves',
      async () => {
        setTokenStatus(true, {
          _id: officer._id.toString(),
          accessLevel: MEMBERSHIP_STATE.OFFICER,
        });
        const result = await test.sendPostRequestWithToken(
          token, '/api/User/bulkEdit', {
            ids: [member._id.toString(), officer._id.toString()],
            accessLevel: MEMBERSHIP_STATE.MEMBER,
          });
        expect(result).to.have.status(FORBIDDEN);
        // the whole request is rejected, so the other user is untouched
        const untouched = await User.findById(member._id).lean();
        expect(untouched.accessLevel).to.equal(MEMBERSHIP_STATE.MEMBER);
      });

    it('Should let an admin include themselves', async () => {
      setTokenStatus(true, {
        _id: admin._id.toString(),
        accessLevel: MEMBERSHIP_STATE.ADMIN,
      });
      const result = await test.sendPostRequestWithToken(
        token, '/api/User/bulkEdit', {
          ids: [admin._id.toString()],
          accessLevel: MEMBERSHIP_STATE.MEMBER,
        });
      expect(result).to.have.status(OK);
      const updated = await User.findById(admin._id).lean();
      expect(updated.accessLevel).to.equal(MEMBERSHIP_STATE.MEMBER);
    });

    it('Should update every selected user', async () => {
      setTokenStatus(true, editorAdmin);
      const result = await test.sendPostRequestWithToken(
        token, '/api/User/bulkEdit', {
          ids: [member._id.toString(), officer._id.toString()],
          accessLevel: MEMBERSHIP_STATE.PENDING,
        });
      expect(result).to.have.status(OK);
      expect(result.body.modified).to.equal(2);
      const updated = await User.find({
        _id: { $in: [member._id, officer._id] }
      }).lean();
      updated.forEach(updatedUser => {
        expect(updatedUser.accessLevel).to.equal(MEMBERSHIP_STATE.PENDING);
      });
    });

    it('Should skip users who outrank the editor', async () => {
      setTokenStatus(true, editorOfficer);
      const result = await test.sendPostRequestWithToken(
        token, '/api/User/bulkEdit', {
          ids: [member._id.toString(), admin._id.toString()],
          accessLevel: MEMBERSHIP_STATE.NON_MEMBER,
        });
      expect(result).to.have.status(OK);
      expect(result.body.skipped).to.have.length(1);
      expect(result.body.skipped[0].email).to.equal('bulk-admin@sce.dev');
      const untouchedAdmin = await User.findById(admin._id).lean();
      expect(untouchedAdmin.accessLevel).to.equal(MEMBERSHIP_STATE.ADMIN);
      const updatedMember = await User.findById(member._id).lean();
      expect(updatedMember.accessLevel).to.equal(MEMBERSHIP_STATE.NON_MEMBER);
    });

    it('Should not report changes for users already at the target level',
      async () => {
        setTokenStatus(true, editorAdmin);
        const result = await test.sendPostRequestWithToken(
          token, '/api/User/bulkEdit', {
            ids: [officer._id.toString()],
            accessLevel: MEMBERSHIP_STATE.OFFICER,
          });
        expect(result).to.have.status(OK);
        expect(result.body.modified).to.equal(0);
        const auditEntries = await AuditLog.find({}).lean();
        expect(auditEntries).to.have.length(0);
      });

    it('Should return statusCode 404 if none of the ids exist', async () => {
      setTokenStatus(true, editorAdmin);
      const result = await test.sendPostRequestWithToken(
        token, '/api/User/bulkEdit', {
          ids: [new mongoose.Types.ObjectId().toString()],
          accessLevel: MEMBERSHIP_STATE.MEMBER,
        });
      expect(result).to.have.status(NOT_FOUND);
    });

    it('Should write one audit log per changed user', async () => {
      setTokenStatus(true, editorAdmin);
      const result = await test.sendPostRequestWithToken(
        token, '/api/User/bulkEdit', {
          ids: [member._id.toString(), officer._id.toString()],
          accessLevel: MEMBERSHIP_STATE.NON_MEMBER,
        });
      expect(result).to.have.status(OK);

      const auditEntries = await AuditLog.find({
        action: AuditLogActions.UPDATE_USER
      }).lean();
      expect(auditEntries).to.have.length(2);

      const memberEntry = auditEntries.find(
        entry => String(entry.documentId) === member._id.toString()
      );
      expect(memberEntry).to.exist;
      const fieldChanges = JSON.parse(memberEntry.details.fieldChanges);
      expect(fieldChanges.accessLevel).to.deep.equal({
        from: MEMBERSHIP_STATE.MEMBER,
        to: MEMBERSHIP_STATE.NON_MEMBER
      });
    });
  });

  describe('/POST users rowsPerPage', () => {
    const SEEDED_USERS = 25;
    const DEFAULT_ROWS_PER_PAGE = 20;

    before(async () => {
      await User.deleteMany({});
      await User.insertMany(
        Array.from({ length: SEEDED_USERS }, (_, index) => ({
          email: `rows-per-page-${index}@sce.com`,
          password: 'Passw0rd',
          firstName: `first-${index}`,
          lastName: `last-${index}`,
          major: 'Computer Science',
        }))
      );
    });

    beforeEach(() => {
      setTokenStatus(true);
    });

    after(async () => {
      await User.deleteMany({});
    });

    it('Should default to 20 rows per page when rowsPerPage is omitted',
      async () => {
        const result = await test.sendPostRequestWithToken(
          token, '/api/User/users', {});
        expect(result).to.have.status(OK);
        expect(result.body.rowsPerPage).to.equal(DEFAULT_ROWS_PER_PAGE);
        expect(result.body.items.length).to.equal(DEFAULT_ROWS_PER_PAGE);
        expect(result.body.total).to.equal(SEEDED_USERS);
      });

    it('Should return only the requested number of rows', async () => {
      const result = await test.sendPostRequestWithToken(
        token, '/api/User/users', { rowsPerPage: 10 });
      expect(result).to.have.status(OK);
      expect(result.body.rowsPerPage).to.equal(10);
      expect(result.body.items.length).to.equal(10);
      expect(result.body.total).to.equal(SEEDED_USERS);
    });

    it('Should return every user when fewer exist than the requested size',
      async () => {
        const result = await test.sendPostRequestWithToken(
          token, '/api/User/users', { rowsPerPage: 50 });
        expect(result).to.have.status(OK);
        expect(result.body.rowsPerPage).to.equal(50);
        expect(result.body.items.length).to.equal(SEEDED_USERS);
      });

    it('Should offset by the requested size when paging', async () => {
      const firstPage = await test.sendPostRequestWithToken(
        token, '/api/User/users', { rowsPerPage: 10, page: 0 });
      const thirdPage = await test.sendPostRequestWithToken(
        token, '/api/User/users', { rowsPerPage: 10, page: 2 });
      expect(thirdPage).to.have.status(OK);
      // 25 users at 10 per page leaves 5 on the final page
      expect(thirdPage.body.items.length).to.equal(5);
      const firstPageIds = firstPage.body.items.map(user => String(user._id));
      thirdPage.body.items.forEach(user => {
        expect(firstPageIds).to.not.include(String(user._id));
      });
    });

    it('Should return every matching user when rowsPerPage is "all"',
      async () => {
        const result = await test.sendPostRequestWithToken(
          token, '/api/User/users', { rowsPerPage: 'all' });
        expect(result).to.have.status(OK);
        expect(result.body.items.length).to.equal(SEEDED_USERS);
        expect(result.body.rowsPerPage).to.equal(SEEDED_USERS);
      });

    it('Should respect the query when rowsPerPage is "all"', async () => {
      const result = await test.sendPostRequestWithToken(
        token, '/api/User/users', { rowsPerPage: 'all', query: 'first-1' });
      expect(result).to.have.status(OK);
      // first-1, and first-10 through first-19
      expect(result.body.items.length).to.equal(11);
      expect(result.body.total).to.equal(11);
      expect(result.body.rowsPerPage).to.equal(11);
    });

    it('Should fall back to 20 rows per page for a disallowed size',
      async () => {
        const disallowedSizes = [1000, 0, -5, 'everything', null];
        for (const rowsPerPage of disallowedSizes) {
          const result = await test.sendPostRequestWithToken(
            token, '/api/User/users', { rowsPerPage });
          expect(result).to.have.status(OK);
          expect(result.body.rowsPerPage).to.equal(DEFAULT_ROWS_PER_PAGE);
          expect(result.body.items.length).to.equal(DEFAULT_ROWS_PER_PAGE);
        }
      });
  });
});
