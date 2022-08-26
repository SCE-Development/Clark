/* global describe it before after */
// During the test the env variable is set to test
process.env.NODE_ENV = 'test';
const DoorCode = require('../../api/main_endpoints/models/DoorCode');
const chai = require('chai');
const chaiHttp = require('chai-http');
const constants = require('../../api/util/constants');
const { OK, BAD_REQUEST, UNAUTHORIZED, NOT_FOUND } = constants.STATUS_CODES;
const SceApiTester = require('../util/tools/SceApiTester');

let app = null;
let test = null;
const expect = chai.expect;
// tools for testing
const tools = require('../util/tools/tools.js');
const {
  initializeTokenMock,
  setTokenStatus,
  resetTokenMock,
  restoreTokenMock,
} = require('../util/mocks/TokenValidFunctions');

chai.should();
chai.use(chaiHttp);

describe('DoorCode', () => {
  before((done) => {
    initializeTokenMock();
    app = tools.initializeServer(__dirname + '/../../api/main_endpoints/' +
      'routes/DoorCode.js');
    test = new SceApiTester(app);
    // Before each test we empty the database
    tools.emptySchema(DoorCode);
    done();
  });

  after((done) => {
    restoreTokenMock();
    tools.terminateServer(done);
  });

  beforeEach(() => {
    setTokenStatus(false);
  });

  afterEach(() => {
    resetTokenMock();
  });

  const token = '';
  let codeId = '';
  const VALID_NEW_CODE = {
    doorCode: '050-9463',
    doorCodeValidUntil: new Date('12/25/20'),
    usersAssigned: 1,
  };
  const CODE_WITH_MORE_ASSIGNED = {
    doorCode: '054-9463',
    doorCodeValidUntil: new Date('12/25/20'),
    usersAssigned: 2,
  };
  const REPEATED_CODE = {
    doorCode: '050-9463',
    doorCodeValidUntil: new Date('12/27/20'),
    usersAssigned: 1,
  };
  const CODE_WITH_INVALID_ID = {
    id: 'invalid',
  };
  const CODE_WITH_INVALID_TOKEN = {
    token: 'invalid',
  };
  const CODE_WITHOUT_REQUIRED_FIELDS = {};
  const EDITED_CODE = {
    doorCode: '051-4451',
    doorCodeValidUntil: new Date('12/25/20'),
    usersAssigned: 1,
  };
  const CODE_WITH_BAD_FORMAT = {
    doorCode: '05121-44514211',
    doorCodeValidUntil: new Date('12/25/20'),
    usersAssigned: 1,
  };
  const CODE_WITH_BAD_FORMAT_TWO = {
    doorCode: '05121-44514211',
    doorCodeValidUntil: new Date('12/25/20'),
    usersAssigned: 1,
  };

  describe('/POST addCode', () => {
    it('Should return 403 when an invalid token is supplied', async () => {
      const result = await test.sendPostRequest(
        '/api/DoorCode/addCode',
        CODE_WITH_INVALID_TOKEN
      );
      expect(result).to.have.status(UNAUTHORIZED);
    });
    it('Should return 400 when the required fields ' +
      'aren\'t filled in', async () => {
      setTokenStatus(true);
      const result = await test.sendPostRequestWithToken(
        token,
        '/api/DoorCode/addCode',
        CODE_WITHOUT_REQUIRED_FIELDS
      );
      expect(result).to.have.status(BAD_REQUEST);
    });
    it('Should return statusCode 200 when all required fields' +
      'are filled in', async () => {
      setTokenStatus(true);
      const result = await test.sendPostRequestWithToken(
        token,
        '/api/DoorCode/addCode',
        VALID_NEW_CODE
      );
      expect(result).to.have.status(OK);
    });
    it('Should return statusCode 200 when all required fields' +
      'are filled in when users assigned is 2 or more', async () => {
      setTokenStatus(true);
      const result = await test.sendPostRequestWithToken(
        token,
        '/api/DoorCode/addCode',
        CODE_WITH_MORE_ASSIGNED
      );
      expect(result).to.have.status(OK);
    });
    it('Should return statusCode 400 nothing when adding a ' +
      'repeated door code', async () => {
      setTokenStatus(true);
      const result = await test.sendPostRequestWithToken(
        token,
        '/api/DoorCode/addCode',
        REPEATED_CODE
      );
      expect(result).to.have.status(BAD_REQUEST);
    });
    it('Should return statusCode 400 nothing when adding a ' +
      'door code with bad formatting', async () => {
      setTokenStatus(true);
      const result = await test.sendPostRequestWithToken(
        token,
        '/api/DoorCode/addCode',
        CODE_WITH_BAD_FORMAT
      );
      expect(result).to.have.status(BAD_REQUEST);
    });
    it('Should return statusCode 400 nothing when adding a ' +
      'door code with bad formatting symbols', async () => {
      setTokenStatus(true);
      const result = await test.sendPostRequestWithToken(
        token,
        '/api/DoorCode/addCode',
        CODE_WITH_BAD_FORMAT_TWO
      );
      expect(result).to.have.status(BAD_REQUEST);
    });
  });

  describe('/GET getDoorCodes', () => {
    it('Should return 2 door codes that were inserted', async () => {
      setTokenStatus(true);
      const result = await test.sendGetRequest(
        '/api/DoorCode/getDoorCodes'
      );
      expect(result).to.have.status(OK);
      const getEventsResponse = result.body;
      getEventsResponse.should.be.a('array');
      expect(getEventsResponse).to.have.length(2);
    });
  });

  describe('/GET getAvailableDoorCode', () => {
    it('Should return an object of only one door code', async () => {
      setTokenStatus(true);
      const result = await test.sendGetRequest(
        '/api/DoorCode/getAvailableDoorCode'
      );
      expect(result).to.have.status(OK);
      const getEventsResponse = result.body;
      expect(getEventsResponse.doorCode).to.equal(VALID_NEW_CODE.doorCode);
      expect(getEventsResponse.doorCodeValidUntil).to.equal(
        VALID_NEW_CODE.doorCodeValidUntil.toISOString()
      );
      expect(getEventsResponse.usersAssigned).to.equal(
        VALID_NEW_CODE.usersAssigned
      );
      codeId = getEventsResponse._id;
    });
  });

  describe('/POST editCode', () => {
    it('Should return 403 when an invalid token is supplied', async () => {
      const result = await test.sendPostRequestWithToken(
        token,
        '/api/DoorCode/editCode',
        CODE_WITH_INVALID_TOKEN
      );
      expect(result).to.have.status(UNAUTHORIZED);
    });
    it(
      'Should return 404 when a code by an ' + 'invalid id isn\'t found',
      async () => {
        setTokenStatus(true);
        const result = await test.sendPostRequestWithToken(
          token,
          '/api/DoorCode/editCode',
          CODE_WITH_INVALID_ID
        );
        expect(result).to.have.status(NOT_FOUND);
      }
    );
    it('Should return 200 when a code is sucessfully updated', async () => {
      setTokenStatus(true);
      const result = await test.sendPostRequestWithToken(
        token, '/api/DoorCode/editCode', { id: codeId, ...EDITED_CODE }
      );
    });
    it('The update should be reflected in the database', async () => {
      setTokenStatus(true);
      const result = await test.sendGetRequest(
        '/api/DoorCode/getAvailableDoorCode'
      );
      expect(result).to.have.status(OK);
      const getEventsResponse = result.body;
      expect(getEventsResponse.doorCode).to.equal(EDITED_CODE.doorCode);
      expect(getEventsResponse.doorCodeValidUntil).to.equal(
        EDITED_CODE.doorCodeValidUntil.toISOString()
      );
      expect(getEventsResponse.usersAssigned).to.equal(
        EDITED_CODE.usersAssigned
      );
    });
  });

  describe('/POST removeCode', () => {
    it('Should return 403 when an invalid token is supplied', async () => {
      const result = await test.sendPostRequestWithToken(
        token,
        '/api/DoorCode/removeCode',
        CODE_WITH_INVALID_TOKEN
      );
      expect(result).to.have.status(UNAUTHORIZED);
    });
    it('Should return 400 when a code is unsucessfully deleted', async () => {
      setTokenStatus(true);
      const result = await test.sendPostRequestWithToken(
        token,
        '/api/DoorCode/removeCode',
        CODE_WITH_INVALID_ID
      );
      expect(result).to.have.status(BAD_REQUEST);
    });
    it('Should return 200 when a code is sucessfully deleted', async () => {
      setTokenStatus(true);
      const result = await test.sendPostRequestWithToken(
        token,
        '/api/DoorCode/removeCode',
        { id: codeId }
      );
      expect(result).to.have.status(OK);
    });
  });

  describe('/POST getDoorCodeByDiscord', () => {
    it('Should return 401 when an invalid token is supplied', async () => {
      const result = await test.sendPostRequestWithToken(
        token,
        `/api/DoorCode/getDoorCodeByDiscord?discordID=${codeId}`,
        CODE_WITH_INVALID_TOKEN
      );
      expect(result).to.have.status(UNAUTHORIZED);
    });

    it('Should return 404 when a code by an invalid id isn\'t found', async () => {
      setTokenStatus(true);
      const result = await test.sendPostRequestWithToken(
        token,
        `/api/DoorCode/getDoorCodeByDiscord?discordID=${codeId}`,
        CODE_WITH_INVALID_ID
      );
      expect(result).to.have.status(NOT_FOUND);
    });

    
  });
  
});
