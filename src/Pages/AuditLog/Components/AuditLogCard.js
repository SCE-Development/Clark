const AuditLogCard = ({ log, index }) => {
  const hasDetails = log => {
    return log.details && Object.keys(log.details).length > 0;
  };

  const formatDetails = details => {
    if (!details || Object.keys(details).length === 0) {
      return null;
    }
    return (
      <div className='mt-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600'>
        <h4 className='font-semibold text-gray-700 dark:text-gray-300 mb-2'>Details:</h4>
        <div className='space-y-1'>
          {Object.entries(details).map(([key, value]) => (
            <div key={key} className='text-sm text-gray-600 dark:text-gray-300'>
              <span className='font-medium text-gray-800 dark:text-gray-200'>{key}:</span> {String(value)}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const formatTimestamp = timestamp => {
    return new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short',
    });
  };

  const simpleActionDescriptions = {
    SIGN_UP: 'signed up for an account',
    LOG_IN: 'logged into the system',
    PRINT_PAGE: 'printed a page',
    ACCESS_DOOR: 'accessed a door',
    CREATE_MESSAGE: 'created a message',
    DELETE_MESSAGE: 'deleted a message',
    VERIFY_CARD: 'verified an Office Access Card',
    ADD_CARD: 'verified a new Office Access Card',
    DELETE_CARD: 'deleted an Office Access Card',
  };

  const getActionDescription = log => {
    const action = log.action;

    // checks if a user updates or deletes ANOTHER user
    if (action === 'UPDATE_USER') {
      if (log.documentId && log.documentId !== log.userId) {
        return 'updated another user\'s account information';
      }
      return 'updated their account information';
    }

    if (action === 'DELETE_USER') {
      if (log.documentId && log.documentId !== log.userId) {
        return 'deleted another user account';
      }
      return 'deleted their account';
    }

    if (simpleActionDescriptions[action]) {
      return simpleActionDescriptions[action];
    }

    return `performed action: ${action.toLowerCase().replace(/_/g, ' ')}`;
  };

  return (
    <div className='p-6 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 dark:hover:bg-gray-700'>
      <div className='flex items-start justify-between'>
        <div className='flex-1'>
          <div className='flex items-center space-x-3 mb-2'>
            <div className='flex-shrink-0'>
              <div className='w-2 h-2 bg-gray-400 rounded-full'></div>
            </div>
            <div className='flex-1'>
              <p className='text-lg font-medium text-gray-900 dark:text-white'>
                <a
                  href={`/user/edit/${log.userId?._id || log.userId}`}
                  className='font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline cursor-pointer'
                >
                  {log.userId ? `${log.userId.firstName} ${log.userId.lastName}` : 'Unknown User'}
                </a>{' '}
                <span className='text-gray-700 dark:text-gray-300'>{getActionDescription(log)}</span>
              </p>

              {log.documentId && log.documentId !== log.userId && (
                <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
                  Target: <span className='font-medium text-gray-700 dark:text-gray-300'>User {log.documentId}</span>
                </p>
              )}
            </div>
          </div>

          <div className='ml-5 text-sm text-gray-500 dark:text-gray-400'>
            <time dateTime={log.createdAt}>{formatTimestamp(log.createdAt)}</time>
          </div>

          {hasDetails(log) && <div className='ml-5 mt-4'>{formatDetails(log.details)}</div>}
        </div>

        <div className='flex-shrink-0 ml-4'>
          <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600'>
            {log.action.replace(/_/g, ' ')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AuditLogCard;
