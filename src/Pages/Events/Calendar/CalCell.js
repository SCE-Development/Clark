import EventRow from './EventRow';
import { sortEventsForDay } from './calendarViewUtils';

export default function CalCell({ date, isCurrentMonth, isToday, events, onSelectEvent, isAdminView }) {
  const sortedEvents = sortEventsForDay(events);
  const mobileRows = sortedEvents.slice(0, 2);
  const desktopOnlyRows = sortedEvents.slice(2, 4);
  const hiddenCount = Math.max(sortedEvents.length - 4, 0);

  return (
    <div
      className={[
        'min-h-[106px] sm:min-h-[124px] border-b border-r border-slate-700/60 p-1.5 transition-colors duration-150',
        isCurrentMonth ? '' : 'opacity-30',
        isToday ? 'bg-cyan-500/[0.12]' : 'hover:bg-slate-700/35',
      ].join(' ')}
    >
      <div className="mb-1 flex justify-start">
        <span
          className={[
            'flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 text-xs font-semibold',
            isToday ? 'bg-cyan-400 text-slate-950' : isCurrentMonth ? 'text-slate-200' : 'text-slate-600',
          ].join(' ')}
        >
          {date.getDate()}
        </span>
      </div>

      <div className="flex flex-col gap-0.5">
        {mobileRows.map((ev) => (
          <EventRow
            key={ev.id}
            event={ev}
            onSelect={onSelectEvent}
            isAdminView={isAdminView}
          />
        ))}

        {desktopOnlyRows.map((ev) => (
          <div key={ev.id} className="hidden sm:block">
            <EventRow
              event={ev}
              onSelect={onSelectEvent}
              isAdminView={isAdminView}
            />
          </div>
        ))}

        {hiddenCount > 0 && (
          <span className="pl-1 text-[10px] font-medium text-slate-400">
            +{hiddenCount} more
          </span>
        )}
      </div>
    </div>
  );
}
