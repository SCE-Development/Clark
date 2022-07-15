/* global describe it before after beforeEach afterEach */
// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

const User = require('../../api/main_endpoints/models/User.js');

// Require the dev-dependencies
const chai = require('chai');
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
        const result = await test.sendPostRequest(
          '/api/User/users', user);
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
        const result = await test.sendPostRequest(
          '/api/User/search', user);
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
        email: 'a@b.c'
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
        const result = await test.sendPostRequest(
          '/api/User/edit', user);
        expect(result).to.have.status(UNAUTHORIZED);
      });

    it('Should return statusCode 404 if no user was found', async () => {
      const user = {
        email: 'invalid@b.c',
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
          email: 'a@b.c',
          token: token,
          firstName: 'pinkUnicorn',
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

  describe('/POST delete', () => {
    it('Should return statusCode 403 if no token is passed in', async () => {
      const user = {
        email: 'a@b.c'
      };
      const result = await test.sendPostRequest(
        '/api/User/delete', user);
      expect(result).to.have.status(FORBIDDEN);
    });

    it('Should return statusCode 403 if an invalid ' +
      'token was passed in', async () => {
        const user = {
          email: 'a@b.c',
          token: 'Invalid token'
        };
        const result = await test.sendPostRequest(
          '/api/User/delete', user);
        expect(result).to.have.status(UNAUTHORIZED);
      });

    it('Should return statusCode 404 if no user was found', async () => {
      const user = {
        email: 'invalid@b.c',
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
          email: 'a@b.c',
          token: token
        };
        setTokenStatus(true);
        const result = await test.sendPostRequestWithToken(
          token, '/api/User/delete', user);
        expect(result).to.have.status(OK);
        result.body.should.be.a('object');
        result.body.should.have.property('message');
      });
  });

  describe('/POST connectToDiscord', () => {
    it('Should return statusCode 403 if no token was passed in', async () => {
      const user = {
        email: 'a@b.c'
      };
      const result = await test.sendPostRequest(
        '/api/user/connectToDiscord', user);
      expect(result).to.have.status(FORBIDDEN);
    });
    it('Should return statusCode 401 if an invalid ' +
      'token was passed in', async () => {
        const user = {
          email: 'a@b.c',
          token: 'Invalid token'
        };
        const result = await test.sendPostRequest(
          '/api/user/connectToDiscord', user);
        expect(result).to.have.status(UNAUTHORIZED);
      });
    it('Should return statusCode 400 if an incorrect or no ' +
      'email was used', async () => {
        const user = {
          token
        };
        setTokenStatus(true);
        const result = await test.sendPostRequestWithToken(
          token, '/api/user/connectToDiscord', user);
        expect(result).to.have.status(BAD_REQUEST);
      });
    it('Should return statusCode 200 ' +
      'if Discord connection was successful', async () => {
        const user = {
          email: 'a@b.c',
          token
        };
        setTokenStatus(true);
        const result = await test.sendPostRequestWithToken(
          token, '/api/user/connectToDiscord', user);
        expect(result).to.have.status(OK);
      });
  });

  describe('/GET callback', () => {
    let discordStub = sandbox.stub(discordModule,
      'loginWithDiscord');
    it('Should return statusCode 200 if connection is true', async () => {
      discordStub.resolves(true);
      const result = await test.sendGetRequest('/api/user/callback');
      expect(result).to.have.status(OK);
      expect(result.redirects).to.have.lengthOf(1);
      expect(result.redirects[0]).to
        .equal('https://discord.com/oauth2/authorized');
    });
    it('Should return statusCode 404 if connection is false', async () => {
      discordStub.rejects({});
      const result = await test.sendGetRequest('/api/user/callback');
      expect(result).to.have.status(NOT_FOUND);
      expect(result.text).to.equal('Authorization unsuccessful!');
    });
  });

  describe('/POST getUserFromDiscordId', () => {
    it('Should return status code 401 if API key is invaid', async () => {
      setTokenStatus(false);
      const body = {
        apiKey: 'Invalid api',
        discordID: '0123456789'
      };
      const result = await test.sendPostRequest(
        '/api/user/getUserFromDiscordId', body);

      console.log(result);
      expect(result).to.have.status(UNAUTHORIZED);
    });
  });
});
