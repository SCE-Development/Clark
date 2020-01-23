import sinon from 'sinon'

let clock = null

/**
 * Mock current time to desired month
 * @param {Number} month - month to mock
 */
export function mockMonth (month) {
  const year = new Date().getFullYear()
  clock = sinon.useFakeTimers(new Date(year, month))
}

/**
 * Reset clock, use after mock
 */
export function revertClock () {
  if (clock) clock.restore()
}
