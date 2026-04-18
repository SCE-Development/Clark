import React, { useEffect, useState } from 'react';
import config from '../../config/config.json';
import { Link, Redirect } from 'react-router-dom';
import { getAllSCEvents } from '../../APIFunctions/SCEvents';
import { useSCE } from '../../Components/context/SceContext';
import { membershipState } from '../../Enums';

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

function EventCard({ event, user }) {
  const isAdmin = event.admins && user?._id && event.admins.includes(String(user._id));

  return (
    <div className="group relative flex flex-col rounded-2xl border border-white/10 bg-white/5 p-6 shadow-md backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.07]">
      <div className="flex items-start justify-between">
        <h2 className="mb-4 pr-4 text-2xl font-bold text-white">
          {event.name || 'Untitled Event'}
        </h2>
        {isAdmin && (
          <Link
            to={`/events/${event.id}/edit`}
            className="rounded-lg p-2 text-gray-400 hover:bg-white/10 hover:text-emerald-400 transition-colors duration-200"
            title="Edit Event"
          >
            <EditIcon />
          </Link>
        )}
      </div>

      <div className="mb-5 space-y-2 text-sm text-gray-300">
        {(event.date || event.time) && (
          <div className="flex items-center gap-2">
            <span className="text-blue-300">
              <CalendarIcon />
            </span>
            <span>{[event.date, event.time].filter(Boolean).join(' · ')}</span>
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

  useEffect(() => {
    if (!isSCEventsEnabled) {
      return;
    }

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
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-[-8rem] h-[22rem] w-[22rem] rounded-full bg-sky-400/10 blur-3xl" />
        <div className="absolute right-[-8rem] top-[10rem] h-[24rem] w-[24rem] rounded-full bg-indigo-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 py-12">
        <div className="mb-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h1 className="text-4xl font-bold text-white md:text-5xl">
            SCEvents
          </h1>
          {canCreateEvent && (
            <Link
              to="/events/create"
              aria-label="Create event"
              className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white shadow-sm backdrop-blur transition hover:border-white/30 hover:bg-white/[0.15]"
            >
              <PlusIcon />
            </Link>
          )}
        </div>

        <div className="mb-6 h-[2px] w-28 rounded-full bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-400" />

        <p className="max-w-2xl text-lg text-gray-300 md:text-xl">
          Discover upcoming SCE events and activities.
        </p>
      </div>

      <div className="relative mx-auto max-w-6xl px-6 pb-14">
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

        {!isLoading && !hasError && events.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center text-lg text-gray-300">
            No events available right now.
          </div>
        )}

        {!isLoading && !hasError && events.length > 0 && (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {events.map((event) => (
              <EventCard key={event.id} event={event} user={user} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
