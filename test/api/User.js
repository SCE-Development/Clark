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
  BAD_REQUEST,
  UNAUTHORIZED,
  NOT_FOUND,
  FORBIDDEN
} = require('../../api/util/constants').STATUS_CODES;
const sinon = require('sinon');
const SceApiTester = require('../util/tools/SceApiTester');
const {mockDayMonthAndYear, revertClock} = require('../util/mocks/Date.js');

const AuditLog = require('../../api/main_endpoints/models/AuditLog.js')
const AuditLogActions = require('../../api/main_endpoints/util/auditLogActions.js')

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

const {
  setDiscordAPIStatus,
  resetDiscordAPIMock,
  restoreDiscordAPIMock,
  initializeDiscordAPIMock
} = require('../util/mocks/DiscordApiFunction');
const { MEMBERSHIP_STATE } = require('../../api/util/constants');
const { getMemberExpirationDate } = require('../../api/main_endpoints/util/userHelpers.js');

chai.should();
chai.use(chaiHttp);

// Our parent block
describe('User', () => {
  before(done => {
    initializeTokenMock();
    initializeDiscordAPIMock();
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
    restoreDiscordAPIMock();
    tools.terminateServer(done);
  });

  beforeEach(() => {
    setTokenStatus(false);
    setDiscordAPIStatus(false);
  });

  afterEach(() => {
    resetTokenMock();
    resetDiscordAPIMock();
  });

  const token = '';

  describe('/POST search', () => {
    it('Should return statusCode 403 if no token is passed in', async () => {
      const user = {
        email: 'a@b.c'
      };
      const result = await test.sendPostRequest(
        '/api/User/users', user);
      expect(result).to.have.status(FORBIDDEN);
    });

    it('Should return statusCode 401 if an invalid ' +
      'token was passed in', async () => {
      const user = {
        token: 'Invalid token'
      };
      const result = await test.sendPostRequestWithToken(
        token, '/api/User/users', user);
      expect(result).to.have.status(UNAUTHORIZED);
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
    it('Should return statusCode 403 if no token is passed in', async () => {
      const user = {
        email: 'a@b.c'
      };
      const result = await test.sendPostRequest(
        '/api/User/search', user);
      expect(result).to.have.status(FORBIDDEN);
    });

    it('Should return statusCode 401 if an invalid ' +
      'token was passed in', async () => {
      const user = {
        email: 'a@b.c',
        token: 'Invalid token'
      };
      const result = await test.sendPostRequestWithToken(
        token, '/api/User/search', user);
      expect(result).to.have.status(UNAUTHORIZED);
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

  describe('/POST edit', () => {
    it('Should return statusCode 403 if no token is passed in', async () => {
      const user = {
        _id: id,
      };
      const result = await test.sendPostRequest(
        '/api/User/edit', user);
      expect(result).to.have.status(FORBIDDEN);
    });

    it('Should return statusCode 401 if an invalid ' +
      'token was passed in', async () => {
      const user = {
        email: 'a@b.c',
        token: 'Invalid token'
      };
      const result = await test.sendPostRequestWithToken(
        token, '/api/User/edit', user);
      expect(result).to.have.status(UNAUTHORIZED);
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
          major: 'Computer Science'
        }).save();
        
        setTokenStatus(true, testUser); 
      })

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
        expect(auditEntry.details.fieldChanges.firstName).to.have.deep.equal({
          from: 'first-name',
          to: 'Newname'
        });

        // make sure pw change log doesn't exist
        const changePWlog = await AuditLog.findOne({
          userId: id,
          action: AuditLogActions.CHANGE_PW
        }).lean()
        expect(changePWlog).to.not.exist
      });

      it('Should create an audit log when a user changes their password (no profile update)', async () => {
        const res = await test.sendPostRequestWithToken(token, '/api/User/edit', {
          _id: testUser._id.toString(),
          firstName: 'first-name',
          email: 'a@b.c',
          password: 'Newpassw0rd',
          token
        })

        expect(res).to.have.status(OK)

        const auditEntry = await AuditLog.findOne({ userId: testUser._id }).lean()
        expect(auditEntry).to.exist
        expect(auditEntry.action).to.equal(AuditLogActions.CHANGE_PW)
        expect(auditEntry).to.not.have.property('password')
      })

      it('Should create both audit logs when password and profile info are updated', async () => {
        const res = await test.sendPostRequestWithToken(token, '/api/User/edit', {
          _id: testUser._id.toString(),
          firstName: 'Newname',
          email: 'a@b.c',
          password: 'Newpassword1',
          discordID: 'anotherID',
          token
        })
       
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
        }).lean()

        expect(auditEntry).to.exist;
        expect(auditEntry.details).to.have.property('fieldChanges');

        // track firstName change
        expect(auditEntry.details.fieldChanges).to.have.property('firstName');
        expect(auditEntry.details.fieldChanges.firstName).to.have.deep.equal({
          from: 'first-name',
          to: 'Newname'
        });

        // track lastName change
        expect(auditEntry.details.fieldChanges).to.have.property('lastName')
        expect(auditEntry.details.fieldChanges.lastName).to.have.deep.equal({
          from: 'last-name',
          to: 'Newlastname'
        });

        // track major change
        expect(auditEntry.details.fieldChanges).to.have.property('major');
        expect(auditEntry.details.fieldChanges.major).to.have.deep.equal({
          from: 'Computer Science',
          to: 'Software Engineering'
        });
    
        // Should NOT track unchanged fields + password field
        expect(auditEntry.details.fieldChanges).to.not.have.property('password')
        expect(auditEntry.details.fieldChanges).to.not.have.property('email');
      });

      it('Should not create audit log when no fields actually change', async () => {
        const res = await test.sendPostRequestWithToken(token, '/api/User/edit', {
          _id: testUser._id.toString(),
          email: 'a@b.c',
          password: 'Passw0rd',
          firstName: 'first-name',
          lastName: 'last-name',
          major: 'Computer Science'
        })
        
        expect(res).to.have.status(OK);
    
        const auditEntry = await AuditLog.findOne({
          action: AuditLogActions.UPDATE_USER || AuditLogActions.CHANGE_PW,
          documentId: testUser._id
        }).lean()
    
        expect(auditEntry).to.not.exist;
      });
    })
  });

  describe('/POST getUserById', () => {
    it('Should return status code 403 if no token was passed in', async () => {
      const user = {
        userID: id,
      };
      const result = await test.sendPostRequest('/api/user/getUserById', user);
      expect(result).to.have.status(FORBIDDEN);
    });
    it('Should return status code 403 if' +
      ' an invalid token was passed in', async () => {
      const user = {
        userID: id,
        token: 'Invalid Token'
      };
      const result = await test.sendPostRequestWithToken(token, '/api/user/getUserById', user);
      expect(result).to.have.status(UNAUTHORIZED);
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
      const user = {
        userID: id,
        token: token
      };
      setTokenStatus(true);
      const result = await test.sendPostRequestWithToken(token, '/api/User/getUserById', user);
      expect(result).to.have.status(OK);
      result.body.should.not.have.property('password');
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

    it('Should return statusCode 403 if no token is passed in', async () => {
      const user = {
        _id : id
      };
      const result = await test.sendPostRequest(
        '/api/User/delete', user);
      expect(result).to.have.status(FORBIDDEN);
    });

    it('Should return statusCode 403 if an invalid ' +
      'token was passed in', async () => {
      const user = {
        _id: id,
        token: 'Invalid token'
      };
      const result = await test.sendPostRequestWithToken(
        token, '/api/User/delete', user);
      expect(result).to.have.status(UNAUTHORIZED);
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
      const user = {
        _id : id,
        token: token
      };
      setTokenStatus(true);
      const result = await test.sendPostRequestWithToken(
        token, '/api/User/delete', user);
      expect(result).to.have.status(OK);
    });

    it('Should return statusCode 200 if user deletes themself', async () => {
      setTokenStatus(true);
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
      const result = await test.sendPostRequestWithToken(
        token, '/api/User/delete', user);
      expect(result).to.have.status(OK);
    });

    it('Should return statusCode 200 if user deletes themself as a member', async () => {
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
      const result = await test.sendPostRequestWithToken(
        token, '/api/User/delete', user);
      expect(result).to.have.status(FORBIDDEN);
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
    it('Should return status code 403 if no token is passed through', async () => {
      const result = await test.sendPostRequest('/api/user/apikey', {});
      expect(result).to.have.status(FORBIDDEN);
    });

    // invalid token
    it('Should return statusCode 401 if an invalid ' +
      'token was passed in', async () => {
      const user = {
        _id: id,
        token: 'Invalid token'
      };
      const result = await test.sendPostRequestWithToken(
        token, '/api/User/apikey', user);
      expect(result).to.have.status(UNAUTHORIZED);
    });
  });

  describe('GET getNewPaidMembersThisSemester', () => {
    it('Should return status code 200 and valid token sent', async () => {
      setTokenStatus(true);
      const result = await test.sendGetRequestWithToken(token, '/api/user/getNewPaidMembersThisSemester');
      expect(result).to.have.status(OK);
    });

    it('Should return statusCode 403 if no token is passed in', async () => {
      const result = await test.sendGetRequest('/api/user/getNewPaidMembersThisSemester');
      expect(result).to.have.status(FORBIDDEN);
    });

    it('Should return statusCode 401 if an invalid' +
      'token was passed in', async () => {
      setTokenStatus(false);
      const result = await test.sendGetRequestWithToken(token, '/api/user/getNewPaidMembersThisSemester');
      expect(result).to.have.status(UNAUTHORIZED);
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

  describe('POST /shortcutsearchusers', () => {
    const queryUser = { query: 'coOl' };
    const fiveMatchUsers = { query: 'Lot' };
    const url = '/api/user/shortcutsearchusers';

    it('Should return status code 403 if no token is passed through', async () => {
      setTokenStatus(false);
      const result = await test.sendPostRequest(url, queryUser);
      expect(result).to.have.status(FORBIDDEN);
    });

    it('Should return status code 401 if access level is invalid', async () => {
      setTokenStatus(false, { accessLevel: MEMBERSHIP_STATE.MEMBER });
      const result = await test.sendPostRequestWithToken(token, url, queryUser);
      expect(result).to.have.status(UNAUTHORIZED);
    });

    before(async () => {
      await User.deleteMany({});
      const users = [
        {
          // contains 'lot'
          firstName: 'Elton',
          lastName: 'Salvatore',
          email: 'test0@test.com',
          password: 'Passw0rd',
          emailVerified: true,
          accessLevel: MEMBERSHIP_STATE.NON_MEMBER, // Not a Member
          joinDate: new Date('2014-02-31'), // Previous Semester
          membershipValidUntil: getMemberExpirationDate(0), // Expired
        },
        {
          // contains both 'lot' and 'cool'
          firstName: 'Lot',
          lastName: 'IsCool',
          email: 'test1@test.com',
          password: 'Passw0rd',
          emailVerified: true,
          accessLevel: MEMBERSHIP_STATE.MEMBER,
          joinDate: new Date('2015-03-01'), // This Semester
          membershipValidUntil: getMemberExpirationDate(1), // Semester Plan
        },
        {
          // contains 'lot'
          firstName: 'Clinton',
          lastName: 'Roberts',
          email: 'test2@test.com',
          password: 'Passw0rd',
          emailVerified: true,
          accessLevel: MEMBERSHIP_STATE.MEMBER,
          joinDate: new Date('2014-09-10'), // Previous Semester
          membershipValidUntil: getMemberExpirationDate(2), // Annual Plan
        },
        {
          // contains both 'lot' and 'cool'
          firstName: 'Lola',
          lastName: 'Contetol',
          email: 'test3@test.com',
          password: 'Passw0rd',
          emailVerified: true,
          accessLevel: MEMBERSHIP_STATE.MEMBER,
          joinDate: new Date('2015-03-10'), // This Semester
          membershipValidUntil: getMemberExpirationDate(2) // Annual Plan
        },
        {
          // contains 'lot'
          firstName: 'Elton',
          lastName: 'Salvatore',
          email: 'test00@test.com',
          password: 'Passw0rd',
          emailVerified: true,
          accessLevel: MEMBERSHIP_STATE.NON_MEMBER, // Not a Member
          joinDate: new Date('2014-06-10'), // Previous Semester
          membershipValidUntil: getMemberExpirationDate(0), // Expired
        },
        {
          // contains 'lot'
          firstName: 'Lori',
          lastName: 'Mattingly',
          email: 'test5@test.com',
          password: 'Passw0rd',
          emailVerified: true,
          accessLevel: MEMBERSHIP_STATE.NON_MEMBER, // Not a Member
          joinDate: new Date('2015-03-15'), // This Semester
          //  Expiration Date Unchanged
        },
        {
          // contains 'lot'
          firstName: 'Mallory',
          lastName: 'Cotton',
          email: 'test6@test.com',
          password: 'Passw0rd',
          emailVerified: true,
          accessLevel: MEMBERSHIP_STATE.MEMBER,
          joinDate: new Date('2015-03-05'), // This Semester
          membershipValidUntil: getMemberExpirationDate(2), // Annual Plan
        },
        {
          // contains 'cool'
          firstName: 'Cool',
          lastName: 'Unmatch',
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

    describe('When valid token and access level - status code 200', () => {
      beforeEach(() => {
        setTokenStatus(true, { accessLevel: MEMBERSHIP_STATE.OFFICER });
      });

      it('Should return an empty array when the query is missing', async () => {
        const result = await test.sendPostRequestWithToken(token, url, {});
        expect(result).to.have.status(OK);
        expect(result.body).to.have.property('items').that.is.an('array').that.is.empty;
      });

      it('Should return FIVE records when query = \'Lot\'', async () => {
        const result = await test.sendPostRequestWithToken(token, url, fiveMatchUsers);
        expect(result).to.have.status(OK);
        expect(result.body).to.have.property('items').that.is.an('array');
        expect(result.body.items).to.have.lengthOf(5);
      });

      it('Should return no records when query = \'Pika\'', async () => {
        const result = await test.sendPostRequestWithToken(token, url, { query: 'Pika' });
        expect(result).to.have.status(OK);
        expect(result.body).to.have.property('items').that.is.an('array').that.is.empty;
      });

      beforeEach(() => {
        setTokenStatus(true, { accessLevel: MEMBERSHIP_STATE.ADMIN });
      });

      it('Should return THREE records when query = \'coOl\'', async () => {
        const result = await test.sendPostRequestWithToken(token, url, queryUser);
        expect(result).to.have.status(OK);
        expect(result.body).to.have.property('items').that.is.an('array');
        expect(result.body.items).to.have.lengthOf(3);
      });

      it('Should show results sorted by best match of name and email', async () => {
        const result = await test.sendPostRequestWithToken(token, url, fiveMatchUsers);
        expect(result).to.have.status(OK);
        expect(result.body).to.have.property('items').that.is.an('array');
        expect(result.body.items.map(u => u.email)).to.eql([
          'test1@test.com',
          'test0@test.com',
          'test00@test.com',
          'test2@test.com',
          'test3@test.com'
        ]);
      });
    });

    describe('When valid token and access level with injection-like input - status code 200', () => {
      beforeEach(() => {
        setTokenStatus(true, { accessLevel: MEMBERSHIP_STATE.ADMIN });
      });
      it('Should return AT MOST five records', async () => {
        const injectionPayloads = [
          '{"$gt": ""}',
          '{"$where": "this.firstName === \'Mallory\'"}',
          '{"$ne": null}',
          '{"$or": [ {}, {} ]}',
          '{"$regex": ".*" }',
          '.*',
          '^',
          '[object Object]',
          [],
          {},
          null,
          undefined
        ];
        for (const payload of injectionPayloads) {
          const result = await test.sendPostRequestWithToken(token, url, { query: String(payload)});
          expect(result).to.have.status(OK);
          expect(result.body).to.have.property('items').that.is.an('array');
          expect(result.body.items.length).at.most(5);
        }
      });
    });

    after(() => {
      User.deleteMany({});
    });
  });
});