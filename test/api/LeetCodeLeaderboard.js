/* global describe it before after beforeEach afterEach */
process.env.NODE_ENV = 'test';

// Require the dev-dependencies
const chai = require('chai');
const mongoose = require('mongoose');

const chaiHttp = require('chai-http');
const {
  OK,
  BAD_REQUEST,
  UNAUTHORIZED,
  NOT_FOUND,
  SERVER_ERROR,
  FORBIDDEN,
} = require('../../api/util/constants').STATUS_CODES;
const {
  initializeTokenMock,
  setTokenStatus,
  resetTokenMock,
  restoreTokenMock,
} = require('../util/mocks/TokenValidFunctions');
const sinon = require('sinon');
const SceApiTester = require('../util/tools/SceApiTester');
const LeetCodeLeaderboardUtils = require('../../api/main_endpoints/util/LeetCodeLeaderboard');

let app = null;
let test = null;

const expect = chai.expect;
const tools = require('../util/tools/tools.js');
let sandbox = sinon.createSandbox();

chai.should();
chai.use(chaiHttp);

const token = '';

describe('LeetCodeLeaderboard', () => {
  let getAllUsersStub = null;
  let addUserStub = null;
  let deleteUserStub = null;
  let checkIfUserExistsStub = null;

  const ADD_API_PATH = '/api/LeetCodeLeaderboard/addUser';
  const DELETE_API_PATH = '/api/LeetCodeLeaderboard/deleteUser';
  const GET_ALL_USERS_API_PATH = '/api/LeetCodeLeaderboard/getAllUsers';
  const CHECK_USER_EXISTS_API_PATH = '/api/LeetCodeLeaderboard/checkIfUserExists';

  before(() => {
    initializeTokenMock();

    getAllUsersStub = sandbox.stub(LeetCodeLeaderboardUtils, 'getAllUsers');
    getAllUsersStub.resolves([{ username: 'testuser', firstName: 'Test', lastName: 'User' }]);

    addUserStub = sandbox.stub(LeetCodeLeaderboardUtils, 'addUserToLeaderboard');
    addUserStub.resolves(true);

    deleteUserStub = sandbox.stub(LeetCodeLeaderboardUtils, 'deleteUserFromLeaderboard');
    deleteUserStub.resolves(true);

    checkIfUserExistsStub = sandbox.stub(LeetCodeLeaderboardUtils, 'checkIfUserExists');
    checkIfUserExistsStub.resolves({ exists: true });

    app = tools.initializeServer([
      __dirname + '/../../api/main_endpoints/routes/LeetCodeLeaderboard.js',
    ]);
    test = new SceApiTester(app);
  });

  beforeEach(() => {
    setTokenStatus(false);
  });

  afterEach(() => {
    resetTokenMock();
  });

  after(done => {
    restoreTokenMock();
    tools.terminateServer(done);
  });

  describe('GET /getAllUsers', () => {
    it('Should return 401 when token is not sent', async () => {
      const result = await test.sendGetRequest(GET_ALL_USERS_API_PATH);
      expect(result).to.have.status(UNAUTHORIZED);
    });

    it('Should return 403 when invalid token is sent', async () => {
      setTokenStatus(null);
      const result = await test.sendGetRequestWithToken(token,
        GET_ALL_USERS_API_PATH);
      expect(result).to.have.status(FORBIDDEN);
    });

    it('Should return 200 with a successful fetch of all users', async () => {
      setTokenStatus(true);
      const result = await test.sendGetRequestWithToken(token,
        GET_ALL_USERS_API_PATH,
      );
      expect(result).to.have.status(OK);
    });

    it('Should return 500 if there was an error fetching all users', async () => {
      setTokenStatus(true);
      getAllUsersStub.resolves(null);
      const result = await test.sendGetRequestWithToken(token,
        GET_ALL_USERS_API_PATH,
      );
      expect(result).to.have.status(SERVER_ERROR);
      getAllUsersStub.restore();
    });
  });

  describe('POST /addUser', () => {
    it('Should return 401 when token is not sent', async () => {
      const result = await test.sendPostRequest(ADD_API_PATH);
      expect(result).to.have.status(UNAUTHORIZED);
    });

    it('Should return 403 when invalid token is sent', async () => {
      setTokenStatus(null);
      const result = await test.sendPostRequestWithToken(token,
        ADD_API_PATH);
      expect(result).to.have.status(FORBIDDEN);
    });

    it('Should return 400 when required fields are missing', async () => {
      setTokenStatus(true);
      const result = await test.sendPostRequestWithToken(token,
        ADD_API_PATH,
        { username: 'testuser' },
      );
      expect(result).to.have.status(BAD_REQUEST);
    });

    it('Should return 200 when user is added successfully', async () => {
      setTokenStatus(true);
      const result = await test.sendPostRequestWithToken(token,
        ADD_API_PATH,
        {
          username: 'testuser',
          firstName: 'Test',
          lastName: 'User',
        },
      );
      expect(result).to.have.status(OK);
    });

    it('Should return 500 if there was an error adding the user', async () => {
      setTokenStatus(true);
      addUserStub.resolves(false);
      const result = await test.sendPostRequestWithToken(token,
        ADD_API_PATH,
        {
          username: 'testuser',
          firstName: 'Test',
          lastName: 'User',
        },
      );
      expect(result).to.have.status(SERVER_ERROR);
      addUserStub.restore();
    });
  });

  describe('POST /deleteUser', () => {
    it('Should return 401 when token is not sent', async () => {
      const result = await test.sendPostRequest(DELETE_API_PATH);
      expect(result).to.have.status(UNAUTHORIZED);
    });

    it('Should return 403 when invalid token is sent', async () => {
      setTokenStatus(null);
      const result = await test.sendPostRequestWithToken(token,
        DELETE_API_PATH);
      expect(result).to.have.status(FORBIDDEN);
    });

    it('Should return 400 when username field is missing', async () => {
      setTokenStatus(true);
      const result = await test.sendPostRequestWithToken(token,
        DELETE_API_PATH,
        {},
      );
      expect(result).to.have.status(BAD_REQUEST);
    });

    it('Should return 200 when user is deleted successfully', async () => {
      setTokenStatus(true);
      const result = await test.sendPostRequestWithToken(token,
        DELETE_API_PATH,
        { username: 'testuser' },
      );
      expect(result).to.have.status(OK);
    });

    it('Should return 500 if there was an error deleting the user', async () => {
      setTokenStatus(true);
      deleteUserStub.resolves(false);
      const result = await test.sendPostRequestWithToken(token,
        DELETE_API_PATH,
        { username: 'testuser' },
      );
      expect(result).to.have.status(SERVER_ERROR);
      deleteUserStub.restore();
    });
  });

  describe('POST /checkIfUserExists', () => {
    it('Should return 401 when token is not sent', async () => {
      const result = await test.sendPostRequest(CHECK_USER_EXISTS_API_PATH);
      expect(result).to.have.status(UNAUTHORIZED);
    });

    it('Should return 403 when invalid token is sent', async () => {
      setTokenStatus(null);
      const result = await test.sendPostRequestWithToken(token,
        CHECK_USER_EXISTS_API_PATH);
      expect(result).to.have.status(FORBIDDEN);
    });

    it('Should return 400 when username field is missing', async () => {
      setTokenStatus(true);
      const result = await test.sendPostRequestWithToken(token,
        CHECK_USER_EXISTS_API_PATH,
        {},
      );
      expect(result).to.have.status(BAD_REQUEST);
    });

    it('Should return 200 when user existence is checked successfully', async () => {
      setTokenStatus(true);
      const result = await test.sendPostRequestWithToken(token,
        CHECK_USER_EXISTS_API_PATH,
        { username: 'testuser' },
      );
      expect(result).to.have.status(OK);
    });

    it('Should return 200 and false when user does not exist', async () => {
      setTokenStatus(true);
      checkIfUserExistsStub.resolves({ exists: false });
      const result = await test.sendPostRequestWithToken(token,
        CHECK_USER_EXISTS_API_PATH,
        { username: 'nonexistentuser' },
      );
      expect(result).to.have.status(OK);
      expect(result.body).to.have.property('exists', false);
      checkIfUserExistsStub.restore();
    });

    it('Should return 500 if there was an error checking user existence', async () => {
      setTokenStatus(true);
      checkIfUserExistsStub.resolves({ error: true, message: 'Internal server error', status: SERVER_ERROR });
      const result = await test.sendPostRequestWithToken(token,
        CHECK_USER_EXISTS_API_PATH,
        { username: 'testuser' },
      );
      expect(result).to.have.status(SERVER_ERROR);
      checkIfUserExistsStub.restore();
    });
  });
});
