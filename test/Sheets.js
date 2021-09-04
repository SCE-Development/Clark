process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const constants = require('../api/util/constants');
const { OK, NOT_FOUND } = constants.STATUS_CODES;
const SceApiTester = require('./util/tools/SceApiTester');
const { SceGoogleApiHandler } =
  require('../api/util/SceGoogleApiHandler');

let app = null;
let test = null;
let sandbox = sinon.createSandbox();
const expect = chai.expect;
const tools = require('./util/tools/tools.js');


chai.should();
chai.use(chaiHttp);

describe('Sheets', () => {
  let sheetsStub = null;
  before(done => {
    sheetsStub = sandbox.stub(SceGoogleApiHandler.prototype, 'writeToForm');
    app = tools.initializeServer(
      __dirname + '/../api/routes/Sheets.js');
    test = new SceApiTester(app);
    done();
  });

  after(done => {
    if (sheetsStub) sheetsStub.restore();
    sandbox.restore();
    tools.terminateServer(done);
  });

  const SHEETS_REQUEST = {
    sheetsId: 'XXXXXXX',
    row: {
      name: 'test',
      email: 'test@gmail.com',
      gradMonth: 'test',
      gradYear: 'test',
      experience: 'test',
      linkedin: 'test'
    }
  };

  const SHEETS_RESPONSE = 'Sample Response';

  describe('/POST addToSpreadsheet', () =>{
    it('Should return 200 when a row of data is successfully added',
      async () => {
        sheetsStub.resolves(SHEETS_RESPONSE);
        const result = await test.sendPostRequest(
          '/api/Sheets/addToSpreadsheet', SHEETS_REQUEST);
        expect(result.body).to.have.property('sheetsData');
        expect(result.body.sheetsData).to.equal(SHEETS_RESPONSE);
        expect(result).to.have.status(OK);
      });

    it('Should return 404 when a row of data is not added',
      async () => {
        sheetsStub.rejects({});
        const result = await test.sendPostRequest(
          '/api/Sheets/addToSpreadsheet', SHEETS_REQUEST);
        expect(result).to.have.status(NOT_FOUND);
      });
  });
});
