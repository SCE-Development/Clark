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

  describe('/POST checkIfUserExists with no users added yet', () => {
    it('Should return statusCode 400 when an email is not' +
      'provided', async () => {
      const user = {};
      const result = await test.sendPostRequest(
        '/api/User/checkIfUserExists', user);
      expect(result).to.have.status(BAD_REQUEST);
    });

    it('Should return statusCode 200 when a user does not exist', async () => {
      const user = {
        email: 'a@b.c'
      };
      const addUser = {
        email: 'a@b.c',
        password: 'Passw0rd',
        firstName: 'first-name',
        lastName: 'last-name'
      };
      test.sendPostRequest('/api/Auth/register', addUser);
      const result = await test.sendPostRequest(
        '/api/User/checkIfUserExists', user);
      expect(result).to.have.status(OK);
    });
  });

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
      result.body.count.should.be.greaterThanOrEqual(0);
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
  });

  describe('POST /apikey', () => {
    let user;
    let usertoken;

    before(async () => {
      user = new User({
        _id: id,
        firstName: 'first-name',
        lastName: 'last-name',
        email: 'test@user.com',
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
});
