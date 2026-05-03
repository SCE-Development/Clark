import { DayLabels } from './DayLabels';
import { CalendarCell } from './CalendarCell';

export function CalendarGrid({ cells, onSelectEvent, isAdminView }) {
  return (
    <div className="hidden sm:block">
      <DayLabels />

      <div className="grid grid-cols-7 [&>*:nth-child(7n)]:border-r-0">
        {cells.map((cell) => (
          <CalendarCell
            key={cell.key}
            {...cell}
            onSelectEvent={onSelectEvent}
            isAdminView={isAdminView}
          />
        ))}
      </div>
    </div>
  );
}
