import { useState, useEffect } from 'react';
import { getAllLogs } from '../../APIFunctions/AuditLog';
import { useUser } from '../../Components/context/UserContext';
import AuditLogContent from './Components/AuditLogContent';

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

  return (
    <div className='m-10'>
      <div className='mb-8'>
        <h1 className='text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white'>
          Audit Logs
        </h1>
        <div className='mt-2 text-sm text-gray-500'>
          Total logs: {auditLogsData.totalLogs} | Page {currentPage + 1} of {totalPages}
        </div>
      </div>

      <AuditLogContent
        loading={loading}
        error={error}
        data={auditLogsData}
        currentPage={currentPage}
        totalPages={totalPages}
        goToPage={goToPage}
      />
    </div>
  );
}
