/* global describe it before after */
process.env.NODE_ENV = 'test';
const Advertisement = require('../../api/main_endpoints/models/Advertisement');
const chai = require('chai');
const chaiHttp = require('chai-http');
const constants = require('../../api/util/constants');
const { OK, BAD_REQUEST, UNAUTHORIZED, FORBIDDEN, NOT_FOUND } = constants.STATUS_CODES;
const SceApiTester = require('../../test/util/tools/SceApiTester');
const {
  initializeTokenMock,
  setTokenStatus,
  resetTokenMock,
  restoreTokenMock,
} = require('../util/mocks/TokenValidFunctions');
const AuditLog = require('../../api/main_endpoints/models/AuditLog');
const AuditLogActions = require('../../api/main_endpoints/util/auditLogActions');
const mongoose = require('mongoose');

let app = null;
let test = null;
const expect = chai.expect;

const tools = require('../util/tools/tools.js');
chai.should();
chai.use(chaiHttp);

const token = '';

describe('Advertisement', () => {
  before(done => {
    initializeTokenMock();
    app = tools.initializeServer(
      __dirname + '/../../api/main_endpoints/routes/Advertisement.js');
    test = new SceApiTester(app);
    tools.emptySchema(Advertisement);
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

  const INVALID_ADVERTISEMENT = {
    createDate: new Date('01/01/2001')
  };

  const VALID_ADVERTISEMENT = {
    message: 'Shameless plug',
    createDate: new Date('01/01/2001'),
    expireDate: new Date('10/10/2001')
  };

  describe('/POST createAdvertisement', () => {

    it('Should return 403 when token is not sent', async () => {
      const res = await test.sendPostRequest('/api/Advertisement/createAdvertisement', VALID_ADVERTISEMENT);
      expect(res).to.have.status(FORBIDDEN);
    });

    it('Should return 401 when invalid token is sent', async () => {
      const res = await test.sendPostRequestWithToken(token, '/api/Advertisement/createAdvertisement', VALID_ADVERTISEMENT);
      expect(res).to.have.status(UNAUTHORIZED);
    });

    describe('audit log tests for creating ads', () => {

      const userId = new mongoose.Types.ObjectId();

      beforeEach(async () => {
        await Advertisement.deleteMany({});
        await AuditLog.deleteMany({});

        setTokenStatus(true, {
          _id: userId,
          email: 'admin@test.com',
          accessLevel: 'ADMIN'
        });
      });

      afterEach(async () => {
        await Advertisement.deleteMany({});
        await AuditLog.deleteMany({});
      });

      it('Should create audit log when ad is succesfully created' + 'with user info of who created the ad', async () => {

        const res = await test.sendPostRequestWithToken(token, '/api/Advertisement/createAdvertisement', VALID_ADVERTISEMENT);
        expect(res).to.have.status(OK);

        const auditEntry = await AuditLog.findOne({
          userId: userId,
          action: AuditLogActions.CREATE_AD
        }).lean();

        expect(auditEntry).to.exist;
        expect(auditEntry.action).to.equal(AuditLogActions.CREATE_AD);
        expect(auditEntry.details).to.have.property('message', 'Shameless plug');
        expect(auditEntry.details).to.have.property('advertisementId');
        expect(auditEntry.userId.toString()).to.equal(userId.toString());
      });

      it('Should not create audit logs for invalid advertisement creation', async () => {

        const res = await test.sendPostRequestWithToken(token, '/api/Advertisement/createAdvertisement', INVALID_ADVERTISEMENT);

        expect(res).to.have.status(BAD_REQUEST);

        const auditEntry = await AuditLog.findOne({
          userId: userId,
          action: AuditLogActions.CREATE_AD
        }).lean();

        expect(auditEntry).to.not.exist;
      });
    });
  });

  describe('/POST deleteAdvertisement', () => {
    it('Should return 403 if no token is sent', async () => {
      const res = await test.sendPostRequest('/api/Advertisement/deleteAdvertisement', { _id: VALID_ADVERTISEMENT._id });
      expect(res).to.have.status(FORBIDDEN);
    });

    it('Should return 401 if invalid token is sent', async () => {
      const res = await test.sendPostRequestWithToken(token, '/api/Advertisement/deleteAdvertisement', { _id: VALID_ADVERTISEMENT._id });
      expect(res).to.have.status(UNAUTHORIZED);
    });

    it('Should return 404 if ad is not found', async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const userId = new mongoose.Types.ObjectId();
      setTokenStatus(true, {
        _id: userId,
        email: 'admin@test.com',
        accessLevel: 'ADMIN'
      });

      const res = await test.sendPostRequestWithToken(token, '/api/Advertisement/deleteAdvertisement', { _id: fakeId });
      expect(res).to.have.status(NOT_FOUND);

      const auditEntry = await AuditLog.findOne({
        userId: userId,
        action: AuditLogActions.DELETE_AD
      }).lean();

      expect(auditEntry).to.not.exist;
    });

    it('Should return 404 if ad fails to delete (e.g., already deleted)', async () => {
      setTokenStatus(true);

      await Advertisement.deleteOne({ _id: VALID_ADVERTISEMENT._id });

      const res = await test.sendPostRequestWithToken(token, '/api/Advertisement/deleteAdvertisement', { _id: VALID_ADVERTISEMENT._id });
      expect(res).to.have.status(NOT_FOUND);
    });

    describe('audit log tests for deleting ads', () => {

      const userId = new mongoose.Types.ObjectId();
      let createdAd = null;

      beforeEach(async () => {
        await Advertisement.deleteMany({});
        await AuditLog.deleteMany({});

        setTokenStatus(true, {
          _id: userId,
          email: 'admin@test.com',
          accessLevel: 'ADMIN'
        });

        createdAd = await Advertisement.create({
          message: 'Delete me!',
          expireDate: new Date('10/12/2099')
        });
      });

      afterEach(async () => {
        await Advertisement.deleteMany({});
        await AuditLog.deleteMany({});
      });

      it('Should create an audit log for succesful ad deletion', async () => {
        const res = await test.sendPostRequestWithToken(token, '/api/Advertisement/deleteAdvertisement', { _id: createdAd._id });
        expect(res).to.have.status(OK);

        const ad = await Advertisement.findById(createdAd._id);
        expect(ad).to.be.null;

        const auditEntry = await AuditLog.findOne({
          userId: userId,
          action: AuditLogActions.DELETE_AD
        }).lean();

        expect(auditEntry).to.exist;
        expect(auditEntry.userId.toString()).to.equal(userId.toString());
        expect(auditEntry.details.deletedAd.message).to.equal('Delete me!');
        expect(auditEntry.details.deletedAd.id.toString()).to.equal(createdAd._id.toString());
      });
    });
  });
});
