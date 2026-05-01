import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getEventAttendanceSummary, getMyEventRegistrationState, joinWaitlistForSCEvent } from '../../APIFunctions/SCEvents';
import { membershipState } from '../../Enums';

// ─── tiny helpers ────────────────────────────────────────────────────────────

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const currentYear = new Date().getFullYear();
const YEAR_RANGE = Array.from({ length: 10 }, (_, i) => currentYear + i);

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

function toTimeSortValue(event) {
  if (!event?.time) return Number.POSITIVE_INFINITY;
  const [hour, minute] = String(event.time).split(':').map(Number);
  if (Number.isNaN(hour) || Number.isNaN(minute)) return Number.POSITIVE_INFINITY;
  return hour * 60 + minute;
}

function sortEventsForDay(events) {
  return [...events].sort((a, b) => {
    const timeDelta = toTimeSortValue(a) - toTimeSortValue(b);
    if (timeDelta !== 0) return timeDelta;
    return String(a.name || '').localeCompare(String(b.name || ''));
  });
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

function getRegistrationStatus(event) {
  return event?.registration_status || 'none';
}

function getRegistrationCta(event) {
  const registrationStatus = getRegistrationStatus(event);

  switch (registrationStatus) {
  case 'registered':
    return {
      label: 'Registered',
      disabled: true,
      className: 'border border-emerald-400/30 bg-emerald-500/10 text-emerald-200',
    };
  case 'pending':
    return {
      label: 'Pending',
      disabled: true,
      className: 'border border-amber-400/30 bg-amber-500/10 text-amber-200',
    };
  case 'waitlisted':
    return {
      label: 'On waitlist',
      disabled: true,
      className: 'border border-violet-400/30 bg-violet-500/10 text-violet-200',
    };
  case 'rejected':
    return {
      label: 'Unavailable',
      disabled: true,
      className: 'border border-slate-500/40 bg-slate-700/40 text-slate-300',
    };
  default:
    return {
      label: 'Register',
      disabled: false,
      className: '',
    };
  }
}

/**
 * Checks if a user has permission to manage an event.
 * @param {Object} event The event object.
 * @param {Object} user The user object.
 * @returns {boolean} True if the user can manage the event.
 */
function canUserManageEvent(event, user) {
  const userId = user?._id != null ? String(user._id) : '';
  const eventAdmins = Array.isArray(event.admins) ? event.admins.map((id) => String(id)) : [];

  // 1. If user is explicitly listed as an admin for this event
  if (eventAdmins.length > 0 && userId && eventAdmins.includes(userId)) {
    return true;
  }

  // 2. If the event has no admins, allow users with level 3 (ADMIN) or higher to manage it
  if (eventAdmins.length === 0 && (user?.accessLevel ?? 0) >= membershipState.ADMIN) {
    return true;
  }

  return false;
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

function PlusIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

// ─── Event popup ──────────────────────────────────────────────────────────────

function EventPopup({ event, onClose, isAdminView, user }) {
  const popupRef = useRef(null);
  const colors = pillColors(event, isAdminView);
  const badgeText = getBadgeText(event, isAdminView);
  const userId = user?._id != null ? String(user._id) : '';
  const [attendeeCount, setAttendeeCount] = useState(null);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [attendanceLoaded, setAttendanceLoaded] = useState(false);
  const [waitlistSubmitting, setWaitlistSubmitting] = useState(false);
  const [waitlistMessage, setWaitlistMessage] = useState('');
  const [waitlistError, setWaitlistError] = useState('');
  const canManageEvent = canUserManageEvent(event, user);
  const [hasRegistered, setHasRegistered] = useState(false);
  const [isCheckingRegistration, setIsCheckingRegistration] = useState(false);
  const eventId = event?.id || event?._id;
  const authToken = user?.token;
  const maxAttendees = Number(event.max_attendees);
  const hasCapacityLimit = Number.isFinite(maxAttendees) && maxAttendees > 0;
  const remainingSpots =
    hasCapacityLimit && typeof attendeeCount === 'number'
      ? Math.max(maxAttendees - attendeeCount, 0)
      : null;
  const registrationCta = getRegistrationCta(event);
  const isFull = hasCapacityLimit && typeof remainingSpots === 'number' && remainingSpots <= 0;
  const shouldShowWaitlistJoin =
    !canManageEvent &&
    event.status === 'published' &&
    !registrationCta.disabled &&
    isFull &&
    !!event.waitlist_enabled;

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  useEffect(() => {
    async function fetchMyRegistrationState() {
      if (!userId || canManageEvent || !user?.token || event.status !== 'published') {
        setHasRegistered(false);
        setIsCheckingRegistration(false);
        return;
      }

      setIsCheckingRegistration(true);
      const eventID = event?.id || event?._id;
      const response = await getMyEventRegistrationState(eventID, user.token);
      if (!response.error) {
        setHasRegistered(Boolean(response.responseData?.registered));
      } else {
        setHasRegistered(false);
      }
      setIsCheckingRegistration(false);
    }

    fetchMyRegistrationState();
  }, [canManageEvent, event, user?.token, userId]);

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

  useEffect(() => {
    let isCurrent = true;
    setAttendeeCount(null);
    setAttendanceLoaded(false);
    setAttendanceLoading(false);

    async function fetchAttendanceSummary() {
      if (!eventId || !authToken) {
        return;
      }
      setAttendanceLoading(true);
      const response = await getEventAttendanceSummary(eventId, authToken);
      if (isCurrent && !response.error && typeof response.responseData?.attendee_count === 'number') {
        setAttendeeCount(response.responseData.attendee_count);
      }
      if (isCurrent) {
        setAttendanceLoaded(true);
        setAttendanceLoading(false);
      }
    }

    fetchAttendanceSummary();

    return () => {
      isCurrent = false;
    };
  }, [eventId, authToken]);

  async function handleJoinWaitlist() {
    setWaitlistError('');
    setWaitlistMessage('');

    if (!authToken) {
      setWaitlistError('You must be logged in to join the waitlist.');
      return;
    }

    if (!eventId) {
      setWaitlistError('Missing event id.');
      return;
    }

    setWaitlistSubmitting(true);
    const response = await joinWaitlistForSCEvent(eventId, authToken);
    setWaitlistSubmitting(false);

    if (response.error) {
      let msg = '';
      const data = response.responseData;

      if (data && typeof data === 'object' && data.error) {
        msg = String(data.error);
      } else if (typeof data === 'string' && data.trim()) {
        msg = data.trim();
      }

      setWaitlistError(msg || 'Failed to join waitlist.');
      return;
    }

    setWaitlistMessage('Joined waitlist successfully.');
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4">
      <div
        ref={popupRef}
        className="relative w-full max-w-sm rounded-xl border border-slate-400/35 bg-slate-900 shadow-lg"
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

          <div className="mt-2 flex flex-wrap gap-1.5">
            {badgeText && (
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
            )}
          </div>
        </div>

        <div className="space-y-3 border-t border-slate-700/70 px-5 py-4">
          {event.date && (
            <div className="flex items-start gap-2.5 text-[15px] text-slate-200">
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
                <span className="ml-1 text-amber-300">· waitlist available</span>
              )}
            </p>
          )}

          {hasCapacityLimit && !canManageEvent && typeof remainingSpots === 'number' && (
            <p className="text-center text-xs text-slate-400">
              {remainingSpots} spot{remainingSpots !== 1 ? 's' : ''} left
              {event.waitlist_enabled && (
                <span className="ml-1 text-amber-300">· waitlist available</span>
              )}
            </p>
          )}

          {hasCapacityLimit && !canManageEvent && attendanceLoading && (
            <p className="text-center text-xs text-slate-400">
              Loading live spots...
            </p>
          )}

          {hasCapacityLimit && !canManageEvent && attendanceLoaded && typeof remainingSpots !== 'number' && (
            <p className="text-center text-xs text-slate-400">
              Unable to load live spots
            </p>
          )}
          {canManageEvent && (
            <div className="grid grid-cols-1 gap-2">
              <Link
                to={`/events/${event.id}/admin/attendees`}
                className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:from-emerald-400 hover:to-teal-400"
                onClick={onClose}
              >
                View attendees
              </Link>
              <Link
                to={`/events/${event.id}/edit`}
                className="inline-flex w-full items-center justify-center rounded-xl border border-slate-400/40 bg-slate-800 px-6 py-2.5 text-sm font-semibold text-white transition hover:border-slate-300 hover:bg-slate-700"
                onClick={onClose}
              >
                Edit event
              </Link>
            </div>
          )}

          {!canManageEvent && event.status === 'closed' && (
            <div className="inline-flex w-full cursor-not-allowed items-center justify-center rounded-xl border border-slate-600/60 bg-slate-800/70 px-6 py-2.5 text-sm font-semibold text-slate-400">
              Registration closed
            </div>
          )}

          {!canManageEvent && event.status === 'draft' && (
            <div className="inline-flex w-full cursor-not-allowed items-center justify-center rounded-xl border border-yellow-400/20 bg-yellow-500/10 px-6 py-2.5 text-sm font-semibold text-yellow-300">
              Not yet published
            </div>
          )}

          {!canManageEvent && event.status === 'published' && registrationCta.disabled && (
            <div
              className={[
                'inline-flex w-full cursor-not-allowed items-center justify-center rounded-xl px-6 py-2.5 text-sm font-semibold',
                registrationCta.className,
              ].join(' ')}
            >
              {registrationCta.label}
            </div>
          )}

          {shouldShowWaitlistJoin && (
            <button
              type="button"
              onClick={handleJoinWaitlist}
              disabled={waitlistSubmitting}
              className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:from-amber-400 hover:to-orange-400 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {waitlistSubmitting ? 'Joining waitlist...' : 'Join waitlist'}
            </button>
          )}

          {!shouldShowWaitlistJoin && !canManageEvent && event.status === 'published' && !registrationCta.disabled && (
            <Link
              to={`/events/${event.id}/register`}
              className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:from-sky-400 hover:to-indigo-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
              onClick={onClose}
            >
              {registrationCta.label}
            </Link>
          )}

          {waitlistError && (
            <p className="text-center text-xs text-red-300">{waitlistError}</p>
          )}

          {waitlistMessage && (
            <p className="text-center text-xs text-emerald-300">{waitlistMessage}</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Event pill ───────────────────────────────────────────────────────────────

function EventRow({ event, onSelect, isAdminView }) {
  const colors = pillColors(event, isAdminView);
  const badgeText = getBadgeText(event, isAdminView);
  const timeLabel = formatTime(event.time);

  return (
    <button
      type="button"
      onClick={() => onSelect(event)}
      className={[
        'flex w-full items-center gap-1.5 rounded border px-1.5 py-1',
        'text-left text-[11px] font-medium leading-tight',
        'transition-all duration-150 hover:border-white/30 hover:brightness-110',
        colors.bg,
        colors.text,
        colors.border,
      ].join(' ')}
      title={event.name}
    >
      <span className={['mt-1 h-1.5 w-1.5 shrink-0 rounded-full', colors.dot].join(' ')} />
      <div className="min-w-0 flex-1 truncate">
        {timeLabel && (
          <span className="mr-1.5 font-semibold text-white/90">
            {timeLabel}
          </span>
        )}
        <span className="truncate">
          {event.name || 'Untitled'}
        </span>
      </div>
      {badgeText && (
        <span className="hidden rounded border border-current/30 px-1 py-0.5 text-[9px] uppercase tracking-wide opacity-75 sm:inline">
          {badgeText}
        </span>
      )}
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

function MobileMonthAgenda({ monthEvents, onSelectEvent, isAdminView }) {
  if (monthEvents.length === 0) {
    return (
      <div className="px-4 py-8 text-center text-sm text-slate-400">
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
    <div className="space-y-3 px-3 pb-4 pt-2">
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
                    <div className="min-w-0 flex-1">
                      <div className="whitespace-normal break-words text-sm font-semibold leading-snug">
                        {event.name || 'Untitled Event'}
                      </div>
                      <div className="pt-1 text-xs font-semibold text-white/85">
                        {timeLabel}
                      </div>
                    </div>

                    <div className="min-w-[92px] text-right">
                      <div className="whitespace-normal break-words text-xs opacity-85">
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

// ─── Main export ──────────────────────────────────────────────────────────────

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
