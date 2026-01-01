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
  FORBIDDEN,
} = require('../../api/util/constants').STATUS_CODES;
const {
  initializeTokenMock,
  setTokenStatus,
  resetTokenMock,
  restoreTokenMock,
} = require('../util/mocks/TokenValidFunctions');
const sinon = require('sinon');
const SceApiTester = require('../util/tools/SceApiTester');
const OfficeAccessCardUtils = require('../../api/main_endpoints/util/OfficeAccessCard');

let app = null;
let test = null;

const expect = chai.expect;
const tools = require('../util/tools/tools.js');
let sandbox = sinon.createSandbox();

chai.should();
chai.use(chaiHttp);

const token = '';

describe('OfficeAccessCard', () => {
  let deleteCardStub = null;
  let testCardId = null;

  const VALID_CARD_BYTES = 'wesleys card';
  const NEW_CARD_BYTES = 'dials card';
  const INVALID_CARD_BYTES = 'evans card';

  const VALID_ID = id.toString();
  const INVALID_ID = 'tiffanys id';
  const VALID_ALIAS = 'gauravs card';
  const NEW_ALIAS = 'updated test card';
  const EMPTY_ALIAS = '';
  const WHITESPACE_ALIAS = '   ';

  const VERIFY_API_PATH = '/api/OfficeAccessCard/verify';
  const DELETE_API_PATH = '/api/OfficeAccessCard/delete';
  const GET_ALL_CARDS_API_PATH = '/api/OfficeAccessCard/getAllCards';
  const EDIT_API_PATH = '/api/OfficeAccessCard/edit';
  const INCREMENT_VERIFY_COUNT = 0;

  before(() => {
    initializeTokenMock();
    deleteCardStub = sandbox.stub(OfficeAccessCardUtils, 'deleteCard');
    deleteCardStub.resolves(false);
    app = tools.initializeServer([
      __dirname + '/../../api/main_endpoints/routes/OfficeAccessCard.js',
    ]);
    test = new SceApiTester(app);
    // Before each test we empty the database
    tools.emptySchema(OfficeAccessCard);
    const testOfficeAccessCard = new OfficeAccessCard({
      _id: VALID_ID,
      cardBytes: VALID_CARD_BYTES,
      alias: VALID_ALIAS,
      verifiedCount: INCREMENT_VERIFY_COUNT,
      lastVerifed: Date.now()
    });
    return new Promise((resolve, reject) => {
      testOfficeAccessCard.save()
        .then(savedCard => {
          testCardId = savedCard._id.toString();
          resolve(savedCard);
        })
        .catch(reject);
    });
  });

  beforeEach(() => {
    setTokenStatus(false);
  });

  afterEach(() => {
    resetTokenMock();
  });

  after(done => {
    restoreTokenMock();
    tools.terminateServer(done);
  });

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

    it('Should return 403 with invalid api key', async () => {
      const params = new URLSearchParams();
      params.append('cardBytes', VALID_CARD_BYTES);
      const path = VERIFY_API_PATH + '?' + params.toString();
      const invalidApiKey = API_KEY + '-invalid-suffix';
      const result = await test.sendGetRequestWithApiKey(
        invalidApiKey + '', path);
      expect(result).to.have.status(FORBIDDEN);
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

    it('Should increment verifyCount by 1 after a valid verify request', async () => {
      const params = new URLSearchParams();
      params.append('cardBytes', VALID_CARD_BYTES);
      const path = VERIFY_API_PATH + '?' + params.toString();
      await test.sendGetRequestWithApiKey(
        API_KEY, path);
      const updatedCard = await OfficeAccessCard.findOne({ cardBytes: VALID_CARD_BYTES });
      const expectVerifyCount = updatedCard.verifiedCount;
      expect(updatedCard.verifiedCount).to.equal(expectVerifyCount);
    });

  });

  describe('POST delete', () => {
    it('Should return 401 when token is not sent', async () => {
      const result = await test.sendPostRequest(DELETE_API_PATH);
      expect(result).to.have.status(UNAUTHORIZED);
    });

    it('Should return 403 when invalid token is sent', async () => {
      setTokenStatus(null);
      const result = await test.sendPostRequestWithToken(token,
        DELETE_API_PATH, { _id: VALID_ID });
      expect(result).to.have.status(FORBIDDEN);
    });

    it('Should return 404 if the card attempted to be deleted was not found', async () => {
      setTokenStatus(true);
      deleteCardStub.resolves(null);
      const result = await test.sendPostRequestWithToken(token,
        DELETE_API_PATH, { _id: INVALID_ID },
      );
      expect(result).to.have.status(NOT_FOUND);
    });

    it('Should return 200 with a valid alias parameter and deleting a card', async () => {
      setTokenStatus(true);
      deleteCardStub.resolves(true);
      const result = await test.sendPostRequestWithToken(token,
        DELETE_API_PATH, {  _id: VALID_ID },
      );
      expect(result).to.have.status(OK);
    });

    it('Should return 500 if there was an error deleting a card', async () => {
      setTokenStatus(true);
      deleteCardStub.resolves(false);
      const result = await test.sendPostRequestWithToken(token,
        DELETE_API_PATH, { _id: VALID_ID },
      );
      expect(result).to.have.status(SERVER_ERROR);
    });
  });

  describe('POST getAllCards', () => {
    it('Should return 401 when token is not sent', async () => {
      const result = await test.sendPostRequest(GET_ALL_CARDS_API_PATH);
      expect(result).to.have.status(UNAUTHORIZED);
    });

    it('Should return 403 when invalid token is sent', async () => {
      setTokenStatus(null);
      const result = await test.sendPostRequestWithToken(token,
        GET_ALL_CARDS_API_PATH);
      expect(result).to.have.status(FORBIDDEN);
    });

    it('Should return 200 with a successful fetch of all cards', async () => {
      setTokenStatus(true);
      const result = await test.sendPostRequestWithToken(token,
        GET_ALL_CARDS_API_PATH,
      );
      expect(result).to.have.status(OK);
    });

    it('Should return 500 if there was an error fetching all cards', async () => {
      setTokenStatus(true);
      const findStub = sinon.stub(OfficeAccessCard, 'find').rejects(new Error('Database error'));
      const result = await test.sendPostRequestWithToken(token,
        GET_ALL_CARDS_API_PATH,
      );
      expect(result).to.have.status(SERVER_ERROR);
      findStub.restore();
    });
  });

  describe('POST edit', () => {
    it('Should return 401 when token is not sent', async () => {
      const result = await test.sendPostRequest(EDIT_API_PATH);
      expect(result).to.have.status(UNAUTHORIZED);
    });

    it('Should return 403 when invalid token is sent', async () => {
      setTokenStatus(null);
      const result = await test.sendPostRequestWithToken(token,
        EDIT_API_PATH, { _id: testCardId, alias: NEW_ALIAS });
      expect(result).to.have.status(FORBIDDEN);
    });

    it('Should return 400 when _id is missing from request body', async () => {
      setTokenStatus(true);
      const result = await test.sendPostRequestWithToken(token,
        EDIT_API_PATH, { alias: NEW_ALIAS });
      expect(result).to.have.status(BAD_REQUEST);
    });

    it('Should return 400 when alias is missing from request body', async () => {
      setTokenStatus(true);
      const result = await test.sendPostRequestWithToken(token,
        EDIT_API_PATH, { _id: testCardId });
      expect(result).to.have.status(BAD_REQUEST);
    });

    it('Should return 404 when trying to edit a non-existent card', async () => {
      setTokenStatus(true);
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      const result = await test.sendPostRequestWithToken(token,
        EDIT_API_PATH, { _id: nonExistentId, alias: NEW_ALIAS });
      expect(result).to.have.status(NOT_FOUND);
    });

    it('Should return 400 when _id is not a valid ObjectId', async () => {
      setTokenStatus(true);
      const result = await test.sendPostRequestWithToken(token,
        EDIT_API_PATH, { _id: 'invalid-id', alias: NEW_ALIAS });
      expect(result).to.have.status(BAD_REQUEST);
    });

    it('Should return 200 and successfully update alias for valid request', async () => {
      setTokenStatus(true);
      const result = await test.sendPostRequestWithToken(token,
        EDIT_API_PATH, { _id: testCardId, alias: NEW_ALIAS });
      expect(result).to.have.status(OK);
      expect(result.body).to.have.property('message', 'Card alias updated successfully');
      expect(result.body).to.have.property('card');
      expect(result.body.card).to.have.property('alias', NEW_ALIAS);
    });

    it('Should actually update the alias in the database', async () => {
      setTokenStatus(true);
      await test.sendPostRequestWithToken(token,
        EDIT_API_PATH, { _id: testCardId, alias: NEW_ALIAS });

      const updatedCard = await OfficeAccessCard.findById(testCardId);
      expect(updatedCard.alias).to.equal(NEW_ALIAS);
    });

    it('Should handle empty alias by returning 400', async () => {
      setTokenStatus(true);
      const result = await test.sendPostRequestWithToken(token,
        EDIT_API_PATH, { _id: testCardId, alias: EMPTY_ALIAS });
      expect(result).to.have.status(BAD_REQUEST);
    });

    it('Should handle whitespace-only alias by returning 400', async () => {
      setTokenStatus(true);
      const result = await test.sendPostRequestWithToken(token,
        EDIT_API_PATH, { _id: testCardId, alias: WHITESPACE_ALIAS });
      expect(result).to.have.status(BAD_REQUEST);
    });

    it('Should preserve other card properties when updating alias', async () => {
      setTokenStatus(true);
      const originalCard = await OfficeAccessCard.findById(testCardId);
      const originalCardBytes = originalCard.cardBytes;
      const originalVerifiedCount = originalCard.verifiedCount;

      await test.sendPostRequestWithToken(token,
        EDIT_API_PATH, { _id: testCardId, alias: NEW_ALIAS });

      const updatedCard = await OfficeAccessCard.findById(testCardId);
      expect(updatedCard.cardBytes).to.equal(originalCardBytes);
      expect(updatedCard.verifiedCount).to.equal(originalVerifiedCount);
      expect(updatedCard.alias).to.equal(NEW_ALIAS);
    });
  });

});
