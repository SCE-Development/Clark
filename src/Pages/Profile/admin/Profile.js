import React from 'react';
import './editor-form.css';
const enums = require('../../../Enums.js');

export default function displayProfile(props) {
  return (
    <div className='wrapper'>
      <h3>
        {props.user.firstName[0].toUpperCase() +
        props.user.firstName.slice(1, props.user.firstName.length) +
        ' ' +
        props.user.lastName[0].toUpperCase() +
        props.user.lastName.slice(1, props.user.lastName.length)}
      </h3>
      <div>
        <h5> Doorcode: {props.user.doorCode} </h5>
        <h5>
          Member Since (yyyy-mm-dd): {props.user.joinDate.slice(0, 10)}
        </h5>
        <h5> Expiration on (yyyy-mm-dd): {' '}
          {props.user.membershipValidUntil &&
          props.user.membershipValidUntil.slice(0, 10)}
        </h5>
        <h5>
          Email: {props.user.email}
        </h5>
        <h5>
          Major: {props.user.major}
        </h5>
        <h5>
          Pages Print: {props.user.pagesPrinted}/30
        </h5>
      </div>
    </div>
  );
}
