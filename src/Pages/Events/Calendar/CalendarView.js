import { useState, useMemo } from 'react';
import { toDateKey } from '../eventUtils';
import { eventDateKey, sortEventsForDay } from './calendarUtils';
import { EventPopup } from './EventPopup';
import { CalendarHeader } from './CalendarHeader';
import { CalendarGrid } from './CalendarGrid';
import { MobileMonthAgenda } from './MobileMonthAgenda';
import { CalendarLegend } from './CalendarLegend';
import { MONTHS } from './calendarConstants';

export default function CalendarView({
  events,
  isAdminView = false,
  user,
  canCreateEvent = false,
  cursor,
  setCursor,
  view,
  onViewChange,
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
        <CalendarHeader
          view={view}
          onViewChange={onViewChange}
          title={`${MONTHS[month]} ${year}`}
          eventCount={monthEventCount}
          countLabel="this month"
          canCreateEvent={canCreateEvent}
          onTodayClick={() => setCursor(new Date(today.getFullYear(), today.getMonth(), 1))}
          onPrevious={() => setCursor(new Date(year, month - 1, 1))}
          onNext={() => setCursor(new Date(year, month + 1, 1))}
        />

        <div className="flex-1 min-h-0 overflow-y-auto sm:hidden">
          <MobileMonthAgenda
            monthEvents={monthEvents}
            onSelectEvent={setSelectedEvent}
            isAdminView={isAdminView}
          />
        </div>

        <CalendarGrid
          cells={cells}
          onSelectEvent={setSelectedEvent}
          isAdminView={isAdminView}
        />

        <CalendarLegend isAdminView={isAdminView} />
      </div>
    </>
  );
}
