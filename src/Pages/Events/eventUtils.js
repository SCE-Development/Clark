export function calculateEventCapacity(event, attendeeCount) {
  const maxAttendees = Number(event?.max_attendees);
  const hasCapacityLimit = Number.isFinite(maxAttendees) && maxAttendees > 0;

  const remainingSpots =
    hasCapacityLimit && typeof attendeeCount === 'number'
      ? Math.max(maxAttendees - attendeeCount, 0)
      : null;

  const isFull = hasCapacityLimit && typeof remainingSpots === 'number' && remainingSpots <= 0;

  return {
    maxAttendees,
    hasCapacityLimit,
    remainingSpots,
    isFull
  };
}

export function toDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getApiErrorMessage(result, options = {}) {
  const {
    fallback = 'Request failed.',
    networkHint = '',
  } = options;

  let msg = '';
  const data = result?.responseData;

  if (data && typeof data === 'object') {
    if (data.error) {
      msg = String(data.error);
    } else if (data.message) {
      msg = String(data.message);
    }
  } else if (typeof data === 'string' && data.trim()) {
    msg = data.trim();
  }

  if (!msg && result?.statusCode) {
    msg = `HTTP ${result.statusCode}`;
  }

  if (result?.networkError) {
    msg = msg || 'Network error';
    if (networkHint) {
      msg = `${msg}. ${networkHint}`;
    }
  }

  return msg || fallback;
}

