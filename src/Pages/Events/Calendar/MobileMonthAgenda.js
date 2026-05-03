import { formatTime, getBadgeText, pillColors } from './calendarUtils';

export function MobileMonthAgenda({ monthEvents, onSelectEvent, isAdminView }) {
  if (monthEvents.length === 0) {
    return (
      <div className="px-4 py-8 text-sm text-center text-slate-400">
        No events scheduled this month.
      </div>
    );
  }

  const groupedEvents = monthEvents.reduce((groups, item) => {
    const lastGroup = groups[groups.length - 1];
    if (!lastGroup || lastGroup.dateKey !== item.dateKey) {
      groups.push({ dateKey: item.dateKey, events: [item.event] });
      return groups;
    }
    lastGroup.events.push(item.event);
    return groups;
  }, []);

  return (
    <div className="px-3 pt-2 pb-4 space-y-3">
      {groupedEvents.map(({ dateKey, events }) => {
        const [year, month, day] = dateKey.split('-');
        const date = new Date(Number(year), Number(month) - 1, Number(day));
        const weekday = date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
        const dayOfMonth = String(date.getDate());

        return (
          <div key={dateKey} className="flex items-start gap-2">
            <div className="w-[44px] shrink-0 pt-1 text-center">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {weekday}
              </div>
              <div className="text-xl font-semibold leading-6 text-slate-100">
                {dayOfMonth}
              </div>
            </div>

            <div className="min-w-0 flex-1 space-y-1.5">
              {events.map((event) => {
                const colors = pillColors(event, isAdminView);
                const badgeText = getBadgeText(event, isAdminView);
                const timeLabel = formatTime(event.time) || 'All day';

                return (
                  <button
                    key={`${dateKey}-${event.id || event._id || event.name}`}
                    type="button"
                    onClick={() => onSelectEvent(event)}
                    className={[
                      'flex w-full items-end justify-between gap-3 rounded-lg border px-3 py-2.5 text-left transition-all',
                      'hover:border-white/30 hover:brightness-110',
                      colors.bg,
                      colors.text,
                      colors.border,
                    ].join(' ')}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold leading-snug break-words whitespace-normal">
                        {event.name || 'Untitled Event'}
                      </div>
                      <div className="pt-1 text-xs font-semibold text-white/85">
                        {timeLabel}
                      </div>
                    </div>

                    <div className="min-w-[92px] text-right">
                      <div className="text-xs break-words whitespace-normal opacity-85">
                        {event.location || '\u00A0'}
                      </div>
                      <div className="pt-1 text-[10px] uppercase tracking-wide opacity-80">
                        {badgeText || '\u00A0'}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
