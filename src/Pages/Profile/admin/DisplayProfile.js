import React from 'react'
const enums = require('../../../Enums.js')
// displaying children of member-board

let toggle = false
let toggleDelete = false

export function displayBoard (user, index) {
  return (
    <tr key={index}>
      <td>
        {user.firstName[0].toUpperCase() +
          user.firstName.slice(1, user.firstName.length) +
          ' ' +
          user.lastName[0].toUpperCase() +
          user.lastName.slice(1, user.lastName.length)}
        {user.middleInitial.trim() !== '' &&
          ' ' + user.middleInitial.toUpperCase() + '.'}
      </td>

      <td>{user.doorCode}</td>

      <td>{user.pagesPrinted}/30</td>

      <td>{this.marks(user.emailVerified)}</td>

      <td>{enums.getKey(enums.membershipStatus, user.accessLevel)}</td>

      <td>
        <button
          className='delete'
          onClick={() => {
            togglerDelete()
          }}
        >
          <svg width='24' height='24' viewBox='0 0 24 24'>
            <path d='M3 6l3 18h12l3-18h-18zm19-4v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.316c0 .901.73 2 1.631 2h5.711z' />
          </svg>
        </button>
      </td>

      <button
        className='delete'
        onClick={() => {
          toggler()
        }}
      >
        <svg width='40' height='40' viewBox='0 0 24 24'>
          <path
            fill='#000000'
            d='M21.7,13.35L20.7,14.35L18.65,12.3L19.65,11.3C19.86,11.09 20.21,11.09
         20.42,11.3L21.7,12.58C21.91,12.79 21.91,13.14 21.7,13.35M12,18.94L18.06,12.88L20.11,14.93L14.06,21H12V18.94M12,14C7.58,14 4,15.79 4,18V20H10V18.11L14,
         14.11C13.34,14.03 12.67,14 12,14M12,4A4,4 0 0,0 8,8A4,4 0 0,0 12,12A4,4 0 0,0 16,8A4,4 0 0,0 12,4Z'
          />
        </svg>
      </button>
    </tr>
  )
}

// Return check mark if true
export function marks (sign) {
  return sign === true ? (
    <svg width='24' height='24' viewBox='0 0 24 24' style={{ fill: 'GREEN' }}>
      <path d='M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z' />
    </svg>
  ) : (
    <svg width='24' height='24' viewBox='0 0 24 24' style={{ fill: 'RED' }}>
      <path d='M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z' />
    </svg>
  )
}

export function getToggle () {
  return toggle
}

export function getToggleDelete () {
  return toggleDelete
}

export function toggler () {
  toggle = !toggle
}

export function togglerDelete () {
  toggleDelete = !toggleDelete
}
