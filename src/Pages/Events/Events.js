import { useEffect, useState } from 'react';
import { getAllSCEvents } from '../../APIFunctions/SCEvents';
import { useSCE } from '../../Components/context/SceContext';
import { membershipState } from '../../Enums';
import CalendarView from './CalendarView';
import { toDateKey } from './eventUtils';

function canUserSeeEvent(event, user) {
  const userId = user?._id != null ? String(user._id) : '';
  const userAccess = user?.accessLevel ?? membershipState.NON_MEMBER;

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

export default function EventsPage() {
  const { user } = useSCE();
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [cursor, setCursor] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  const isAdminView = user?.accessLevel >= membershipState.OFFICER;
  const visibleEvents = events.filter((event) => canUserSeeEvent(event, user));
  const pageContainerClass = isAdminView
    ? 'relative h-dvh overflow-hidden bg-gradient-to-r from-gray-800 to-gray-600 text-white'
    : 'relative h-[calc(100dvh-4rem)] overflow-hidden bg-gradient-to-r from-gray-800 to-gray-600 text-white';
  const calendarContainerClass = isAdminView
    ? 'relative h-full w-full overflow-hidden px-3 py-4 sm:px-4 sm:py-5 lg:px-5'
    : 'relative mx-auto h-full max-w-[120rem] overflow-y-auto px-4 py-6 sm:px-6 sm:py-8 lg:px-10';

  useEffect(() => {
    async function fetchEvents() {
      setIsLoading(true);
      setHasError(false);

      const token = window.localStorage.getItem('jwtToken');
      const startDate = toDateKey(new Date(cursor.getFullYear(), cursor.getMonth(), 1));
      const endDate = toDateKey(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0));
      const response = await getAllSCEvents(token, { startDate, endDate });

      if (!response.error) {
        setEvents(Array.isArray(response.responseData) ? response.responseData : []);
      } else {
        setHasError(true);
      }

      setIsLoading(false);
    }

    fetchEvents();
  }, [cursor]);

  return (
    <div className={pageContainerClass}>
      {/* Ambient blobs — unchanged from original */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 left-[-8rem] h-[22rem] w-[22rem] rounded-full bg-sky-400/10 blur-3xl" />
        <div className="absolute right-[-8rem] top-[10rem] h-[24rem] w-[24rem] rounded-full bg-indigo-500/10 blur-3xl" />
      </div>

      {/* ── Calendar area ── */}
      <div className={calendarContainerClass}>
        {isLoading && (
          <div className="py-16 text-lg text-center text-gray-300">
            Loading events...
          </div>
        )}

        {!isLoading && hasError && (
          <div className="p-6 text-lg text-center text-red-100 border rounded-2xl border-red-400/30 bg-red-500/10">
            Failed to load events. Please make sure SCEvents is running locally.
          </div>
        )}

        {!isLoading && !hasError && (
          <CalendarView
            events={visibleEvents}
            isAdminView={isAdminView}
            user={user}
            canCreateEvent={isAdminView}
            cursor={cursor}
            setCursor={setCursor}
          />
        )}
      </div>
    </div>
  );
}
