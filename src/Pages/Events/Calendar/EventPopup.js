import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getEventAttendanceSummary, joinWaitlistForSCEvent } from '../../../APIFunctions/SCEvents';
import { calculateEventCapacity, getApiErrorMessage } from '../eventUtils';
import { CalendarIcon, PinIcon, ClockIcon, XIcon } from '../EventIcons';
import {
  canUserManageEvent,
  formatDate,
  formatTime,
  getBadgeText,
  getRegistrationCta,
  pillColors,
} from './calendarViewUtils';

export default function EventPopup({ event, onClose, isAdminView, user }) {
  const popupRef = useRef(null);
  const colors = pillColors(event, isAdminView);
  const badgeText = getBadgeText(event, isAdminView);
  const [attendeeCount, setAttendeeCount] = useState(null);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [attendanceLoaded, setAttendanceLoaded] = useState(false);
  const [waitlistSubmitting, setWaitlistSubmitting] = useState(false);
  const [waitlistMessage, setWaitlistMessage] = useState('');
  const [waitlistError, setWaitlistError] = useState('');
  const canManageEvent = canUserManageEvent(event, user);
  const eventId = event?.id || event?._id;
  const authToken = user?.token;

  const { hasCapacityLimit, remainingSpots, isFull } = calculateEventCapacity(event, attendeeCount);

  const registrationCta = getRegistrationCta(event);
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
      setWaitlistError(getApiErrorMessage(response, { fallback: 'Failed to join waitlist.' }));
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
              {event.max_attendees} total spot{event.max_attendees !== 1 ? 's' : ''}
              {canManageEvent && event.waitlist_enabled && (
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
