import React from 'react';

const enums = require('../../Enums.js');


export default function RoleDropdown(props) {
  return (
    <>
      <label htmlFor="role" className="block text-sm font-medium leading-6">
        Membership Status
      </label>
      <div className="mt-2">
        <select
          id="role" name="role" autoComplete="role-name" className="block w-full rounded-md border-0 py-2   shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
          defaultValue={props.defaultValue}
          onChange={(e) => {
            props.setuserMembership(Number(e.target.value));
          }}
        >
          {Object.keys(enums.membershipState).map((membership) => {
            const numericalValue = enums.membershipState[membership];
            const readableValue = enums.membershipStateToString(numericalValue);
            return (
              <option key={numericalValue} value={numericalValue}>
                {readableValue}
              </option>
            );
          })}
        </select>
      </div>
    </>
  );
}
