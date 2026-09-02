import { expect } from 'chai';

import {
  bucketEventsByHour,
  calendarSearchParams,
  countLabel,
  miniMonthMatrix,
  stepCursor,
  viewTitle,
  visibleRange,
} from '../../src/Pages/Events/Calendar/calendarUtils';

function dateParts(date) {
  return [date.getFullYear(), date.getMonth(), date.getDate()];
}

describe('Calendar view mode helpers', () => {
  describe('visibleRange', () => {
    it('returns inclusive day, week, month, and year ranges', () => {
      expect(visibleRange('day', new Date(2026, 7, 27))).to.deep.equal({
        startDate: '2026-08-27',
        endDate: '2026-08-27',
      });
      expect(visibleRange('week', new Date(2026, 8, 2))).to.deep.equal({
        startDate: '2026-08-30',
        endDate: '2026-09-05',
      });
      expect(visibleRange('month', new Date(2028, 1, 14))).to.deep.equal({
        startDate: '2028-02-01',
        endDate: '2028-02-29',
      });
      expect(visibleRange('year', new Date(2026, 7, 27))).to.deep.equal({
        startDate: '2026-01-01',
        endDate: '2026-12-31',
      });
    });
  });

  describe('stepCursor', () => {
    it('steps day and week views across month boundaries', () => {
      expect(dateParts(stepCursor('day', new Date(2026, 7, 31), 1)))
        .to.deep.equal([2026, 8, 1]);
      expect(dateParts(stepCursor('day', new Date(2026, 7, 1), -1)))
        .to.deep.equal([2026, 6, 31]);
      expect(dateParts(stepCursor('week', new Date(2026, 7, 30), 1)))
        .to.deep.equal([2026, 8, 6]);
      expect(dateParts(stepCursor('week', new Date(2026, 7, 30), -1)))
        .to.deep.equal([2026, 7, 23]);
    });

    it('anchors month and year steps to day one without mutating the cursor', () => {
      const monthCursor = new Date(2026, 0, 31);
      const yearCursor = new Date(2028, 1, 29);

      expect(dateParts(stepCursor('month', monthCursor, 1)))
        .to.deep.equal([2026, 1, 1]);
      expect(dateParts(stepCursor('year', yearCursor, 1)))
        .to.deep.equal([2029, 1, 1]);
      expect(dateParts(monthCursor)).to.deep.equal([2026, 0, 31]);
      expect(dateParts(yearCursor)).to.deep.equal([2028, 1, 29]);
    });
  });

  describe('view labels', () => {
    it('formats titles and count labels for all four views', () => {
      const cursor = new Date(2026, 7, 27);
      const crossMonthWeekCursor = new Date(2026, 8, 2);
      const crossYearWeekCursor = new Date(2026, 11, 30);

      expect(viewTitle('day', cursor)).to.equal('Thursday, August 27, 2026');
      expect(viewTitle('week', cursor)).to.equal('August 2026');
      expect(viewTitle('week', crossMonthWeekCursor)).to.equal('August - September 2026');
      expect(viewTitle('week', crossYearWeekCursor)).to.equal('December 2026 - January 2027');
      expect(viewTitle('month', cursor)).to.equal('August 2026');
      expect(viewTitle('year', cursor)).to.equal('2026');
      expect(countLabel('day')).to.equal('today');
      expect(countLabel('week')).to.equal('this week');
      expect(countLabel('month')).to.equal('this month');
      expect(countLabel('year')).to.equal('this year');
    });
  });

  describe('bucketEventsByHour', () => {
    it('keeps timed events ordered and moves invalid times to all day', () => {
      const midnight = { name: 'Midnight', time: '00:00' };
      const firstMorning = { name: 'Z first', time: '09:30' };
      const secondMorning = { name: 'A second', time: '09:30' };
      const late = { name: 'Late', time: '23:59' };
      const untimed = { name: 'Untimed' };
      const malformed = { name: 'Malformed', time: 'morning' };
      const outOfRange = { name: 'Out of range', time: '24:00' };
      const badMinute = { name: 'Bad minute', time: '12:99' };
      const missingMinute = { name: 'Missing minute', time: '09:' };
      const result = bucketEventsByHour([
        midnight,
        firstMorning,
        secondMorning,
        late,
        untimed,
        malformed,
        outOfRange,
        badMinute,
        missingMinute,
      ]);

      expect(result.eventsByHour).to.have.lengthOf(24);
      expect(new Set(result.eventsByHour).size).to.equal(24);
      expect(result.eventsByHour[0]).to.deep.equal([midnight]);
      expect(result.eventsByHour[9]).to.deep.equal([firstMorning, secondMorning]);
      expect(result.eventsByHour[23]).to.deep.equal([late]);
      expect(result.allDayEvents)
        .to.deep.equal([untimed, malformed, outOfRange, badMinute, missingMinute]);
    });
  });

  describe('miniMonthMatrix', () => {
    it('builds a Sunday-start leap-February matrix with complete weeks', () => {
      const matrix = miniMonthMatrix(2028, 1);
      const dates = matrix.filter(Boolean);

      expect(matrix).to.have.lengthOf(35);
      expect(matrix[0]).to.equal(null);
      expect(matrix[1]).to.equal(null);
      expect(dateParts(matrix[2])).to.deep.equal([2028, 1, 1]);
      expect(dateParts(matrix[30])).to.deep.equal([2028, 1, 29]);
      expect(matrix.slice(31)).to.deep.equal([null, null, null, null]);
      expect(dates).to.have.lengthOf(29);
    });
  });

  describe('calendarSearchParams', () => {
    const cursor = new Date(2026, 7, 27);

    it('keeps Month URLs free of view and day parameters', () => {
      const params = calendarSearchParams(
        '?month=7&year=2026&view=day&day=12',
        cursor,
        'month',
      );

      expect(params.toString()).to.equal('month=7&year=2026');
      expect(params.has('view')).to.equal(false);
      expect(params.has('day')).to.equal(false);
    });

    it('writes day only for Day and Week while preserving unrelated parameters', () => {
      const dayParams = calendarSearchParams('?filter=mine', cursor, 'day');
      const weekParams = calendarSearchParams('?filter=mine', cursor, 'week');
      const yearParams = calendarSearchParams('?filter=mine&day=12', cursor, 'year');

      expect(dayParams.get('month')).to.equal('7');
      expect(dayParams.get('year')).to.equal('2026');
      expect(dayParams.get('view')).to.equal('day');
      expect(dayParams.get('day')).to.equal('27');
      expect(dayParams.get('filter')).to.equal('mine');
      expect(weekParams.get('month')).to.equal('7');
      expect(weekParams.get('year')).to.equal('2026');
      expect(weekParams.get('view')).to.equal('week');
      expect(weekParams.get('day')).to.equal('27');
      expect(weekParams.get('filter')).to.equal('mine');
      expect(yearParams.get('view')).to.equal('year');
      expect(yearParams.has('day')).to.equal(false);
      expect(yearParams.get('filter')).to.equal('mine');
    });
  });
});
