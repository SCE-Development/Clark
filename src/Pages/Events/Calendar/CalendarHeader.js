import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, PlusIcon } from '../EventIcons';
import { MONTHS, YEAR_RANGE } from './calendarConstants';

export function CalendarHeader({
  month,
  year,
  monthEventCount,
  canCreateEvent,
  onMonthChange,
  onYearChange,
  onTodayClick,
  onPreviousMonth,
  onNextMonth,
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3 px-5 py-4 border-b border-slate-600/50">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-28 sm:w-36">
            <select
              value={month}
              onChange={onMonthChange}
              aria-label="Select month"
              className="h-10 w-full appearance-none rounded-lg border border-slate-400/40 bg-slate-800 px-4 pr-10 text-[14px] font-semibold text-slate-100 transition hover:border-slate-300 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            >
              {MONTHS.map((monthName, index) => (
                <option key={monthName} value={index} className="bg-slate-900">
                  {monthName}
                </option>
              ))}
            </select>
          </div>

          <div className="relative w-24">
            <select
              value={year}
              onChange={onYearChange}
              aria-label="Select year"
              className="h-10 w-full appearance-none rounded-lg border border-slate-400/40 bg-slate-800 px-4 pr-10 text-[14px] font-semibold text-slate-100 transition hover:border-slate-300 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            >
              {YEAR_RANGE.map((yearOption) => (
                <option key={yearOption} value={yearOption} className="bg-slate-900">
                  {yearOption}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={onTodayClick}
            className="h-10 rounded-lg border border-slate-400/40 bg-slate-800 px-4 text-[14px] font-semibold text-slate-100 transition hover:border-slate-300 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          >
            Today
          </button>
        </div>

        <p className="text-sm font-medium tracking-wide text-slate-300">
          {monthEventCount} event{monthEventCount !== 1 ? 's' : ''} this month
        </p>
      </div>

      <div className="flex items-center gap-2">
        {canCreateEvent && (
          <Link
            to="/events/create"
            aria-label="Create event"
            className="inline-flex items-center justify-center w-10 h-10 transition border rounded-lg border-slate-400/40 bg-slate-800 text-slate-100 hover:border-slate-300 hover:bg-slate-700 hover:text-white"
          >
            <PlusIcon />
          </Link>
        )}

        <button
          onClick={onPreviousMonth}
          aria-label="Previous month"
          className="flex items-center justify-center w-10 h-10 transition border rounded-lg border-slate-400/40 bg-slate-800 text-slate-100 hover:border-slate-300 hover:bg-slate-700 hover:text-white"
        >
          <ChevronLeft />
        </button>

        <button
          onClick={onNextMonth}
          aria-label="Next month"
          className="flex items-center justify-center w-10 h-10 transition border rounded-lg border-slate-400/40 bg-slate-800 text-slate-100 hover:border-slate-300 hover:bg-slate-700 hover:text-white"
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
}
