import React, { useState, useEffect, useCallback } from 'react';
import {
  getPermissionRequests,
  approvePermissionRequest,
  deletePermissionRequest
} from '../../APIFunctions/PermissionRequest';
import { useSCE } from '../../Components/context/SceContext';

export default function PermissionRequestPage() {
  const { user } = useSCE();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');

  const loadRequests = useCallback(async () => {
    setLoading(true);
    const res = await getPermissionRequests('', user.token);
    if (!res.error) {
      setRequests(res.responseData);
    }
    setLoading(false);
  }, [user.token]);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  async function handleApprove(request) {
    const res = await approvePermissionRequest(request.type, request._id, user.token);
    if (!res.error) loadRequests();
  }

  async function handleRevoke(request) {
    const res = await deletePermissionRequest(request._id, user.token);
    if (!res.error) loadRequests();
  }

  function getStatusBadge(status) {
    const styles = {
      PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      APPROVED: 'bg-green-100 text-green-800 border-green-300',
      DENIED: 'bg-red-100 text-red-800 border-red-300',
      REVOKED: 'bg-gray-100 text-gray-800 border-gray-300',
    };
    return (
      <span className={`px-2 py-1 rounded text-xs font-semibold border ${styles[status] || styles.REVOKED}`}>
        {status}
      </span>
    );
  }

  function renderActions(req) {
    if (req.status === 'PENDING') {
      return (
        <div className="flex gap-2 justify-center">
          <button className="btn btn-success btn-sm flex-1 sm:flex-none" onClick={() => handleApprove(req)}>Approve</button>
          <button className="btn btn-error btn-sm flex-1 sm:flex-none" onClick={() => handleRevoke(req)}>Deny</button>
        </div>
      );
    }
    if (req.status === 'APPROVED') {
      return (
        <button className="btn btn-outline btn-error btn-sm w-full sm:w-auto" onClick={() => handleRevoke(req)}>
          Revoke Access
        </button>
      );
    }
    return <span className="text-gray-400 italic text-sm">No actions available</span>;
  }

  function getFormattedTime(maybeISOString = null) {
    let date = new Date();
    if (maybeISOString) {
      date = new Date(maybeISOString);
    }

    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZoneName: 'short',
    });
  }

  function renderContent(data) {
    if (data.length === 0) {
      return <p className="text-center mt-10 text-gray-500">No requests found.</p>;
    }

    return (
      <div className="w-full px-4">
        {/* DESKTOP TABLE: Hidden on small screens */}
        <div className="hidden md:block overflow-x-auto border rounded-lg">
          <table className="table w-full">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="p-4 text-left">Date</th>
                <th className="p-4 text-left">User</th>
                <th className="p-4 text-left">Type</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((req) => (
                <tr key={req._id} className="border-t border-gray-200 dark:border-gray-700">
                  <td className='p-4'>{getFormattedTime(req.createdAt)}</td>
                  <td className="p-4">
                    <div className="font-bold">{req.userId?.firstName} {req.userId?.lastName}</div>
                    <div className="text-sm opacity-50">{req.userId?.email}</div>
                  </td>
                  <td className="p-4">{req.type}</td>
                  <td className="p-4">{getStatusBadge(req.status)}</td>
                  <td className="p-4 text-center">{renderActions(req)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MOBILE CARDS: Hidden on medium+ screens */}
        <div className="md:hidden space-y-4">
          {data.map((req) => (
            <div key={req._id} className="border rounded-lg p-4 shadow-sm bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-bold">{req.userId?.firstName} {req.userId?.lastName}</div>
                  <div className="text-xs text-gray-500">{req.userId?.email}</div>
                </div>
                {getStatusBadge(req.status)}
              </div>
              <div className="text-sm mb-4">
                <span className="font-semibold">Request Type:</span> {req.type}
              </div>
              <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                {renderActions(req)}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-10 mb-20">
      <h1 className="text-2xl font-bold text-center mb-6">Permission Management</h1>

      <div className="flex justify-center mb-8">
        <div className="tabs tabs-boxed">
          <button
            className={`tab ${activeTab === 'pending' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            Pending
          </button>
          <button
            className={`tab ${activeTab === 'all' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            Past Approved Requests
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-10"><span className="loading loading-spinner loading-lg"></span></div>
      ) : (
        renderContent(activeTab === 'pending' ? requests.filter(r => r.status === 'PENDING') : requests)
      )}
    </div>
  );
}
