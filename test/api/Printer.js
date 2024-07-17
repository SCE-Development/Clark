/* global describe it before after */
process.env.NODE_ENV = "test";

const User = require("../../api/main_endpoints/models/User");

const chai = require("chai");

const chaiHttp = require("chai-http");
const constants = require("../../api/util/constants.js");
const { OK, UNAUTHORIZED, NOT_FOUND, SERVER_ERROR, BAD_REQUEST } =
  require("../../api/util/constants").STATUS_CODES;
const sinon = require("sinon");
const SceApiTester = require("../util/tools/SceApiTester.js");
const { PDFDocument } = require("pdf-lib");

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
const {
  PRINTING = {}
} = require('../../api/config/config.json');

describe("Printer", () => {
  let healthCheckStub = null;

  before((done) => {
    initializeTokenMock();
    healthCheckStub = sandbox.stub(SshTunnelFunctions, 'healthCheck');
    healthCheckStub.resolves(false);
    app = tools.initializeServer(
      __dirname + "/../../api/main_endpoints/routes/Printer.js"
    );
    test = new SceApiTester(app);
    tools.emptySchema(User);
    done();
  });

  after((done) => {
    restoreTokenMock();
    if (healthCheckStub) healthCheckStub.restore();
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
    it("Should return 200 when printing is disabled ", async () => {
      PRINTING.ENABLED = false;
      const result = await test.sendGetRequest("/api/Printer/healthCheck");
      expect(result).to.have.status(OK);
    });

    it("Should return 200 when printing is enabled and ssh tunnel is up ", async () => {
      PRINTING.ENABLED = true;
      healthCheckStub.resolves(true);
      const result = await test.sendGetRequest("/api/Printer/healthCheck");
      expect(result).to.have.status(OK);
    });
    
    it("Should return 404 when printing is enabled but ssh tunnel is down ", async () => {
      PRINTING.ENABLED = true;
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
    
    it("Should return 200 when printing is disabled ", async () => {
      PRINTING.ENABLED = false;
      setTokenStatus(true);
      const result = await test.sendPostRequestWithToken(
        token, "/api/Printer/sendPrintRequest"
      );
      expect(result).to.have.status(OK);
    });
    
    it('Should return 400 when print page count exceeds weekly limit ',
      async () => {
        PRINTING.ENABLED = true;
        setTokenStatus(true);
        /*
        setTokenStatus(true, mockUser);
        mockUser = {
          email:
          pagesPrinted:
        };
        create new PDF using PDFDocument

        data - PDF File and its configurations
        data.file - PDF file
        data.copies - Number of copies
        data.sides - Sides to print: one-sided or two-sided
        data, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }

        Mock User.findOne (create stub) to return the mockUser

        Mock getPagesToBeUsedInPrintRequestStub line 102~106 to return mock data.

        Mock file operations to avoid actual file operations and HTTP Requests. 

        Check that response status is BAD_REQUEST

        For valid request,
        Mock axios.post(PRINTER_URL + '/print', ...) in require('../util/Printer.js');
        Check that return status is OK.

        */
        const result = await test.sendPostRequestWithToken(
          token, '/api/Printer/sendPrintRequest', params);
        expect(result).to.have.status(BAD_REQUEST);
      });

    // it('Should return 200 when all required fields are filled in ',
    //   async () => {
    //     setTokenStatus(true);
    //     const result = await test.sendPostRequestWithToken(
    //       '/api/Printer/sendPrintRequest', );
    //     expect(result).to.have.status();
    //   });

    //   it('Should return 500 when all required fields are not filled in ',
    //   async () => {
    //     setTokenStatus(true);
    //     const result = await test.sendPostRequestWithToken(
    //       '/api/Printer/sendPrintRequest', );
    //     expect(result).to.have.status();
    //   });
  });
});
