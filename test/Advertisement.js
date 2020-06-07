/* global describe it before after */
process.env.NODE_ENV = 'test';
const Advertisement = require('../api/models/Advertisement');
const chai = require('chai');
const chaiHttp = require('chai-http');
const constants = require('../api/constants');
const { OK, BAD_REQUEST, UNAUTHORIZED, NOT_FOUND } = constants.STATUS_CODES;

let app = null;

const expect = chai.expect;

const tools = require('../util/testing-utils/tools.js');
const {
  setTokenStatus,
  resetMock,
  restoreMock
} = require('./mocks/TokenValidFunctions');
chai.should();
chai.use(chaiHttp);

describe('Advertisement', () => {
  before(done => {
    app = tools.initializeServer();
    tools.emptySchema(Advertisement);
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
  let advertisementId = '';

  const INVALID_ADVERTISEMENT = {
    createDate: new Date('01/01/2001')
  };

  const VALID_ADVERTISEMENT = {
    pictureUrl:
      'https://www.fosi.org/',
    createDate: new Date('01/01/2001'),
    expireDate: new Date('10/10/2001')
  };

  const ADVERTISEMENT_WITH_INVALID_TOKEN = {
    token: 'invalid'
  };
  const ADVERTISEMENT_WITH_INVALID_ID = {
    id: 'strawberry'
  };
  const UPDATED_ADVERTISEMENT = {
    createDate: new Date('5/27/20'),
    expireDate: new Date('5/28/20'),
    pictureUrl: 'https://link.to/pdf'
  };

  describe('/POST addAdvertisement', () => {
    it('Should return 403 when an invalid token is supplied', done => {
      chai
        .request(app)
        .post('/api/Advertisement/addAdvertisement')
        .send(ADVERTISEMENT_WITH_INVALID_TOKEN)
        .then(function(res) {
          expect(res).to.have.status(UNAUTHORIZED);
          done();
        })
        .catch(err => {
          throw err;
        });
    });
    it('Should return 400 when required fields are not filled in ', done => {
      setTokenStatus(true);
      chai
        .request(app)
        .post('/api/Advertisement/addAdvertisement')
        .send({token, ...INVALID_ADVERTISEMENT})
        .then(function(res) {
          expect(res).to.have.status(BAD_REQUEST);
          done();
        })
        .catch(err => {
          throw err;
        });
    });
    it('Should return statusCode 200 when all required fields are filled in ',
      done => {
        setTokenStatus(true);
        chai
          .request(app)
          .post('/api/Advertisement/addAdvertisement')
          .send({token, ...VALID_ADVERTISEMENT})
          .then(function(res) {
            expect(res).to.have.status(OK);
            done();
          })
          .catch(err => {
            throw err;
          });
      });
  });
  describe('/GET getAdvertisement', () => {
    it('Should return an object of all advertisement', done => {
      setTokenStatus(true);
      chai
        .request(app)
        .get('/api/Advertisement/getAdvertisement')
        .then(function(res) {
          expect(res).to.have.status(OK);
          const getAdvertisementResponse = res.body;
          getAdvertisementResponse.should.be.a('array');
          expect(getAdvertisementResponse).to.have.length(1);
          expect(getAdvertisementResponse[0].pictureUrl).to.equal(
            VALID_ADVERTISEMENT.pictureUrl
          );
          expect(getAdvertisementResponse[0].createDate).to.equal(
            VALID_ADVERTISEMENT.createDate.toISOString()
          );
          expect(getAdvertisementResponse[0].expireDate).to.equal(
            VALID_ADVERTISEMENT.expireDate.toISOString()
          );
          advertisementId = getAdvertisementResponse[0]._id;
          done();
        })
        .catch(err => {
          throw err;
        });
    });
  });

  describe('/POST editAdvertisement', () => {
    it('Should return 403 when an invalid token is supplied', done => {
      chai
        .request(app)
        .post('/api/Advertisement/editAdvertisement')
        .send({ advertisementId, ...ADVERTISEMENT_WITH_INVALID_TOKEN })
        .then(function(res) {
          expect(res).to.have.status(UNAUTHORIZED);
          done();
        })
        .catch(err => {
          throw err;
        });
    });
    it('Should return 404 when an advertisement by an ' +
       'invalid id is not found', done => {
      setTokenStatus(true);
      chai
        .request(app)
        .post('/api/Advertisement/editAdvertisement')
        .send({ token, ...ADVERTISEMENT_WITH_INVALID_ID })
        .then(function(res) {
          expect(res).to.have.status(NOT_FOUND);
          done();
        })
        .catch(err => {
          throw err;
        });
    });
    it('Should return 200 when an advertisement is sucessfully updated',
      done => {
        setTokenStatus(true);
        chai
          .request(app)
          .post('/api/Advertisement/editAdvertisement')
          .send({ token, id: advertisementId, ...UPDATED_ADVERTISEMENT })
          .then(function(res) {
            expect(res).to.have.status(OK);
            done();
          })
          .catch(err => {
            throw err;
          });
      });
    it('The update should be reflected in the database', done => {
      setTokenStatus(true);
      chai
        .request(app)
        .get('/api/Advertisement/getAdvertisement')
        .then(function(res) {
          expect(res).to.have.status(OK);
          const getAdvertisementResponse = res.body;
          expect(getAdvertisementResponse).to.have.length(1);
          expect(getAdvertisementResponse[0].createDate).to.equal(
            UPDATED_ADVERTISEMENT.createDate.toISOString()
          );
          expect(getAdvertisementResponse[0].expireDate).to.equal(
            UPDATED_ADVERTISEMENT.expireDate.toISOString()
          );
          expect(getAdvertisementResponse[0].pictureUrl).to.equal(
            UPDATED_ADVERTISEMENT.pictureUrl
          );
          done();
        })
        .catch(err => {
          throw err;
        });
    });
  });
  describe('/POST deleteAdvertisement', () => {
    it('Should return 403 when an invalid token is supplied', done => {
      chai
        .request(app)
        .post('/api/Advertisement/deleteAdvertisement')
        .send(ADVERTISEMENT_WITH_INVALID_TOKEN)
        .then(function(res) {
          expect(res).to.have.status(UNAUTHORIZED);
          done();
        })
        .catch(err => {
          throw err;
        });
    });
    it('Should return 400 when an advertisement is unsucessfully deleted',
      done => {
        setTokenStatus(true);
        chai
          .request(app)
          .post('/api/Advertisement/deleteAdvertisement')
          .send({ token, ...ADVERTISEMENT_WITH_INVALID_ID })
          .then(function(res) {
            expect(res).to.have.status(BAD_REQUEST);
            done();
          })
          .catch(err => {
            throw err;
          });
      });
    it('Should return 200 when an advertisement is sucessfully deleted',
      done => {
        setTokenStatus(true);
        chai
          .request(app)
          .post('/api/Advertisement/deleteAdvertisement')
          .send({ token, id: advertisementId })
          .then(function(res) {
            expect(res).to.have.status(OK);
            done();
          })
          .catch(err => {
            throw err;
          });
      });
    it('The deleted item should be reflected in the database', done => {
      setTokenStatus(true);
      chai
        .request(app)
        .get('/api/Advertisement/getAdvertisement')
        .then(function(res) {
          expect(res).to.have.status(OK);
          const getAdvertisementResponse = res.body;
          getAdvertisementResponse.should.be.a('array');
          expect(getAdvertisementResponse).to.have.length(0);
          done();
        })
        .catch(err => {
          throw err;
        });
    });
  });

});
