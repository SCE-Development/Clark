import React from 'react';
import { Badge, Container } from 'reactstrap';
const enums = require('../../../Enums.js');
import * as countTime from '../../../userTimeTraffic.js';

export default function displayProfile(props) {

  React.useEffect(() =>{
    window.addEventListener('onload', countTime.onLoad);
    document.addEventListener('visibilitychange', countTime.visibilityChange);
    return () => {
      window.removeEventListener('onload', countTime.onLoad);
      document.removeEventListener('visibilitychange',
        countTime.visibilityChange);
    };
  });

  return (
    <div>
      <Container>
        <img
          alt='profile'
          style={{
            position: 'relative',
            height: '300px',
            marginLeft: '10%'
          }}
          src='images/SCE-glow.png'
        />
      </Container>

      <Badge color='primary'>
        {enums.membershipStateToString(props.user.accessLevel)}
      </Badge>
      <h3>
        {props.user.firstName[0].toUpperCase() +
          props.user.firstName.slice(1, props.user.firstName.length) +
          ' ' +
          props.user.lastName[0].toUpperCase() +
          props.user.lastName.slice(1, props.user.lastName.length)}
      </h3>
      <h5>Doorcode: {props.user.doorCode}</h5>
      <h5>Member Since (yyyy-mm-dd): {props.user.joinDate.slice(0, 10)}</h5>
      <h5>
        Expiration on (yyyy-mm-dd):{' '}
        {props.user.membershipValidUntil &&
          props.user.membershipValidUntil.slice(0, 10)}
      </h5>
      <h5>Email: {props.user.email}</h5>
      <h5>Major: {props.user.major}</h5>
      <h5>Pages Print: {props.user.pagesPrinted}/30</h5>
    </div>
  );
}
