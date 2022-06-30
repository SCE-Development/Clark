process.env.NODE_ENV = 'test';
const { registerUser, getMemberExpirationDate } = require('../../api/main_endpoints/util/registerUser.js');

const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect, assert } = chai;

const { mockMonth, revertClock } = require('../util/mocks/Date');

const SEPTEMBER = 8;
const FEBRUARY = 1;
const JUNE = 5;
const JANUARY = 0;
const DECEMBER = 11;
const MAY = 4;

describe('registerUser', () => {
  describe('getMemberExpirationDate', () => {
    after(done => {
      // get rid of the stub
      revertClock();
      done();
    });
    it('should return june for a single semester in spring', () => {
      const today = new Date();
      mockMonth(FEBRUARY);
      let result = getMemberExpirationDate(1);
      const testDate = new Date(today.getFullYear(), JUNE);
      expect(result).deep.equal(testDate);
    });
    it('should return january of next year for a single semester in fall',
      () => {
        const today = new Date();
        mockMonth(SEPTEMBER);
        let result = getMemberExpirationDate(1);
        const testDate = new Date(today.getFullYear() + 1, JANUARY);
        expect(result).deep.equal(testDate);
      });
    it('should return january of next year for two semeseters in spring',
      () => {
        const today = new Date();
        mockMonth(FEBRUARY);
        let result = getMemberExpirationDate(2);
        const testDate = new Date(today.getFullYear() + 1, JANUARY);
        expect(result).deep.equal(testDate);
      });
    it('should return june of next year for two semesters in fall', () => {
      const today = new Date();
      mockMonth(SEPTEMBER);
      let result = getMemberExpirationDate(2);
      const testDate = new Date(today.getFullYear() + 1, JUNE);
      expect(result).deep.equal(testDate);
    });
    it('should return january of next year for one semester in december',
      () => {
        const today = new Date();
        mockMonth(DECEMBER);
        let result = getMemberExpirationDate(1);
        const testDate = new Date(today.getFullYear() + 1, JANUARY);
        expect(result).deep.equal(testDate);
      });
    it('should return june first for one semester in may', () => {
      const today = new Date();
      mockMonth(MAY);
      let result = getMemberExpirationDate(1);
      const testDate = new Date(today.getFullYear(), JUNE);
      expect(result).deep.equal(testDate);
    });
    it('should return null for no semesters', () => {
      let result = getMemberExpirationDate(0);
      expect(result).to.equal(null);
    });
  });
});
