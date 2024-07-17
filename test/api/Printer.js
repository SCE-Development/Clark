/* global describe it before after */
process.env.NODE_ENV = "test";

const User = require("../../api/main_endpoints/models/User");

const chai = require("chai");

const chaiHttp = require("chai-http");
const { OK, UNAUTHORIZED, NOT_FOUND, BAD_REQUEST } =
  require("../../api/util/constants").STATUS_CODES;
const sinon = require("sinon");
const SceApiTester = require("../util/tools/SceApiTester.js");
const { PDFDocument } = require("pdf-lib");
const multer = require('multer');
const fs = require ('fs');

let app = null;
let test = null;
let sandbox = sinon.createSandbox();

const expect = chai.expect;
const tools = require("../util/tools/tools.js");
const {
  setTokenStatus,
  resetTokenMock,
  restoreTokenMock,
  initializeTokenMock,
} = require("../util/mocks/TokenValidFunctions");

chai.should();
chai.use(chaiHttp);
const SshTunnelFunctions = require('../../api/main_endpoints/util/Printer')

describe("Printer", () => {
  let healthCheckStub = null;
  let userFindOneMock = null;
  let userUpdateOneMock = null;
  let createReadStreamSub = null;

  before((done) => {
    initializeTokenMock();
    healthCheckStub = sandbox.stub(SshTunnelFunctions, 'healthCheck');
    healthCheckStub.resolves(false);
    app = tools.initializeServer(
      __dirname + "/../../api/main_endpoints/routes/Printer.js"
    );
    test = new SceApiTester(app);
    tools.emptySchema(User);
    userFindOneMock = sandbox.stub(User, 'findOne');
    userUpdateOneMock = sandbox.stub(User, 'updateOne');
    createReadStreamSub = sandbox.stub(fs, 'createReadStream');
    done();
  });

  after((done) => {
    restoreTokenMock();
    if (healthCheckStub) healthCheckStub.restore();
    userFindOneMock.restore();
    userUpdateOneMock.restore();
    createReadStreamSub.restore();
    sandbox.restore();
    tools.terminateServer(done);
  });

  beforeEach(() => {
    setTokenStatus(false);
    healthCheckStub.resolves(false);
  });

  afterEach(() => {
    resetTokenMock();
  });

  const token = '';
  // Test cases for /healthCheck endpoint
  describe("/GET healthCheck", () => {
    it("Should return 200 when printing is enabled and ssh tunnel is up", async () => {
      healthCheckStub.resolves(true);
      const result = await test.sendGetRequest("/api/Printer/healthCheck");
      expect(result).to.have.status(OK);
    });

    it("Should return 404 when printing is enabled but ssh tunnel is down ", async () => {
      healthCheckStub.resolves(false);
      const result = await test.sendGetRequest("/api/Printer/healthCheck");
      expect(result).to.have.status(NOT_FOUND);
    });
  });

  // Test cases for /sendPrintRequest endpoint
  describe("/POST sendPrintRequest", () => {
    it("Should return 401 when token is not sent ", async () => {
      const result = await test.sendPostRequest(
        "/api/Printer/sendPrintRequest"
      );
      expect(result).to.have.status(UNAUTHORIZED);
    });

    it("Should return 401 when invalid token is sent ", async () => {
      const result = await test.sendPostRequestWithToken(
        token,
        "/api/Printer/sendPrintRequest"
      );
      expect(result).to.have.status(UNAUTHORIZED);
    });

    it('Should return 400 when print page count exceeds weekly limit ',
      async () => {
        
        setTokenStatus(true);
        createReadStreamSub.resolves(null);
        const result = await test.sendPostRequestWithTokenAndFile(
          token, "/api/Printer/sendPrintRequest", 'idk', {
          copies: 1,
          sides: 'one-sided',
        }
        );
        // mock user result?
        // mock page count result?
        // mock delete file?
      });

    // it('Should return 200 when all required fields are filled in ',
    //   async () => {
    //   });

    // it('Should delete the file after a successful print request ',
    //   async () => {
    //   });

    // it('update the user's page count after a successful print request',
    //   async () => {
    //   });

    //   it('Should return 500 the ssh tunnel is down ',
    //   async () => {
    //   });

    //   it('Should delete the file anyway when the ssh tunnel is down ',
    //   async () => {
    //   });
  });
});
