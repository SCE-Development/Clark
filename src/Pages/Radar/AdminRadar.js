import { useState, useEffect, useRef } from 'react';
import {
  getHealth,
  getDashboardCurrent,
  getPresenceHistory,
  getDiscoveredDevices,
  getManagedDevices,
  upsertManagedDevice,
  removePairedDevice,
  getPairCandidates,
  pairFinalize,
  enrollStart,
  enrollCancel,
  updateFilter,
  getDebugFingerprints,
} from '../../APIFunctions/Radar';

const REFRESH_INTERVAL_MS = 15000;

export default function AdminRadar() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const intervalRef = useRef(null);

  // Tab-specific data
  const [dashboard, setDashboard] = useState(null);
  const [managed, setManaged] = useState([]);
  const [discovered, setDiscovered] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [history, setHistory] = useState([]);
  const [health, setHealth] = useState(null);
  const [fingerprints, setFingerprints] = useState(null);

  // Modal states
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState(null);
  const [pairModalOpen, setPairModalOpen] = useState(false);
  const [pairingCandidate, setPairingCandidate] = useState(null);
  const [removeConfirm, setRemoveConfirm] = useState(false);
  const [removingDevice, setRemovingDevice] = useState(null);
  const [enrollmentActive, setEnrollmentActive] = useState(false);

  // Form inputs
  const [editFormData, setEditFormData] = useState({ label: '', room: '' });
  const [pairFormData, setPairFormData] = useState({ label: '', room: '' });
  const [filterFormData, setFilterFormData] = useState('');
  const [historyStartDate, setHistoryStartDate] = useState('');
  const [historyEndDate, setHistoryEndDate] = useState('');

  async function fetchTabData() {
    setLoading(true);
    setError(false);
    try {
      switch (activeTab) {
        case 'dashboard': {
          const res = await getDashboardCurrent();
          if (!res.error) setDashboard(res.responseData);
          else setError(true);
          break;
        }
        case 'managed': {
          const res = await getManagedDevices();
          if (!res.error) setManaged(res.responseData ?? []);
          else setError(true);
          break;
        }
        case 'discover': {
          const dRes = await getDiscoveredDevices();
          const cRes = await getPairCandidates();
          if (!dRes.error) setDiscovered(dRes.responseData ?? []);
          if (!cRes.error) setCandidates(cRes.responseData ?? []);
          if (dRes.error || cRes.error) setError(true);
          break;
        }
        case 'history': {
          const params = {};
          if (historyStartDate) params.startDate = historyStartDate;
          if (historyEndDate) params.endDate = historyEndDate;
          const res = await getPresenceHistory(params);
          if (!res.error) setHistory(res.responseData ?? []);
          else setError(true);
          break;
        }
        case 'diagnostics': {
          const hRes = await getHealth();
          const fRes = await getDebugFingerprints();
          if (!hRes.error) setHealth(hRes.responseData);
          if (!fRes.error) setFingerprints(fRes.responseData);
          if (hRes.error || fRes.error) setError(true);
          break;
        }
        default:
          break;
      }
    } catch (err) {
      setError(true);
    }
    setLastUpdated(new Date());
    setLoading(false);
  }

  // Fetch on tab change
  useEffect(() => {
    fetchTabData();
  }, [activeTab, historyStartDate, historyEndDate]);

  // Auto-refresh only for dashboard and discover tabs
  useEffect(() => {
    if (!autoRefresh || (activeTab !== 'dashboard' && activeTab !== 'discover')) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    const fetch = async () => {
      try {
        if (activeTab === 'dashboard') {
          const res = await getDashboardCurrent();
          if (!res.error) {
            setDashboard(res.responseData);
            setLastUpdated(new Date());
          }
        } else if (activeTab === 'discover') {
          const cRes = await getPairCandidates();
          if (!cRes.error) {
            setCandidates(cRes.responseData ?? []);
            setLastUpdated(new Date());
          }
        }
      } catch (err) {
        // Silent fail on auto-refresh
      }
    };

    intervalRef.current = setInterval(fetch, REFRESH_INTERVAL_MS);
    return () => clearInterval(intervalRef.current);
  }, [autoRefresh, activeTab]);

  async function handleEditDevice(device) {
    setEditingDevice(device);
    setEditFormData({ label: device.label || '', room: device.room || '' });
    document.getElementById('edit-device-modal').showModal();
  }

  async function handleSaveEditDevice() {
    const payload = {
      id: editingDevice.id,
      mac: editingDevice.mac,
      ...editFormData,
    };
    const res = await upsertManagedDevice(payload);
    if (!res.error) {
      setManaged(managed.map(d => d.id === editingDevice.id ? { ...d, ...editFormData } : d));
      document.getElementById('edit-device-modal').close();
    }
  }

  async function handleRemoveDevice(device) {
    setRemovingDevice(device);
    document.getElementById('remove-confirm-modal').showModal();
  }

  async function handleConfirmRemove() {
    const res = await removePairedDevice(removingDevice.id);
    if (!res.error) {
      setManaged(managed.filter(d => d.id !== removingDevice.id));
      document.getElementById('remove-confirm-modal').close();
    }
  }

  async function handlePairCandidate(candidate) {
    setPairingCandidate(candidate);
    setPairFormData({ label: '', room: '' });
    document.getElementById('pair-finalize-modal').showModal();
  }

  async function handleFinalizePair() {
    const payload = {
      deviceId: pairingCandidate.id || pairingCandidate.mac,
      ...pairFormData,
    };
    const res = await pairFinalize(payload);
    if (!res.error) {
      setCandidates(candidates.filter(c => c.id !== pairingCandidate.id));
      document.getElementById('pair-finalize-modal').close();
    }
  }

  async function handleStartEnrollment() {
    const res = await enrollStart();
    if (!res.error) {
      setEnrollmentActive(true);
    }
  }

  async function handleCancelEnrollment() {
    const res = await enrollCancel();
    if (!res.error) {
      setEnrollmentActive(false);
      setCandidates([]);
    }
  }

  async function handleSaveFilter() {
    let filterPayload;
    try {
      filterPayload = JSON.parse(filterFormData);
    } catch {
      filterPayload = { raw: filterFormData };
    }
    const res = await updateFilter(filterPayload);
    if (!res.error) {
      setLastUpdated(new Date());
    }
  }

  function renderStatusBadge() {
    if (error) return <span className='badge badge-error text-white'>Offline</span>;
    if (activeTab === 'dashboard' && dashboard?.count > 0)
      return (
        <span className='badge badge-success text-white'>
          Occupied — {dashboard.count} {dashboard.count === 1 ? 'person' : 'people'}
        </span>
      );
    return <span className='badge badge-neutral text-white'>Unoccupied</span>;
  }

  function renderTabContent() {
    if (loading && activeTab !== 'dashboard') {
      return (
        <div className='flex justify-center py-10'>
          <span className='loading loading-spinner loading-lg text-primary' />
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return renderDashboardTab();
      case 'managed':
        return renderManagedTab();
      case 'discover':
        return renderDiscoverTab();
      case 'filters':
        return renderFiltersTab();
      case 'history':
        return renderHistoryTab();
      case 'diagnostics':
        return renderDiagnosticsTab();
      default:
        return null;
    }
  }

  function renderDashboardTab() {
    if (error) {
      return (
        <div className='text-center py-10'>
          <p className='text-gray-500 dark:text-gray-400'>Unable to fetch dashboard data.</p>
        </div>
      );
    }

    if (!dashboard) {
      return (
        <div className='text-center py-10'>
          <span className='loading loading-spinner loading-lg text-primary' />
        </div>
      );
    }

    return (
      <div className='space-y-4'>
        {dashboard.room && (
          <p className='text-sm text-gray-500 dark:text-gray-400'>
            Room: <span className='font-medium text-gray-700 dark:text-gray-200'>{dashboard.room}</span>
          </p>
        )}
        {dashboard.firmware && (
          <p className='text-sm text-gray-500 dark:text-gray-400'>
            Firmware: <span className='font-medium text-gray-700 dark:text-gray-200'>{dashboard.firmware}</span>
          </p>
        )}
        <div className='overflow-x-auto'>
          <table className='min-w-full text-sm text-left text-gray-700 dark:text-gray-400'>
            <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
              <tr>
                {['Device ID', 'MAC', 'Room', 'Signal', 'Distance'].map((col) => (
                  <th key={col} className='px-6 py-3'>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {!dashboard.devices || dashboard.devices.length === 0 ? (
                <tr>
                  <td colSpan={5} className='px-6 py-8 text-center text-gray-500 dark:text-gray-400'>
                    No devices currently detected.
                  </td>
                </tr>
              ) : (
                dashboard.devices.map((device, idx) => (
                  <tr key={device.id || idx} className='bg-white border-b dark:bg-gray-800 dark:border-gray-700'>
                    <td className='px-6 py-4 font-mono text-sm'>{device.id}</td>
                    <td className='px-6 py-4 font-mono text-sm'>{device.mac}</td>
                    <td className='px-6 py-4 text-sm'>{device.room || '—'}</td>
                    <td className='px-6 py-4 text-sm'>{device.rssi} dBm</td>
                    <td className='px-6 py-4 text-sm'>
                      {device.distance != null ? `${device.distance.toFixed(1)} m` : '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  function renderManagedTab() {
    if (error) {
      return (
        <div className='text-center py-10'>
          <p className='text-gray-500 dark:text-gray-400'>Unable to fetch managed devices.</p>
        </div>
      );
    }

    return (
      <div className='overflow-x-auto'>
        <table className='min-w-full text-sm text-left text-gray-700 dark:text-gray-400'>
          <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
            <tr>
              {['MAC', 'Device ID', 'Label', 'Room', 'Distance', 'Actions'].map((col) => (
                <th key={col} className='px-6 py-3'>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {managed.length === 0 ? (
              <tr>
                <td colSpan={6} className='px-6 py-8 text-center text-gray-500 dark:text-gray-400'>
                  No managed devices.
                </td>
              </tr>
            ) : (
              managed.map((device, idx) => (
                <tr key={device.id || idx} className='bg-white border-b dark:bg-gray-800 dark:border-gray-700'>
                  <td className='px-6 py-4 font-mono text-sm'>{device.mac}</td>
                  <td className='px-6 py-4 font-mono text-sm'>{device.id}</td>
                  <td className='px-6 py-4 text-sm'>{device.label || '—'}</td>
                  <td className='px-6 py-4 text-sm'>{device.room || '—'}</td>
                  <td className='px-6 py-4 text-sm'>
                    {device.distance != null ? `${device.distance.toFixed(1)} m` : '—'}
                  </td>
                  <td className='px-6 py-4 text-sm flex gap-2'>
                    <button
                      className='btn btn-sm btn-ghost text-primary'
                      onClick={() => handleEditDevice(device)}
                    >
                      Edit
                    </button>
                    <button
                      className='btn btn-sm btn-ghost text-error'
                      onClick={() => handleRemoveDevice(device)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    );
  }

  function renderDiscoverTab() {
    if (error) {
      return (
        <div className='text-center py-10'>
          <p className='text-gray-500 dark:text-gray-400'>Unable to fetch discovery data.</p>
        </div>
      );
    }

    return (
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Discovered Devices */}
        <div>
          <h3 className='text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200'>Discovered Devices</h3>
          <div className='overflow-x-auto'>
            <table className='min-w-full text-sm text-left text-gray-700 dark:text-gray-400'>
              <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
                <tr>
                  {['MAC', 'ID', 'RSSI', 'Distance'].map((col) => (
                    <th key={col} className='px-4 py-2'>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {discovered.length === 0 ? (
                  <tr>
                    <td colSpan={4} className='px-4 py-4 text-center text-gray-500 dark:text-gray-400'>
                      No devices discovered.
                    </td>
                  </tr>
                ) : (
                  discovered.map((device, idx) => (
                    <tr
                      key={device.mac || idx}
                      className='bg-white border-b dark:bg-gray-800 dark:border-gray-700'
                    >
                      <td className='px-4 py-2 font-mono text-xs'>{device.mac}</td>
                      <td className='px-4 py-2 font-mono text-xs'>{device.id}</td>
                      <td className='px-4 py-2 text-xs'>{device.rssi} dBm</td>
                      <td className='px-4 py-2 text-xs'>
                        {device.distance != null ? `${device.distance.toFixed(1)} m` : '—'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pairing Flow */}
        <div>
          <h3 className='text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200'>Enrollment & Pairing</h3>
          <div className='space-y-3 mb-6'>
            <button
              className='btn btn-primary w-full'
              onClick={handleStartEnrollment}
              disabled={enrollmentActive}
            >
              Start Enrollment
            </button>
            <button
              className='btn btn-secondary w-full'
              onClick={handleCancelEnrollment}
              disabled={!enrollmentActive}
            >
              Cancel Enrollment
            </button>
          </div>

          <div className='overflow-x-auto'>
            <table className='min-w-full text-sm text-left text-gray-700 dark:text-gray-400'>
              <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
                <tr>
                  {['MAC', 'RSSI', 'Actions'].map((col) => (
                    <th key={col} className='px-4 py-2'>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {candidates.length === 0 ? (
                  <tr>
                    <td colSpan={3} className='px-4 py-4 text-center text-gray-500 dark:text-gray-400'>
                      {enrollmentActive ? 'Waiting for candidates...' : 'No candidates. Start enrollment.'}
                    </td>
                  </tr>
                ) : (
                  candidates.map((candidate, idx) => (
                    <tr
                      key={candidate.mac || idx}
                      className='bg-white border-b dark:bg-gray-800 dark:border-gray-700'
                    >
                      <td className='px-4 py-2 font-mono text-xs'>{candidate.mac}</td>
                      <td className='px-4 py-2 text-xs'>{candidate.rssi} dBm</td>
                      <td className='px-4 py-2'>
                        <button
                          className='btn btn-sm btn-success text-white'
                          onClick={() => handlePairCandidate(candidate)}
                        >
                          Finalize
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  function renderFiltersTab() {
    return (
      <div className='space-y-4 max-w-2xl'>
        <p className='text-sm text-gray-500 dark:text-gray-400'>
          Enter filter configuration as JSON or raw text:
        </p>
        <textarea
          className='textarea textarea-bordered w-full h-48 font-mono text-sm dark:bg-gray-800 dark:text-white'
          placeholder='{"allowlist": ["mac1", "mac2"]} or other filter rules...'
          value={filterFormData}
          onChange={(e) => setFilterFormData(e.target.value)}
        />
        <button className='btn btn-primary' onClick={handleSaveFilter}>
          Save Filter
        </button>
        {lastUpdated && (
          <p className='text-xs text-gray-400 dark:text-gray-500'>Last saved: {lastUpdated.toLocaleTimeString()}</p>
        )}
      </div>
    );
  }

  function renderHistoryTab() {
    if (error) {
      return (
        <div className='text-center py-10'>
          <p className='text-gray-500 dark:text-gray-400'>Unable to fetch history.</p>
        </div>
      );
    }

    return (
      <div className='space-y-4'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label className='label text-sm'>Start Date</label>
            <input
              type='datetime-local'
              className='input input-bordered w-full dark:bg-gray-800 dark:text-white'
              value={historyStartDate}
              onChange={(e) => setHistoryStartDate(e.target.value)}
            />
          </div>
          <div>
            <label className='label text-sm'>End Date</label>
            <input
              type='datetime-local'
              className='input input-bordered w-full dark:bg-gray-800 dark:text-white'
              value={historyEndDate}
              onChange={(e) => setHistoryEndDate(e.target.value)}
            />
          </div>
        </div>

        <div className='overflow-x-auto'>
          <table className='min-w-full text-sm text-left text-gray-700 dark:text-gray-400'>
            <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
              <tr>
                {['Timestamp', 'Device ID', 'Device Name', 'Room', 'Action'].map((col) => (
                  <th key={col} className='px-6 py-3'>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {history.length === 0 ? (
                <tr>
                  <td colSpan={5} className='px-6 py-8 text-center text-gray-500 dark:text-gray-400'>
                    No presence history.
                  </td>
                </tr>
              ) : (
                history.map((entry, idx) => (
                  <tr key={idx} className='bg-white border-b dark:bg-gray-800 dark:border-gray-700'>
                    <td className='px-6 py-4 text-sm'>
                      {new Date(entry.timestamp).toLocaleString()}
                    </td>
                    <td className='px-6 py-4 font-mono text-sm'>{entry.deviceId}</td>
                    <td className='px-6 py-4 text-sm'>{entry.deviceName || '—'}</td>
                    <td className='px-6 py-4 text-sm'>{entry.room || '—'}</td>
                    <td className='px-6 py-4 text-sm'>
                      <span className={`badge ${entry.action === 'enter' ? 'badge-success' : 'badge-warning'}`}>
                        {entry.action}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  function renderDiagnosticsTab() {
    return (
      <div className='space-y-6'>
        <div>
          <h3 className='text-lg font-semibold mb-3 text-gray-700 dark:text-gray-200'>Health Status</h3>
          <button
            className='btn btn-sm btn-ghost mb-3'
            onClick={async () => {
              const res = await getHealth();
              if (!res.error) setHealth(res.responseData);
            }}
          >
            Refresh Health
          </button>
          {health ? (
            <pre className='bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-auto max-h-64 text-xs'>
              {JSON.stringify(health, null, 2)}
            </pre>
          ) : (
            <p className='text-gray-500 dark:text-gray-400'>No health data.</p>
          )}
        </div>

        <div>
          <h3 className='text-lg font-semibold mb-3 text-gray-700 dark:text-gray-200'>Debug Fingerprints</h3>
          <button
            className='btn btn-sm btn-ghost mb-3'
            onClick={async () => {
              const res = await getDebugFingerprints();
              if (!res.error) setFingerprints(res.responseData);
            }}
          >
            Refresh Fingerprints
          </button>
          {fingerprints ? (
            <pre className='bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-auto max-h-64 text-xs'>
              {JSON.stringify(fingerprints, null, 2)}
            </pre>
          ) : (
            <p className='text-gray-500 dark:text-gray-400'>No fingerprint data.</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className='overview-container bg-white dark:bg-gradient-to-r dark:from-gray-800 dark:to-gray-600 min-h-[100dvh]'>
      <h1 className='text-center text-gray-700 dark:text-white text-4xl font-bold py-4'>Radar</h1>

      {/* Header */}
      <div className='flex flex-wrap items-center justify-between gap-4 mx-6 mb-6'>
        <div className='flex items-center gap-3'>
          {renderStatusBadge()}
          {lastUpdated && (
            <span className='text-sm text-gray-400 dark:text-gray-400'>
              Updated {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          {loading && <span className='loading loading-spinner loading-sm text-primary' />}
        </div>
        <div className='flex items-center gap-3'>
          <label className='flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 cursor-pointer'>
            <input
              type='checkbox'
              className='checkbox checkbox-sm'
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
            />
            Auto-refresh ({REFRESH_INTERVAL_MS / 1000}s)
          </label>
          <button
            className='btn btn-sm btn-neutral text-gray-800 bg-gray-200 hover:bg-gray-300 dark:text-white dark:bg-gray-700 dark:hover:bg-gray-600'
            onClick={fetchTabData}
            disabled={loading}
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className='flex justify-center mb-8'>
        <div className='tabs tabs-boxed'>
          {['dashboard', 'managed', 'discover', 'filters', 'history', 'diagnostics'].map((tab) => (
            <button
              key={tab}
              className={`tab ${activeTab === tab ? 'tab-active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className='mx-6 pb-10'>{renderTabContent()}</div>

      {/* Edit Device Modal */}
      <dialog id='edit-device-modal' className='modal modal-bottom sm:modal-middle'>
        <div className='modal-box'>
          <h3 className='font-bold text-lg'>Edit Device</h3>
          <div className='py-4 space-y-4'>
            <div className='form-control'>
              <label className='label'>
                <span className='label-text'>Device Label</span>
              </label>
              <input
                type='text'
                className='input input-bordered dark:bg-gray-800 dark:text-white'
                value={editFormData.label}
                onChange={(e) => setEditFormData({ ...editFormData, label: e.target.value })}
              />
            </div>
            <div className='form-control'>
              <label className='label'>
                <span className='label-text'>Room / Location</span>
              </label>
              <input
                type='text'
                className='input input-bordered dark:bg-gray-800 dark:text-white'
                value={editFormData.room}
                onChange={(e) => setEditFormData({ ...editFormData, room: e.target.value })}
              />
            </div>
          </div>
          <div className='modal-action'>
            <form method='dialog'>
              <button className='btn'>Cancel</button>
              <button type='button' className='btn btn-primary ml-2' onClick={handleSaveEditDevice}>
                Save
              </button>
            </form>
          </div>
        </div>
      </dialog>

      {/* Pair Finalize Modal */}
      <dialog id='pair-finalize-modal' className='modal modal-bottom sm:modal-middle'>
        <div className='modal-box'>
          <h3 className='font-bold text-lg'>Finalize Pairing</h3>
          <p className='text-sm text-gray-500 dark:text-gray-400 mt-2'>
            Device: {pairingCandidate?.mac}
          </p>
          <div className='py-4 space-y-4'>
            <div className='form-control'>
              <label className='label'>
                <span className='label-text'>Device Label</span>
              </label>
              <input
                type='text'
                className='input input-bordered dark:bg-gray-800 dark:text-white'
                value={pairFormData.label}
                onChange={(e) => setPairFormData({ ...pairFormData, label: e.target.value })}
              />
            </div>
            <div className='form-control'>
              <label className='label'>
                <span className='label-text'>Room / Location</span>
              </label>
              <input
                type='text'
                className='input input-bordered dark:bg-gray-800 dark:text-white'
                value={pairFormData.room}
                onChange={(e) => setPairFormData({ ...pairFormData, room: e.target.value })}
              />
            </div>
          </div>
          <div className='modal-action'>
            <form method='dialog'>
              <button className='btn'>Cancel</button>
              <button type='button' className='btn btn-success text-white ml-2' onClick={handleFinalizePair}>
                Finalize
              </button>
            </form>
          </div>
        </div>
      </dialog>

      {/* Remove Confirmation Modal */}
      <dialog id='remove-confirm-modal' className='modal modal-bottom sm:modal-middle'>
        <div className='modal-box'>
          <h3 className='font-bold text-lg'>Remove Device?</h3>
          <p className='text-sm text-gray-500 dark:text-gray-400 mt-2'>
            {removingDevice?.label || removingDevice?.id}
          </p>
          <p className='text-xs text-gray-400 dark:text-gray-500 mt-1'>This action cannot be undone.</p>
          <div className='modal-action'>
            <form method='dialog'>
              <button className='btn'>Cancel</button>
              <button type='button' className='btn btn-error text-white ml-2' onClick={handleConfirmRemove}>
                Remove
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}
