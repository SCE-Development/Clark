import { useState, useEffect } from 'react';
import { getAllLogs } from '../../APIFunctions/AuditLog';
import Loading from './Components/Loading';
import Error from './Components/Error';
import FilterActivityTypes from './Components/FilterActivityTypes';
import RefreshButton from './Components/RefreshButton';
import FirstNameFilter from './Components/FirstNameFilter';
import Pagination from './Components/Pagination';
import AuditLogCard from './Components/AuditLogCard';
import { useUser } from '../../Components/context/UserContext';
import LastNameFilter from './Components/LastNameFilter';

export default function AuditLogPage() {
  const [auditLogs, setAuditLogs] = useState([]);
  const [totalLogs, setTotalLogs] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [firstNameFilter, setFirstNameFilter] = useState('');
  const [lastNameFilter, setLastNameFilter] = useState('');
  const [activityFilters, setActivityFilters] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);

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
        setAuditLogs(auditLogsFromDB.responseData.items);
        setTotalLogs(auditLogsFromDB.responseData.totalLogs);
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
    getAuditLogsFromDB();
  }, [currentPage]);

  const applyFilters = () => {
    setCurrentPage(1); // reset to first page when applying filters
    getAuditLogsFromDB();
  };

  const clearFilters = () => {
    setFirstNameFilter('');
    setLastNameFilter('');
    setActivityFilters([]);
    setCurrentPage(1);
    getAuditLogsFromDB();
  };

  const itemsPerPage = 50;
  const totalPages = Math.ceil(totalLogs / itemsPerPage);
  const currentLogs = auditLogs;

  const goToPage = page => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error />;
  }

  return (
    <div className='m-10'>
      <div className='mb-8'>
        <h1 className='text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white'>
          Audit Logs
        </h1>
        <div className='mt-2 text-sm text-gray-500'>
          Total logs: {totalLogs} | Showing: {currentLogs.length} | Page {currentPage} of {totalPages}
        </div>

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
      </div>

      {currentLogs.length === 0 ? (
        <div className='text-center py-16'>
          <h3 className='text-lg font-medium text-white mb-2'>No audit logs found</h3>
          <p className='text-gray-400'>
            {firstNameFilter.trim() || lastNameFilter.trim() || activityFilters.length > 0
              ? 'No logs match your current filters. Try adjusting your search criteria.'
              : 'There are no audit logs to display at this time.'}
          </p>
        </div>
      ) : (
        <div>
          <div className='space-y-4'>
            {currentLogs.map((log, index) => (
              <AuditLogCard key={log._id || index} log={log} />
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              goToPage={goToPage}
              itemsPerPage={itemsPerPage}
              totalLogs={totalLogs}
            />
          )}
        </div>
      )}

      {currentLogs.length > 0 && <RefreshButton getAuditLogsFromDB={getAuditLogsFromDB} />}
    </div>
  );
}
