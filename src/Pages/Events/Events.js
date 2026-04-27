import React, { useEffect, useState } from 'react';
import config from '../../config/config.json';
import { Link, Redirect } from 'react-router-dom';
import { getAllSCEvents, getEventAttendanceSummary } from '../../APIFunctions/SCEvents';
import { useSCE } from '../../Components/context/SceContext';
import { membershipState } from '../../Enums';
import CalendarView from './CalendarView';

function CalendarIcon() {
  return (
    <svg
      className="h-4 w-4 flex-shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 2v4M16 2v4M3 10h18" />
      <rect x="3" y="4" width="18" height="17" rx="2" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg
      className="h-4 w-4 flex-shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 21s6-5.686 6-11a6 6 0 1 0-12 0c0 5.314 6 11 6 11Z"
      />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function PeopleIcon() {
  return (
    <svg
      className="h-4 w-4 flex-shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      className="h-5 w-5 flex-shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg
      className="h-5 w-5 flex-shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function getUserAccessLevel(user) {
  return user?.accessLevel ?? membershipState.NON_MEMBER;
}

function formatEventDate(date) {
  if (!date) {
    return '';
  }

  const [year, month, day] = date.split('-').map(Number);
  if (!year || !month || !day) {
    return date;
  }

  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatEventTime(time) {
  if (!time) {
    return '';
  }

  const [hour, minute] = time.split(':').map(Number);
  if (Number.isNaN(hour) || Number.isNaN(minute)) {
    return time;
  }

  return new Date(2000, 0, 1, hour, minute).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

function canUserSeeEvent(event, user) {
  const userId = user?._id != null ? String(user._id) : '';
  const userAccess = getUserAccessLevel(user);

  const isGlobalAdmin = userAccess >= membershipState.ADMIN;
  const isEventAdmin = Array.isArray(event.admins) && userId
    ? event.admins.includes(userId)
    : false;

  const status = event.status || 'draft';
  const visibility = event.visibility || 'public';
  const minimumVisibleRole = event.minimum_visible_role || '';

  if (status === 'draft') {
    return isGlobalAdmin || isEventAdmin;
  }

  if (visibility === 'public') {
    return true;
  }

  if (visibility === 'private') {
    const requiredLevel = membershipState[minimumVisibleRole?.toUpperCase()];
    if (requiredLevel === undefined) return false;
    return userAccess >= requiredLevel;
  }

  return false;
}

function EventCard({ event, user }) {
  const [attendeeCount, setAttendeeCount] = useState(0);
  const userAccess = getUserAccessLevel(user);
  const isEventAdmin =
    Array.isArray(event.admins) && user?._id
      ? event.admins.includes(String(user._id))
      : false;
  const canViewAttendance =
    isEventAdmin ||
    ((!Array.isArray(event.admins) || event.admins.length === 0) &&
      userAccess >= membershipState.ADMIN);

  useEffect(() => {
    let isCurrent = true;
    setAttendeeCount(0);

    async function fetchAttendanceSummary() {
      const response = await getEventAttendanceSummary(event.id, user?.token);
      if (isCurrent && !response.error && typeof response.responseData?.attendee_count === 'number') {
        setAttendeeCount(response.responseData.attendee_count);
      }
    }

    if (canViewAttendance && event.id && user?.token) {
      fetchAttendanceSummary();
    }

    return () => {
      isCurrent = false;
    };
  }, [canViewAttendance, event.id, user?.token]);

  return (
    <div className="group relative flex flex-col rounded-2xl border border-white/10 bg-white/5 p-6 shadow-md backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.07]">
      <div className="flex items-start justify-between">
        <h2 className="mb-4 pr-4 text-2xl font-bold text-white">
          {event.name || 'Untitled Event'}
        </h2>
        {isEventAdmin && (
          <Link
            to={`/events/${event.id}/edit`}
            className="rounded-lg p-2 text-gray-400 hover:bg-white/10 hover:text-emerald-400 transition-colors duration-200"
            title="Edit Event"
          >
            <EditIcon />
          </Link>
        )}
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {event.status === 'draft' && (
          <span className="rounded-full bg-yellow-500/15 px-3 py-1 text-xs font-medium text-yellow-200 border border-yellow-400/20">
            Draft
          </span>
        )}
        {event.visibility === 'private' && (
          <span className="rounded-full bg-purple-500/15 px-3 py-1 text-xs font-medium text-purple-200 border border-purple-400/20">
            Private
          </span>
        )}
      </div>

      <div className="mb-5 space-y-2 text-sm text-gray-300">
        {(event.date || event.time) && (
          <div className="flex items-center gap-2">
            <span className="text-blue-300">
              <CalendarIcon />
            </span>
            <span>{[formatEventDate(event.date), formatEventTime(event.time)].filter(Boolean).join(' · ')}</span>
          </div>
        )}

        {event.location && (
          <div className="flex items-center gap-2">
            <span className="text-blue-300">
              <PinIcon />
            </span>
            <span>{event.location}</span>
          </div>
        )}

        {canViewAttendance && (
          <div className="flex items-center gap-2">
            <span className="text-emerald-300">
              <PeopleIcon />
            </span>
            <span>
              <span className="font-semibold text-emerald-300">{attendeeCount}</span>
              {' people going'}
            </span>
          </div>
        )}
      </div>

      {event.description && (
        <p className="text-base leading-7 text-gray-300">
          {event.description}
        </p>
      )}

      <div className="mt-auto pt-6">
        <Link
          to={`/events/${event.id}/register`}
          className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:from-sky-400 hover:to-indigo-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-gray-900"
        >
          Register
        </Link>
      </div>
    </div>
  );
}

export default function EventsPage() {
  const { user } = useSCE();
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const isSCEventsEnabled = config.SCEvents?.ENABLED;
  const canCreateEvent = user?.accessLevel >= membershipState.OFFICER;
  const visibleEvents = events.filter((event) => canUserSeeEvent(event, user));
  const isAdminView = canCreateEvent;

  useEffect(() => {
    if (!isSCEventsEnabled) return;

    async function fetchEvents() {
      setIsLoading(true);
      setHasError(false);

      const response = await getAllSCEvents();

      if (!response.error) {
        setEvents(Array.isArray(response.responseData) ? response.responseData : []);
      } else {
        setHasError(true);
      }

      setIsLoading(false);
    }

    fetchEvents();
  }, [isSCEventsEnabled]);

  if (!isSCEventsEnabled) {
    return <Redirect to="/notfound" />;
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-r from-gray-800 to-gray-600 text-white">
      {/* Ambient blobs — unchanged from original */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-[-8rem] h-[22rem] w-[22rem] rounded-full bg-sky-400/10 blur-3xl" />
        <div className="absolute right-[-8rem] top-[10rem] h-[24rem] w-[24rem] rounded-full bg-indigo-500/10 blur-3xl" />
      </div>

      {/* ── Calendar area ── */}
      <div className="relative mx-auto max-w-[120rem] px-4 py-8 sm:px-6 lg:px-10">
        {isLoading && (
          <div className="py-16 text-center text-lg text-gray-300">
            Loading events...
          </div>
        )}

        {!isLoading && hasError && (
          <div className="rounded-2xl border border-red-400/30 bg-red-500/10 p-6 text-center text-lg text-red-100">
            Failed to load events. Please make sure SCEvents is running locally.
          </div>
        )}

        {!isLoading && !hasError && (
          <CalendarView
            events={visibleEvents}
            isAdminView={isAdminView}
            user={user}
            canCreateEvent={canCreateEvent}
          />
        )}
      </div>
    </div>
  );
}
