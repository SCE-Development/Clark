export function CalendarLegend({ isAdminView }) {
  const legendItems = isAdminView
    ? [
      { label: 'Scheduled', dot: 'bg-blue-300' },
      { label: 'Published', dot: 'bg-cyan-300' },
      { label: 'Private', dot: 'bg-violet-300' },
      { label: 'Draft', dot: 'bg-amber-300' },
      { label: 'Closed', dot: 'bg-rose-300' },
    ]
    : [
      { label: 'Open', dot: 'bg-cyan-300' },
      { label: 'Members only', dot: 'bg-violet-300' },
      { label: 'Closed', dot: 'bg-rose-300' },
    ];

  return (
    <div className="flex flex-wrap items-center px-5 py-3 border-t gap-x-4 gap-y-1 border-slate-700/70 bg-slate-900/35">
      {legendItems.map(({ label, dot }) => (
        <span key={label} className="flex items-center gap-1.5 text-[11px] font-medium text-slate-300">
          <span className={['h-2.5 w-2.5 rounded-full', dot].join(' ')} />
          {label}
        </span>
      ))}
    </div>
  );
}
