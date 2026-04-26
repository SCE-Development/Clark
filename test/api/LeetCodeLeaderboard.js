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

  const ADD_API_PATH = '/api/LeetCodeLeaderboard/addUser';
  const DELETE_API_PATH = '/api/LeetCodeLeaderboard/deleteUser';
  const GET_ALL_USERS_API_PATH = '/api/LeetCodeLeaderboard/';

  before(() => {
    initializeTokenMock();

    getAllUsersStub = sandbox.stub(LeetCodeLeaderboardUtils, 'getAllUsers');
    getAllUsersStub.resolves([{ username: 'testuser', firstName: 'Test', lastName: 'User' }]);

    addUserStub = sandbox.stub(LeetCodeLeaderboardUtils, 'addUserToLeaderboard');
    addUserStub.resolves(true);

    deleteUserStub = sandbox.stub(LeetCodeLeaderboardUtils, 'deleteUserFromLeaderboard');
    deleteUserStub.resolves(true);

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

  describe('GET /', () => {
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
  });
});
