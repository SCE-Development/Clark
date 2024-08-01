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
const { mockDayMonthAndYear, revertClock } = require('../util/mocks/Date.js');
const { MEMBERSHIP_STATE } = require('../../api/util/constants');

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
    revertClock();
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

    it('Should return statusCode 200 and a message ' +
      'if a user was edited', async () => {
      const user = {
        _id: id,
        email: 'd@e.f',
        token: token,
        firstName: 'pinkUnicorn',
        discordID: '0987654321',
        numberOfSemestersToSignUpFor: undefined
      };
      setTokenStatus(true);
      const result = await test.sendPostRequestWithToken(
        token, '/api/User/edit', user);
      expect(result).to.have.status(OK);
      result.body.should.be.a('object');
      result.body.should.have.property('message');
    });
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

  describe('/GET countAllUsers', () => {
    it('Should return statusCode 200 if count >= 1', async () => {
      setTokenStatus(true);
      const query = '?search=a';
      const result = await test.sendGetRequestWithToken(
        token, `/api/User/countAllUsers${query}`);
      expect(result).to.have.status(OK);
      result.body.count.should.be.greaterThanOrEqual(1);
    });
    it('Should return statusCode 404 if count == 0', async () => {
      setTokenStatus(true);
      const query = '?search=ab%cd%de';
      const result = await test.sendGetRequestWithToken(
        token, `/api/User/countAllUsers${query}`);
      expect(result).to.have.status(NOT_FOUND);
      result.body.count.should.be.equal(0);
    });
    it('Should return statusCode 403 if no token is passed in', async () => {
      const query = '?search=a';
      const result = await test.sendGetRequest(
        `/api/User/countAllUsers${query}`);
      expect(result).to.have.status(FORBIDDEN);
    });
    it('Should return statusCode 401 if an invalid ' +
    'token was passed in', async () => {
      setTokenStatus(false);
      const query = '?search=a';
      const result = await test.sendGetRequestWithToken(
        token, `/api/User/countAllUsers${query}`);
      expect(result).to.have.status(UNAUTHORIZED);
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

  describe('/POST countMembers', () => {
    it('Should return statusCode 403 if no token is passed in', async () => {
      const user = {
        _id : id
      };
      const result = await test.sendPostRequest(
        '/api/User/countMembers', user);
      expect(result).to.have.status(FORBIDDEN);
    });
    it('Should return statusCode 401 if an invalid ' +
      'token was passed in', async () => {
      const user = {
        _id: id,
        token: 'Invalid token'
      };
      const result = await test.sendPostRequestWithToken(
        token, '/api/User/countMembers', user);
      expect(result).to.have.status(UNAUTHORIZED);
    });
    it('Should return statusCode 200 and the member counts correctly for fall semester if a valid token is passed in', async () => {
      const mockCurrentDate = mockDayMonthAndYear(31, 11, 2023); // December 31, 2023
      const user = {
        userID : id,
        token: token
      };
      const addUsers = [
        {
          email: 'user1@example.com',
          password: 'password',
          firstName: 'User',
          lastName: 'One',
          emailVerified: true,
          accessLevel: MEMBERSHIP_STATE.MEMBER,
          joinDate: new Date(2023, 5, 1),
          membershipValidUntil: new Date(2024, 0, 1) // 1 Semester
        },
        {
          email: 'user2@example.com',
          password: 'password',
          firstName: 'User',
          lastName: 'Two',
          emailVerified: true,
          accessLevel: MEMBERSHIP_STATE.MEMBER,
          joinDate: new Date(2023, 5, 1),
          membershipValidUntil: new Date(2024, 5, 1) // 2 Semesters
        },
        {
          email: 'user3@example.com',
          password: 'password',
          firstName: 'User',
          lastName: 'Three',
          emailVerified: true,
          accessLevel: MEMBERSHIP_STATE.MEMBER,
          joinDate: new Date(2023, 7, 13),
          membershipValidUntil: new Date(2024, 0, 1) // 1 Semester
        },
        {
          email: 'user4@example.com',
          password: 'password',
          firstName: 'User',
          lastName: 'Four',
          emailVerified: true,
          accessLevel: MEMBERSHIP_STATE.MEMBER,
          joinDate: new Date(2023, 4, 31),
          membershipValidUntil: new Date(2024, 0, 1) // 2 Semesters but shouldn't be included since join date was last semester
        }
      ];
      setTokenStatus(true);
      await User.insertMany(addUsers);
      const result = await test.sendPostRequestWithToken(token, '/api/User/countMembers', user);

      expect(result).to.have.status(OK);
      result.body.should.be.a('object');
      result.body.should.have.property('newSingleAndAnnualMembers').that.equals(3);
      result.body.should.have.property('newSingleSemester').that.equals(2);
      result.body.should.have.property('newAnnualMembers').that.equals(1);
      result.body.should.have.property('totalNewMembersThisYear').that.equals(4);
      result.body.should.have.property('currentActiveMembers').that.equals(4);
      tools.emptySchema(User);
    });
    it('Should return statusCode 200 and the member counts correctly for spring semester if a valid token is passed in', async () => {
      const mockCurrentDate = mockDayMonthAndYear(2, 0, 2023); // January 2, 2023
      const user = {
        userID : id,
        token: token
      };
      const addUsers = [
        {
          email: 'user5@example.com',
          password: 'password',
          firstName: 'User',
          lastName: 'Five',
          emailVerified: true,
          accessLevel: MEMBERSHIP_STATE.MEMBER,
          joinDate: new Date(2023, 0, 1),
          membershipValidUntil: new Date(2023, 5, 1) // 1 Semester
        },
        {
          email: 'user6@example.com',
          password: 'password',
          firstName: 'User',
          lastName: 'Six',
          emailVerified: true,
          accessLevel: MEMBERSHIP_STATE.MEMBER,
          joinDate: new Date(2023, 0, 2),
          membershipValidUntil: new Date(2024, 0, 1) // 2 Semesters
        },
        {
          email: 'user7@example.com',
          password: 'password',
          firstName: 'User',
          lastName: 'Seven',
          emailVerified: true,
          accessLevel: MEMBERSHIP_STATE.MEMBER,
          joinDate: new Date(2023, 0, 2),
          membershipValidUntil: new Date(2023, 5, 1) // 1 Semester
        },
        {
          email: 'user8@example.com',
          password: 'password',
          firstName: 'User',
          lastName: 'Eight',
          emailVerified: true,
          accessLevel: MEMBERSHIP_STATE.MEMBER,
          joinDate: new Date(2022, 11, 31),
          membershipValidUntil: new Date(2023, 5, 1) // 2 Semesters but shouldn't be included since join date was last semester
        }
      ];
      setTokenStatus(true);
      await User.insertMany(addUsers);
      const result = await test.sendPostRequestWithToken(token, '/api/User/countMembers', user);

      expect(result).to.have.status(OK);
      result.body.should.be.a('object');
      result.body.should.have.property('newSingleAndAnnualMembers').that.equals(3);
      result.body.should.have.property('newSingleSemester').that.equals(2);
      result.body.should.have.property('newAnnualMembers').that.equals(1);
      result.body.should.have.property('totalNewMembersThisYear').that.equals(3);
      result.body.should.have.property('currentActiveMembers').that.equals(4);
    });
  });
});
