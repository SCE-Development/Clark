import React, { useState } from 'react';

export default function PageSelectDropdown(props) {
  const [inputEnabled, setInputEnabled] = useState(props.inputEnable);

  function handleMajorChange(e) {
    setInputEnabled(e.target.value === 'Custom');
  }

  const options = ['All', 'Custom'];

  return (
    <div>
      <label htmlFor="major" className="block text-sm font-medium leading-6">
        {
          props.hideMajorPrompt ||
          <span style={{ paddingRight: '10px' }}>Pages</span>
        }
      </label>
      <div className="mt-2">
        <select
          id="major" name="major" autoComplete="country-name" className="block w-full rounded-md border-0 py-2   shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
          onChange={(e) => {
            handleMajorChange(e);
          }}
        >
          {options.map((option) => {
            return (
              <option key={option} value={option}>
                {option}
              </option>
            );
          })}
        </select>
        {inputEnabled ? (
          <input
            type="text"
            name="first-name"
            id="first-name"
            placeholder='1-5, 7, 10-12'
            className="indent-2 block w-auto rounded-md border-0 my-4 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:  focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            onChange={(e) => props.setPageRanges(e.target.value)}
          />
        ) : null}
        <p>Note: Prints are black ink only</p>
      </div>
    </div>
  );
}
