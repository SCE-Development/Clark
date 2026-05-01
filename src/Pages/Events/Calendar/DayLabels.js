import { DAYS } from './calendarViewUtils';

export default function DayLabels() {
  return (
    <div className="grid grid-cols-7 border-b border-slate-700/70 bg-slate-900/35">
      {DAYS.map((dayName) => (
        <div
          key={dayName}
          className="py-2 text-center text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400"
        >
          {dayName}
        </div>
      ))}
    </div>
  );
}
