import { DayLabels } from './DayLabels';
import { CalendarCell } from './CalendarCell';

function chunkWeeks(cells) {
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }
  return weeks;
}

export function CalendarGrid({ cells, onSelectEvent, isAdminView, gridScrollRef }) {
  const weeks = chunkWeeks(cells);

  return (
    <div className="hidden sm:flex sm:flex-col sm:flex-1 sm:min-h-0">
      <DayLabels />

      <div
        ref={gridScrollRef}
        className="flex-1 min-h-0 overflow-y-auto"
      >
        {weeks.map((week, weekIndex) => (
          <div
            key={weekIndex}
            data-week-index={weekIndex}
            className="grid grid-cols-7 [&>*:nth-child(7n)]:border-r-0"
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
