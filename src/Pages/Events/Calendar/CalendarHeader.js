import { Link } from 'react-router-dom';
import { ChevronDown, ChevronLeft, ChevronRight, PlusIcon } from '../EventIcons';
import { VIEW_MODES } from './calendarConstants';

export function CalendarHeader({
  view,
  onViewChange,
  title,
  eventCount,
  countLabel,
  canCreateEvent,
  onTodayClick,
  onPrevious,
  onNext,
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3 px-5 py-4 border-b border-slate-600/50">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-28 sm:w-36">
            <select
              value={view}
              onChange={(e) => onViewChange(e.target.value)}
              aria-label="Select calendar view"
              className="h-10 w-full appearance-none rounded-lg border border-slate-400/40 bg-slate-800 px-4 pr-10 text-[14px] font-semibold text-slate-100 transition hover:border-slate-300 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            >
              {VIEW_MODES.map(({ label, value }) => (
                <option key={value} value={value} className="bg-slate-900">
                  {label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-300">
              <ChevronDown />
            </div>
          </div>

          <button
            onClick={onTodayClick}
            className="h-10 rounded-lg border border-slate-400/40 bg-slate-800 px-4 text-[14px] font-semibold text-slate-100 transition hover:border-slate-300 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          >
            Today
          </button>
        </div>

        <p className="text-sm font-medium tracking-wide text-slate-300">
          {eventCount} event{eventCount !== 1 ? 's' : ''} {countLabel}
        </p>
      </div>

      <div className="flex items-center gap-[6px]">
        {canCreateEvent && (
          <Link
            to="/events/create"
            aria-label="Create event"
            className="inline-flex items-center justify-center w-10 h-10 transition border rounded-lg border-slate-400/40 bg-slate-800 text-slate-100 hover:border-slate-300 hover:bg-slate-700 hover:text-white"
          >
            <PlusIcon />
          </Link>
        )}

        <span className="mr-[6px] text-[14px] font-semibold text-slate-100 whitespace-nowrap">
          {title}
        </span>

        <button
          onClick={onPrevious}
          aria-label="Previous month"
          className="flex items-center justify-center w-10 h-10 transition border rounded-lg border-slate-400/40 bg-slate-800 text-slate-100 hover:border-slate-300 hover:bg-slate-700 hover:text-white"
        >
          <ChevronLeft />
        </button>

        <button
          onClick={onNext}
          aria-label="Next month"
          className="flex items-center justify-center w-10 h-10 transition border rounded-lg border-slate-400/40 bg-slate-800 text-slate-100 hover:border-slate-300 hover:bg-slate-700 hover:text-white"
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
}
