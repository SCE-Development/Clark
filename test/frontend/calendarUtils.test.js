import { expect } from 'chai';
import { getWeekRowIndex } from '../../src/Pages/Events/Calendar/calendarUtils';

describe('getWeekRowIndex', () => {
  // May 2026 starts on Friday (firstDayOfMonth === 5)
  const may2026FirstDay = new Date(2026, 4, 1).getDay();

  it('returns 0 for the first day of May 2026', () => {
    expect(getWeekRowIndex(1, may2026FirstDay)).to.equal(0);
  });

  it('returns 5 for May 31, 2026 (6th week row)', () => {
    expect(getWeekRowIndex(31, may2026FirstDay)).to.equal(5);
  });
});
