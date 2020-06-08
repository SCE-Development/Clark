/* global describe it before after */
// During the test the env variable is set to test
process.env.NODE_ENV = 'test';
const PrintingForm3D = require('../api/models/PrintingForm3D');
const tokenValidMocker = require('./util/mocks/TokenValidFunctions');
// Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const {
  OK,
  BAD_REQUEST,
  UNAUTHORIZED,
  FORBIDDEN,
  NOT_FOUND
} = require('../api/constants').STATUS_CODES;

let app = null;
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
describe('3DPrintingForm', () => {
  before(done => {
    initializeMock();
    app = tools.initializeServer(
      __dirname + '/../api/routes/3DPrintingForm.js');
    tools.emptySchema(PrintingForm3D);
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

  const token = 'token';
  let date = 0;

  describe('/POST submit', () => {
    it('Should return statusCode 401 when the ' +
       'required fields are not set', done => {
      const form = {};
      chai
        .request(app)
        .post('/api/3DPrintingForm/submit')
        .send(form)
        .then(function(res) {
          expect(res).to.have.status(BAD_REQUEST);

          done();
        })
        .catch(err => {
          throw err;
        });
    });
    it('Should return statusCode 200 when all ' +
       'required fields are filled in', done => {
      const form = {
        name: 'pinkUnicorn',
        color: 'Rainbow',
        contact: 'b@b.c',
        email: 'b@b.c'
      };
      chai
        .request(app)
        .post('/api/3DPrintingForm/submit')
        .send(form)
        .then(function(res) {
          expect(res).to.have.status(OK);
          done();
        })
        .catch(err => {
          throw err;
        });
    });
  });

  describe('/POST GetForm', () => {
    it('Should return an object of all forms', done => {
      const form = { email: 'b@b.c' };
      chai
        .request(app)
        .post('/api/3DPrintingForm/GetForm')
        .send(form)
        .then(function(res) {
          expect(res).to.have.status(OK);
          res.body.should.be.a('array');
          date = res.body[0].date;
          done();
        })
        .catch(err => {
          throw err;
        });
    });
  });
  describe('/POST edit', () => {
    it('Should return statusCode 403 if no token is passed in', done => {
      const form = {
        name: 'pinkUnicorn'
      };
      chai
        .request(app)
        .post('/api/3DPrintingForm/edit')
        .send(form)
        .then(function(res) {
          expect(res).to.have.status(FORBIDDEN);
          done();
        })
        .catch(err => {
          throw err;
        });
    });
    it('Should return statusCode 401 if an invalid ' +
       'token was passed in', done => {
      const form = {
        name: 'pinkUnicorn',
        token: 'Invalid token',
        email: 'b@b.c'
      };
      chai
        .request(app)
        .post('/api/3DPrintingForm/edit')
        .send(form)
        .then(function(res) {
          expect(res).to.have.status(UNAUTHORIZED);
          done();
        })
        .catch(err => {
          throw err;
        });
    });

    it('Should return statusCode 404 if no form was found', done => {
      const form = {
        name: 'invalid-name',
        token: token,
        email: 'b@b.c'
      };
      setTokenStatus(true);
      chai
        .request(app)
        .post('/api/3DPrintingForm/edit')
        .send(form)
        .then(function(res) {
          expect(res).to.have.status(NOT_FOUND);
          done();
        })
        .catch(err => {
          throw err;
        });
    });
    it('Should return statusCode 200 and a message ' +
       'if a form was edited', done => {
      const form = {
        name: 'pinkUnicorn',
        color: 'something else',
        token: token,
        email: 'b@b.c',
        date: date
      };
      setTokenStatus(true);
      chai
        .request(app)
        .post('/api/3DPrintingForm/edit')
        .send(form)
        .then(function(res) {
          expect(res).to.have.status(OK);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          done();
        })
        .catch(err => {
          throw err;
        });
    });
  });

  describe('/POST delete', () => {
    it('Should return statusCode 403 if no token is passed in', done => {
      const form = {
        name: 'invalid-name',
        color: 'invalid-color',
        email: 'b@b.c'
      };
      chai
        .request(app)
        .post('/api/3DPrintingForm/delete')
        .send(form)
        .then(function(res) {
          expect(res).to.have.status(FORBIDDEN);
          done();
        })
        .catch(err => {
          throw err;
        });
    });
    it('Should return statusCode 401 if an invalid ' +
       'token was passed in', done => {
      const form = {
        name: 'invalid-name',
        color: 'invalid-color',
        token: 'Invalid token',
        email: 'b@b.c'
      };
      chai
        .request(app)
        .post('/api/3DPrintingForm/delete')
        .send(form)
        .then(function(res) {
          expect(res).to.have.status(UNAUTHORIZED);
          done();
        })
        .catch(err => {
          throw err;
        });
    });

    it('Should return statusCode 404 if no form was found', done => {
      const form = {
        name: 'invalid-name',
        color: 'invalid-color',
        token: token,
        email: 'b@b.c'
      };
      setTokenStatus(true);
      chai
        .request(app)
        .post('/api/3DPrintingForm/delete')
        .send(form)
        .then(function(res) {
          expect(res).to.have.status(NOT_FOUND);
          done();
        })
        .catch(err => {
          throw err;
        });
    });

    it('Should return statusCode 200 and a message ' +
       'if a form was deleted', done => {
      const form = {
        name: 'pinkUnicorn',
        color: 'NeonGhost',
        token: token,
        email: 'b@b.c',
        date: date
      };
      setTokenStatus(true);
      chai
        .request(app)
        .post('/api/3DPrintingForm/delete')
        .send(form)
        .then(function(res) {
          expect(res).to.have.status(OK);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          done();
        })
        .catch(err => {
          throw err;
        });
    });
  });
});
