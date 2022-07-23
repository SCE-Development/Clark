process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const constants = require('../../api/util/constants');
const { OK, BAD_REQUEST } = constants.STATUS_CODES;
const SceApiTester = require('../util/tools/SceApiTester');
const { SceGoogleApiHandler } =
  require('../../api/cloud_api/util/SceGoogleApiHandler');
const verificationTemplate =
  require('../../api/cloud_api/email_templates/verification');

let app = null;
let test = null;
let sandbox = sinon.createSandbox();
const expect = chai.expect;
const tools = require('../util/tools/tools.js');

chai.should();
chai.use(chaiHttp);

describe('Mailer', () => {
  let sendEmailStub = null;
  let verificationStub = null;
  before(done => {
    sendEmailStub = sandbox.stub(SceGoogleApiHandler.prototype, 'sendEmail');
    verificationStub = sandbox.stub(verificationTemplate, 'verification');
    app = tools.initializeServer(
      __dirname + '/../../api/cloud_api/routes/Mailer.js');
    test = new SceApiTester(app);
    done();
  });

  after(done => {
    if (sendEmailStub) sendEmailStub.restore();
    if (verificationStub) verificationStub.restore();
    sandbox.restore();
    tools.terminateServer(done);
  });

  const VALID_EMAIL_REQUEST = {
    recipientEmail: 'a@a.com',
    recipientName: 'test'
  };

  describe('/POST sendVerificationEmail', () => {
    it('Should return 200 when an email is successfully sent', async () => {
      sendEmailStub.resolves({});
      verificationStub.resolves({});
      const result = await test.sendPostRequest(
        '/api/Mailer/sendVerificationEmail', VALID_EMAIL_REQUEST);
      expect(result).to.have.status(OK);
    });

    it('Should return 400 when we cannot generate a hashed ID', async () => {
      sendEmailStub.resolves({});
      verificationStub.rejects({});
      const result = await test.sendPostRequest(
        '/api/Mailer/sendVerificationEmail', VALID_EMAIL_REQUEST);
      expect(result).to.have.status(BAD_REQUEST);
    });

    it('Should return 400 when sending an email fails', async () => {
      sendEmailStub.rejects({});
      const result = await test.sendPostRequest(
        '/api/Mailer/sendVerificationEmail', VALID_EMAIL_REQUEST);
      expect(result).to.have.status(BAD_REQUEST);
    });
  });

  describe('/POST sendBlastEmail', () => {
    it('Should return 200 when an email is successfully sent', async () => {
      sendEmailStub.resolves({});
      verificationStub.resolves({});
      const result = await test.sendPostRequest(
        '/api/Mailer/sendBlastEmail',
        VALID_EMAIL_REQUEST
      );
      expect(result).to.have.status(OK);
    });

    it('Should return 400 when sending an email fails', async () => {
      sendEmailStub.rejects({});
      const result = await test.sendPostRequest(
        '/api/Mailer/sendBlastEmail',
        VALID_EMAIL_REQUEST
      );
      expect(result).to.have.status(BAD_REQUEST);
    });
  });
});
