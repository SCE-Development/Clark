import React, { useEffect, useState } from 'react';
import config from '../../config/config.json';
import { Redirect } from 'react-router-dom';
import { getAllSCEvents } from '../../APIFunctions/SCEvents';

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

function EventCard({ event }) {
  return (
    <div className="group rounded-2xl border border-white/10 bg-white/5 p-6 shadow-md backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.07]">
      <h2 className="mb-4 text-2xl font-bold text-white">
        {event.name || 'Untitled Event'}
      </h2>

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
    </div>
  );
}

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const isSCEventsEnabled = config.SCEvents?.ENABLED;

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
        <h1 className="mb-3 text-4xl font-bold text-white md:text-5xl">
          SCEvents
        </h1>

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
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
