import React, { useEffect, useState } from 'react';
import config from '../../config/config.json';
import { Redirect } from 'react-router-dom';
import { getAllSCEvents } from '../../APIFunctions/SCEvents';


function EventCard({ event }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-md transition hover:scale-[1.02]">
      <h2 className="mb-4 text-2xl font-bold text-white">
        {event.name || 'Untitled Event'}
      </h2>

      <div className="mb-4 space-y-2 text-blue-300">
        {event.date && <p className="text-lg">{event.date}</p>}
        {event.time && <p className="text-lg">{event.time}</p>}
        {event.location && <p className="text-lg">{event.location}</p>}
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
    <div className="min-h-screen bg-gradient-to-r from-gray-800 to-gray-600 text-white">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="mb-3 text-4xl font-bold text-white md:text-5xl">
          SCEvents
        </h1>
        <div className="mb-6 h-1 w-24 bg-blue-400"></div>
        <p className="max-w-2xl text-lg text-gray-300 md:text-xl">
          Discover upcoming SCE events and activities.
        </p>
      </div>

      <div className="mx-auto max-w-6xl px-6 pb-14">
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
              <EventCard
                key={event.id}
                event={event}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
