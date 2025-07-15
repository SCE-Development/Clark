import { useState, useEffect } from 'react';
import { getAllLogs } from '../../APIFunctions/AuditLog';
import Loading from './Components/Loading';
import Error from './Components/Error';
import Pagination from './Components/Pagination';
import { useUser } from '../../Components/context/UserContext';

export default function AuditLogPage() {
  const [auditLogsData, setAuditLogsData] = useState({ items: [], totalLogs: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

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
          Total logs: {auditLogsData.totalLogs} | Page {currentPage} of {totalPages}
        </div>
      </div>

      {auditLogsData.items.length === 0 ? (
        <div className='text-center py-16'>
          <div className='text-gray-400 text-xl mb-4'>📋</div>
          <h3 className='text-lg font-medium text-white mb-2'>No audit logs found</h3>
          <p className='text-gray-400'>There are no audit logs to display at this time.</p>
        </div>
      ) : (
        <div>
          <div className='space-y-4'>
            {auditLogsData.items.map((log, index) => (
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
              startIndex={(currentPage - 1) * itemsPerPage}
              endIndex={Math.min(currentPage * itemsPerPage, auditLogsData.totalLogs)}
            />
          )}
        </div>
      )}
    </div>
  );
}
