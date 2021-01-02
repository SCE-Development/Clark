/* global describe it before after afterEach */
import { membershipState } from '../../Enums';

const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
const proxyquire = require('proxyquire');

const requestWithToken = {
  body: {
    token: 'hi thai',
    accessLevel: membershipState.MEMBER,
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
    tokenFunctions = proxyquire('../api/main_endpoints/util/token-functions',
      {
        jsonwebtoken: {
          verify: jwtStub
        }
      });
    done();
  });
  describe('checkIfTokenSent', () => {
    it('Should return true if a token field exists in the request', done => {
      expect(tokenFunctions.checkIfTokenSent(requestWithToken)).to.equal(true);
      done();
    });
    it('Should return false if a token field does ' +
      'not exist in the request', done => {
      expect(tokenFunctions.checkIfTokenSent(requestWithoutToken))
        .to.equal(false);
      done();
    });
  });

  describe('checkIfTokenValid', () => {
    it('Should return the decoded response ', done => {
      jwtStub.yields(false, requestWithToken.body);
      expect(tokenFunctions.checkIfTokenValid(requestWithToken))
        .to.equal(true);
      done();
    });
    it('Should return false if a token field ' +
      'does not exist in the request', done => {
      jwtStub.yields(true, false);
      expect(tokenFunctions.checkIfTokenValid(requestWithToken))
        .to.equal(false);
      done();
    });
  });
});
