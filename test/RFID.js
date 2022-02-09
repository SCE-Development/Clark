process.env.NODE_ENV = 'test';

const RFID = require('../api/peripheral_api/models/RFID');
const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const {
  OK, NOT_FOUND, BAD_REQUEST, UNAUTHORIZED
} = require('../api/util/constants').STATUS_CODES;
const SceApiTester = require('./util/tools/SceApiTester');

let app = null;
let test = null;
const expect = chai.expect;
const tools = require('./util/tools/tools');

chai.should();
chai.use(chaiHttp);

describe('RFID', () => {
  before(done => {
    app = tools.initializeServer(
      __dirname + '/../api/main_endpoints/routes/RFID.js');
    test = new SceApiTester(app);
    tools.emptySchema(RFID);
    done();
  });

  after(done => {
    sandbox.restore();
    tools.terminateServer(done);
  });

  const token = '';
  const SAMPLE_RFID_BYTE = {
    byte : '12345ABCDE'
  };
  const SAMPLE_USER_NAME = {
    name : 'TEST'
  };
  const VALID_ID = '';
  const INVALID_ID = {
    id : '0987654321'
  };
  const INVALID_TOKEN = {
    token : 'jdihuehfuqhuifw'
  };

  /* *********** add/create testing here ************* */

  describe('/GET getRFIDs', () => {
    it('Should return 403 when supplied with invalid token',
      async () => {
        const result = await test.sendGetRequestWithToken(token, '/getRFIDs', {token : INVALID_TOKEN});
        expect(result).to.have.status(UNAUTHORIZED);
      }
    );

    it('Should return 200 with a list of RFID cards when successful',
      async () => {
        const result = await test.sendGetRequestWithToken({token : VALID_TOKEN}, '/getRFIDs');
        expect(result).to.have.length(1);
        expect(result.body).to.have.property('name');
        expect(result.body).to.have.property('byte');
        expect(result.body.name).to.equal(SAMPLE_USER_NAME.name);
        expect(result.body.byte).to.equal(SAMPLE_RFID_BYTE.byte);
        expect(result).to.have.status(OK);
        VALID_ID = result[0].id;
      }
    );
  });

  describe('/POST deleteRFID', () => {
    it('Should return 403 when an invalid token is supplied', async () => {
      const result = await test.sendPostRequestWithToken(
        INVALID_TOKEN, '/deleteRFID');
      expect(result).to.have.status(UNAUTHORIZED);
    });

    it('Should return 400 when an RFID does not exist', async () => {
      setTokenStatus(true);
      const result = await test.sendPostRequestWithToken(
        token, '/deleteRFID', INVALID_ID);
      expect(result).to.have.status(BAD_REQUEST);
    });

    it('Should return 200 when an RFID is sucessfully deleted', async () => {
      setTokenStatus(true);
      const result = await test.sendPostRequestWithToken(
        token, '/deleteRFID', {id : VALID_ID});
      expect(result).to.have.status(OK);
      const getReqResult = await test.sendGetRequestWithToken(
        VALID_TOKEN, '/getRFIDs');
      expect(getReqResult).to.have.status(OK);
      const getRfidResponse = getReqResult.body;
      getRfidResponse.should.be.a('array');
      expect(getRfidResponse).to.have.length(0);
    });
  });
});
