import { formatTime, getBadgeText, pillColors } from './calendarUtils';

export function EventRow({ event, onSelect, isAdminView }) {
  const colors = pillColors(event, isAdminView);
  const badgeText = getBadgeText(event, isAdminView);
  const timeLabel = formatTime(event.time);

  return (
    <button
      type="button"
      onClick={() => onSelect(event)}
      className={[
        'flex w-full items-center gap-1.5 rounded border px-1.5 py-1',
        'text-left text-[11px] font-medium leading-tight',
        'transition-all duration-150 hover:border-white/30 hover:brightness-110',
        colors.bg,
        colors.text,
        colors.border,
      ].join(' ')}
      title={event.name}
    >
      <span className={['mt-1 h-1.5 w-1.5 shrink-0 rounded-full', colors.dot].join(' ')} />
      <div className="flex-1 min-w-0 truncate">
        {timeLabel && (
          <span className="mr-1.5 font-semibold text-white/90">
            {timeLabel}
          </span>
        )}
        <span className="truncate">
          {event.name || 'Untitled'}
        </span>
      </div>
      {badgeText && (
        <span className="hidden rounded border border-current/30 px-1 py-0.5 text-[9px] uppercase tracking-wide opacity-75 sm:inline">
          {badgeText}
        </span>
      )}
    </button>
  );
}
