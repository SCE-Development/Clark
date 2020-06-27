/* global describe it before after beforeEach afterEach */
// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

const User = require('../api/models/User');

// Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const {
  OK,
  BAD_REQUEST,
  UNAUTHORIZED,
  NOT_FOUND,
  CONFLICT,
  FORBIDDEN
} = require('../api/constants').STATUS_CODES;
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
describe('User', () => {
  before(done => {
    initializeMock();
    app = tools.initializeServer(__dirname + '/../api/routes/User.js');
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
      const result = await test.sendPostRequest(
        '/api/User/checkIfUserExists', user);
      expect(result).to.have.status(OK);
    });
  });

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
        '/api/User/register', user);
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
        '/api/User/register', user);
      expect(result).to.have.status(CONFLICT);
    });
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
      '/api/User/register', user);
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
      '/api/User/register', user);
    expect(result).to.have.status(BAD_REQUEST);
  });

  // Failing. Right now if this test is included, then
  // it removes the user from the database?
  // If this is commented out, then the user created above persists?
  describe('/POST checkIfUserExists with a user added', () => {
    it('Should return statusCode 409 when a user already exists', async () => {
      const user = {
        email: 'a@b.c'
      };
      const result = await test.sendPostRequest(
        '/api/User/checkIfUserExists', user);
      expect(result).to.have.status(CONFLICT);
    });
  });

  describe('/POST login', () => {
    it('Should return statusCode 400 if an email and/or ' +
       'password is not provided', async () => {
      const user = {};
      const result = await test.sendPostRequest(
        '/api/User/login', user);
      expect(result).to.have.status(BAD_REQUEST);
    });

    it('Should return statusCode 401 if an email/pass combo ' +
       'does not match a record in the DB', async () => {
      const user = {
        email: 'nota@b.c',
        password: 'Passwd'
      };
      const result = await test.sendPostRequest(
        '/api/User/login', user);
      expect(result).to.have.status(UNAUTHORIZED);
    });

    it('Should return statusCode 401 if the email exists ' +
       'but password is incorrect', async () => {
      const user = {
        email: 'a@b.c',
        password: 'password'
      };
      const result = await test.sendPostRequest(
        '/api/User/login', user);
      expect(result).to.have.status(UNAUTHORIZED);
    });

    /**
     * failing because user's default acesslevel is NOW -1
     * (pending), user can't login until verify email
     * fix this when email-verify-module is working
     */
    // it('Should return statusCode 200 and a JWT token
    // if the email/pass is correct', done => {
    //   const user = {
    //     email: 'a@b.c',
    //     password: 'Passw0rd'
    //   }
    //   chai
    //     .request(app)
    //     .post('/api/User/login')
    //     .send(user)
    //     .then(function (res) {
    //       expect(res).to.have.status(OK)
    //       res.body.should.be.a('object')
    //       res.body.should.have.property('token')
    //       token = res.body.token

    //       done()
    //     })
    //     .catch(err => {
    //       throw err
    //     })
    // })
  });

  describe('/POST verify', () => {
    it('Should return statusCode 401 when a token is not passed in',
      async () => {
        const result = await test.sendPostRequestWithToken(
          token, '/api/User/verify', null);
        expect(result).to.have.status(UNAUTHORIZED);
      });

    it('Should return statusCode 401 when an invalid ' +
        'token is passed in', async () => {
      const result = await test.sendPostRequest(
        '/api/User/verify', { token: 'Invalid Token' });
      expect(result).to.have.status(UNAUTHORIZED);
    });

    it('Should return statusCode 200 when a valid' +
        'token is passed in', async () => {
      setTokenStatus({
        name: 'name',
        email: 'email',
        accessLevel: 'accessLevel'
      });
      const result = await test.sendPostRequest(
        '/api/User/verify', { token: token });
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
    });
  });

  describe('/POST edit', () => {
    it('Should return statusCode 403 if no token is passed in', async () => {
      const user = {
        queryEmail: 'a@b.c'
      };
      const result = await test.sendPostRequest(
        '/api/User/edit', user);
      expect(result).to.have.status(FORBIDDEN);
    });

    it('Should return statusCode 401 if an invalid ' +
       'token was passed in', async () => {
      const user = {
        queryEmail: 'a@b.c',
        token: 'Invalid token'
      };
      const result = await test.sendPostRequest(
        '/api/User/edit', user);
      expect(result).to.have.status(UNAUTHORIZED);
    });

    it('Should return statusCode 404 if no user was found', async () => {
      const user = {
        queryEmail: 'invalid@b.c',
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

    it('Should return statusCode 403 if an invalid' +
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

    it('Should return statusCode 200 and a message' +
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
});
