process.env.NODE_ENV = 'test';

const PermissionRequest = require('../../api/main_endpoints/models/PermissionRequest');
const chai = require('chai');
const chaiHttp = require('chai-http');
const constants = require('../../api/util/constants');
const { OK, BAD_REQUEST, UNAUTHORIZED, NOT_FOUND, CONFLICT } = constants.STATUS_CODES;
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

// Helper functions
const createUserToken = (accessLevel = constants.MEMBERSHIP_STATE.MEMBER) => {
  const userId = new mongoose.Types.ObjectId();
  setTokenStatus(true, { _id: userId, email: 'test@test.com', accessLevel });
  return userId;
};

const createRequest = async (userId, type = PermissionRequestTypes.LED_SIGN) => {
  await PermissionRequest.deleteMany({ userId, type });
  return await new PermissionRequest({ userId, type }).save();
};

const extractUserId = (item) => {
  if (!item.userId) return null;
  return item.userId._id ? item.userId._id.toString() : item.userId.toString();
};

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

  afterEach(() => {
    resetTokenMock();
  });

  describe('/POST create', () => {
    it('Should return 401 when token is not sent', async () => {
      const res = await test.sendPostRequest('/api/PermissionRequest/create', { type: PermissionRequestTypes.LED_SIGN });
      expect(res).to.have.status(UNAUTHORIZED);
    });

    it('Should return 401 when invalid token is sent', async () => {
      const res = await test.sendPostRequestWithToken(token, '/api/PermissionRequest/create', { type: PermissionRequestTypes.LED_SIGN });
      expect(res).to.have.status(UNAUTHORIZED);
    });

    it('Should return 400 when type is invalid or missing', async () => {
      const userId = createUserToken();
      const invalidRes = await test.sendPostRequestWithToken(token, '/api/PermissionRequest/create', { type: 'INVALID' });
      expect(invalidRes).to.have.status(BAD_REQUEST);
      const missingRes = await test.sendPostRequestWithToken(token, '/api/PermissionRequest/create', {});
      expect(missingRes).to.have.status(BAD_REQUEST);
    });

    it('Should return 409 CONFLICT when duplicate request exists', async () => {
      const userId = createUserToken();
      await createRequest(userId);
      const res = await test.sendPostRequestWithToken(token, '/api/PermissionRequest/create', { type: PermissionRequestTypes.LED_SIGN });
      expect(res).to.have.status(CONFLICT);
    });

    it('Should create permission request successfully', async () => {
      const userId = createUserToken();
      const res = await test.sendPostRequestWithToken(token, '/api/PermissionRequest/create', { type: PermissionRequestTypes.LED_SIGN });
      expect(res).to.have.status(OK);
      const request = await PermissionRequest.findOne({ userId, type: PermissionRequestTypes.LED_SIGN });
      expect(request).to.exist;
      expect(request.type).to.equal(PermissionRequestTypes.LED_SIGN);
      expect(request.userId.toString()).to.equal(userId.toString());
    });
  });

  describe('/GET get', () => {
    it('Should return 401 when token is not sent or invalid', async () => {
      const res1 = await test.sendGetRequest('/api/PermissionRequest/get');
      expect(res1).to.have.status(UNAUTHORIZED);
      const res2 = await test.sendGetRequest('/api/PermissionRequest/get');
      expect(res2).to.have.status(UNAUTHORIZED);
    });

    it('Should return empty array when no requests exist', async () => {
      const userId = createUserToken();
      const res = await test.sendGetRequest(`/api/PermissionRequest/get?userId=${userId}&type=${PermissionRequestTypes.LED_SIGN}`);
      expect(res).to.have.status(OK);
      expect(res.body).to.be.an('array').that.is.empty;
    });

    it('Should return permission request when it exists', async () => {
      const userId = createUserToken();
      await createRequest(userId);
      const res = await test.sendGetRequest(`/api/PermissionRequest/get?userId=${userId}&type=${PermissionRequestTypes.LED_SIGN}`);
      expect(res).to.have.status(OK);
      expect(res.body).to.be.an('array').with.length(1);
      expect(res.body[0].type).to.equal(PermissionRequestTypes.LED_SIGN);
    });

    it('Should enforce authorization: non-officer only sees own requests, officer sees all', async () => {
      const userId1 = createUserToken(constants.MEMBERSHIP_STATE.MEMBER);
      const userId2 = new mongoose.Types.ObjectId();
      await createRequest(userId1);
      await createRequest(userId2);
      
      // Non-officer should only see own requests
      const memberRes = await test.sendGetRequest(`/api/PermissionRequest/get?userId=${userId2}`);
      expect(memberRes.body).to.be.an('array').with.length(1);
      const memberUserId = extractUserId(memberRes.body[0]);
      expect(memberUserId).to.equal(userId1.toString());
      
      // Officer should see all requests
      createUserToken(constants.MEMBERSHIP_STATE.OFFICER);
      const officerRes = await test.sendGetRequest('/api/PermissionRequest/get');
      expect(officerRes.body.length).to.be.at.least(2);
    });

    it('Should filter by userId for officer and by type', async () => {
      const userId1 = createUserToken(constants.MEMBERSHIP_STATE.OFFICER);
      const userId2 = new mongoose.Types.ObjectId();
      await PermissionRequest.deleteMany({ userId: { $in: [userId1, userId2] } });
      await createRequest(userId1);
      await createRequest(userId2);
      
      const res = await test.sendGetRequest(`/api/PermissionRequest/get?userId=${userId2}`);
      expect(res).to.have.status(OK);
      const userIds = res.body.filter(r => r.userId).map(extractUserId);
      expect(userIds).to.include(userId2.toString());
      userIds.forEach(uid => expect(uid).to.equal(userId2.toString()));
      
      const typeRes = await test.sendGetRequest(`/api/PermissionRequest/get?type=${PermissionRequestTypes.LED_SIGN}`);
      expect(typeRes.body.every(r => r.type === PermissionRequestTypes.LED_SIGN)).to.be.true;
    });

    it('Should exclude deleted requests and sort by createdAt descending', async () => {
      const userId = createUserToken();
      const active = await createRequest(userId);
      active.deletedAt = new Date();
      await active.save();
      
      const res = await test.sendGetRequest('/api/PermissionRequest/get');
      expect(res.body.map(r => r._id.toString())).to.not.include(active._id.toString());
      
      const timestamps = res.body.map(r => new Date(r.createdAt).getTime());
      for (let i = 0; i < timestamps.length - 1; i++) {
        expect(timestamps[i]).to.be.at.least(timestamps[i + 1]);
      }
    });

    it('Should populate userId fields when User exists', async () => {
      const User = require('../../api/main_endpoints/models/User');
      const userId = new mongoose.Types.ObjectId();
      const user = await new User({
        _id: userId, firstName: 'John', lastName: 'Doe', email: 'john@test.com',
        password: 'Passw0rd', accessLevel: constants.MEMBERSHIP_STATE.MEMBER
      }).save();
      createUserToken();
      await createRequest(userId);
      const res = await test.sendGetRequest('/api/PermissionRequest/get');
      expect(res.body[0].userId).to.have.property('firstName', 'John');
      expect(res.body[0].userId).to.have.property('lastName', 'Doe');
      expect(res.body[0].userId).to.have.property('email', 'john@test.com');
      await User.deleteOne({ _id: userId });
    });
  });

  describe('/POST delete', () => {
    it('Should return 401 when token is not sent or invalid', async () => {
      const res1 = await test.sendPostRequest('/api/PermissionRequest/delete', { type: PermissionRequestTypes.LED_SIGN });
      expect(res1).to.have.status(UNAUTHORIZED);
      const res2 = await test.sendPostRequestWithToken(token, '/api/PermissionRequest/delete', { type: PermissionRequestTypes.LED_SIGN });
      expect(res2).to.have.status(UNAUTHORIZED);
    });

    it('Should return 400 when type is invalid or missing', async () => {
      const userId = createUserToken();
      const invalidRes = await test.sendPostRequestWithToken(token, '/api/PermissionRequest/delete', { type: 'INVALID' });
      expect(invalidRes).to.have.status(BAD_REQUEST);
      const missingRes = await test.sendPostRequestWithToken(token, '/api/PermissionRequest/delete', {});
      expect(missingRes).to.have.status(BAD_REQUEST);
    });

    it('Should delete permission request successfully and set deletedAt', async () => {
      const userId = createUserToken();
      const request = await createRequest(userId);
      const beforeDelete = new Date();
      const res = await test.sendPostRequestWithToken(token, '/api/PermissionRequest/delete', {
        type: PermissionRequestTypes.LED_SIGN, _id: request._id
      });
      expect(res).to.have.status(OK);
      const deleted = await PermissionRequest.findById(request._id);
      expect(deleted.deletedAt).to.not.be.null;
      expect(new Date(deleted.deletedAt).getTime()).to.be.at.least(beforeDelete.getTime());
    });

    it('Should return 404 when _id does not exist or request already deleted', async () => {
      const userId = createUserToken(constants.MEMBERSHIP_STATE.OFFICER);
      const nonExistentId = new mongoose.Types.ObjectId();
      const res1 = await test.sendPostRequestWithToken(token, '/api/PermissionRequest/delete', {
        type: PermissionRequestTypes.LED_SIGN, _id: nonExistentId
      });
      expect(res1).to.have.status(NOT_FOUND);
      
      const deletedRequest = await new PermissionRequest({ userId, type: PermissionRequestTypes.LED_SIGN, deletedAt: new Date() }).save();
      const res2 = await test.sendPostRequestWithToken(token, '/api/PermissionRequest/delete', {
        type: PermissionRequestTypes.LED_SIGN, _id: deletedRequest._id
      });
      expect(res2).to.have.status(NOT_FOUND);
    });

    it('Should enforce authorization: non-officer cannot delete others, officer can delete any', async () => {
      const userId1 = createUserToken(constants.MEMBERSHIP_STATE.MEMBER);
      const userId2 = new mongoose.Types.ObjectId();
      const request2 = await createRequest(userId2);
      
      // Non-officer cannot delete another user's request
      const memberRes = await test.sendPostRequestWithToken(token, '/api/PermissionRequest/delete', {
        type: PermissionRequestTypes.LED_SIGN, _id: request2._id
      });
      expect(memberRes).to.have.status(NOT_FOUND);
      expect((await PermissionRequest.findById(request2._id)).deletedAt).to.be.null;
      
      // Officer can delete any request
      createUserToken(constants.MEMBERSHIP_STATE.OFFICER);
      const officerRes = await test.sendPostRequestWithToken(token, '/api/PermissionRequest/delete', {
        type: PermissionRequestTypes.LED_SIGN, _id: request2._id
      });
      expect(officerRes).to.have.status(OK);
      expect((await PermissionRequest.findById(request2._id)).deletedAt).to.not.be.null;
    });

    it('Should require _id parameter even for officers', async () => {
      const userId = createUserToken(constants.MEMBERSHIP_STATE.OFFICER);
      const request = await createRequest(userId);
      const res = await test.sendPostRequestWithToken(token, '/api/PermissionRequest/delete', {
        type: PermissionRequestTypes.LED_SIGN
      });
      expect(res).to.have.status(NOT_FOUND);
      expect((await PermissionRequest.findById(request._id)).deletedAt).to.be.null;
    });
  });
});
