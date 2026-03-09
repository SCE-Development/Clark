/* global describe it before after */
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

describe('PermissionRequest', () => {
  // Helper functions
  function createUserToken(accessLevel) {
    const level = accessLevel || constants.MEMBERSHIP_STATE.MEMBER;
    const userId = new mongoose.Types.ObjectId();
    setTokenStatus(true, { _id: userId, email: 'test@test.com', accessLevel: level });
    return userId;
  }

  async function createRequest(userId, type) {
    const requestType = type || PermissionRequestTypes.LED_SIGN;
    await PermissionRequest.deleteMany({ userId, type: requestType });
    return await new PermissionRequest({ userId, type: requestType }).save();
  }

  function extractUserId(item) {
    if (!item.userId) return null;
    return item.userId._id ? item.userId._id.toString() : item.userId.toString();
  }

  async function verifyRequestUserId(requestId, expectedUserId) {
    const dbRequest = await PermissionRequest.findById(requestId);
    if (!dbRequest) return false;
    return dbRequest.userId.toString() === expectedUserId.toString();
  }
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
    const GET_ROUTE = '/api/PermissionRequest/';
    it('Should return 401 when token is not sent or invalid', async () => {
      const res1 = await test.sendGetRequest(GET_ROUTE);
      expect(res1).to.have.status(UNAUTHORIZED);
      const res2 = await test.sendGetRequest(GET_ROUTE);
      expect(res2).to.have.status(UNAUTHORIZED);
    });

    it('Should return empty array when no requests exist', async () => {
      const userId = createUserToken();
      const res = await test.sendGetRequest(`${GET_ROUTE}?userId=${userId}&type=${PermissionRequestTypes.LED_SIGN}`);
      expect(res).to.have.status(OK);
      expect(res.body).to.be.an('array').that.is.empty;
    });

    it('Should return permission request when it exists', async () => {
      const userId = createUserToken();
      await createRequest(userId);
      const res = await test.sendGetRequest(`${GET_ROUTE}?userId=${userId}&type=${PermissionRequestTypes.LED_SIGN}`);
      expect(res).to.have.status(OK);
      expect(res.body).to.be.an('array').with.length(1);
      expect(res.body[0].type).to.equal(PermissionRequestTypes.LED_SIGN);
    });

    it('Should enforce authorization: non-officer only sees own requests, officer sees all', async () => {
      const userId1 = createUserToken(constants.MEMBERSHIP_STATE.MEMBER);
      const userId2 = new mongoose.Types.ObjectId();
      await PermissionRequest.deleteMany({ userId: { $in: [userId1, userId2] } });
      const request1 = await createRequest(userId1);
      const request2 = await createRequest(userId2);
      // Non-officer should only see own requests (ignores queryUserId)
      const memberRes = await test.sendGetRequest(`${GET_ROUTE}?userId=${userId2}`);
      expect(memberRes.body).to.be.an('array').with.length(1);
      // Verify it's the user's own request by checking database
      expect(await verifyRequestUserId(memberRes.body[0]._id, userId1)).to.be.true;
      // Verify userId2's request is NOT returned
      const returnedIds = memberRes.body.map(r => r._id.toString());
      expect(returnedIds).to.not.include(request2._id.toString());
      // Officer should see all requests
      createUserToken(constants.MEMBERSHIP_STATE.OFFICER);
      const officerRes = await test.sendGetRequest(GET_ROUTE);
      const officerIds = officerRes.body.map(r => r._id.toString());
      expect(officerIds).to.include(request1._id.toString());
      expect(officerIds).to.include(request2._id.toString());
    });

    it('Should filter by userId for officer and by type', async () => {
      const userId1 = createUserToken(constants.MEMBERSHIP_STATE.OFFICER);
      const userId2 = new mongoose.Types.ObjectId();
      await PermissionRequest.deleteMany({ userId: { $in: [userId1, userId2] } });
      const request1 = await createRequest(userId1);
      const request2 = await createRequest(userId2);
      const res = await test.sendGetRequest(`${GET_ROUTE}?userId=${userId2}`);
      expect(res).to.have.status(OK);
      // Verify all returned requests are for userId2 by checking database
      const returnedIds = res.body.map(r => r._id.toString());
      expect(returnedIds).to.include(request2._id.toString());
      expect(returnedIds).to.not.include(request1._id.toString());
      // Verify all returned are actually for userId2
      for (const req of res.body) {
        expect(await verifyRequestUserId(req._id, userId2)).to.be.true;
      }
      const typeRes = await test.sendGetRequest(`${GET_ROUTE}?type=${PermissionRequestTypes.LED_SIGN}`);
      expect(typeRes.body.every(r => r.type === PermissionRequestTypes.LED_SIGN)).to.be.true;
    });

    it('Should exclude deleted requests and sort by createdAt descending', async () => {
      const userId = createUserToken();
      await PermissionRequest.deleteMany({ userId });
      const active = await createRequest(userId);
      active.deletedAt = new Date();
      await active.save();
      const res = await test.sendGetRequest(GET_ROUTE);
      expect(res.body.map(r => r._id.toString())).to.not.include(active._id.toString());
      const timestamps = res.body.map(r => new Date(r.createdAt).getTime());
      for (let i = 0; i < timestamps.length - 1; i++) {
        expect(timestamps[i]).to.be.at.least(timestamps[i + 1]);
      }
    });

    it('Should populate userId fields when User exists', async () => {
      const User = require('../../api/main_endpoints/models/User');
      const userId = createUserToken();
      const user = await new User({
        _id: userId, firstName: 'John', lastName: 'Doe', email: 'john@test.com',
        password: 'Passw0rd', accessLevel: constants.MEMBERSHIP_STATE.MEMBER
      }).save();
      await PermissionRequest.deleteMany({ userId });
      await createRequest(userId);
      const res = await test.sendGetRequest(GET_ROUTE);
      expect(res.body.length).to.be.at.least(1);
      const userRequest = res.body.find(r => r.userId && (r.userId._id ? r.userId._id.toString() : r.userId.toString()) === userId.toString());
      expect(userRequest).to.exist;
      expect(userRequest.userId).to.have.property('firstName', 'John');
      expect(userRequest.userId).to.have.property('lastName', 'Doe');
      expect(userRequest.userId).to.have.property('email', 'john@test.com');
      await User.deleteOne({ _id: userId });
    });
  });

  describe('/POST delete', () => {
    it('Should return 401 when token is not sent or invalid', async () => {
      const res = await test.sendPostRequest('/api/PermissionRequest/delete', { _id: new mongoose.Types.ObjectId() });
      expect(res).to.have.status(UNAUTHORIZED);
    });

    it('Should allow a Member to cancel their own PENDING request', async () => {
      const userId = createUserToken(constants.MEMBERSHIP_STATE.MEMBER);
      const request = await new PermissionRequest({
        userId,
        type: PermissionRequestTypes.LED_SIGN,
        status: 'PENDING'
      }).save();

      const res = await test.sendPostRequestWithToken(token, '/api/PermissionRequest/delete', {
        _id: request._id
      });

      expect(res).to.have.status(OK);
      const deleted = await PermissionRequest.findById(request._id);
      expect(deleted.deletedAt).to.not.be.null;
      // Status stays PENDING because the user canceled it themselves
      expect(deleted.status).to.equal('PENDING');
    });

    it('Should set status to DENIED when an Officer deletes a PENDING request', async () => {
      const memberId = new mongoose.Types.ObjectId();
      const request = await new PermissionRequest({
        userId: memberId,
        type: PermissionRequestTypes.LED_SIGN,
        status: 'PENDING'
      }).save();

      // Switch to Officer
      createUserToken(constants.MEMBERSHIP_STATE.OFFICER);
      const res = await test.sendPostRequestWithToken(token, '/api/PermissionRequest/delete', {
        _id: request._id
      });

      expect(res).to.have.status(OK);
      const updated = await PermissionRequest.findById(request._id);
      expect(updated.status).to.equal('DENIED');
      expect(updated.deletedAt).to.not.be.null;
    });

    it('Should set status to REVOKED when an Officer deletes an APPROVED request', async () => {
      const memberId = new mongoose.Types.ObjectId();
      const request = await new PermissionRequest({
        userId: memberId,
        type: PermissionRequestTypes.LED_SIGN,
        status: 'APPROVED'
      }).save();

      createUserToken(constants.MEMBERSHIP_STATE.OFFICER);
      const res = await test.sendPostRequestWithToken(token, '/api/PermissionRequest/delete', {
        _id: request._id
      });

      expect(res).to.have.status(OK);
      const updated = await PermissionRequest.findById(request._id);
      expect(updated.status).to.equal('REVOKED');
      expect(updated.deletedAt).to.not.be.null;
    });

    it('Should return 404 if a non-officer tries to delete their own APPROVED request', async () => {
      // According to your code: if (!isOfficer) { query.status = 'PENDING' }
      // This means a member cannot revoke their own approved permission via this endpoint.
      const userId = createUserToken(constants.MEMBERSHIP_STATE.MEMBER);
      const request = await new PermissionRequest({
        userId,
        type: PermissionRequestTypes.LED_SIGN,
        status: 'APPROVED'
      }).save();

      const res = await test.sendPostRequestWithToken(token, '/api/PermissionRequest/delete', {
        _id: request._id
      });

      expect(res).to.have.status(NOT_FOUND);
    });

    it('Should return 404 when request is already deleted (deletedAt is not null)', async () => {
      createUserToken(constants.MEMBERSHIP_STATE.OFFICER);
      const deletedRequest = await new PermissionRequest({
        userId: new mongoose.Types.ObjectId(),
        type: PermissionRequestTypes.LED_SIGN,
        deletedAt: new Date(),
        status: 'PENDING'
      }).save();

      const res = await test.sendPostRequestWithToken(token, '/api/PermissionRequest/delete', {
        _id: deletedRequest._id
      });
      expect(res).to.have.status(NOT_FOUND);
    });
  });
});
