const sinon = require('sinon');
// import sinon from 'sinon';

let clock = null;

/**
 * Mock current time to desired month and year
 * @param {Number} month - month to mock
 * @param {Number} year - month to mock
 */
function mockMonthAndYear(month, year) {
  clock = sinon.useFakeTimers({
    now: new Date(year, month),
    toFake: [
      'setTimeout', 'clearTimeout', 'setImmediate', 'clearImmediate',
      'setInterval', 'clearInterval', 'Date'
    ],
  });
}

/**
 * Mock current time to desired month. The year of the mocked date
 * is whatever the current year was when this function was called.
 * @param {Number} month - month to mock
 */
function mockMonth(month) {
  mockMonthAndYear(month, new Date().getFullYear());
}

/**
 * Reset clock, use after mock
 */
function revertClock() {
  if (clock) clock.restore();
}

module.exports = { mockMonthAndYear, mockMonth, revertClock };
