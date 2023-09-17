process.env.NODE_ENV = 'test';
const { getMemberExpirationDate } =
  require('../../api/main_endpoints/util/userHelpers.js');

const chai = require('chai');
const { expect, assert } = chai;

const { mockMonth, revertClock } = require('../util/mocks/Date');

const SEPTEMBER = 8;
const FEBRUARY = 1;
const JUNE = 5;
const JANUARY = 0;
const DECEMBER = 11;
const MAY = 4;
const TODAY = new Date();

describe('registerUser', () => {
  describe('getMemberExpirationDate', () => {
    afterEach(done => {
      // get rid of the stub
      revertClock();
      done();
    });
    it('should return june for a single semester in spring', () => {
      mockMonth(FEBRUARY);
      let result = getMemberExpirationDate(1);
      const testDate = new Date(TODAY.getFullYear(), JUNE);
      expect(result).deep.equal(testDate);
    });
    it('should return january of next year for a single semester in fall',
      () => {
        mockMonth(SEPTEMBER);
        let result = getMemberExpirationDate(1);
        const testDate = new Date(TODAY.getFullYear() + 1, JANUARY);
        expect(result).deep.equal(testDate);
      });
    it('should return january of next year for two semeseters in spring',
      () => {
        mockMonth(FEBRUARY);
        let result = getMemberExpirationDate(2);
        const testDate = new Date(TODAY.getFullYear() + 1, JANUARY);
        expect(result).deep.equal(testDate);
      });
    it('should return june of next year for two semesters in fall', () => {
      mockMonth(SEPTEMBER);
      let result = getMemberExpirationDate(2);
      const testDate = new Date(TODAY.getFullYear() + 1, JUNE);
      expect(result).deep.equal(testDate);
    });
    it('should return january of next year for one semester in december',
      () => {
        mockMonth(DECEMBER);
        let result = getMemberExpirationDate(1);
        const testDate = new Date(TODAY.getFullYear() + 1, JANUARY);
        expect(result).deep.equal(testDate);
      });
    it('should return june first for one semester in may', () => {
      mockMonth(MAY);
      let result = getMemberExpirationDate(1);
      const testDate = new Date(TODAY.getFullYear(), JUNE);
      expect(result).deep.equal(testDate);
    });
    it('should return today for 0 semester', () => {
      mockMonth(MAY);
      const testDate = new Date(TODAY.getFullYear(), MAY);
      let result = getMemberExpirationDate(0);
      expect(result).deep.equal(testDate);
    });
  });
});
