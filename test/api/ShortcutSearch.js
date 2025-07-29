process.env.NODE_ENV = 'test';

const User = require('../../api/main_endpoints/models/User.js');

// Require the dev-dependencies
const chai = require('chai');

const chaiHttp = require('chai-http');
const {
  OK,
  UNAUTHORIZED,
  FORBIDDEN
} = require('../../api/util/constants').STATUS_CODES;
const SceApiTester = require('../util/tools/SceApiTester');

let app = null;
let test = null;

const expect = chai.expect;
const tools = require('../util/tools/tools.js');
const {
  setTokenStatus,
  resetTokenMock,
  restoreTokenMock,
  initializeTokenMock
} = require('../util/mocks/TokenValidFunctions');

const {
  setDiscordAPIStatus,
  resetDiscordAPIMock,
  restoreDiscordAPIMock,
  initializeDiscordAPIMock
} = require('../util/mocks/DiscordApiFunction');
const { MEMBERSHIP_STATE } = require('../../api/util/constants');
const { getMemberExpirationDate } = require('../../api/main_endpoints/util/userHelpers.js');

chai.should();
chai.use(chaiHttp);

// Our parent block
describe('ShortcutSearch', () => {
  before(async () => {
    initializeTokenMock();
    initializeDiscordAPIMock();
    app = tools.initializeServer([
      __dirname + '/../../api/main_endpoints/routes/ShortcutSearch.js',
    ]);
    test = new SceApiTester(app);
    // Before each test we empty the database
    await tools.emptySchema(User);
    const testUser = new User({
      email: 'shortcutsearch@b.c',
      password: 'Passw0rd',
      firstName: 'firstName',
      lastName: 'lastName',
      major: 'Software Engineering',
    });
    testUser.save();
  });

  after(done => {
    restoreTokenMock();
    restoreDiscordAPIMock();
    tools.terminateServer(done);
  });

  beforeEach(() => {
    setTokenStatus(false);
    setDiscordAPIStatus(false);
  });

  afterEach(() => {
    resetTokenMock();
    resetDiscordAPIMock();
  });

  const token = '';

  describe('POST /', () => {
    const queryUser = { query: 'coOl' };
    const fiveMatchUsers = { query: 'Lot' };
    const url = '/api/ShortcutSearch/';

    it('Should return status code 403 if no token is passed through', async () => {
      setTokenStatus(false);
      const result = await test.sendPostRequest(url, queryUser);
      expect(result).to.have.status(FORBIDDEN);
    });

    it('Should return status code 401 if access level is invalid', async () => {
      setTokenStatus(false, { accessLevel: MEMBERSHIP_STATE.MEMBER });
      const result = await test.sendPostRequestWithToken(token, url, queryUser);
      expect(result).to.have.status(UNAUTHORIZED);
    });

    before(async () => {
      await User.deleteMany({});
      const users = [
        {
          // contains 'lot'
          firstName: 'Elton',
          lastName: 'Salvatore',
          email: 'test0@test.com',
          password: 'Passw0rd',
          emailVerified: true,
          accessLevel: MEMBERSHIP_STATE.NON_MEMBER, // Not a Member
          joinDate: new Date('2014-02-31'), // Previous Semester
          membershipValidUntil: getMemberExpirationDate(0), // Expired
        },
        {
          // contains both 'lot' and 'cool'
          firstName: 'Lot',
          lastName: 'IsCool',
          email: 'test1@test.com',
          password: 'Passw0rd',
          emailVerified: true,
          accessLevel: MEMBERSHIP_STATE.MEMBER,
          joinDate: new Date('2015-03-01'), // This Semester
          membershipValidUntil: getMemberExpirationDate(1), // Semester Plan
        },
        {
          // contains 'lot'
          firstName: 'Clinton',
          lastName: 'Roberts',
          email: 'test2@test.com',
          password: 'Passw0rd',
          emailVerified: true,
          accessLevel: MEMBERSHIP_STATE.MEMBER,
          joinDate: new Date('2014-09-10'), // Previous Semester
          membershipValidUntil: getMemberExpirationDate(2), // Annual Plan
        },
        {
          // contains both 'lot' and 'cool'
          firstName: 'Lola',
          lastName: 'Contetol',
          email: 'test3@test.com',
          password: 'Passw0rd',
          emailVerified: true,
          accessLevel: MEMBERSHIP_STATE.MEMBER,
          joinDate: new Date('2015-03-10'), // This Semester
          membershipValidUntil: getMemberExpirationDate(2) // Annual Plan
        },
        {
          // contains 'lot'
          firstName: 'Elton',
          lastName: 'Salvatore',
          email: 'test00@test.com',
          password: 'Passw0rd',
          emailVerified: true,
          accessLevel: MEMBERSHIP_STATE.NON_MEMBER, // Not a Member
          joinDate: new Date('2014-06-10'), // Previous Semester
          membershipValidUntil: getMemberExpirationDate(0), // Expired
        },
        {
          // contains 'lot'
          firstName: 'Lori',
          lastName: 'Mattingly',
          email: 'test5@test.com',
          password: 'Passw0rd',
          emailVerified: true,
          accessLevel: MEMBERSHIP_STATE.NON_MEMBER, // Not a Member
          joinDate: new Date('2015-03-15'), // This Semester
          //  Expiration Date Unchanged
        },
        {
          // contains 'lot'
          firstName: 'Mallory',
          lastName: 'Cotton',
          email: 'test6@test.com',
          password: 'Passw0rd',
          emailVerified: true,
          accessLevel: MEMBERSHIP_STATE.MEMBER,
          joinDate: new Date('2015-03-05'), // This Semester
          membershipValidUntil: getMemberExpirationDate(2), // Annual Plan
        },
        {
          // contains 'cool'
          firstName: 'Cool',
          lastName: 'Unmatch',
          email: 'test7@test.com',
          password: 'Passw0rd',
          emailVerified: true,
          accessLevel: MEMBERSHIP_STATE.MEMBER,
          joinDate: new Date('2015-02-15'), // This Semester
          membershipValidUntil: getMemberExpirationDate(1), // Semester Plan
        },
      ];
      await User.insertMany(users);
    });

    describe('When valid token and access level - status code 200', () => {
      beforeEach(() => {
        setTokenStatus(true, { accessLevel: MEMBERSHIP_STATE.OFFICER });
      });

      it('Should return an empty array when the query is missing', async () => {
        const result = await test.sendPostRequestWithToken(token, url, {});
        expect(result).to.have.status(OK);
        expect(result.body.items.users).that.is.an('array').that.is.empty;
        expect(result.body.items.cleezyData).that.is.an('array').that.is.empty;
      });

      it('Should return FIVE records when query = \'Lot\'', async () => {
        const result = await test.sendPostRequestWithToken(token, url, fiveMatchUsers);
        expect(result).to.have.status(OK);
        expect(result.body.items.users).that.is.an('array').to.have.lengthOf(5);
      });

      it('Should return no records when query = \'Pika\'', async () => {
        const result = await test.sendPostRequestWithToken(token, url, { query: 'Pika' });
        expect(result).to.have.status(OK);
        expect(result.body.items.users).that.is.an('array').that.is.empty;
      });

      beforeEach(() => {
        setTokenStatus(true, { accessLevel: MEMBERSHIP_STATE.ADMIN });
      });

      it('Should return THREE records when query = \'coOl\'', async () => {
        const result = await test.sendPostRequestWithToken(token, url, queryUser);
        expect(result).to.have.status(OK);
        expect(result.body.items.users).that.is.an('array').to.have.lengthOf(3);
      });

      it('Should show results sorted by best match of name and email', async () => {
        const result = await test.sendPostRequestWithToken(token, url, fiveMatchUsers);
        expect(result).to.have.status(OK);
        expect(result.body.items.users.map(u => u.email)).to.eql([
          'test1@test.com',
          'test0@test.com',
          'test00@test.com',
          'test2@test.com',
          'test3@test.com'
        ]);
      });
    });

    describe('When valid token and access level with injection-like input - status code 200', () => {
      beforeEach(() => {
        setTokenStatus(true, { accessLevel: MEMBERSHIP_STATE.ADMIN });
      });
      it('Should return AT MOST five records', async () => {
        const injectionPayloads = [
          '{"$gt": ""}',
          '{"$where": "this.firstName === \'Mallory\'"}',
          '{"$ne": null}',
          '{"$or": [ {}, {} ]}',
          '{"$regex": ".*" }',
          '.*',
          '^',
          '[object Object]',
          [],
          {},
          null,
          undefined
        ];
        for (const payload of injectionPayloads) {
          const result = await test.sendPostRequestWithToken(token, url, { query: String(payload)});
          expect(result).to.have.status(OK);
          expect(result.body.items.users.length).at.most(5);
          expect(result.body.items.cleezyData.length).at.most(5);
        }
      });
    });

    after(() => {
      User.deleteMany({});
    });
  });
});
