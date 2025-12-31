export default function JobStatus({ id, status, fileName }) {
  const getStatusConfig = () => {
    switch (status) {
    case 'failed':
      return {
        color: 'alert-error',
        icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />,
        loading: false
      };
    case 'completed':
      return {
        color: 'alert-success',
        icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />,
        loading: false
      };
    default: // 'created', 'processing', etc.
      return {
        color: 'alert-info',
        icon: null, // We'll use a spinner instead
        loading: true
      };
    }
  };

  const config = getStatusConfig();

  return (
    <div className='flex justify-center w-full mt-4 animate-in fade-in slide-in-from-top-2'>
      <div role="alert" className={`w-full max-w-2xl alert ${config.color} shadow-lg py-3`}>
        {config.loading ? (
          <span className="loading loading-spinner loading-sm"></span>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 stroke-current shrink-0" fill="none" viewBox="0 0 24 24">
            {config.icon}
          </svg>
        )}

        <div className="flex flex-col items-start flex-1 ml-2">
          <span className="font-bold truncate max-w-[250px] sm:max-w-md">
            {fileName}
          </span>
          <span className="text-xs opacity-70 italic">Job ID: {id}</span>
        </div>

        <div className="flex-none">
          <div className="badge badge-outline uppercase text-[10px] font-bold tracking-widest px-2 py-1">
            {status}
          </div>
        </div>
      </div>
    </div>
  );
}
