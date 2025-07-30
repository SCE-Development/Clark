import { useState, useEffect } from 'react';
import { getAllLogs } from '../../APIFunctions/AuditLog';
import Pagination from './Components/Pagination';
import { useSCE } from '../../Components/context/SceContext';
import AuditLogCard from './Components/AuditLogCard';
import { BASE_API_URL } from '../../Enums';

export default function AuditLogPage() {
  const [auditLogsData, setAuditLogsData] = useState({ items: [], totalLogs: 0 });

  // states for filters
  const [searchQuery, setSearchQuery] = useState('');
  const [activityFilters, setActivityFilters] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [applyingFilters, setApplyingFilters] = useState(false);

  const user = useSCE();

  const toggleActivityFilter = activity => {
    setActivityFilters(prev => (prev.includes(activity) ? prev.filter(a => a !== activity) : [...prev, activity]));
  };

  const activityTypes = [
    'SIGN_UP',
    'LOG_IN',
    'UPDATE_USER',
    'PRINT_PAGE',
    'VERIFY_EMAIL',
    'EMAIL_SENT',
    'CHANGE_PW',
    'RESET_PW',
    'VERIFY_CARD',
    'ADD_CARD',
    'DELETE_CARD',
  ];

  const getAuditLogsFromDB = async () => {
    try {
      setLoading(true);
      const auditLogsFromDB = await getAllLogs(currentPage, activityFilters, searchQuery, user.user.token);
      if (!auditLogsFromDB.error) {
        setAuditLogsData(auditLogsFromDB.responseData);
      } else {
        setError('Failed to load audit logs');
      }
    } catch (err) {
      setError('Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await getAuditLogsFromDB();

      if (applyingFilters) {
        setApplyingFilters(false);
      }
    };

    fetchData();

    const url = new URL('/api/AuditLog/listen', BASE_API_URL);
    const eventSource = new EventSource(url.href);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setAuditLogsData(prev => ({items: [data.message, ...prev.items], totalLogs: prev.totalLogs + 1}));
    };

    eventSource.onerror = () => {
      setError('Failed to load audit logs');
    };

    return () => {
      eventSource.close();
    };

  }, [currentPage, applyingFilters]);

  const applyFilters = async () => {
    setApplyingFilters(true);
    setCurrentPage(0);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setActivityFilters([]);
    setApplyingFilters(true);
    setCurrentPage(0);
  };

  const itemsPerPage = 50;
  const totalPages = Math.ceil(auditLogsData.totalLogs / itemsPerPage);

  const goToPage = page => {
    setCurrentPage(Math.max(0, Math.min(page, totalPages - 1)));
  };

  function maybeRenderAuditLogs() {
    if (loading) {
      return (
        <div className='flex items-center justify-center h-64'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
          <span className='ml-3 text-lg text-gray-600 dark:text-gray-600'>Loading audit logs...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className='bg-red-50 dark:bg-red-100 border border-red-300 dark:border-red-400 text-red-800 dark:text-red-700 px-4 py-3 rounded'>
          <strong className='font-bold'>Error: </strong>
          <span className='block sm:inline'>{error}</span>
        </div>
      );
    }

    if (!auditLogsData.items.length) {
      return (
        <div className='text-center py-16'>
          <div className='text-gray-400 text-xl mb-4'>📋</div>
          <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-2'>No audit logs found</h3>
          <p className='text-gray-600 dark:text-gray-400'>There are no audit logs to display at this time.</p>
        </div>
      );
    }

    return (
      <div>
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            goToPage={goToPage}
            startIndex={currentPage * itemsPerPage}
            endIndex={Math.min((currentPage + 1) * itemsPerPage, auditLogsData.totalLogs)}
            totalResults={auditLogsData.totalLogs}
          />
        )}
      </div>
    );
  }

  return (
    <div className='m-10'>
      <h1 className='text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white mb-8'>
        Audit Logs
      </h1>
      <div className='space-y-4'>
        <div className='mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 items-end'>
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>Search Users</label>
              <input
                className='w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                type='text'
                placeholder='Search by first name, last name, or email'
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={event => {
                  if (event.key === 'Enter') {
                    if (currentPage !== 0) {
                      setCurrentPage(0);
                    } else {
                      applyFilters();
                    }
                  }
                }}
              />
            </div>
            <div className='relative'>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                Filter by Activity Type
              </label>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className='w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex justify-between items-center'
              >
                <span>
                  {activityFilters.length === 0 ? 'Select activities...' : `${activityFilters.length} selected`}
                </span>
                <svg
                  className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                </svg>
              </button>

              {isDropdownOpen && (
                <div className='absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto'>
                  <div className='p-2'>
                    {activityTypes.map(activity => (
                      <label
                        key={activity}
                        className='flex items-center space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded cursor-pointer'
                      >
                        <input
                          type='checkbox'
                          checked={activityFilters.includes(activity)}
                          onChange={() => toggleActivityFilter(activity)}
                          className='form-checkbox h-4 w-4 text-blue-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500'
                        />
                        <span className='text-gray-900 dark:text-white text-sm'>{activity.replace(/_/g, ' ')}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className='flex gap-2'>
              <button
                onClick={applyFilters}
                className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500'
              >
                Apply Filters
              </button>
              <button
                onClick={clearFilters}
                className='px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500'
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
        {auditLogsData.items.map((log, index) => (
          <AuditLogCard key={log._id || index} log={log} index={index} />
        ))}
      </div>
      {maybeRenderAuditLogs()}
    </div>
  );
}
