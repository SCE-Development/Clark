process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const fs = require('fs');

const {
  OK,
  UNAUTHORIZED,
  FORBIDDEN,
} = require('../../api/util/constants').STATUS_CODES;

const {
  initializeTokenMock,
  setTokenStatus,
  resetTokenMock,
  restoreTokenMock,
} = require('../util/mocks/TokenValidFunctions');

const { File } = require('node:buffer');

const sinon = require('sinon');
const SceApiTester = require('../util/tools/SceApiTester');
const expect = chai.expect;
const tools = require('../util/tools/tools.js');
const crypto = require('crypto');
const token = '';
const printerUtil = require('../../api/main_endpoints/util/Printer.js');
const User = require('../../api/main_endpoints/models/User.js');
const { MEMBERSHIP_STATE } = require('../../api/util/constants');

let app = null;
let test = null;
let sandbox = sinon.createSandbox();

chai.should();
chai.use(chaiHttp);

describe('Printer', () => {
  before(done => {
    initializeTokenMock();
    tools.emptySchema(User);

    app = tools.initializeServer([
      __dirname + '/../../api/main_endpoints/routes/Printer.js',
    ]);
    test = new SceApiTester(app);
    done();
  });

  after(done => {
    restoreTokenMock();
    sandbox.restore();
    tools.terminateServer(done);
  });

  beforeEach(() => {
    setTokenStatus(false);
  });

  afterEach(() => {
    resetTokenMock();
  });

  describe('cleanUpExpiredChunks', () => {
    const CHUNK_DIRECTORY = __dirname + '/../../api/main_endpoints/routes/printing';
    const MY_BIRTH_DATE = new Date('December 4, 2005 07:53:00');

    it('Should delete expired chunks (5 minutes or older)', async () => {
      // Clean up any pre-existing expired chunks from previous runs
      await printerUtil.cleanUpExpiredChunks(CHUNK_DIRECTORY, 0);
      const dirBefore = await fs.promises.readdir(CHUNK_DIRECTORY);
      const numFilesBefore = dirBefore.length;

      // 5 minutes old
      const firstExpiredChunk = tools.createFakeChunk(CHUNK_DIRECTORY, 'expired1.CHUNK', new Date(Date.now() - 300000));

      // 10 minutes old
      const secondExpiredChunk = tools.createFakeChunk(CHUNK_DIRECTORY, 'expired2.CHUNK', new Date(Date.now() - 600000));

      // nearly two decades old
      const thirdExpiredChunk = tools.createFakeChunk(CHUNK_DIRECTORY, 'expired3.CHUNK', MY_BIRTH_DATE);

      await printerUtil.cleanUpExpiredChunks(CHUNK_DIRECTORY, 300000);
      const dirAfter = await fs.promises.readdir(CHUNK_DIRECTORY);
      expect(dirAfter.length).to.equal(numFilesBefore);
    });

    it('Should not delete fresh chunks (less than 5 minutes old)', async () => {
      const dirBefore = await fs.promises.readdir(CHUNK_DIRECTORY);
      const numFilesBefore = dirBefore.length;

      // 4.90 minutes old
      const firstFreshChunk = tools.createFakeChunk(CHUNK_DIRECTORY, 'fresh1.CHUNK', new Date(Date.now() - 294000));

      // 1 minute old
      const secondFreshChunk = tools.createFakeChunk(CHUNK_DIRECTORY, 'fresh2.CHUNK', new Date(Date.now() - 60000));

      // 20 minutes from the future
      const thirdFreshChunk = tools.createFakeChunk(CHUNK_DIRECTORY, 'fresh3.CHUNK', new Date(Date.now() + 1200000));

      await printerUtil.cleanUpExpiredChunks(CHUNK_DIRECTORY, 300000);
      const dirAfter = await fs.promises.readdir(CHUNK_DIRECTORY);
      expect(dirAfter.length).to.equal(numFilesBefore + 3);

      await fs.promises.unlink(firstFreshChunk);
      await fs.promises.unlink(secondFreshChunk);
      await fs.promises.unlink(thirdFreshChunk);
    });

    it ('Should return false if a bad directory is given', async () => {
      const response = await printerUtil.cleanUpExpiredChunks('haha this directory doesnt do not exist', 1);
      expect(response).to.equal(false);
    });
  });

  describe('/POST sendPrintRequest', () => {
    const id = crypto.randomUUID();
    const CHUNK_SIZE = 1024 * 1024 * 0.5; // 0.5 MB
    const FAKE_PDF = new File([new Uint32Array(1024 * 1024)], 'real_pdf'); // 16 MB
    const TOTAL_CHUNKS = Math.ceil(FAKE_PDF.size / CHUNK_SIZE);

    const DUMMY_CHUNK = new FormData();

    it('Should return 401 when token is not sent', async () => {
      const result = await test.sendPostRequest('/api/Printer/sendPrintRequest', { DUMMY_CHUNK });
      expect(result).to.have.status(UNAUTHORIZED);
    });

    it('Should return 403 when invalid token is sent', async () => {
      setTokenStatus(null);
      const result = await test.sendPostRequestWithToken(token, '/api/Printer/sendPrintRequest', { DUMMY_CHUNK });
      expect(result).to.have.status(FORBIDDEN);
    });

    it(`Should successfully process all ${TOTAL_CHUNKS} chunks sent (with valid token)`, async () => {
      let chunksProcessed = 0;

      const testUser = await new User({
        email: 'getuser@test.com',
        password: 'Passw0rd',
        firstName: 'Get',
        lastName: 'User',
        accessLevel: MEMBERSHIP_STATE.MEMBER,
        emailVerified: true,
        escrowPagesPrinted: 0
      }).save();

      setTokenStatus(true, { _id: testUser._id });

      for (let i = 0; i < TOTAL_CHUNKS; i++) {
        let chunkStart = i * CHUNK_SIZE;
        let chunk = FAKE_PDF.slice(chunkStart, chunkStart + CHUNK_SIZE);
        const arrayBuffer = await chunk.arrayBuffer();

        const result = await chai
          .request(app)
          .post('/api/Printer/sendPrintRequest')
          .set('Authorization', `Bearer ${token}`)
          .type('form')
          .field('totalChunks', TOTAL_CHUNKS)
          .field('totalPages', 1)
          .field('chunkIdx', i)
          .field('sides', 'one-sided')
          .field('copies', 1)
          .field('id', id)
          .attach('chunk', Buffer.from(arrayBuffer), id + '_' + i + '.CHUNK');

        if (result.status === OK) {
          chunksProcessed++;
        }
      }

      expect(chunksProcessed).to.equal(TOTAL_CHUNKS);
      const userAfterPrinting = await User.findOne({ _id: testUser._id });
      expect(userAfterPrinting.escrowPagesPrinted).to.equal(1);
    });
  });
});
