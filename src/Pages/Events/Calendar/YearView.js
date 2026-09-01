import { useEffect, useRef, useState } from 'react';
import { toDateKey } from '../eventUtils';
import { DAYS, MONTHS } from './calendarConstants';
import { miniMonthMatrix } from './calendarUtils';
import { EventRow } from './EventRow';

export function YearView({
  year,
  activeMonth,
  eventsByDate,
  onSelectEvent,
  onSelectMonth,
  isAdminView,
}) {
  const todayKey = toDateKey(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const monthRefs = useRef([]);
  const selectedDateKey = selectedDate ? toDateKey(selectedDate) : null;
  const selectedEvents = selectedDateKey ? eventsByDate[selectedDateKey] || [] : [];

  useEffect(() => {
    setSelectedDate(null);
  }, [year]);

  useEffect(() => {
    monthRefs.current[activeMonth]?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }, [activeMonth, year]);

  function handleYearContentClick(event) {
    if (
      event.target.closest('button')
      || event.target.closest('[data-year-date-preview]')
    ) return;
    setSelectedDate(null);
  }

  return (
    <div className="flex-1 min-h-0 overflow-y-auto" onClick={handleYearContentClick}>
      {selectedDate && (
        <div
          className="sticky top-0 z-10 w-full px-4 pt-3 sm:px-5"
          data-year-date-preview="true"
        >
          <div className="rounded-lg border border-slate-700/60 bg-slate-900/95 p-3 shadow-lg">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-slate-100">
                {MONTHS[selectedDate.getMonth()]} {selectedDate.getDate()}, {year}
              </p>
              <button
                type="button"
                onClick={() => setSelectedDate(null)}
                className="rounded px-2 py-1 text-xs font-semibold text-slate-300 transition hover:bg-slate-700 hover:text-white"
                aria-label="Clear selected date"
              >
                Close
              </button>
            </div>

            {selectedEvents.length > 0 ? (
                {selectedEvents.map((event, index) => (
                  <EventRow
                    key={event.id || event._id || `${selectedDateKey}-${index}`}
                    event={event}
                    onSelect={onSelectEvent}
                    isAdminView={isAdminView}
                  />
                ))}
              </div>
            ) : (
              <p className="mt-2 text-xs text-slate-400">No events scheduled for this date.</p>
            )}
          </div>
        </div>
      )}

      <div
        className="grid w-full grid-cols-1 gap-y-3 p-4 sm:grid-cols-3 sm:gap-x-4 sm:gap-y-4 sm:p-5"
        data-admin-view={isAdminView ? 'true' : 'false'}
      >
        {MONTHS.map((monthName, monthIndex) => {
          const monthDates = miniMonthMatrix(year, monthIndex);

          return (
            <section
              key={monthName}
              ref={(node) => {
                monthRefs.current[monthIndex] = node;
              }}
              className="min-w-0 rounded-lg border border-slate-700/50 bg-slate-900/20 p-2"
            >
              <button
                type="button"
                onClick={() => onSelectMonth(monthIndex)}
                className="mb-2 w-full text-center text-sm font-semibold text-slate-100 transition hover:text-cyan-200"
              >
                {monthName}
              </button>

              <div className="grid grid-cols-7 text-center text-[9px] font-bold uppercase tracking-[0.1em] text-slate-500">
                {DAYS.map((day) => (
                  <span key={day}>{day}</span>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-y-0.5">
                {monthDates.map((date, index) => {
                  if (!date) {
                    return <div key={`${monthName}-${index}`} className="h-9" aria-hidden="true" />;
                  }

                  const dateKey = toDateKey(date);
                  const isToday = dateKey === todayKey;
                  const isSelected = dateKey === selectedDateKey;
                  const hasEvents = Boolean(eventsByDate[dateKey]?.length);

                  return (
                    <button
                      key={dateKey}
                      type="button"
                      onClick={() => setSelectedDate(date)}
                      className={[
                        'flex h-9 flex-col items-center justify-center gap-1 rounded-md text-xs transition-colors',
                        isToday
                          ? 'text-slate-950'
                          : isSelected
                            ? 'bg-slate-700/70 text-slate-50'
                            : 'text-slate-200 hover:bg-slate-700/60',
                      ].join(' ')}
                      aria-label={`${monthName} ${date.getDate()}, ${year}`}
                    >
                      <span
                        className={[
                          'flex h-5 w-5 items-center justify-center rounded-full leading-none',
                          isToday ? 'bg-cyan-400 text-slate-950' : '',
                        ].join(' ')}
                      >
                        {date.getDate()}
                      </span>
                      <span
                        className={[
                          'h-1 w-1 rounded-full',
                          hasEvents ? 'bg-cyan-300' : 'invisible',
                        ].join(' ')}
                      />
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
