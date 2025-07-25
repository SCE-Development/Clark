import { useState } from 'react';

const FilterActivityTypes = ({ activityFilters, setActivityFilters }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleActivityFilter = activity => {
    setActivityFilters(prev => (prev.includes(activity) ? prev.filter(a => a !== activity) : [...prev, activity]));
  };

  const activityTypes = [
    'SIGN_UP',
    'LOG_IN',
    'UPDATE_USER',
    'PRINT_PAGE',
    'VERIFY_EMAIL',
    'EMAIL_SENT',
    'CHANGE_PW',
    'RESET_PW',
  ];

  return (
    <div className='relative'>
      <label className='block text-sm font-medium text-gray-300 mb-2'>Filter by Activity Type</label>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className='w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex justify-between items-center'
      >
        <span>{activityFilters.length === 0 ? 'Select activities...' : `${activityFilters.length} selected`}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
        </svg>
      </button>

      {isDropdownOpen && (
        <div className='absolute z-10 w-full mt-1 bg-gray-700 border border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto'>
          <div className='p-2'>
            {activityTypes.map(activity => (
              <label
                key={activity}
                className='flex items-center space-x-2 p-2 hover:bg-gray-600 rounded cursor-pointer'
              >
                <input
                  type='checkbox'
                  checked={activityFilters.includes(activity)}
                  onChange={() => toggleActivityFilter(activity)}
                  className='form-checkbox h-4 w-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500'
                />
                <span className='text-white text-sm'>{activity.replace(/_/g, ' ')}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterActivityTypes;
