process.env.NODE_ENV = 'test';

const PermissionRequest = require('../../api/main_endpoints/models/PermissionRequest');
const chai = require('chai');
const chaiHttp = require('chai-http');
const constants = require('../../api/util/constants');
const { OK, BAD_REQUEST, UNAUTHORIZED, NOT_FOUND } = constants.STATUS_CODES;
const SceApiTester = require('../../test/util/tools/SceApiTester');
const {
  initializeTokenMock,
  setTokenStatus,
  resetTokenMock,
  restoreTokenMock,
} = require('../util/mocks/TokenValidFunctions');
const mongoose = require('mongoose');
const PermissionRequestTypes = require('../../api/main_endpoints/util/permissionRequestTypes');

let app = null;
let test = null;
const expect = chai.expect;
const tools = require('../util/tools/tools.js');
chai.should();
chai.use(chaiHttp);
const token = '';

describe('PermissionRequest', () => {
  before(done => {
    initializeTokenMock();
    app = tools.initializeServer(__dirname + '/../../api/main_endpoints/routes/PermissionRequest.js');
    test = new SceApiTester(app);
    tools.emptySchema(PermissionRequest);
    done();
  });

  after(done => {
    restoreTokenMock();
    tools.terminateServer(done);
  });

  beforeEach(() => {
    setTokenStatus(false);
  });

  afterEach(async () => {
    resetTokenMock();
    await PermissionRequest.deleteMany({});
  });

  describe('/POST create', () => {
    it('Should return 401 when token is not sent', async () => {
      const res = await test.sendPostRequest('/api/PermissionRequest/create', { type: PermissionRequestTypes.LED_SIGN });
      expect(res).to.have.status(UNAUTHORIZED);
    });

    it('Should create permission request successfully', async () => {
      const userId = new mongoose.Types.ObjectId();
      setTokenStatus(true, { _id: userId, email: 'test@test.com', accessLevel: 'MEMBER' });
      const res = await test.sendPostRequestWithToken(token, '/api/PermissionRequest/create', { type: PermissionRequestTypes.LED_SIGN });
      expect(res).to.have.status(OK);
      const request = await PermissionRequest.findOne({ userId, type: PermissionRequestTypes.LED_SIGN });
      expect(request).to.exist;
      expect(request.type).to.equal(PermissionRequestTypes.LED_SIGN);
    });
  });

  describe('/GET get', () => {
    it('Should return 404 when request does not exist', async () => {
      const userId = new mongoose.Types.ObjectId();
      setTokenStatus(true, { _id: userId, email: 'test@test.com', accessLevel: 'MEMBER' });
      const res = await test.sendGetRequest('/api/PermissionRequest/get?type=' + PermissionRequestTypes.LED_SIGN);
      expect(res).to.have.status(NOT_FOUND);
    });

    it('Should return permission request when it exists', async () => {
      const userId = new mongoose.Types.ObjectId();
      setTokenStatus(true, { _id: userId, email: 'test@test.com', accessLevel: 'MEMBER' });
      await new PermissionRequest({ userId, type: PermissionRequestTypes.LED_SIGN }).save();
      const res = await test.sendGetRequest('/api/PermissionRequest/get?type=' + PermissionRequestTypes.LED_SIGN);
      expect(res).to.have.status(OK);
      expect(res.body.type).to.equal(PermissionRequestTypes.LED_SIGN);
    });
  });

  describe('/POST delete', () => {
    it('Should delete permission request successfully', async () => {
      const userId = new mongoose.Types.ObjectId();
      setTokenStatus(true, { _id: userId, email: 'test@test.com', accessLevel: 'MEMBER' });
      const request = await new PermissionRequest({ userId, type: PermissionRequestTypes.LED_SIGN }).save();
      const res = await test.sendPostRequestWithToken(token, '/api/PermissionRequest/delete', { type: PermissionRequestTypes.LED_SIGN });
      expect(res).to.have.status(OK);
      const deleted = await PermissionRequest.findById(request._id);
      expect(deleted.deletedAt).to.not.be.null;
    });
  });
});

