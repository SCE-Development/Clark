import Pagination from './Pagination';

const AuditLogContent = ({ loading, error, data, currentPage, totalPages, goToPage }) => {
  if (loading) {
    return (
      <div className='m-10'>
        <h1 className='text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white mb-8'>
          Audit Logs
        </h1>
        <div className='flex items-center justify-center h-64'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
          <span className='ml-3 text-lg text-gray-600'>Loading audit logs...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='m-10'>
        <h1 className='text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white mb-8'>
          Audit Logs
        </h1>
        <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded'>
          <strong className='font-bold'>Error: </strong>
          <span className='block sm:inline'>{error}</span>
        </div>
      </div>
    );
  }

  if (!data.items.length) {
    return (
      <div className='text-center py-16'>
        <div className='text-gray-400 text-xl mb-4'>📋</div>
        <h3 className='text-lg font-medium text-white mb-2'>No audit logs found</h3>
        <p className='text-gray-400'>There are no audit logs to display at this time.</p>
      </div>
    );
  }

  return (
    <div>
      <div className='space-y-4'>
        {data.items.map((log, index) => (
          <div key={log._id || index} className='p-4 rounded-lg bg-gray-800 border border-gray-700'>
            <pre className='text-sm text-gray-300 whitespace-pre-wrap'>{JSON.stringify(log, null, 2)}</pre>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          goToPage={goToPage}
          startIndex={currentPage * 50}
          endIndex={Math.min((currentPage + 1) * 50, data.totalLogs)}
          totalResults={data.totalLogs}
        />
      )}
    </div>
  );
};

export default AuditLogContent;
