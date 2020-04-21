/* global describe it before after */
// During the test the env variable is set to test
process.env.NODE_ENV = 'test';
const InventoryItem = require('../api/models/InventoryItem');
// Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const constants = require('../api/constants');
const { OK, BAD_REQUEST, UNAUTHORIZED, NOT_FOUND } = constants.STATUS_CODES;

let app = null;

const expect = chai.expect;
// tools for testing
const tools = require('../util/testing-utils/tools.js');
const {
  setTokenStatus,
  resetMock,
  restoreMock
} = require('./mocks/TokenValidFunctions');

chai.should();
chai.use(chaiHttp);

describe('InventoryItem', () => {
  before(done => {
    app = tools.initializeServer();
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
    it('Should return 403 when an invalid token is supplied', done => {
      chai
        .request(app)
        .post('/api/InventoryItem/addItem')
        .send(ITEM_WITH_INVALID_TOKEN)
        .then(function(res) {
          expect(res).to.have.status(UNAUTHORIZED);
          done();
        })
        .catch(err => {
          throw err;
        });
    });
    it('Should return 400 when the required fields aren\'t filled in', done => {
      setTokenStatus(true);
      chai
        .request(app)
        .post('/api/InventoryItem/addItem')
        .send({ token, ...ITEM_WITHOUT_REQUIRED_FIELDS })
        .then(function(res) {
          expect(res).to.have.status(BAD_REQUEST);
          done();
        })
        .catch(err => {
          throw err;
        });
    });
    it('Should return statusCode 200 when all required fields are filled in',
      done => {
        setTokenStatus(true);
        chai
          .request(app)
          .post('/api/InventoryItem/addItem')
          .send({ token, ...VALID_NEW_ITEM })
          .then(function(res) {
            expect(res).to.have.status(OK);
            done();
          })
          .catch(err => {
            throw err;
          });
      });
  });

  describe('/GET getItems', () => {
    it('Should return an object of all items', done => {
      setTokenStatus(true);
      chai
        .request(app)
        .post('/api/InventoryItem/getItems')
        .then(function(res) {
          expect(res).to.have.status(OK);
          const getItemsResponse = res.body;
          getItemsResponse.should.be.a('array');
          expect(getItemsResponse).to.have.length(1);
          expect(getItemsResponse[0].name).to.equal(VALID_NEW_ITEM.name);
          expect(getItemsResponse[0].price).to.equal(VALID_NEW_ITEM.price);
          expect(getItemsResponse[0].stock).to.equal(VALID_NEW_ITEM.stock);
          expect(getItemsResponse[0].category).to
            .equal(VALID_NEW_ITEM.category);
          expect(getItemsResponse[0].picture).to.equal(VALID_NEW_ITEM.picture);
          expect(getItemsResponse[0].description).to.equal(
            VALID_NEW_ITEM.description
          );
          itemName = getItemsResponse[0].name;
          done();
        })
        .catch(err => {
          throw err;
        });
    });
  });

  describe('/POST editItem', () => {
    it('Should return 403 when an invalid token is supplied', done => {
      chai
        .request(app)
        .post('/api/InventoryItem/editItem')
        .send({ itemId: itemName, ...ITEM_WITH_INVALID_TOKEN })
        .then(function(res) {
          expect(res).to.have.status(UNAUTHORIZED);
          done();
        })
        .catch(err => {
          throw err;
        });
    });
    it('Should return 404 when an item by an invalid id isn\'t found', done => {
      setTokenStatus(true);
      chai
        .request(app)
        .post('/api/InventoryItem/editItem')
        .send({ token, ...ITEM_WITH_INVALID_NAME })
        .then(function(res) {
          expect(res).to.have.status(NOT_FOUND);
          done();
        })
        .catch(err => {
          throw err;
        });
    });
    it('Should return 200 when an item is sucessfully updated', done => {
      setTokenStatus(true);
      chai
        .request(app)
        .post('/api/InventoryItem/editItem')
        .send({ token, name: itemName, ...UPDATED_ITEM })
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
        .post('/api/InventoryItem/getItems')
        .then(function(res) {
          expect(res).to.have.status(OK);
          const getItemsResponse = res.body;
          expect(getItemsResponse).to.have.length(1);
          expect(getItemsResponse[0].name).to.equal(UPDATED_ITEM.name);
          expect(getItemsResponse[0].price).to.equal(UPDATED_ITEM.price);
          expect(getItemsResponse[0].stock).to.equal(UPDATED_ITEM.stock);
          expect(getItemsResponse[0].category).to.equal(UPDATED_ITEM.category);
          expect(getItemsResponse[0].description).to.equal(
            UPDATED_ITEM.description
          );
          expect(getItemsResponse[0].picture).to.equal(UPDATED_ITEM.picture);

          done();
        })
        .catch(err => {
          throw err;
        });
    });
  });

  describe('/POST deleteItem', () => {
    it('Should return 403 when an invalid token is supplied', done => {
      chai
        .request(app)
        .post('/api/InventoryItem/deleteItem')
        .send(ITEM_WITH_INVALID_TOKEN)
        .then(function(res) {
          expect(res).to.have.status(UNAUTHORIZED);
          done();
        })
        .catch(err => {
          throw err;
        });
    });
    it('Should return 404 when an item is not found', done => {
      setTokenStatus(true);
      chai
        .request(app)
        .post('/api/InventoryItem/deleteItem')
        .send({ token, ...ITEM_WITH_INVALID_NAME })
        .then(function(res) {
          expect(res).to.have.status(NOT_FOUND);
          done();
        })
        .catch(err => {
          throw err;
        });
    });
    it('Should return 200 when an item is sucessfully deleted', done => {
      setTokenStatus(true);
      chai
        .request(app)
        .post('/api/InventoryItem/deleteItem')
        .send({ token, name: itemName })
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
        .post('/api/InventoryItem/getItems')
        .then(function(res) {
          expect(res).to.have.status(OK);
          const getItemsResponse = res.body;
          getItemsResponse.should.be.a('array');
          expect(getItemsResponse).to.have.length(0);
          done();
        })
        .catch(err => {
          throw err;
        });
    });
  });
});
