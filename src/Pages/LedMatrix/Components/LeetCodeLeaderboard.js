import React, { useState } from 'react';

export default function LeetCodeLeaderboard() {

  return (
    <div className='flex flex-col items-center'>
      <h1 className='text-gray-700 dark:text-white text-2xl font-bold py-4'>
        LeetCode Leaderboard
      </h1>
      <div>
        <iframe
          id='led-frame'
          src='http://192.168.69.123:8888'
          title='LED Emulator'
        />
      </div>
    </div>
  );
}
