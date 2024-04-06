import React from 'react';


export default function ExpirationDropdown(props) {
  /**
   * Checks if current semester is spring or fall. Initializes
   * expDate1 and expDate2 to a String that represents the
   * expiration date for one and two semesters, respectively.
   * @returns {Array<String>} Array of two Strings: expDate1 and expDate2
   */

  function membershipExpDate() {
    const date = new Date();
    let expDate1 = '';
    let expDate2 = '';
    // spring checks if current month is between January and May
    let spring = date.getMonth() >= 0 && date.getMonth() <= 4;
    if (spring) {
      expDate1 = `June 1, ${date.getFullYear()}`;
      expDate2 = `Jan 1, ${date.getFullYear() + 1}`;
    } else {
      expDate1 = `Jan 1, ${date.getFullYear() + 1}`;
      expDate2 = `June 1, ${date.getFullYear() + 1}`;
    }
    return [expDate1, expDate2];
  }
  const expDates = membershipExpDate();
  const membership = [
    { value: 0, name: 'Keep Same' },
    { value: 1, name: 'Expired Membership' },
    { value: 2, name: `This semester (${expDates[0]})` },
    { value: 3, name: `2 semesters (${expDates[1]})` }
  ];

  return (
    <>
      <label htmlFor="membership" className="block text-sm font-medium leading-6  ">Membership Expiration</label>
      <div className="mt-2">
        <select
          id="membership" name="membership" autoComplete="country-name" className="block w-full rounded-md border-0 py-2   shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
          onChange={event => {
            props.setNumberOfSemestersToSignUpFor(event.target.value);
          }}
        >
          {membership.map((x) => (
            <option key={x.value} value={x.value}>
              {x.name}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}
