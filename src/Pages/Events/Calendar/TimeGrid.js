import { useEffect, useRef } from 'react';
import { bucketEventsByHour, formatTime } from './calendarUtils';
import { DAYS } from './calendarConstants';
import { EventRow } from './EventRow';

const START_HOUR = 8;

export function TimeGrid({ days, onSelectEvent, isAdminView }) {
  const scrollContainerRef = useRef(null);
  const startHourRef = useRef(null);
  const isWeekView = days.length === 7;
  const day = days[0] || { key: '', isToday: false, events: [] };
  const dayBuckets = days.map(({ events }) => bucketEventsByHour(events));
  const { allDayEvents, eventsByHour } = dayBuckets[0];

  useEffect(() => {
    if (scrollContainerRef.current && startHourRef.current) {
      scrollContainerRef.current.scrollTop = startHourRef.current.offsetTop;
    }
  }, [day.key]);

  if (isWeekView) {
    return (
      <div className="flex min-h-0 flex-1 flex-col overflow-x-auto">
        <div className="flex min-h-0 min-w-[640px] flex-1 flex-col">
          <div className="grid shrink-0 grid-cols-[5rem_repeat(7,minmax(0,1fr))] border-b border-slate-700/70 bg-slate-900/35">
            <div />
            {days.map((weekDay, index) => (
              <div
                key={weekDay.key}
                className="flex flex-col items-center gap-1 py-2 text-center text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400"
              >
                <span>{DAYS[index]}</span>
                <span
                  className={[
                    'flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 text-xs font-semibold tracking-normal',
                    weekDay.isToday ? 'bg-cyan-400 text-slate-950' : 'text-slate-200',
                  ].join(' ')}
                >
                  {weekDay.date.getDate()}
                </span>
              </div>
            ))}
          </div>

          <div className="grid shrink-0 grid-cols-[5rem_repeat(7,minmax(0,1fr))] border-b border-slate-700/60 bg-slate-900/20 [&>*:nth-child(8n)]:border-r-0">
            <div className="whitespace-nowrap border-r border-slate-700/60 px-2 py-3 text-right text-[10px] font-semibold text-slate-400">
              All day
            </div>
            {days.map((weekDay, index) => (
              <div
                key={weekDay.key}
                className={[
                  'min-w-0 space-y-1 border-r border-slate-700/60 p-1.5',
                  weekDay.isToday ? 'bg-cyan-500/[0.12]' : '',
                ].join(' ')}
              >
                {dayBuckets[index].allDayEvents.map((event, eventIndex) => (
                  <EventRow
                    key={event.id || event._id || `${weekDay.key}-all-day-${eventIndex}`}
                    event={{ ...event, time: '' }}
                    onSelect={() => onSelectEvent(event)}
                    isAdminView={isAdminView}
                  />
                ))}
              </div>
            ))}
          </div>

          <div
            ref={scrollContainerRef}
            aria-label="Hourly schedule"
            className="relative flex-1 min-h-0 overflow-y-auto overscroll-contain"
          >
            {Array.from({ length: 24 }, (_, hour) => (
              <div
                key={hour}
                ref={hour === START_HOUR ? startHourRef : null}
                className="grid min-h-[8.333333%] grid-cols-[5rem_repeat(7,minmax(0,1fr))] border-b border-slate-700/60 [&>*:nth-child(8n)]:border-r-0"
              >
                <div className="whitespace-nowrap border-r border-slate-700/60 px-2 pt-1 text-right text-[10px] font-semibold text-slate-400">
                  {formatTime(`${String(hour).padStart(2, '0')}:00`)}
                </div>
                {days.map((weekDay, index) => (
                  <div
                    key={weekDay.key}
                    className={[
                      'flex min-w-0 flex-col gap-1 border-r border-slate-700/60 p-1',
                      weekDay.isToday ? 'bg-cyan-500/[0.12]' : '',
                    ].join(' ')}
                  >
                    {dayBuckets[index].eventsByHour[hour].map((event, eventIndex) => (
                      <EventRow
                        key={event.id || event._id || `${weekDay.key}-${hour}-${eventIndex}`}
                        event={event}
                        onSelect={onSelectEvent}
                        isAdminView={isAdminView}
                      />
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

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
