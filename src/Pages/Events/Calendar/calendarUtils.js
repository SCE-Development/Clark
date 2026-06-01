import { membershipState } from '../../../Enums';
import { toDateKey } from '../eventUtils';

export function getWeekRowIndex(dayOfMonth, firstDayOfMonth) {
  return Math.floor((dayOfMonth - 1 + firstDayOfMonth) / 7);
}

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
