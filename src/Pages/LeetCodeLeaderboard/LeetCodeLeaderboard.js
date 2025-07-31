import React, { useState } from 'react';
import { membershipState } from '../../Enums';

export default function LeetCodeLeaderboard({ user }) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  // Determine if user is admin
  const isAdmin = user?.accessLevel >= membershipState.OFFICER;
  const iframeSrc = `http://192.168.69.123:5173?isAdmin=${isAdmin}`;

  return (
    <div className="fixed inset-0 w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      )}
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white">
          <div className="text-red-500 mb-4">Failed to load LeetCode page</div>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      )}
      <iframe 
        src={iframeSrc}
        className="w-full h-full border-0"
        style={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0 }}
        title="LeetCode Leaderboard"
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
} 