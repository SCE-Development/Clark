import { useEffect, useRef } from 'react';
import { bucketEventsByHour, formatTime } from './calendarUtils';
import { EventRow } from './EventRow';

const START_HOUR = 8;

export function TimeGrid({ days, onSelectEvent, isAdminView }) {
  const scrollContainerRef = useRef(null);
  const startHourRef = useRef(null);
  const day = days[0] || { key: '', isToday: false, events: [] };
  const { allDayEvents, eventsByHour } = bucketEventsByHour(day.events);

  useEffect(() => {
    if (scrollContainerRef.current && startHourRef.current) {
      scrollContainerRef.current.scrollTop = startHourRef.current.offsetTop;
    }
  }, [day.key]);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="grid shrink-0 grid-cols-[5rem_minmax(0,1fr)] border-b border-slate-700/60 bg-slate-900/20">
        <div className="whitespace-nowrap border-r border-slate-700/60 px-2 py-3 text-right text-[10px] font-semibold text-slate-400">
          All day
        </div>
        <div className="min-w-0 space-y-1 p-1.5">
          {allDayEvents.map((event, index) => (
            <EventRow
              key={event.id || event._id || `${day.key}-all-day-${index}`}
              event={{ ...event, time: '' }}
              onSelect={() => onSelectEvent(event)}
              isAdminView={isAdminView}
            />
          ))}
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        aria-label="Hourly schedule"
        className="relative flex-1 min-h-0 overflow-y-auto overscroll-contain"
      >
        {eventsByHour.map((hourEvents, hour) => (
          <div
            key={hour}
            ref={hour === START_HOUR ? startHourRef : null}
            className="grid min-h-[8.333333%] grid-cols-[5rem_minmax(0,1fr)] border-b border-slate-700/60"
          >
            <div className="whitespace-nowrap border-r border-slate-700/60 px-2 pt-1 text-right text-[10px] font-semibold text-slate-400">
              {formatTime(`${String(hour).padStart(2, '0')}:00`)}
            </div>
            <div className="flex min-w-0 flex-col gap-1 p-1">
              {hourEvents.map((event, index) => (
                <EventRow
                  key={event.id || event._id || `${day.key}-${hour}-${index}`}
                  event={event}
                  onSelect={onSelectEvent}
                  isAdminView={isAdminView}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
