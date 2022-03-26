process.env.NODE_ENV = 'test';

const RFID = require('../api/peripheral_api/models/RFID');
const awsIot = require('aws-iot-device-sdk');
const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const {
  OK, NOT_FOUND, BAD_REQUEST, UNAUTHORIZED
} = require('../api/util/constants').STATUS_CODES;
const SceApiTester = require('./util/tools/SceApiTester');
const {
  initializeMock,
  setTokenStatus,
  resetMock,
  restoreMock,
} = require('./util/mocks/TokenValidFunctions');
let app = null;
let test = null;
const expect = chai.expect;
const tools = require('./util/tools/tools');
const { RfidHelper } = require('../api/peripheral_api/util/RFID-helpers');

let addingRfidStub = null;
let awsIotStub = null;
let countDownStub = null;
let testingStub = null;

chai.should();
chai.use(chaiHttp);

describe('RFID', () => {
  before(done => {
    initializeMock();
    countDownStub = sinon.stub(RfidHelper.prototype, 'startCountdownToAddCard');
    addingRfidStub = sinon.stub(RfidHelper.prototype, 'addingRfid');
    testingStub = sinon.stub(RfidHelper.prototype, 'testing');
    testingStub.returns(true);
    sinon.stub(RfidHelper.prototype, 'keysExist').returns(true);
    app = tools.initializeServer(
      __dirname + '/../api/peripheral_api/routes/RFID.js');
    test = new SceApiTester(app);
    tools.emptySchema(RFID);
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

  const SAMPLE_RFID_BYTE = {
    byte: '12345ABCDE'
  };
  const SAMPLE_USER_NAME = {
    name: 'TEST'
  };
  let VALID_ID = '';
  const INVALID_ID = {
    id: '0987654321'
  };
  const token = '';

  describe('/POST createRFID', () => {
    it('Should return 400 when adding already in progress',
      async () => {
        setTokenStatus(true);
        addingRfidStub.returns(true);
        const result = await test.sendPostRequestWithToken(token,
          '/api/RFID/createRFID', SAMPLE_USER_NAME);
        expect(result).to.have.status(BAD_REQUEST);
      }
    );

    it('Should start countdown to add RFID',
      async () => {
        setTokenStatus(true);
        addingRfidStub.returns(false);
        const result = await test.sendPostRequestWithToken(token,
          '/api/RFID/createRFID', SAMPLE_USER_NAME);
        expect(countDownStub.called === true);
        const args = countDownStub.getCall(0).args[0];
        expect(args).to.equal(SAMPLE_USER_NAME.name);
        expect(result).to.have.status(OK);
      }
    );
  });

  describe('/GET getRFIDs', () => {
    it('Should return 401 when supplied with invalid token',
      async () => {
        const result = await test.sendGetRequestWithToken(token,
          '/api/RFID/getRFIDs');
        expect(result).to.have.status(UNAUTHORIZED);
      }
    );

    it('Should return 200 with a list of RFID cards when successful',
      async () => {
        setTokenStatus(true);
        tools.insertItem(RFID, { ...SAMPLE_RFID_BYTE, ...SAMPLE_USER_NAME });
        const result = await test.sendGetRequestWithToken(token,
          '/api/RFID/getRFIDs');
        const item = result.body[0];
        expect(result.body).to.have.length(1);
        expect(item).to.have.property('name');
        expect(item).to.have.property('byte');
        expect(item.name).to.equal(SAMPLE_USER_NAME.name);
        expect(item.byte).to.equal(SAMPLE_RFID_BYTE.byte);
        expect(result).to.have.status(OK);
        VALID_ID = item._id;
      }
    );
  });

  describe('/POST deleteRFID', () => {
    it('Should return 401 when an invalid token is supplied', async () => {
      const result = await test.sendPostRequestWithToken(token,
        '/api/RFID/deleteRFID', {});
      expect(result).to.have.status(UNAUTHORIZED);
    });

    it('Should return 404 when an RFID does not exist', async () => {
      setTokenStatus(true);
      const result = await test.sendPostRequestWithToken(
        token, '/api/RFID/deleteRFID', INVALID_ID);
      expect(result).to.have.status(NOT_FOUND);
    });

    it('Should return 200 when an RFID is sucessfully deleted', async () => {
      setTokenStatus(true);
      const result = await test.sendPostRequestWithToken(token,
        '/api/RFID/deleteRFID', { _id: VALID_ID });
      expect(result).to.have.status(OK);
      const getReqResult = await test.sendGetRequestWithToken(token,
        '/api/RFID/getRFIDs');
      expect(getReqResult).to.have.status(OK);
      const getRfidResponse = getReqResult.body;
      getRfidResponse.should.be.a('array');
      expect(getRfidResponse).to.have.length(0);
    });
  });
});
