import { useState, useEffect } from 'react';
import { getOccupancyDevices } from '../../APIFunctions/OccupancyMonitor';

const REFRESH_INTERVAL_MS = 15000;

export default function AdminOccupancyMonitor() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  async function fetchDevices() {
    setLoading(true);
    const res = await getOccupancyDevices();
    if (res.error || !res.responseData) {
      setError(true);
      setData(null);
    } else {
      setData(res.responseData);
      setError(false);
    }
    setLastUpdated(new Date());
    setLoading(false);
  }

  useEffect(() => {
    fetchDevices();
  }, []);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(fetchDevices, REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const devices = data?.devices ?? [];

  function renderStatusBadge() {
    if (error) {
      return <span className='badge badge-error text-white'>Sensor Offline</span>;
    }
    if (devices.length > 0) {
      return (
        <span className='badge badge-success text-white'>
          Occupied — {devices.length} {devices.length === 1 ? 'person' : 'people'}
        </span>
      );
    }
    return <span className='badge badge-neutral text-white'>Unoccupied</span>;
  }

  function renderDeviceRows() {
    if (error) {
      return (
        <tr>
          <td colSpan={6} className='px-6 py-8 text-center text-gray-500 dark:text-gray-400'>
            Could not reach the occupancy sensor. Check that it is running at localhost:5055.
          </td>
        </tr>
      );
    }
    if (devices.length === 0) {
      return (
        <tr>
          <td colSpan={6} className='px-6 py-8 text-center text-gray-500 dark:text-gray-400'>
            No devices currently detected.
          </td>
        </tr>
      );
    }
    return devices.map((device, index) => (
      <tr
        key={device.mac || index}
        className='bg-white border-b dark:bg-gray-800 dark:border-gray-700'
      >
        <td className='px-6 py-4 text-gray-700 dark:text-white font-mono text-sm'>
          {device.mac}
        </td>
        <td className='px-6 py-4 text-gray-700 dark:text-white text-sm'>
          {device.id}
        </td>
        <td className='px-6 py-4 text-gray-700 dark:text-white text-sm'>
          {device.rssi} dBm
        </td>
        <td className='px-6 py-4 text-gray-700 dark:text-white text-sm'>
          {device['rssi@1m']} dBm
        </td>
        <td className='px-6 py-4 text-gray-700 dark:text-white text-sm'>
          {device.distance != null ? `${device.distance.toFixed(1)} m` : '—'}
        </td>
        <td className='px-6 py-4 text-gray-700 dark:text-white text-sm'>
          {device.int != null ? `${device.int} ms` : '—'}
        </td>
      </tr>
    ));
  }

  return (
    <div className='overview-container bg-white dark:bg-gradient-to-r dark:from-gray-800 dark:to-gray-600 min-h-[100dvh]'>
      <h1 className='text-center text-gray-700 dark:text-white text-4xl font-bold py-4'>
        Occupancy Monitor
      </h1>
      <p className='text-center text-gray-500 dark:text-gray-300 pb-4'>
        Live BLE device tracking for the SCE office
      </p>

      {data && (
        <div className='flex justify-center gap-6 pb-4 text-sm text-gray-500 dark:text-gray-400'>
          <span>Room: <span className='font-medium text-gray-700 dark:text-gray-200'>{data.room}</span></span>
          <span>Firmware: <span className='font-medium text-gray-700 dark:text-gray-200'>{data.firm}</span></span>
        </div>
      )}

      <div className='flex flex-wrap items-center justify-between gap-4 mx-6 mb-4'>
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
            onClick={fetchDevices}
            disabled={loading}
          >
            Refresh
          </button>
        </div>
      </div>

      <div className='overflow-x-auto mx-6'>
        <table className='min-w-full text-sm text-left text-gray-700 dark:text-gray-400'>
          <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
            <tr>
              {['MAC', 'Device ID', 'RSSI', 'RSSI @ 1m', 'Distance', 'Interval'].map((col) => (
                <th key={col} className='px-6 py-3'>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>{renderDeviceRows()}</tbody>
        </table>
      </div>
    </div>
  );
}
