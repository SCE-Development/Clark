import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

// ─── tiny helpers ────────────────────────────────────────────────────────────

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const YEAR_RANGE = Array.from({ length: 10 }, (_, i) => 2026 + i);

function toDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function eventDateKey(event) {
  if (!event.date) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(event.date)) return event.date;
  const d = new Date(event.date);
  if (isNaN(d)) return null;
  return toDateKey(d);
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(`${dateStr}T12:00:00`);
  if (isNaN(d)) return dateStr;
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatTime(timeStr) {
  if (!timeStr) return '';
  const [hours, minutes] = String(timeStr).split(':');
  if (hours == null || minutes == null) return timeStr;

  const h = Number(hours);
  const m = Number(minutes);
  if (Number.isNaN(h) || Number.isNaN(m)) return timeStr;

  return new Date(2000, 0, 1, h, m).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
}

function pillColors(event, isAdminView) {
  const status = event.status || 'draft';
  const visibility = event.visibility || 'public';

  if (isAdminView) {
    if (status === 'draft') {
      return {
        bg: 'bg-amber-500/12',
        text: 'text-amber-200',
        border: 'border-amber-400/40',
        dot: 'bg-amber-300',
        accent: 'text-amber-300',
      };
    }

    if (status === 'closed') {
      return {
        bg: 'bg-rose-500/12',
        text: 'text-rose-200',
        border: 'border-rose-400/40',
        dot: 'bg-rose-300',
        accent: 'text-rose-300',
      };
    }

    if (visibility === 'private') {
      return {
        bg: 'bg-violet-500/12',
        text: 'text-violet-200',
        border: 'border-violet-400/40',
        dot: 'bg-violet-300',
        accent: 'text-violet-300',
      };
    }

    return {
      bg: 'bg-cyan-500/12',
      text: 'text-cyan-100',
      border: 'border-cyan-400/40',
      dot: 'bg-cyan-300',
      accent: 'text-cyan-300',
    };
  }

  if (status === 'closed') {
    return {
      bg: 'bg-rose-500/16',
      text: 'text-rose-200',
      border: 'border-rose-400/30',
      dot: 'bg-rose-300',
      accent: 'text-rose-300',
    };
  }

  if (visibility === 'private') {
    return {
      bg: 'bg-violet-500/16',
      text: 'text-violet-200',
      border: 'border-violet-400/30',
      dot: 'bg-violet-300',
      accent: 'text-violet-300',
    };
  }

  return {
    bg: 'bg-cyan-500/16',
    text: 'text-cyan-100',
    border: 'border-cyan-400/30',
    dot: 'bg-cyan-300',
    accent: 'text-cyan-300',
  };
}

function getBadgeText(event, isAdminView) {
  const status = event.status || 'draft';
  const visibility = event.visibility || 'public';

  if (isAdminView) {
    if (status === 'draft') return 'Draft';
    if (status === 'closed') return 'Closed';
    if (visibility === 'private') return 'Private';
    return 'Published';
  }

  if (status === 'closed') return 'Closed';
  if (visibility === 'private') return 'Members only';
  return '';
}

// ─── icons ────────────────────────────────────────────────────────────────────

function ChevronLeft() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="17" rx="2" />
      <path d="M8 2v4M16 2v4M3 10h18" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 21s6-5.686 6-11a6 6 0 1 0-12 0c0 5.314 6 11 6 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

// ─── Event popup ──────────────────────────────────────────────────────────────

function EventPopup({ event, onClose, isAdminView, user }) {
  const popupRef = useRef(null);
  const colors = pillColors(event, isAdminView);
  const badgeText = getBadgeText(event, isAdminView);
  const userId = user?._id != null ? String(user._id) : '';
  const canEditEvent =
    Array.isArray(event.admins) &&
    userId &&
    event.admins.includes(userId);

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  useEffect(() => {
    function onClickOutside(e) {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        onClose();
      }
    }
    const timer = setTimeout(() => document.addEventListener('mousedown', onClickOutside), 0);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', onClickOutside);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 p-4">
      <div
        ref={popupRef}
        className="relative w-full max-w-sm rounded-xl border border-slate-400/35 bg-slate-900/95 shadow-lg"
        role="dialog"
        aria-modal="true"
        aria-label={event.name}
      >
        <div className={['h-1 w-full rounded-t-xl', colors.dot].join(' ')} />

        <div className="flex items-start justify-between px-5 pb-3 pt-4">
          <div className="flex items-center gap-2">
            <span className={['h-2.5 w-2.5 shrink-0 rounded-full', colors.dot].join(' ')} />
            <span className={['text-xs font-semibold uppercase tracking-wider', colors.accent].join(' ')}>
              {event.category || event.type || 'Event'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-slate-400 transition hover:bg-slate-700/70 hover:text-white"
            aria-label="Close"
          >
            <XIcon />
          </button>
        </div>

        <div className="px-5 pb-4">
          <h3 className="text-lg font-bold leading-snug text-white">
            {event.name || 'Untitled Event'}
          </h3>

          {badgeText && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              <span
                className={[
                  'rounded-full border px-2 py-0.5 text-[10px] font-medium',
                  colors.border,
                  colors.bg,
                  colors.text,
                ].join(' ')}
              >
                {badgeText}
              </span>
            </div>
          )}
        </div>

        <div className="space-y-3 border-t border-slate-700/70 px-5 py-4">
          {event.date && (
            <div className="flex items-start gap-2.5 text-sm text-slate-200">
              <span className="mt-0.5 text-slate-400"><CalendarIcon /></span>
              <span>{formatDate(event.date)}</span>
            </div>
          )}

          {event.time && (
            <div className="flex items-start gap-2.5 text-sm text-slate-200">
              <span className="mt-0.5 text-slate-400"><ClockIcon /></span>
              <span>{formatTime(event.time)}</span>
            </div>
          )}

          {event.location && (
            <div className="flex items-start gap-2.5 text-sm text-slate-200">
              <span className="mt-0.5 text-slate-400"><PinIcon /></span>
              <span>{event.location}</span>
            </div>
          )}

          {event.description && (
            <p className="pt-1 text-sm leading-relaxed text-slate-300">
              {event.description}
            </p>
          )}
        </div>

        <div className="space-y-2 border-t border-slate-700/70 px-5 py-4">
          {event.max_attendees > 0 && (
            <p className="text-center text-xs text-slate-400">
              {event.max_attendees} spot{event.max_attendees !== 1 ? 's' : ''} available
              {event.waitlist_enabled && (
                <span className="ml-1 text-amber-300">· waitlist enabled</span>
              )}
            </p>
          )}

          {canEditEvent && (
            <Link
              to={`/events/${event.id}/edit`}
              className="inline-flex w-full items-center justify-center rounded-xl border border-slate-400/40 bg-slate-800 px-6 py-2.5 text-sm font-semibold text-white transition hover:border-slate-300 hover:bg-slate-700"
              onClick={onClose}
            >
              Edit event
            </Link>
          )}

          {!canEditEvent && event.status === 'closed' && (
            <div className="inline-flex w-full cursor-not-allowed items-center justify-center rounded-xl border border-slate-600/60 bg-slate-800/70 px-6 py-2.5 text-sm font-semibold text-slate-400">
              Registration closed
            </div>
          )}

          {!canEditEvent && event.status === 'draft' && (
            <div className="inline-flex w-full cursor-not-allowed items-center justify-center rounded-xl border border-yellow-400/20 bg-yellow-500/10 px-6 py-2.5 text-sm font-semibold text-yellow-300">
              Not yet published
            </div>
          )}

          {!canEditEvent && event.status === 'published' && (
            <Link
              to={`/events/${event.id}/register`}
              className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:from-sky-400 hover:to-indigo-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
              onClick={onClose}
            >
              Register
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Event pill ───────────────────────────────────────────────────────────────

function EventPill({ event, onSelect, isAdminView }) {
  const colors = pillColors(event, isAdminView);
  const badgeText = getBadgeText(event, isAdminView);

  return (
    <button
      type="button"
      onClick={() => onSelect(event)}
      className={[
        'flex w-full items-start gap-1.5 rounded-md border px-1.5 py-1',
        'text-left text-[11px] font-semibold leading-tight',
        'transition-all duration-150 hover:border-white/30 hover:brightness-110',
        colors.bg,
        colors.text,
        colors.border,
      ].join(' ')}
      title={event.name}
    >
      <span className={['mt-1 h-1.5 w-1.5 shrink-0 rounded-full', colors.dot].join(' ')} />
      <div className="min-w-0 flex-1">
        <div className="truncate">
          {event.name || 'Untitled'}
        </div>
        {badgeText && (
          <div className="truncate pt-0.5 text-[10px] opacity-80">
            {badgeText}
          </div>
        )}
      </div>
    </button>
  );
}

// ─── Day labels ───────────────────────────────────────────────────────────────

function DayLabels() {
  return (
    <div className="grid grid-cols-7 border-b border-slate-700/70 bg-slate-900/35">
      {DAYS.map((d) => (
        <div
          key={d}
          className="py-2 text-center text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400"
        >
          {d}
        </div>
      ))}
    </div>
  );
}

// ─── Calendar cell ────────────────────────────────────────────────────────────

function CalCell({ date, isCurrentMonth, isToday, events, onSelectEvent, isAdminView }) {
  return (
    <div
      className={[
        'min-h-[100px] border-b border-r border-slate-700/60 p-1.5 transition-colors duration-150',
        isCurrentMonth ? '' : 'opacity-30',
        isToday ? 'bg-cyan-500/[0.12]' : 'hover:bg-slate-700/35',
      ].join(' ')}
    >
      <div className="mb-1 flex justify-end">
        <span
          className={[
            'flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold',
            isToday ? 'bg-cyan-400 text-slate-950' : isCurrentMonth ? 'text-slate-200' : 'text-slate-600',
          ].join(' ')}
        >
          {date.getDate()}
        </span>
      </div>

      <div className="flex flex-col gap-0.5">
        {events.slice(0, 3).map((ev) => (
          <EventPill
            key={ev.id}
            event={ev}
            onSelect={onSelectEvent}
            isAdminView={isAdminView}
          />
        ))}

        {events.length > 3 && (
          <span className="pl-1 text-[10px] text-slate-400">
            +{events.length - 3} more
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function CalendarView({ events, isAdminView = false, user }) {
  const today = new Date();
  const [cursor, setCursor] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedEvent, setSelectedEvent] = useState(null);

  const eventsByDate = useMemo(() => {
    const map = {};
    events.forEach((ev) => {
      const key = eventDateKey(ev);
      if (!key) return;
      if (!map[key]) map[key] = [];
      map[key].push(ev);
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

      <div className="overflow-hidden rounded-xl border border-slate-500/50 bg-slate-800/85 shadow-[0_0_0_1px_rgba(148,163,184,0.05)]">
        <div className="flex items-start justify-between border-b border-slate-600/50 px-5 py-4">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative w-28 sm:w-36">
                <select
                  value={month}
                  onChange={handleMonthChange}
                  aria-label="Select month"
                  className="h-10 w-full appearance-none rounded-lg border border-slate-400/40 bg-slate-800 px-4 pr-10 text-sm font-semibold text-slate-100 transition hover:border-slate-300 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-400"
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
                  className="h-10 w-full appearance-none rounded-lg border border-slate-400/40 bg-slate-800 px-4 pr-10 text-sm font-semibold text-slate-100 transition hover:border-slate-300 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-400"
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
                className="h-10 rounded-lg border border-slate-400/40 bg-slate-800 px-4 text-sm font-semibold text-slate-100 transition hover:border-slate-300 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              >
                Today
              </button>
            </div>

            <p className="text-xs font-medium tracking-wide text-slate-300">
              {monthEventCount} event{monthEventCount !== 1 ? 's' : ''} this month
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCursor(new Date(year, month - 1, 1))}
              aria-label="Previous month"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-400/40 bg-slate-800 text-slate-100 transition hover:border-slate-300 hover:bg-slate-700 hover:text-white"
            >
              <ChevronLeft />
            </button>
            <button
              onClick={() => setCursor(new Date(year, month + 1, 1))}
              aria-label="Next month"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-400/40 bg-slate-800 text-slate-100 transition hover:border-slate-300 hover:bg-slate-700 hover:text-white"
            >
              <ChevronRight />
            </button>
          </div>
        </div>

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

        {isAdminView ? (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-slate-700/70 bg-slate-900/35 px-5 py-3">
            {[
              { label: 'Published', dot: 'bg-cyan-300' },
              { label: 'Private', dot: 'bg-violet-300' },
              { label: 'Draft', dot: 'bg-amber-300' },
              { label: 'Closed', dot: 'bg-rose-300' },
            ].map(({ label, dot }) => (
              <span key={label} className="flex items-center gap-1.5 text-[11px] font-medium text-slate-300">
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
                <span className={['h-2 w-2 rounded-full', dot].join(' ')} />
                {label}
              </span>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
