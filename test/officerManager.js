/* global describe it before after beforeEach afterEach */
// During the test the env variable is set to test
process.env.NODE_ENV = 'test';
const OfficerManager = require('../api/main_endpoints/models/OfficerManager');
const User = require('../api/main_endpoints/models/User');
const chai = require('chai');
const chaiHttp = require('chai-http');
const {
  OK,
  BAD_REQUEST,
  UNAUTHORIZED,
  NOT_FOUND,
  FORBIDDEN
} = require('../api/util/constants').STATUS_CODES;
const SceApiTester = require('../test/util/tools/SceApiTester');

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
const { DEFAULT_PHOTO_URL } = require('../api/util/constants');
chai.should();
chai.use(chaiHttp);

// Our parent block
describe('OfficerManager', () => {
  before(done => {
    initializeMock();
    app = tools.initializeServer(
      __dirname + '/../api/main_endpoints/routes/officerManager.js');
    test = new SceApiTester(app);
    // Before each test we empty the database
    tools.emptySchema(OfficerManager);
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

  describe('/POST submit', () => {
    it('Should return statusCode 400 when the ' +
       'required fields are not set', async () => {
      const form = { token: token };
      setTokenStatus(true);
      const result = await test.sendPostRequest(
        '/api/officerManager/submit', form);
      expect(result).to.have.status(BAD_REQUEST);
    });

    it('Should return statusCode 403 when no token is submited', async () => {
      const form = {
        email: 'test@test.com',
        team: 'dev'
      };
      const result = await test.sendPostRequest(
        '/api/officerManager/submit', form);
      expect(result).to.have.status(FORBIDDEN);
    });

    it('Should return statusCode 401 when invalid token is submited',
      async () => {
        const form = {
          email: 'test@test.com',
          team: 'dev',
          token: 'Invalid-Token'
        };
        const result = await test.sendPostRequest(
          '/api/officerManager/submit', form);
        expect(result).to.have.status(UNAUTHORIZED);
      });

    it('Should return statusCode 200 when all required ' +
       'fields are filled in', async () => {
      const form = {
        name: 'member',
        email: 'test@test.com',
        team: 'dev',
        linkedin: 'linkedinlink',
        quote: 'aquote',
        pictureUrl: DEFAULT_PHOTO_URL,
        token: token
      };
      setTokenStatus(true);
      const result = await test.sendPostRequest(
        '/api/officerManager/submit', form);
      expect(result).to.have.status(OK);
    });
  });

  describe('/POST getOfficers', () => {
    it('Should return an object of all forms', async () => {
      const form = { token: token };
      setTokenStatus(true);
      const result = await test.sendPostRequest(
        '/api/officerManager/getOfficers', form);
      expect(result).to.have.status(OK);
      const response = result.body;
      response.should.be.a('array');
      expect(response).to.have.length(1);
      expect(response[0].name).to.be.eql('member');
      expect(response[0].email).to.be.eql('test@test.com');
      expect(response[0].team).to.be.eql('dev');
      expect(response[0].linkedin).to.be.eql('linkedinlink');
      expect(response[0].quote).to.be.eql('aquote');
      expect(response[0].pictureUrl).to.be.eql(DEFAULT_PHOTO_URL);
    });

    it('Should return an object of only querried parameter', async () => {
      const form = {
        email: 'test@test.com',
        token: token
      };
      setTokenStatus(true);
      const result = await test.sendPostRequest(
        '/api/officerManager/getOfficers', form);
      expect(result).to.have.status(OK);
      result.body.should.be.a('array');
      result.body.forEach(obj => {
        expect(obj.email).to.be.eql('test@test.com');
      });
    });
  });

  describe('/POST edit', () => {
    it('Should return statusCode 403 if no token is passed in', async () => {
      const form = {
        name: 'pinkUnicorn'
      };
      const result = await test.sendPostRequest(
        '/api/officerManager/edit', form);
      expect(result).to.have.status(FORBIDDEN);
    });

    it('Should return statusCode 401 if an invalid ' +
       'token was passed in', async () => {
      const form = {
        token: 'Invalid token',
        email: 'test@test.com'
      };
      const result = await test.sendPostRequest(
        '/api/officerManager/edit', form);
      expect(result).to.have.status(UNAUTHORIZED);
    });

    it('Should return statusCode 404 if no form was found', async () => {
      const form = {
        token: token,
        email: 'invalid-email'
      };
      setTokenStatus(true);
      const result = await test.sendPostRequest(
        '/api/officerManager/edit', form);
      expect(result).to.have.status(NOT_FOUND);
    });

    it('Should return statusCode 200 and a message ' +
       'if a form was edited', async () => {
      const form = {
        token: token,
        email: 'test@test.com',
        team: 'event'
      };
      setTokenStatus(true);
      const result = await test.sendPostRequest(
        '/api/officerManager/edit', form);
      expect(result).to.have.status(OK);
      result.body.should.be.a('object');
      result.body.should.have.property('message');
    });

    it('The update should be reflected in the database', async () => {
      const form = {
        token: token,
        email: 'test@test.com'
      };
      setTokenStatus(true);
      const result = await test.sendPostRequest(
        '/api/officerManager/getOfficers', form);
      expect(result).to.have.status(OK);
      expect(result.body[0].team).to.equal('event');
    });
  });

  describe('/POST delete', () => {
    it('Should return statusCode 403 if no token is passed in', async () => {
      const form = {
        name: 'invalid-name',
        email: 'test@test.com'
      };
      const result = await test.sendPostRequest(
        '/api/officerManager/delete', form);
      expect(result).to.have.status(FORBIDDEN);
    });

    it('Should return statusCode 401 if an invalid ' +
       'token was passed in', async () => {
      const form = {
        token: 'Invalid token',
        email: 'test@test.com'
      };
      const result = await test.sendPostRequest(
        '/api/officerManager/delete', form);
      expect(result).to.have.status(UNAUTHORIZED);
    });

    it('Should return statusCode 404 if no form was found', async () => {
      const form = {
        token: token,
        email: 'fsefvsf@dsges.csadw'
      };
      setTokenStatus(true);
      const result = await test.sendPostRequest(
        '/api/officerManager/delete', form);
      expect(result).to.have.status(NOT_FOUND);
    });

    it('Should return statusCode 200 and a message ' +
       'if a form was deleted', async () => {
      const form = {
        token: token,
        email: 'test@test.com'
      };
      setTokenStatus(true);
      const result = await test.sendPostRequest(
        '/api/officerManager/delete', form);
      expect(result).to.have.status(OK);
      result.body.should.be.a('object');
      result.body.should.have.property('message');
    });

    it('The deleted item should be reflected in the database', async () => {
      const form = {
        token: token,
        email: 'test@test.com'
      };
      setTokenStatus(true);
      const result = await test.sendPostRequest(
        '/api/officerManager/getOfficers', form);
      expect(result).to.have.status(OK);
      expect(result.body).have.length(0);
    });
  });
});
