import { useState, useEffect } from 'react';
import { getOccupancyDevices } from '../../APIFunctions/OccupancyMonitor';

const REFRESH_INTERVAL_MS = 30000;

export default function OccupancyMonitor() {
  const [deviceCount, setDeviceCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  async function fetchOccupancy() {
    const res = await getOccupancyDevices();
    if (res.error || !res.responseData) {
      setError(true);
    } else {
      const devices = res.responseData.devices ?? [];
      setDeviceCount(devices.length);
      setError(false);
    }
    setLastUpdated(new Date());
    setLoading(false);
  }

  useEffect(() => {
    fetchOccupancy();
    const interval = setInterval(fetchOccupancy, REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  function renderStatus() {
    if (loading) {
      return (
        <div className='flex flex-col items-center gap-4'>
          <span className='loading loading-spinner loading-lg text-primary' />
          <p className='text-gray-500 dark:text-gray-400'>Checking occupancy...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className='flex flex-col items-center gap-4'>
          <p className='text-xl font-semibold text-gray-700 dark:text-gray-200'>
            Sensor unavailable
          </p>
          <p className='text-gray-500 dark:text-gray-400 text-sm text-center'>
            The occupancy sensor may be offline. Try again later.
          </p>
        </div>
      );
    }

    const isOccupied = deviceCount > 0;
    return (
      <div className='flex flex-col items-center gap-6'>
        <div
          className={`w-40 h-40 rounded-full flex items-center justify-center shadow-lg ${
            isOccupied
              ? 'bg-green-100 dark:bg-green-900'
              : 'bg-gray-100 dark:bg-gray-700'
          }`}
        >
          <span className='text-6xl'>{isOccupied ? '🟢' : '🔴'}</span>
        </div>
        <div className='text-center'>
          <p
            className={`text-3xl font-bold ${
              isOccupied
                ? 'text-green-600 dark:text-green-400'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            {isOccupied ? 'Office is Open' : 'Office is Closed'}
          </p>
          <p className='text-gray-500 dark:text-gray-400 mt-2'>
            {deviceCount === 1
              ? '1 person detected'
              : `${deviceCount} people detected`}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-[100dvh] bg-white dark:bg-gradient-to-r dark:from-gray-800 dark:to-gray-600 flex flex-col items-center justify-center px-4'>
      <div className='max-w-sm w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-10 flex flex-col items-center gap-8'>
        <h1 className='text-2xl font-bold text-gray-800 dark:text-white tracking-tight'>
          SCE Office Occupancy
        </h1>
        {renderStatus()}
        {lastUpdated && !loading && (
          <div className='flex flex-col items-center gap-2'>
            <p className='text-xs text-gray-400 dark:text-gray-500'>
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
            <button
              className='btn btn-sm btn-ghost text-gray-500 dark:text-gray-400'
              onClick={fetchOccupancy}
            >
              Refresh
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
