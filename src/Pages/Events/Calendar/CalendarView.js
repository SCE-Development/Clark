import { useState, useMemo, useRef, useLayoutEffect } from 'react';
import { toDateKey } from '../eventUtils';
import { eventDateKey, sortEventsForDay, getTodayWeekRowIndex } from './calendarUtils';
import { EventPopup } from './EventPopup';
import { CalendarHeader } from './CalendarHeader';
import { CalendarGrid } from './CalendarGrid';
import { MobileMonthAgenda } from './MobileMonthAgenda';
import { CalendarLegend } from './CalendarLegend';

export default function CalendarView({
  events,
  isAdminView = false,
  user,
  canCreateEvent = false,
  cursor,
  setCursor,
  scrollToTodayWeekOnMount = false,
}) {
  const today = useMemo(() => new Date(), []);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const shouldScrollToTodayWeekRef = useRef(scrollToTodayWeekOnMount);
  const [scrollToTodayWeekRequest, setScrollToTodayWeekRequest] = useState(0);
  const [firstVisibleWeekIndex, setFirstVisibleWeekIndex] = useState(0);

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

  function showFullMonth() {
    setFirstVisibleWeekIndex(0);
  }

  function handleMonthChange(e) {
    showFullMonth();
    const nextMonth = Number(e.target.value);
    setCursor(new Date(year, nextMonth, 1));
  }

  function handleYearChange(e) {
    showFullMonth();
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

  const isViewingCurrentMonth =
    year === today.getFullYear() && month === today.getMonth();

  useLayoutEffect(() => {
    if (!shouldScrollToTodayWeekRef.current || !isViewingCurrentMonth) {
      return;
    }

    setFirstVisibleWeekIndex(getTodayWeekRowIndex(cells));
    shouldScrollToTodayWeekRef.current = false;
  }, [
    isViewingCurrentMonth,
    year,
    month,
    todayKey,
    cells.length,
    scrollToTodayWeekRequest,
  ]);

  function handleTodayClick() {
    shouldScrollToTodayWeekRef.current = true;
    setScrollToTodayWeekRequest((n) => n + 1);
    setCursor(new Date(today.getFullYear(), today.getMonth(), 1));
  }

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

      <div className="flex h-full min-h-0 max-h-full flex-col overflow-hidden rounded-xl border border-slate-500/50 bg-slate-800/85 shadow-[0_0_0_1px_rgba(148,163,184,0.05)]">
        <CalendarHeader
          month={month}
          year={year}
          monthEventCount={monthEventCount}
          canCreateEvent={canCreateEvent}
          onMonthChange={handleMonthChange}
          onYearChange={handleYearChange}
          onTodayClick={handleTodayClick}
          onPreviousMonth={() => {
            showFullMonth();
            setCursor(new Date(year, month - 1, 1));
          }}
          onNextMonth={() => {
            showFullMonth();
            setCursor(new Date(year, month + 1, 1));
          }}
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
          firstVisibleWeekIndex={firstVisibleWeekIndex}
        />

        <CalendarLegend isAdminView={isAdminView} />
      </div>
    </>
  );
}
