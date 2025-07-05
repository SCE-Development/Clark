import { useState, useEffect, useCallback, useRef } from 'react';
import { getAllLogs } from '../../APIFunctions/AuditLog';
import Loading from './Components/Loading';
import Error from './Components/Error';
import FilterActivityTypes from './Components/FilterActivityTypes';
import RefreshButton from './Components/RefreshButton';
import FilterName from './Components/FilterName';
import Pagination from './Components/Pagination';
import AuditLogCard from './Components/AuditLogCard';

export default function AuditLogPage() {
  const [auditLogs, setAuditLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [nameFilter, setNameFilter] = useState('');
  const [activityFilters, setActivityFilters] = useState([]);

  const debounceRef = useRef();
  const [currentPage, setCurrentPage] = useState(1);

  const getAuditLogsFromDB = async () => {
    try {
      setLoading(true);
      const auditLogsFromDB = await getAllLogs();
      if (!auditLogsFromDB.error) {
        setAuditLogs(auditLogsFromDB.responseData);
        setFilteredLogs(auditLogsFromDB.responseData);
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
  }, []);

  const debouncedFilter = (callback, delay) => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(callback, delay);
  };

  const applyFilters = useCallback(() => {
    let filtered = auditLogs;

    if (nameFilter.trim()) {
      filtered = filtered.filter(log => {
        const searchTerm = nameFilter.toLowerCase();

        const userFirstName = log.userId?.firstName?.toLowerCase() || '';
        const userLastName = log.userId?.lastName?.toLowerCase() || '';
        const userFullName = `${userFirstName} ${userLastName}`.trim();

        return (
          userFirstName.includes(searchTerm) || userLastName.includes(searchTerm) || userFullName.includes(searchTerm)
        );
      });
    }

    if (activityFilters.length > 0) {
      filtered = filtered.filter(log => activityFilters.includes(log.action));
    }

    setFilteredLogs(filtered);
    setCurrentPage(1);
  }, [auditLogs, nameFilter, activityFilters]);

  useEffect(() => {
    debouncedFilter(applyFilters, 300);
  }, [nameFilter, activityFilters, auditLogs, applyFilters]);

  const clearFilters = () => {
    setNameFilter('');
    setActivityFilters([]);
    setCurrentPage(1);
  };

  const itemsPerPage = 50;
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLogs = filteredLogs.slice(startIndex, endIndex);

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
          Total logs: {auditLogs.length} | Filtered: {filteredLogs.length} | Page {currentPage} of {totalPages}
        </div>

        <div className='mt-6 p-4 bg-gray-800 rounded-lg border border-gray-700'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 items-end'>
            <FilterName nameFilter={nameFilter} setNameFilter={setNameFilter} />
            <FilterActivityTypes activityFilters={activityFilters} setActivityFilters={setActivityFilters} />
            <div>
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

      {filteredLogs.length === 0 ? (
        <div className='text-center py-16'>
          <div className='text-gray-400 text-xl mb-4'>📋</div>
          <h3 className='text-lg font-medium text-white mb-2'>No audit logs found</h3>
          <p className='text-gray-400'>
            {auditLogs.length === 0
              ? 'There are no audit logs to display at this time.'
              : 'No logs match your current filters. Try adjusting your search criteria.'}
          </p>
        </div>
      ) : (
        <div>
          <div className='space-y-4'>
            {currentLogs.map((log, index) => (
              <AuditLogCard log={log} index={index} />
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              goToPage={goToPage}
              startIndex={startIndex}
              endIndex={endIndex}
              filteredLogs={filteredLogs}
            />
          )}
        </div>
      )}

      {filteredLogs.length > 0 && <RefreshButton getAuditLogsFromDB={getAuditLogsFromDB} />}
    </div>
  );
}
