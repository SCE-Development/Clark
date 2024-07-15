/* global describe it before after */
process.env.NODE_ENV = 'test';
const Advertisement = require('../../api/main_endpoints/models/Advertisement');
const chai = require('chai');
const chaiHttp = require('chai-http');
const constants = require('../../api/util/constants');
const { OK, BAD_REQUEST } = constants.STATUS_CODES;
const SceApiTester = require('../../test/util/tools/SceApiTester');

let app = null;
let test = null;
const expect = chai.expect;

const tools = require('../util/tools/tools.js');
chai.should();
chai.use(chaiHttp);

describe('Advertisement', () => {
  before(done => {
    app = tools.initializeServer(
      __dirname + '/../../api/main_endpoints/routes/Advertisement.js');
    test = new SceApiTester(app);
    tools.emptySchema(Advertisement);
    done();
  });

  after(done => {
    tools.terminateServer(done);
  });

  const INVALID_ADVERTISEMENT = {
    createDate: new Date('01/01/2001')
  };

  const VALID_ADVERTISEMENT = {
    pictureUrl:
      'https://www.fosi.org/',
    createDate: new Date('01/01/2001'),
    expireDate: new Date('10/10/2001')
  };

});
