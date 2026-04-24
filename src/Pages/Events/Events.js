import React, { useEffect, useState } from 'react';
import config from '../../config/config.json';
import { Link, Redirect } from 'react-router-dom';
import { getAllSCEvents } from '../../APIFunctions/SCEvents';
import { useSCE } from '../../Components/context/SceContext';
import { membershipState } from '../../Enums';
import CalendarView from './CalendarView';

// ─── access helpers ───────────────────────────────────────────────────────────

function getUserAccessLevel(user) {
  return user?.accessLevel ?? membershipState.NON_MEMBER;
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

// ─── page ─────────────────────────────────────────────────────────────────────

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
