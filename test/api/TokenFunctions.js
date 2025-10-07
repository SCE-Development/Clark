/* global describe it before after afterEach */

const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
const proxyquire = require('proxyquire');
const { OK, FORBIDDEN, UNAUTHORIZED } = require('../../api/util/constants').STATUS_CODES;
const membershipState = require('../../api/util/constants').MEMBERSHIP_STATE;

const requestWithToken = {
  headers: {
    authorization: 'Bearer hi thai',
  },
  body: {
    accessLevel: 2,
  }
};
const requestWithoutToken = {
  body: {}
};
let tokenFunctions;
let jwtStub;


describe('TokenFunctions', () => {
  jwtStub = sinon.stub();
  beforeEach(done => {
    tokenFunctions = proxyquire('../../api/main_endpoints/util/token-functions',
      {
        jsonwebtoken: {
          verify: jwtStub
        }
      });
    done();
  });
  describe('decodeToken', () => {
    it('Should resolve with UNAUTHORIZED if no token is sent', done => {
      tokenFunctions.decodeToken(requestWithoutToken)
        .then(decodedResponse => {
          expect(decodedResponse.status).to.equal(UNAUTHORIZED);
          done();
        });
    });
    it('Should resolve with FORBIDDEN if token is invalid', done => {
      jwtStub.yields(new Error('invalid token'), null);
      tokenFunctions.decodeToken(requestWithToken)
        .then(decodedResponse => {
          expect(decodedResponse.status).to.equal(FORBIDDEN);
          done();
        });
    });
    it('Should resolve with FORBIDDEN if access level is insufficient',
      done => {
        jwtStub.yields(null, { accessLevel: membershipState.MEMBER });
        tokenFunctions.decodeToken(requestWithToken, membershipState.OFFICER)
          .then(decodedResponse => {
            expect(decodedResponse.status).to.equal(FORBIDDEN);
            done();
          });
      });
    it('Should resolve with OK and the decoded token if token is valid and access level is sufficient',
      done => {
        const decodedToken = { accessLevel: membershipState.OFFICER, firstName: 'Test' };
        jwtStub.yields(null, decodedToken);
        tokenFunctions.decodeToken(requestWithToken, membershipState.OFFICER)
          .then(decodedResponse => {
            expect(decodedResponse.status).to.equal(OK);
            expect(decodedResponse.token).to.equal(decodedToken);
            done();
          });
      });
  });
});
