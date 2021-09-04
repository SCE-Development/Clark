/* global describe it before after */
// During the test the env variable is set to test
process.env.NODE_ENV = 'test';
const InventoryItem = require('../api/models/InventoryItem');
// Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const constants = require('../api/util/constants');
const { OK, BAD_REQUEST, UNAUTHORIZED, NOT_FOUND } = constants.STATUS_CODES;
const SceApiTester = require('../test/util/tools/SceApiTester');

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

describe('InventoryItem', () => {
  before(done => {
    initializeMock();
    app = tools.initializeServer(
      __dirname + '/../api/routes/InventoryItem.js');
    test = new SceApiTester(app);
    // Before each test we empty the database
    tools.emptySchema(InventoryItem);
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
  let itemName = '';
  const VALID_NEW_ITEM = {
    name: 'Chips',
    price: 0.75,
    stock: 25,
    category: 'Food',
    description: 'Food that you can eat',
    picture: '%&(&%##$^&(&#@'
  };
  const ITEM_WITH_INVALID_TOKEN = {
    token: 'invalid'
  };
  const ITEM_WITHOUT_REQUIRED_FIELDS = {
    name: 'chocolate'
  };
  const ITEM_WITH_INVALID_NAME = {
    name: 'bob'
  };
  const UPDATED_ITEM = {
    name: 'Chips',
    price: 0.5,
    stock: 15,
    category: 'Snack',
    description: 'A snack that you can eat',
    picture: ')(^#!@$%*(*'
  };

  describe('/POST addItem', () => {
    it('Should return 403 when an invalid token is supplied', async () => {
      const result = await test.sendPostRequestWithToken(
        token, '/api/InventoryItem/addItem', ITEM_WITH_INVALID_TOKEN);
      expect(result).to.have.status(UNAUTHORIZED);
    });
    it('Should return 400 when the required fields aren\'t filled in',
      async () => {
        setTokenStatus(true);
        const result = await test.sendPostRequestWithToken(
          token, '/api/InventoryItem/addItem', ITEM_WITHOUT_REQUIRED_FIELDS);
        expect(result).to.have.status(BAD_REQUEST);
      });
    it('Should return statusCode 200 when all required fields are filled in',
      async () => {
        setTokenStatus(true);
        const result = await test.sendPostRequestWithToken(
          token, '/api/InventoryItem/addItem', VALID_NEW_ITEM);
        expect(result).to.have.status(OK);
      });
  });

  describe('/GET getItems', () => {
    it('Should return an object of all items', async () => {
      setTokenStatus(true);
      const result = await test.sendGetRequest(
        '/api/InventoryItem/getItems');
      expect(result).to.have.status(OK);
      const getItemsResponse = result.body;
      getItemsResponse.should.be.a('array');
      expect(getItemsResponse).to.have.length(1);
      expect(getItemsResponse[0].name).to.equal(VALID_NEW_ITEM.name);
      expect(getItemsResponse[0].price).to.equal(VALID_NEW_ITEM.price);
      expect(getItemsResponse[0].stock).to.equal(VALID_NEW_ITEM.stock);
      expect(getItemsResponse[0].category).to
        .equal(VALID_NEW_ITEM.category);
      expect(getItemsResponse[0].picture).to.equal(VALID_NEW_ITEM.picture);
      expect(getItemsResponse[0].description).to.equal(
        VALID_NEW_ITEM.description);
      itemName = getItemsResponse[0].name;
    });
  });

  describe('/POST editItem', () => {
    it('Should return 403 when an invalid token is supplied', async () => {
      const result = await test.sendPostRequestWithToken(
        token, '/api/InventoryItem/editItem', ITEM_WITH_INVALID_TOKEN);
      expect(result).to.have.status(UNAUTHORIZED);
    });
    it('Should return 404 when an item by an invalid id isn\'t found',
      async () => {
        setTokenStatus(true);
        const result = await test.sendPostRequestWithToken(
          token, '/api/InventoryItem/editItem', ITEM_WITH_INVALID_NAME);
        expect(result).to.have.status(NOT_FOUND);
      });
    it('Should return 200 when an item is sucessfully updated', async () => {
      setTokenStatus(true);
      const result = await test.sendPostRequestWithToken(
        token, '/api/InventoryItem/editItem', UPDATED_ITEM);
      expect(result).to.have.status(OK);
    });
    it('The update should be reflected in the database', async () => {
      setTokenStatus(true);
      const result = await test.sendGetRequest('/api/InventoryItem/getItems');
      expect(result).to.have.status(OK);
      const getItemsResponse = result.body;
      expect(getItemsResponse).to.have.length(1);
      expect(getItemsResponse[0].name).to.equal(UPDATED_ITEM.name);
      expect(getItemsResponse[0].price).to.equal(UPDATED_ITEM.price);
      expect(getItemsResponse[0].stock).to.equal(UPDATED_ITEM.stock);
      expect(getItemsResponse[0].category).to.equal(UPDATED_ITEM.category);
      expect(getItemsResponse[0].description).to.equal(
        UPDATED_ITEM.description
      );
      expect(getItemsResponse[0].picture).to.equal(UPDATED_ITEM.picture);
    });
  });

  describe('/POST deleteItem', () => {
    it('Should return 403 when an invalid token is supplied', async () => {
      const result = await test.sendPostRequestWithToken(
        token, '/api/InventoryItem/deleteItem', ITEM_WITH_INVALID_TOKEN);
      expect(result).to.have.status(UNAUTHORIZED);
    });
    it('Should return 404 when an item is not found', async () => {
      setTokenStatus(true);
      const result = await test.sendPostRequestWithToken(
        token, '/api/InventoryItem/deleteItem', ITEM_WITH_INVALID_NAME);
      expect(result).to.have.status(NOT_FOUND);
    });
    it('Should return 200 when an item is sucessfully deleted', async () => {
      setTokenStatus(true);
      const result = await test.sendPostRequestWithToken(
        token, '/api/InventoryItem/deleteItem', {name: itemName});
      expect(result).to.have.status(OK);
    });
    it('The deleted item should be reflected in the database', async () => {
      setTokenStatus(true);
      const result = await test.sendGetRequest('/api/InventoryItem/getItems');
      expect(result).to.have.status(OK);
      const getItemsResponse = result.body;
      getItemsResponse.should.be.a('array');
      expect(getItemsResponse).to.have.length(0);
    });
  });
});
