/* global describe it before after beforeEach afterEach */
process.env.NODE_ENV = 'test';
const User = require('../api/models/User');
// Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const {
  OK,
  BAD_REQUEST,
  UNAUTHORIZED,
  CONFLICT
} = require('../api/util/constants').STATUS_CODES;
const SceApiTester = require('./util/tools/SceApiTester');

let app = null;
let test = null;
const expect = chai.expect;
// tools for testing
const tools = require('./util/tools/tools.js');
const {
  setTokenStatus,
  resetMock,
  restoreMock,
  initializeMock
} = require('./util/mocks/TokenValidFunctions');

chai.should();
chai.use(chaiHttp);

// Our parent block
describe('Auth', () => {
  before(done => {
    initializeMock();
    app = tools.initializeServer(__dirname +
      '/../api/routes/Auth.js');
    test = new SceApiTester(app);
    // Before each test we empty the database
    tools.emptySchema(User);
    done();
  });

  after(done => {
    restoreMock();
    tools.terminateServer(done);
  });

  beforeEach(() => {
    setTokenStatus(false);
  });

  afterEach(() => {
    resetMock();
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
      expect(result).to.have.status(BAD_REQUEST);
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
        const result = await test.sendPostRequestWithToken(
          token, '/api/Auth/verify', null);
        expect(result).to.have.status(UNAUTHORIZED);
      });

    it('Should return statusCode 401 when an invalid ' +
        'token is passed in', async () => {
      const result = await test.sendPostRequest(
        '/api/Auth/verify', { token: 'Invalid Token' });
      expect(result).to.have.status(UNAUTHORIZED);
    });

    it('Should return statusCode 200 when a valid' +
        'token is passed in', async () => {
      setTokenStatus({
        name: 'name',
        email: 'email',
        accessLevel: 'accessLevel'
      });
      const result = await test.sendPostRequestWithToken(
        token, '/api/Auth/verify', { token: token });
      expect(result).to.have.status(OK);
    });
  });

});
