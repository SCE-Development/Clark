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
const discordModule
  = require('../../api/main_endpoints/util/discord-connection');


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


describe('Messages', () => {
  before(done => {
    initializeTokenMock();
    initializeDiscordAPIMock();
    app = tools.initializeServer([
      __dirname + '/../../api/main_endpoints/routes/User.js',
      __dirname + '/../../api/main_endpoints/routes/Auth.js',
      __dirname + '/../../api/main_endpoints/routes/Messages.js',
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

  describe('POST /send', () => {

    let user;
    let usertoken;

    before(async () => {
      user = new User({
        _id: id,
        firstName: 'first-name',
        lastName: 'last-name',
        email: 'test1@user.com',
        password: 'Passw0rd',
        emailVerified: true,
        accessLevel: MEMBERSHIP_STATE.MEMBER,
        apiKey: 123
      });
      await user.save();

      it('Should return status code 200 if valid api-key, room-id, and message was sent', async () => {
        const result = await test.sendPostRequest('/api/messages/send', {
          apiKey: 123,
          message: 'Hello',
          id: 'general'
        });
        expect(result).to.have.status(OK);
      });
    });
  });
});
