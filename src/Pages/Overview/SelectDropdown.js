import React, { useState } from 'react';

/**
 * Single-select dropdown styled to match the activity filter on the Audit Log
 * page. Closes once an option is picked.
 *
 * The options panel is absolutely positioned, so the caller is responsible for
 * placing this inside an element with `relative` and a width.
 *
 * @param {string} label Rendered above the trigger button. Optional.
 * @param {{value: *, label: string}[]} options
 * @param {*} value The currently selected option's value
 * @param {function} onChange Called with the newly selected option's value
 * @param {boolean} disabled
 */
export default function SelectDropdown({
  label,
  options,
  value,
  onChange,
  disabled = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(option => option.value === value);

  return (
    <>
      {label && (
        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
          {label}
        </label>
      )}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className='w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex justify-between items-center'
      >
        <span>{selectedOption ? selectedOption.label : ''}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
        </svg>
      </button>

      {isOpen && (
        <div className='absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto'>
          <div className='p-2'>
            {options.map(option => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left text-sm p-2 rounded cursor-pointer text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 ${option.value === value ? 'bg-gray-100 dark:bg-gray-600' : ''}`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
