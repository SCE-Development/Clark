process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const constants = require('../api/util/constants');
const { OK, NOT_FOUND } = constants.STATUS_CODES;
const SceApiTester = require('./util/tools/SceApiTester');
const { SceGithubApiHandler } =
  require('../api/util/SceGithubApiHandler');

let app = null;
let test = null;
let sandbox = sinon.createSandbox();
const expect = chai.expect;
const tools = require('./util/tools/tools.js');
const GITHUB_RESPONSE = 'Sample response';

chai.should();
chai.use(chaiHttp);

describe('Github', () => {
  let githubStub = null;
  before(done => {
    githubStub = sandbox.stub(SceGithubApiHandler.prototype,
      'getPullRequestsFromRepo');
    app = tools.initializeServer(
      __dirname + '/../api/routes/Github.js');
    test = new SceApiTester(app);
    done();
  });

  after(done => {
    if (githubStub) githubStub.restore();
    sandbox.restore();
    tools.terminateServer(done);
  });

  describe('/GET getPullRequestsFromRepo', () => {
    it('Should return 200 with list of pull requests when successful',
      async () => {
        githubStub.resolves(GITHUB_RESPONSE);
        const result = await test.sendGetRequest(
          '/api/github/getPullRequestsFromRepo');
        expect(result.body).to.have.property('pullRequests');
        expect(result.body.pullRequests).to.equal(GITHUB_RESPONSE);
        expect(result).to.have.status(OK);
      });

    it('Should return 404 when we cannot retrieve pull requests from repo',
      async () => {
        githubStub.rejects({});
        const result = await test.sendGetRequest(
          '/api/github/getPullRequestsFromRepo');
        expect(result).to.have.status(NOT_FOUND);
      });
  });
});

describe('Github', () => {
  let githubStub = null;
  before(done => {
    githubStub = sandbox.stub(SceGithubApiHandler.prototype,
      'getCommitsFromRepo');
    app = tools.initializeServer(
      __dirname + '/../api/routes/Github.js');
    test = new SceApiTester(app);
    done();
  });

  after(done => {
    if (githubStub) githubStub.restore();
    sandbox.restore();
    tools.terminateServer(done);
  });

  describe('/GET getCommitsFromRepo', () => {
    it('Should return 200 with commits when successful',
      async () => {
        githubStub.resolves(GITHUB_RESPONSE);
        const result = await test.sendGetRequest(
          '/api/github/getCommitsFromRepo');
        expect(result.body).to.have.property('commits');
        expect(result.body.commits).to.equal(GITHUB_RESPONSE);
        expect(result).to.have.status(OK);
      });

    it('Should return 404 when we cannot retrieve commits from repo',
      async () => {
        githubStub.rejects({});
        const result = await test.sendGetRequest(
          '/api/github/getCommitsFromRepo');
        expect(result).to.have.status(NOT_FOUND);
      });
  });
});

describe('Github', () => {
  let githubStub = null;
  before(done => {
    githubStub = sandbox.stub(SceGithubApiHandler.prototype,
      'getContributorsInPastMonthFromRepo');
    app = tools.initializeServer(
      __dirname + '/../api/routes/Github.js');
    test = new SceApiTester(app);
    done();
  });

  after(done => {
    if (githubStub) githubStub.restore();
    sandbox.restore();
    tools.terminateServer(done);
  });

  describe('/GET getContributorsInPastMonthFromRepo', () => {
    it('Should return 200 with list of contributors when successful',
      async () => {
        githubStub.resolves(GITHUB_RESPONSE);
        const result = await test.sendGetRequest(
          '/api/github/getContributorsInPastMonthFromRepo');
        expect(result.body).to.have.property('contributors');
        expect(result.body.contributors).to.equal(GITHUB_RESPONSE);
        expect(result).to.have.status(OK);
      });

    it('Should return 404 when we cannot retrieve contributors from repo',
      async () => {
        githubStub.rejects({});
        const result = await test.sendGetRequest(
          '/api/github/getContributorsInPastMonthFromRepo');
        expect(result).to.have.status(NOT_FOUND);
      });
  });
});
