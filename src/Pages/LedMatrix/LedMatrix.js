import React, { useState } from 'react';
import AnnouncementDashboard from './Components/AnnouncementDashboard';
import LeetCodeLeaderboard from './Components/LeetCodeLeaderboard';
import ClockAndWeatherPage from './Components/ClockAndWeather';

export default function LedMatrix() {
  const [tab, setTab] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('tab') || 'leaderboard'; // tab options: 'leaderboard', 'announcement', 'clock'
  });

  const handleTabChange = (newTab) => {
    setTab(newTab);
    const params = new URLSearchParams(window.location.search);
    params.set('tab', newTab);
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState({}, '', newUrl);
  };

  const BUTTON_CLASSNAME = 'py-2.5 mx-6 text-base border-none rounded-lg text-black cursor-pointer transition-all duration-300 ease-in-out min-w-[200px] max-w-[200px] min-h-[50px] font-medium shadow-md hover:text-white';

  function renderPageContent() {
    if (tab === 'leaderboard') {
      return (
        <LeetCodeLeaderboard/>
      );
    }
    if (tab === 'announcement') {
      return (
        <AnnouncementDashboard/>
      );
    }
    return (
      <ClockAndWeatherPage/>
    );
  }

  return (
    <div className='text-center overview-container bg-gray min-h-[100dvh]'>
      <h1 className='text-gray-700 dark:text-white text-4xl font-bold py-4'>
        SCE LED Matrix
      </h1>
      <h3>This page manages the functions of the LED Matrix</h3>
      <div className='flex flex-row items-center justify-center py-6 w-full'>
        <button
          className={`${BUTTON_CLASSNAME} ${tab === 'leaderboard' ? 'bg-blue-400' : 'bg-blue-700'}`}
          onClick={() => handleTabChange('leaderboard')}
        >
          Leaderboard
        </button>
        <button
          className={`${BUTTON_CLASSNAME} ${tab === 'announcement' ? 'bg-blue-400' : 'bg-blue-700'}`}
          onClick={() => handleTabChange('announcement')}
        >
          Announcement
        </button>
        <button
          className={`${BUTTON_CLASSNAME} ${tab === 'clock' ? 'bg-blue-400' : 'bg-blue-700'}`}
          onClick={() => handleTabChange('clock')}
        >
          Clock & Weather
        </button>
      </div>
      {renderPageContent()}
    </div>
  );
}
