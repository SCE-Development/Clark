import { useState, useEffect } from 'react';
import { getAllLogs } from '../../APIFunctions/AuditLog';
import Pagination from './Components/Pagination';
import { useUser } from '../../Components/context/UserContext';
import AuditLogCard from './Components/AuditLogCard';

export default function AuditLogPage() {
  const [auditLogsData, setAuditLogsData] = useState({ items: [], totalLogs: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(0);

  const user = useUser();

  const getAuditLogsFromDB = async () => {
    try {
      setLoading(true);
      const auditLogsFromDB = await getAllLogs(currentPage, user.user.token);
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
    getAuditLogsFromDB();
  }, [currentPage]);

  const itemsPerPage = 50;
  const totalPages = Math.ceil(auditLogsData.totalLogs / itemsPerPage);

  const goToPage = page => {
    setCurrentPage(Math.max(0, Math.min(page, totalPages)));
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
        <div className='space-y-4'>
          {auditLogsData.items.map((log, index) => (
            <AuditLogCard log={log} index={index} />
          ))}
        </div>

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
      {maybeRenderAuditLogs()}
    </div>
  );
}
