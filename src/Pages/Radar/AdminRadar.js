import { useState, useEffect, useRef, useCallback } from 'react';
import {
  getManagedDevices,
  removePairedDevice,
  getPairCandidates,
  pairFinalize,
  enrollStart,
  enrollCancel,
} from '../../APIFunctions/Radar';

const CANDIDATE_POLL_MS = 5000;
const DEVICE_TYPES = ['phone', 'tablet', 'watch', 'laptop', 'other'];

export default function AdminRadar() {
  const [enrolled, setEnrolled] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [enrollmentActive, setEnrollmentActive] = useState(false);
  const [loadingEnrolled, setLoadingEnrolled] = useState(true);
  const [enrollError, setEnrollError] = useState(null);
  const [enrollStartParams, setEnrollStartParams] = useState({ device_type: 'phone', name: 'new_device' });

  const [finalizingCandidate, setFinalizingCandidate] = useState(null);
  const [finalizeForm, setFinalizeForm] = useState({ public_name: '', device_type: 'phone' });
  const [finalizeLoading, setFinalizeLoading] = useState(false);
  const [finalizeError, setFinalizeError] = useState(null);

  const [removingDevice, setRemovingDevice] = useState(null);
  const [removeLoading, setRemoveLoading] = useState(false);

  const pollRef = useRef(null);

  const fetchEnrolled = useCallback(async () => {
    setLoadingEnrolled(true);
    const res = await getManagedDevices();
    if (!res.error) {
      const rows = res.responseData?.data ?? [];
      setEnrolled(rows.filter(d => d.is_active));
    }
    setLoadingEnrolled(false);
  }, []);

  useEffect(() => {
    fetchEnrolled();
  }, [fetchEnrolled]);

  useEffect(() => {
    if (!enrollmentActive) {
      clearInterval(pollRef.current);
      return;
    }
    const poll = async () => {
      const res = await getPairCandidates();
      if (!res.error) setCandidates(res.responseData?.data ?? []);
    };
    poll();
    pollRef.current = setInterval(poll, CANDIDATE_POLL_MS);
    return () => clearInterval(pollRef.current);
  }, [enrollmentActive]);

  async function handleStartEnrollment() {
    setEnrollError(null);
    const res = await enrollStart(enrollStartParams.device_type, enrollStartParams.name);
    if (!res.error && res.responseData?.ok !== false) {
      setEnrollmentActive(true);
      setCandidates([]);
    } else {
      setEnrollError(res.responseData?.message || 'Failed to start enrollment. Check ESPresense connection.');
    }
  }

  async function handleCancelEnrollment() {
    await enrollCancel();
    setEnrollmentActive(false);
    setCandidates([]);
  }

  function openFinalizeModal(candidate) {
    setFinalizingCandidate(candidate);
    setFinalizeForm({ public_name: candidate.live_name || '', device_type: 'phone' });
    setFinalizeError(null);
    document.getElementById('finalize-modal').showModal();
  }

  async function handleFinalize() {
    if (!finalizeForm.public_name.trim()) {
      setFinalizeError('Display name is required.');
      return;
    }
    setFinalizeLoading(true);
    setFinalizeError(null);
    const res = await pairFinalize({
      public_name: finalizeForm.public_name.trim(),
      device_type: finalizeForm.device_type,
      observed_device_id: finalizingCandidate.observed_device_id,
    });
    setFinalizeLoading(false);
    if (!res.error && res.responseData?.ok) {
      document.getElementById('finalize-modal').close();
      setCandidates(prev => prev.filter(c => c.observed_device_id !== finalizingCandidate.observed_device_id));
      fetchEnrolled();
    } else {
      setFinalizeError(res.responseData?.message || 'Failed to finalize pairing.');
    }
  }

  function openRemoveModal(device) {
    setRemovingDevice(device);
    document.getElementById('remove-modal').showModal();
  }

  async function handleConfirmRemove() {
    setRemoveLoading(true);
    const res = await removePairedDevice(removingDevice.display_name);
    setRemoveLoading(false);
    if (!res.error) {
      document.getElementById('remove-modal').close();
      setEnrolled(prev => prev.filter(d => d.display_name !== removingDevice.display_name));
    }
  }

  function formatTime(ts) {
    if (!ts) return '—';
    return new Date(ts).toLocaleString();
  }

  return (
    <div className='overview-container bg-white dark:bg-gradient-to-r dark:from-gray-800 dark:to-gray-600 min-h-[100dvh]'>
      <h1 className='text-center text-gray-700 dark:text-white text-4xl font-bold py-4'>Radar</h1>

      <div className='mx-6 pb-10 space-y-8'>

        {/* ── Enrollment Panel ── */}
        <div className='card bg-base-100 dark:bg-gray-800 shadow border border-base-200 dark:border-gray-700'>
          <div className='card-body'>
            <div className='flex flex-wrap items-center justify-between gap-3 mb-4'>
              <h2 className='card-title text-gray-700 dark:text-white'>Enrollment</h2>
              <span className={`badge text-white ${enrollmentActive ? 'badge-success' : 'badge-neutral'}`}>
                {enrollmentActive ? 'Scanning…' : 'Idle'}
              </span>
            </div>

            <div className='flex flex-wrap gap-3 items-end mb-4'>
              <div className='form-control'>
                <label className='label py-0'><span className='label-text text-xs dark:text-gray-400'>Device type hint</span></label>
                <select
                  className='select select-bordered select-sm dark:bg-gray-700 dark:text-white'
                  value={enrollStartParams.device_type}
                  onChange={e => setEnrollStartParams(p => ({ ...p, device_type: e.target.value }))}
                  disabled={enrollmentActive}
                >
                  {DEVICE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className='form-control'>
                <label className='label py-0'><span className='label-text text-xs dark:text-gray-400'>ESPresense name hint</span></label>
                <input
                  type='text'
                  className='input input-bordered input-sm dark:bg-gray-700 dark:text-white'
                  value={enrollStartParams.name}
                  onChange={e => setEnrollStartParams(p => ({ ...p, name: e.target.value }))}
                  disabled={enrollmentActive}
                />
              </div>
              <button
                className='btn btn-primary btn-sm'
                onClick={handleStartEnrollment}
                disabled={enrollmentActive}
              >
                Start Enrollment
              </button>
              <button
                className='btn btn-secondary btn-sm'
                onClick={handleCancelEnrollment}
                disabled={!enrollmentActive}
              >
                Cancel
              </button>
            </div>

            {enrollError && (
              <div className='alert alert-error text-sm mb-3'>{enrollError}</div>
            )}

            {/* Candidates table */}
            <div className='flex items-center gap-2 mb-2'>
              <span className='text-sm font-semibold text-gray-600 dark:text-gray-300'>Pairing Candidates</span>
              {enrollmentActive && <span className='loading loading-spinner loading-xs text-primary' />}
            </div>
            {candidates.length === 0 ? (
              <p className='text-sm text-gray-400 dark:text-gray-500 py-3 italic'>
                {enrollmentActive
                  ? 'Scanning — bring your device close to an ESPresense node.'
                  : 'Start enrollment to discover nearby devices.'}
              </p>
            ) : (
              <div className='overflow-x-auto'>
                <table className='min-w-full text-sm text-left text-gray-700 dark:text-gray-300'>
                  <thead className='text-xs uppercase bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400'>
                    <tr>
                      {['Device ID', 'BLE Name', 'Room', 'Last Seen', ''].map((col, i) => (
                        <th key={i} className='px-4 py-2'>{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {candidates.map((c, i) => (
                      <tr key={c.observed_device_id || i} className='border-b dark:border-gray-700'>
                        <td className='px-4 py-2 font-mono text-xs'>{c.observed_device_id}</td>
                        <td className='px-4 py-2 text-xs'>{c.live_name || '—'}</td>
                        <td className='px-4 py-2 text-xs'>{c.room || '—'}</td>
                        <td className='px-4 py-2 text-xs'>{formatTime(c.last_seen_ts)}</td>
                        <td className='px-4 py-2'>
                          <button
                            className='btn btn-xs btn-success text-white'
                            onClick={() => openFinalizeModal(c)}
                          >
                            Pair
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* ── Enrolled Devices ── */}
        <div className='card bg-base-100 dark:bg-gray-800 shadow border border-base-200 dark:border-gray-700'>
          <div className='card-body'>
            <div className='flex items-center justify-between mb-4'>
              <h2 className='card-title text-gray-700 dark:text-white'>
                Enrolled Devices
                <span className='badge badge-neutral ml-1'>{enrolled.length}</span>
              </h2>
              <button
                className='btn btn-sm btn-ghost dark:text-gray-300'
                onClick={fetchEnrolled}
                disabled={loadingEnrolled}
              >
                {loadingEnrolled ? <span className='loading loading-spinner loading-xs' /> : 'Refresh'}
              </button>
            </div>

            <div className='overflow-x-auto'>
              <table className='min-w-full text-sm text-left text-gray-700 dark:text-gray-300'>
                <thead className='text-xs uppercase bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400'>
                  <tr>
                    {['Name', 'Type', 'Observed ID', 'Fingerprint ID', 'Last Room', 'Last Seen', ''].map((col, i) => (
                      <th key={i} className='px-4 py-2'>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {enrolled.length === 0 ? (
                    <tr>
                      <td colSpan={7} className='px-4 py-8 text-center text-gray-400 dark:text-gray-500 italic'>
                        {loadingEnrolled ? 'Loading…' : 'No enrolled devices. Use enrollment above to pair a device.'}
                      </td>
                    </tr>
                  ) : (
                    enrolled.map((d, i) => (
                      <tr key={d.display_name || i} className='border-b dark:border-gray-700'>
                        <td className='px-4 py-2 font-medium text-gray-800 dark:text-gray-100'>{d.display_name}</td>
                        <td className='px-4 py-2 text-xs'>{d.device_type}</td>
                        <td className='px-4 py-2 font-mono text-xs'>{d.observed_device_id || '—'}</td>
                        <td className='px-4 py-2 font-mono text-xs'>{d.fingerprint_device_id || '—'}</td>
                        <td className='px-4 py-2 text-xs'>{d.last_seen_room || '—'}</td>
                        <td className='px-4 py-2 text-xs'>{formatTime(d.last_seen_ts)}</td>
                        <td className='px-4 py-2'>
                          <button
                            className='btn btn-xs btn-error text-white'
                            onClick={() => openRemoveModal(d)}
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
          </div>
        </div>
      </div>

      {/* ── Finalize Pairing Modal ── */}
      <dialog id='finalize-modal' className='modal modal-bottom sm:modal-middle'>
        <div className='modal-box dark:bg-gray-800'>
          <h3 className='font-bold text-lg dark:text-white'>Pair Device</h3>
          {finalizingCandidate && (
            <p className='text-xs font-mono text-gray-400 dark:text-gray-500 mt-1'>
              {finalizingCandidate.observed_device_id}
            </p>
          )}
          <div className='py-4 space-y-4'>
            <div className='form-control'>
              <label className='label'><span className='label-text dark:text-gray-300'>Display Name</span></label>
              <input
                type='text'
                className='input input-bordered dark:bg-gray-700 dark:text-white'
                placeholder="e.g. Alice's Phone"
                value={finalizeForm.public_name}
                onChange={e => setFinalizeForm(f => ({ ...f, public_name: e.target.value }))}
              />
            </div>
            <div className='form-control'>
              <label className='label'><span className='label-text dark:text-gray-300'>Device Type</span></label>
              <select
                className='select select-bordered dark:bg-gray-700 dark:text-white'
                value={finalizeForm.device_type}
                onChange={e => setFinalizeForm(f => ({ ...f, device_type: e.target.value }))}
              >
                {DEVICE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            {finalizeError && <div className='alert alert-error text-sm'>{finalizeError}</div>}
          </div>
          <div className='modal-action'>
            <form method='dialog'>
              <button className='btn dark:text-white' disabled={finalizeLoading}>Cancel</button>
            </form>
            <button
              className='btn btn-success text-white ml-2'
              onClick={handleFinalize}
              disabled={finalizeLoading}
            >
              {finalizeLoading ? <span className='loading loading-spinner loading-sm' /> : 'Confirm Pair'}
            </button>
          </div>
        </div>
      </dialog>

      {/* ── Remove Confirm Modal ── */}
      <dialog id='remove-modal' className='modal modal-bottom sm:modal-middle'>
        <div className='modal-box dark:bg-gray-800'>
          <h3 className='font-bold text-lg dark:text-white'>Remove Device?</h3>
          <p className='text-sm text-gray-500 dark:text-gray-400 mt-2'>
            <span className='font-medium text-gray-700 dark:text-gray-200'>{removingDevice?.display_name}</span> will be unenrolled and removed from BLE tracking.
          </p>
          <div className='modal-action'>
            <form method='dialog'>
              <button className='btn dark:text-white' disabled={removeLoading}>Cancel</button>
            </form>
            <button
              className='btn btn-error text-white ml-2'
              onClick={handleConfirmRemove}
              disabled={removeLoading}
            >
              {removeLoading ? <span className='loading loading-spinner loading-sm' /> : 'Remove'}
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}
