import { expect } from 'chai';
import { getWeekRowIndex, getTodayWeekRowIndex } from '../../src/Pages/Events/Calendar/calendarUtils';
import { toDateKey } from '../../src/Pages/Events/eventUtils';

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

describe('getTodayWeekRowIndex', () => {
  function buildMay2026Cells(todayKey) {
    const year = 2026;
    const month = 4;
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const totalCells = Math.ceil((firstDayOfMonth + daysInMonth) / 7) * 7;

    return Array.from({ length: totalCells }, (_, i) => {
      const dayOffset = i - firstDayOfMonth;
      const date = new Date(year, month, dayOffset + 1);
      const key = toDateKey(date);
      return {
        key,
        isToday: key === todayKey,
      };
    });
  }

  it('returns 5 when today is May 31, 2026', () => {
    const cells = buildMay2026Cells('2026-05-31');
    expect(getTodayWeekRowIndex(cells)).to.equal(5);
  });

  it('returns 5 when today is June 1, 2026 in the May grid', () => {
    const cells = buildMay2026Cells('2026-06-01');
    expect(getTodayWeekRowIndex(cells)).to.equal(5);
  });

  it('returns 0 when today is not in the grid', () => {
    const cells = buildMay2026Cells('2026-07-04');
    expect(getTodayWeekRowIndex(cells)).to.equal(0);
  });
});
