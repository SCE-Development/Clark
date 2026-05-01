import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { toDateKey } from '../eventUtils';
import { ChevronLeft, ChevronRight, PlusIcon } from '../EventIcons';
import { eventDateKey, MONTHS, sortEventsForDay, YEAR_RANGE } from './calendarViewUtils';
import EventPopup from './EventPopup';
import DayLabels from './DayLabels';
import CalCell from './CalCell';
import MobileMonthAgenda from './MobileMonthAgenda';

export default function CalendarView({
  events,
  isAdminView = false,
  user,
  canCreateEvent = false,
  cursor,
  setCursor,
}) {
  const today = useMemo(() => new Date(), []);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const eventsByDate = useMemo(() => {
    const map = {};
    events.forEach((ev) => {
      const key = eventDateKey(ev);
      if (!key) return;
      if (!map[key]) map[key] = [];
      map[key].push(ev);
    });
    Object.keys(map).forEach((key) => {
      map[key] = sortEventsForDay(map[key]);
    });
    return map;
  }, [events]);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();

  function handleMonthChange(e) {
    const nextMonth = Number(e.target.value);
    setCursor(new Date(year, nextMonth, 1));
  }

  function handleYearChange(e) {
    const nextYear = Number(e.target.value);
    setCursor(new Date(nextYear, month, 1));
  }

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const totalCells = Math.ceil((firstDayOfMonth + daysInMonth) / 7) * 7;
  const todayKey = toDateKey(today);

  const cells = Array.from({ length: totalCells }, (_, i) => {
    const dayOffset = i - firstDayOfMonth;
    const date = new Date(year, month, dayOffset + 1);
    const key = toDateKey(date);
    return {
      date,
      key,
      isCurrentMonth: date.getMonth() === month,
      isToday: key === todayKey,
      events: eventsByDate[key] || [],
    };
  });

  const monthEventCount = cells
    .filter((c) => c.isCurrentMonth)
    .reduce((sum, c) => sum + c.events.length, 0);

  const monthEvents = useMemo(() => {
    return cells
      .filter((c) => c.isCurrentMonth && c.events.length > 0)
      .flatMap((c) =>
        c.events.map((event) => ({
          event,
          dateKey: c.key,
        }))
      );
  }, [cells]);

  return (
    <>
      {selectedEvent && (
        <EventPopup
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          isAdminView={isAdminView}
          user={user}
        />
      )}

      <div className="flex h-full max-h-full flex-col overflow-hidden rounded-xl border border-slate-500/50 bg-slate-800/85 shadow-[0_0_0_1px_rgba(148,163,184,0.05)] sm:h-auto sm:max-h-none">
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-600/50 px-5 py-4">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative w-28 sm:w-36">
                <select
                  value={month}
                  onChange={handleMonthChange}
                  aria-label="Select month"
                  className="h-10 w-full appearance-none rounded-lg border border-slate-400/40 bg-slate-800 px-4 pr-10 text-[14px] font-semibold text-slate-100 transition hover:border-slate-300 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                >
                  {MONTHS.map((monthName, index) => (
                    <option key={monthName} value={index} className="bg-slate-900">
                      {monthName}
                    </option>
                  ))}
                </select>

                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-300">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              <div className="relative w-24">
                <select
                  value={year}
                  onChange={handleYearChange}
                  aria-label="Select year"
                  className="h-10 w-full appearance-none rounded-lg border border-slate-400/40 bg-slate-800 px-4 pr-10 text-[14px] font-semibold text-slate-100 transition hover:border-slate-300 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                >
                  {YEAR_RANGE.map((yearOption) => (
                    <option key={yearOption} value={yearOption} className="bg-slate-900">
                      {yearOption}
                    </option>
                  ))}
                </select>

                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-300">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              <button
                onClick={() => setCursor(new Date(today.getFullYear(), today.getMonth(), 1))}
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
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-400/40 bg-slate-800 text-slate-100 transition hover:border-slate-300 hover:bg-slate-700 hover:text-white"
              >
                <PlusIcon />
              </Link>
            )}

            <button
              onClick={() => setCursor(new Date(year, month - 1, 1))}
              aria-label="Previous month"
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-400/40 bg-slate-800 text-slate-100 transition hover:border-slate-300 hover:bg-slate-700 hover:text-white"
            >
              <ChevronLeft />
            </button>
            <button
              onClick={() => setCursor(new Date(year, month + 1, 1))}
              aria-label="Next month"
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-400/40 bg-slate-800 text-slate-100 transition hover:border-slate-300 hover:bg-slate-700 hover:text-white"
            >
              <ChevronRight />
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto sm:hidden">
          <MobileMonthAgenda
            monthEvents={monthEvents}
            onSelectEvent={setSelectedEvent}
            isAdminView={isAdminView}
          />
        </div>

        <div className="hidden sm:block">
          <DayLabels />

          <div className="grid grid-cols-7 [&>*:nth-child(7n)]:border-r-0">
            {cells.map((cell) => (
              <CalCell
                key={cell.key}
                {...cell}
                onSelectEvent={setSelectedEvent}
                isAdminView={isAdminView}
              />
            ))}
          </div>
        </div>

        {isAdminView ? (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-slate-700/70 bg-slate-900/35 px-5 py-3">
            {[
              { label: 'Published', dot: 'bg-cyan-300' },
              { label: 'Private', dot: 'bg-violet-300' },
              { label: 'Draft', dot: 'bg-amber-300' },
              { label: 'Closed', dot: 'bg-rose-300' },
            ].map(({ label, dot }) => (
              <span key={label} className="flex items-center gap-1.5 text-[12px] font-medium text-slate-300">
                <span className={['h-2 w-2 rounded-full', dot].join(' ')} />
                {label}
              </span>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-slate-700/70 bg-slate-900/35 px-5 py-3">
            {[
              { label: 'Open', dot: 'bg-cyan-300' },
              { label: 'Members only', dot: 'bg-violet-300' },
              { label: 'Closed', dot: 'bg-rose-300' },
            ].map(({ label, dot }) => (
              <span key={label} className="flex items-center gap-1.5 text-[11px] font-medium text-slate-300">
                <span className={['h-2.5 w-2.5 rounded-full', dot].join(' ')} />
                {label}
              </span>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
