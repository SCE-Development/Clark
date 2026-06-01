import { DayLabels } from './DayLabels';
import { CalendarCell } from './CalendarCell';

function chunkWeeks(cells) {
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }
  return weeks;
}

export function CalendarGrid({
  cells,
  onSelectEvent,
  isAdminView,
  firstVisibleWeekIndex = 0,
}) {
  const weeks = chunkWeeks(cells);
  const visibleWeeks = weeks.slice(firstVisibleWeekIndex);

  return (
    <div className="hidden sm:flex sm:flex-col sm:flex-1 sm:min-h-0">
      <DayLabels />

      <div className="flex min-h-0 flex-1 flex-col">
        {visibleWeeks.map((week, weekIndex) => (
          <div
            key={firstVisibleWeekIndex + weekIndex}
            data-week-index={firstVisibleWeekIndex + weekIndex}
            className="grid min-h-0 flex-1 grid-cols-7 [&>*:nth-child(7n)]:border-r-0"
          >
            {week.map((cell) => (
              <CalendarCell
                key={cell.key}
                {...cell}
                onSelectEvent={onSelectEvent}
                isAdminView={isAdminView}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
