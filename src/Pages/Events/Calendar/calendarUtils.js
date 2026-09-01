import { membershipState } from '../../../Enums';
import { toDateKey } from '../eventUtils';
import { MONTHS } from './calendarConstants';

export function eventDateKey(event) {
  if (!event.date) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(event.date)) return event.date;
  const d = new Date(event.date);
  if (isNaN(d)) return null;
  return toDateKey(d);
}

export function toTimeSortValue(event) {
  if (!event?.time) return Number.POSITIVE_INFINITY;
  const [hour, minute] = String(event.time).split(':').map(Number);
  if (Number.isNaN(hour) || Number.isNaN(minute)) return Number.POSITIVE_INFINITY;
  return hour * 60 + minute;
}

export function sortEventsForDay(events) {
  return [...events].sort((a, b) => {
    const timeDelta = toTimeSortValue(a) - toTimeSortValue(b);
    if (timeDelta !== 0) return timeDelta;
    return String(a.name || '').localeCompare(String(b.name || ''));
  });
}

export function formatDate(dateStr) {
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

export function formatTime(timeStr) {
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

export function isScheduledEvent(event) {
  if (event.status !== 'draft' || !event.publish_date) return false;
  const publishDate = new Date(event.publish_date);
  return !isNaN(publishDate) && publishDate > new Date();
}

export function pillColors(event, isAdminView) {
  const status = event.status || 'draft';
  const visibility = event.visibility || 'public';

  if (isAdminView) {
    if (isScheduledEvent(event)) {
      return {
        bg: 'bg-blue-500/12',
        text: 'text-blue-200',
        border: 'border-blue-400/40',
        dot: 'bg-blue-300',
        accent: 'text-blue-300',
      };
    }

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

export function getBadgeText(event, isAdminView) {
  const status = event.status || 'draft';
  const visibility = event.visibility || 'public';

  if (isAdminView) {
    if (isScheduledEvent(event)) return 'Scheduled';
    if (status === 'draft') return 'Draft';
    if (status === 'closed') return 'Closed';
    if (visibility === 'private') return 'Private';
    return 'Published';
  }

  if (status === 'closed') return 'Closed';
  if (visibility === 'private') return 'Members only';
  return '';
}

export function getRegistrationCta(event, isAdminView) {
  const registrationStatus = event?.registration_status || 'none';

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
    if (isAdminView) {
      return {
        label: 'Register',
        disabled: false,
        className: '',
      };
    }
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
export function canUserManageEvent(event, user) {
  const userId = user?._id != null ? String(user._id) : '';
  const access = user?.accessLevel ?? 0;
  const eventAdmins = Array.isArray(event.admins) ? event.admins.map((id) => String(id)) : [];

  // 1. If user is explicitly listed as an admin for this event
  if (eventAdmins.length > 0 && userId && eventAdmins.includes(userId)) {
    return true;
  }

  if (event.all_org_admins_can_edit && access >= membershipState.OFFICER) {
    return true;
  }

  // 2. If the event has no admins, allow users with level 3 (ADMIN) or higher to manage it
  if (eventAdmins.length === 0 && access >= membershipState.ADMIN) {
    return true;
  }

  return false;
}

export function visibleRange(view, cursor) {
  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const day = cursor.getDate();
  let start;
  let end;

  switch (view) {
  case 'day':
    start = new Date(year, month, day);
    end = new Date(year, month, day);
    break;
  case 'week':
    start = new Date(year, month, day - cursor.getDay());
    end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 6);
    break;
  case 'year':
    start = new Date(year, 0, 1);
    end = new Date(year, 11, 31);
    break;
  default:
    start = new Date(year, month, 1);
    end = new Date(year, month + 1, 0);
  }

  return {
    startDate: toDateKey(start),
    endDate: toDateKey(end),
  };
}

export function stepCursor(view, cursor, direction) {
  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const day = cursor.getDate();

  switch (view) {
  case 'day':
    return new Date(year, month, day + direction);
  case 'week':
    return new Date(year, month, day + (7 * direction));
  case 'year':
    return new Date(year + direction, month, 1);
  default:
    return new Date(year, month + direction, 1);
  }
}

export function viewTitle(view, cursor) {
  if (view === 'day') return formatDate(toDateKey(cursor));
  if (view === 'year') return String(cursor.getFullYear());
  return `${MONTHS[cursor.getMonth()]} ${cursor.getFullYear()}`;
}

export function countLabel(view) {
  switch (view) {
  case 'day':
    return 'today';
  case 'week':
    return 'this week';
  case 'year':
    return 'this year';
  default:
    return 'this month';
  }
}

export function bucketEventsByHour(events) {
  const allDayEvents = [];
  const eventsByHour = Array.from({ length: 24 }, () => []);

  events.forEach((event) => {
    const validTime = /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(String(event?.time || ''));
    const timeValue = toTimeSortValue(event);

    if (!validTime || !Number.isFinite(timeValue)) {
      allDayEvents.push(event);
      return;
    }

    eventsByHour[Math.floor(timeValue / 60)].push(event);
  });

  return { allDayEvents, eventsByHour };
}

export function miniMonthMatrix(year, month) {
  const firstDayOffset = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const totalCells = Math.ceil((firstDayOffset + daysInMonth) / 7) * 7;
  return Array.from({ length: totalCells }, (_, index) => {
    const day = index - firstDayOffset + 1;
    return day >= 1 && day <= daysInMonth
      ? new Date(year, month, day)
      : null;
  });
}

export function calendarSearchParams(search, cursor, view) {
  const params = new URLSearchParams(search);
  const month = cursor.getMonth();
  const year = cursor.getFullYear();

  params.set('month', month);
  params.set('year', year);

  if (view === 'month') {
    params.delete('view');
  } else {
    params.set('view', view);
  }

  if (view === 'day' || view === 'week') {
    params.set('day', cursor.getDate());
  } else {
    params.delete('day');
  }

  return params;
}
