import { useState, useEffect } from 'react';
import { getAllLogs } from '../../APIFunctions/AuditLog';
import Pagination from './Components/Pagination';
import { useUser } from '../../Components/context/UserContext';
import AuditLogCard from './Components/AuditLogCard';
import FilterActivityTypes from './Components/FilterActivityTypes';
import FirstNameFilter from './Components/FirstNameFilter';
import LastNameFilter from './Components/LastNameFilter';

export default function AuditLogPage() {
  const [auditLogsData, setAuditLogsData] = useState({ items: [], totalLogs: 0 });

  // states for filters
  const [firstNameFilter, setFirstNameFilter] = useState('');
  const [lastNameFilter, setLastNameFilter] = useState('');
  const [activityFilters, setActivityFilters] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [applyingFilters, setApplyingFilters] = useState(false);

  const user = useUser();

  const getAuditLogsFromDB = async () => {
    try {
      setLoading(true);
      const auditLogsFromDB = await getAllLogs(
        currentPage,
        activityFilters,
        firstNameFilter,
        lastNameFilter,
        user.user.token
      );
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
  }, [currentPage, applyingFilters]);

  const applyFilters = async () => {
    setApplyingFilters(true);
    setCurrentPage(0);
  };

  const clearFilters = () => {
    setFirstNameFilter('');
    setLastNameFilter('');
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
          <span className='ml-3 text-lg text-gray-600'>Loading audit logs...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded'>
          <strong className='font-bold'>Error: </strong>
          <span className='block sm:inline'>{error}</span>
        </div>
      );
    }

    if (!auditLogsData.items.length) {
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
        <div className='mt-6 p-4 bg-gray-800 rounded-lg border border-gray-700'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 items-end'>
            <FirstNameFilter firstNameFilter={firstNameFilter} setFirstNameFilter={setFirstNameFilter} />
            <LastNameFilter lastNameFilter={lastNameFilter} setLastNameFilter={setLastNameFilter} />
            <FilterActivityTypes activityFilters={activityFilters} setActivityFilters={setActivityFilters} />
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
          <AuditLogCard log={log} index={index} />
        ))}
      </div>
      {maybeRenderAuditLogs()}
    </div>
  );
}
