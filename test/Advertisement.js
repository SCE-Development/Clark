/* global describe it before after */
process.env.NODE_ENV = 'test';
const Advertisement = require('../api/models/Advertisement');
const chai = require('chai');
const chaiHttp = require('chai-http');
const constants = require('../api/constants');
const { OK, BAD_REQUEST } = constants.STATUS_CODES;

let app = null;

const expect = chai.expect;

const tools = require('../util/testing-utils/tools.js');
chai.should();
chai.use(chaiHttp);

describe('Advertisement', () => {
  before(done => {
    app = tools.initializeServer();
    tools.emptySchema(Advertisement);
    done();
  });

  after(done => {
    tools.terminateServer(done);
  });

  const INVALID_ADVERTISEMENT = {
    createDate: new Date('01/01/2001')
  };

  const VALID_ADVERTISEMENT = {
    pictureUrl:
      'https://www.fosi.org/',
    createDate: new Date('01/01/2001'),
    expireDate: new Date('10/10/2001')
  };

  describe('/POST addAdvertisement', () => {
    it('Should return 400 when required fields are not filled in ', done => {
      chai
        .request(app)
        .post('/api/Advertisement/addAdvertisement')
        .send(INVALID_ADVERTISEMENT)
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
        chai
          .request(app)
          .post('/api/Advertisement/addAdvertisement')
          .send(VALID_ADVERTISEMENT)
          .then(function(res) {
            expect(res).to.have.status(OK);
            done();
          })
          .catch(err => {
            throw err;
          });
      });
  });
  describe('/GET getAdvertisements', () => {
    it('Should return an object of all events', done => {
      chai
        .request(app)
        .get('/api/Advertisement/getAdvertisements')
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
          done();
        })
        .catch(err => {
          throw err;
        });
    });
  });
});
