import { getActionDescription } from './getActionDescription';
import { formatDetails } from './formatDetails';
import { formatTimestamp } from './formatTimestamp';

const AuditLogCard = ({ log, index }) => {
  const hasDetails = log => {
    return log.details && Object.keys(log.details).length > 0;
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
