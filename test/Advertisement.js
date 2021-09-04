/* global describe it before after */
process.env.NODE_ENV = 'test';
const Advertisement = require('../api/models/Advertisement');
const chai = require('chai');
const chaiHttp = require('chai-http');
const constants = require('../api/util/constants');
const { OK, BAD_REQUEST } = constants.STATUS_CODES;
const SceApiTester = require('../test/util/tools/SceApiTester');

let app = null;
let test = null;
const expect = chai.expect;

const tools = require('./util/tools/tools.js');
chai.should();
chai.use(chaiHttp);

describe('Advertisement', () => {
  before(done => {
    app = tools.initializeServer(
      __dirname + '/../api/routes/Advertisement.js');
    test = new SceApiTester(app);
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
    it('Should return 400 when required fields are not filled in ',
      async () => {
        const result = await test.sendPostRequest(
          '/api/Advertisement/addAdvertisement', INVALID_ADVERTISEMENT);
        expect(result).to.have.status(BAD_REQUEST);
      });
    it('Should return statusCode 200 when all required fields are filled in ',
      async () => {
        const result = await test.sendPostRequest(
          '/api/Advertisement/addAdvertisement', VALID_ADVERTISEMENT);
        expect(result).to.have.status(OK);
      });
  });
  describe('/GET getAdvertisements', () => {
    it('Should return an object of all events', async () => {
      const result = await test.sendGetRequest(
        '/api/Advertisement/getAdvertisements');
      expect(result).to.have.status(OK);
      const getAdvertisementResponse = result.body;
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
    });
  });
});
