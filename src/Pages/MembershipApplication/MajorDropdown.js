import React, { useState } from 'react';

export default function MajorDropdown(props) {
  const [inputEnabled, setInputEnabled] = useState(props.inputEnable);
  const [major, setMajor] = useState();
  const [dropdownOpen, setDropdownOpen] = useState();


  function handleMajorChange(e) {
    props.setMajor(e.target.value);
    setMajor(e.target.value);
    setInputEnabled(e.target.value === 'Other');
  }

  const options = ['Computer Engineering', 'Software Engineering', 'Computer Science', 'Other'];

  return (
    <div id='application-dropdown'>
      <label htmlFor="major" className="block text-sm font-medium leading-6">
        {
          props.hideMajorPrompt ||
          <span style={{ paddingRight: '10px' }}>Major</span>
        }
      </label>
      <div className="mt-2">
        <select
          id="major" name="major" autoComplete="country-name" className="block w-full rounded-md border-0 py-2   shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
          defaultValue={props.defaultValue}
          onChange={(e) => {
            handleMajorChange(e);
          }}
        >
          {options.map((option, index) => {
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
            placeholder='Enter major here...'
            className="indent-2 block w-full rounded-md border-0 my-4 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:  focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            onChange={(e) => props.setMajor(e.target.value)}
          />
        ) : null}
      </div>
    </div>
  );
}
