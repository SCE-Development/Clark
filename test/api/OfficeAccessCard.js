/* global describe it before after beforeEach afterEach */
process.env.NODE_ENV = 'test';

const OfficeAccessCard = require('../../api/main_endpoints/models/OfficeAccessCard.js');

const { officeAccessCard: cardConfigFromJson = {} } = require('../../api/config/config.json');
const { API_KEY = 'NOTHING_REALLY' } = cardConfigFromJson;

// Require the dev-dependencies
const chai = require('chai');
const mongoose = require('mongoose');
let id = new mongoose.Types.ObjectId();

const chaiHttp = require('chai-http');
const {
  OK,
  BAD_REQUEST,
  UNAUTHORIZED,
  NOT_FOUND,
  SERVER_ERROR,
} = require('../../api/util/constants').STATUS_CODES;
const sinon = require('sinon');
const SceApiTester = require('../util/tools/SceApiTester');

let app = null;
let test = null;

const expect = chai.expect;
const tools = require('../util/tools/tools.js');

chai.should();
chai.use(chaiHttp);

describe('OfficeAccessCard', () => {
  const VALID_CARD_BYTES = 'wesleys card';
  const NEW_CARD_BYTES = 'dials card';
  const VERIFY_API_PATH = '/api/OfficeAccessCard/verify';
  before(() => {
    app = tools.initializeServer([
      __dirname + '/../../api/main_endpoints/routes/OfficeAccessCard.js',
    ]);
    test = new SceApiTester(app);
    // Before each test we empty the database
    tools.emptySchema(OfficeAccessCard);
    const testOfficeAccessCard = new OfficeAccessCard({
      cardBytes: VALID_CARD_BYTES,
    });
    return new Promise((resolve, reject) => {
      testOfficeAccessCard.save()
        .then(resolve)
        .catch(reject);
    });
  });

  after(tools.terminateServer);


  describe('GET verify', () => {
    it('Should return 200 with valid api key and card', async () => {
      const params = new URLSearchParams();
      params.append('cardBytes', VALID_CARD_BYTES);
      const path = VERIFY_API_PATH + '?' + params.toString();
      const result = await test.sendGetRequestWithApiKey(
        API_KEY, path);
      expect(result).to.have.status(OK);
    });

    it('Should return 400 when api key http header is missing', async () => {
      const result = await test.sendGetRequest(
        VERIFY_API_PATH);
      expect(result).to.have.status(BAD_REQUEST);
    });

    it('Should return 400 when cardBytes query parameter is missing', async () => {
      const result = await test.sendGetRequestWithApiKey(
        API_KEY, VERIFY_API_PATH);
      expect(result).to.have.status(BAD_REQUEST);
    });

    it('Should return 401 with invalid api key', async () => {
      const params = new URLSearchParams();
      params.append('cardBytes', VALID_CARD_BYTES);
      const path = VERIFY_API_PATH + '?' + params.toString();
      const invalidApiKey = API_KEY + '-invalid-suffix';
      const result = await test.sendGetRequestWithApiKey(
        invalidApiKey + '', path);
      expect(result).to.have.status(UNAUTHORIZED);
    });

    it('Should return 404 with valid api key and unknown card', async () => {
      const params = new URLSearchParams();
      params.append('cardBytes', NEW_CARD_BYTES);
      const path = VERIFY_API_PATH + '?' + params.toString();
      const result = await test.sendGetRequestWithApiKey(
        API_KEY, path);
      expect(result).to.have.status(NOT_FOUND);
    });

    it('Should return 500 when there was an error adding a new card', async () => {
      const saveStub = sinon.stub(OfficeAccessCard.prototype, 'save').rejects(new Error('Database error'));
      const params = new URLSearchParams();
      params.append('cardBytes', NEW_CARD_BYTES);
      params.append('add', true);
      const path = VERIFY_API_PATH + '?' + params.toString();
      const result = await test.sendGetRequestWithApiKey(
        API_KEY, path);
      expect(result).to.have.status(SERVER_ERROR);
      saveStub.restore();
    });

    it('Should return 200 with valid api key and adding a new card', async () => {
      const params = new URLSearchParams();
      params.append('cardBytes', NEW_CARD_BYTES);
      params.append('add', true);
      const path = VERIFY_API_PATH + '?' + params.toString();
      const result = await test.sendGetRequestWithApiKey(
        API_KEY, path);
      expect(result).to.have.status(OK);
    });
  });
});
