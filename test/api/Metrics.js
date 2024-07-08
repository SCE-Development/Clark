/* global describe it before after beforeEach afterEach */
// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');

const { OK } = require('../../api/util/constants').STATUS_CODES;

const sinon = require('sinon');
const SceApiTester = require('../util/tools/SceApiTester');
const expect = chai.expect;
const tools = require('../util/tools/tools.js');

let app = null;
let test = null;
let sandbox = sinon.createSandbox();

chai.should();
chai.use(chaiHttp);

describe('Metrics', () => {
	  before(done => {
    app = tools.initializeServer([
      __dirname + '/../../api/main_endpoints/routes/Metrics.js',
    ]);
    test = new SceApiTester(app);
    done();
  	});

  after(done => {
    tools.terminateServer(done);
  });

  describe('GET /metrics', () => {
    it('should return the metrics for the Prometheus server', async () => {
      const res = await test.sendGetRequest('/metrics');
      expect(res).to.have.status(OK);
      expect(res).to.be.text;
    });

    it('should consist of the string # HELP and # TYPE', async () => {
      const res = await test.sendGetRequest('/metrics');
      expect (res.text).to.have.string('# HELP');
      expect (res.text).to.have.string('# TYPE');
    });
  });
});
