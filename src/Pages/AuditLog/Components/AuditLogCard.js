const AuditLogCard = ({ log, index }) => {
  const hasDetails = log => {
    return log.details && Object.keys(log.details).length > 0;
  };

  const formatDetails = details => {
    if (!details || Object.keys(details).length === 0) {
      return null;
    }
    return (
      <div className='mt-3 p-4 bg-gray-700 rounded-lg border border-gray-600'>
        <h4 className='font-semibold text-gray-300 mb-2'>Details:</h4>
        <div className='space-y-1'>
          {Object.entries(details).map(([key, value]) => (
            <div key={key} className='text-sm text-gray-300'>
              <span className='font-medium text-gray-200'>{key}:</span> {String(value)}
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
  };

  const getActionDescription = log => {
    const action = log.action;

    // checks if a user updates or deletes ANOTHER user
    if (action === 'UPDATE_USER') {
      if (log.documentId && log.documentId !== log.userId) {
        return "updated another user's account information";
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
    <div
      key={log._id || index}
      className='p-6 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md bg-gray-800 border border-gray-700 hover:bg-gray-750'
    >
      <div className='flex items-start justify-between'>
        <div className='flex-1'>
          <div className='flex items-center space-x-3 mb-2'>
            <div className='flex-shrink-0'>
              <div className='w-2 h-2 bg-gray-400 rounded-full'></div>
            </div>
            <div className='flex-1'>
              <p className='text-lg font-medium text-white'>
                <span className='font-semibold text-blue-400'>
                  {log.userId ? `${log.userId.firstName} ${log.userId.lastName}` : 'Unknown User'}
                </span>{' '}
                <span className='text-gray-300'>{getActionDescription(log)}</span>
              </p>

              {log.documentId && log.documentId !== log.userId && (
                <p className='text-sm text-gray-400 mt-1'>
                  Target: <span className='font-medium text-gray-300'>User {log.documentId}</span>
                </p>
              )}
            </div>
          </div>

          <div className='ml-5 text-sm text-gray-400'>
            <time dateTime={log.createdAt}>{formatTimestamp(log.createdAt)}</time>
          </div>

          {hasDetails(log) && <div className='ml-5 mt-4'>{formatDetails(log.details)}</div>}
        </div>

        <div className='flex-shrink-0 ml-4'>
          <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-gray-300 border border-gray-600'>
            {log.action.replace(/_/g, ' ')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AuditLogCard;
