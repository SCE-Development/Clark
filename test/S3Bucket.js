process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const constants = require('../api/util/constants');
const { OK, NOT_FOUND } = constants.STATUS_CODES;
const SceApiTester = require('./util/tools/SceApiTester');
const {
  S3BucketApiHandler,
} = require('../api/cloud_api/util/S3BucketApiHandler');

let app = null;
let test = null;
let sandbox = sinon.createSandbox();
const expect = chai.expect;
const tools = require('./util/tools/tools.js');

chai.should();
chai.use(chaiHttp);

describe('S3Bucket', () => {
  let bucketStub = null;
  before((done) => {
    bucketStub = sandbox.stub(S3BucketApiHandler.prototype, 'getSignedUrl');
    app = tools.initializeServer(
      __dirname + '/../api/cloud_api/routes/S3Bucket.js'
    );
    test = new SceApiTester(app);
    done();
  });

  after((done) => {
    if (bucketStub) bucketStub.restore();
    sandbox.restore();
    tools.terminateServer(done);
  });
  BUCKET_RESPONSE = 'Sample url';

  describe('/POST getSignedUrl', () => {
    it('Should return 200 when successful', async () => {
      bucketStub.resolves(BUCKET_RESPONSE);
      const result = await test.sendPostRequest('/api/S3Bucket/getSignedUrl');
      expect(result).to.have.status(OK);
      expect(result.body).to.have.property('url');
      expect(result.body.url).to.equal(BUCKET_RESPONSE);
    });

    it('Should return 404 when we cannot retrieve a url', async () => {
      bucketStub.rejects({});
      const result = await test.sendPostRequest('/api/S3Bucket/getSignedUrl');
      expect(result).to.have.status(NOT_FOUND);
    });
  });
});
