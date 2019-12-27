import React from 'react'
import { Badge } from 'reactstrap'
const enums = require('../../../Enums.js')

export function displayProfile (user, membershipValidUntil) {
  return (
    <div>
      <Badge color='primary'>
        {enums.getKey(enums.membershipStatus, user.accessLevel)}
      </Badge>
      <h3>
        {user.firstName[0].toUpperCase() +
          user.firstName.slice(1, user.firstName.length) +
          ' ' +
          user.lastName[0].toUpperCase() +
          user.lastName.slice(1, user.lastName.length)}
        {user.middleInitial.trim() !== '' &&
          ' ' + user.middleInitial.toUpperCase() + '.'}
      </h3>
      <h5>Doorcode: {user.doorCode}</h5>
      <h5>Member Since (yyyy-mm-dd): {user.joinDate.slice(0, 10)}</h5>
      <h5>Expiration on (yyyy-mm-dd): {membershipValidUntil.slice(0, 10)}</h5>
      <h5>Email: {user.email}</h5>
      <h5>Major: {user.major}</h5>
      <h5>Pages Print: {user.pagesPrinted}/30</h5>
    </div>
  )
}
