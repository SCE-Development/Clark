import React, { useRef, useState } from 'react';
import {DEFAULT_PICS} from '../../../Enums.js';
import { MDBCard, MDBCardBody, MDBCardTitle, MDBCardText,
  MDBCardImage, MDBBtn, MDBRipple } from 'mdb-react-ui-kit';
import { Badge, Container } from 'reactstrap';
const enums = require('../../../Enums.js');

export default function displayProfile(props) {
  const [selectedImage, setSelectedImage] = useState(null);
  return (
    <div>
      <MDBCard style={{ maxWidth: '27rem' }}>
        <MDBCardBody>
          <MDBCardTitle class="d-flex justify-content-center fw-bold">
            {props.user.firstName[0].toUpperCase() +
              props.user.firstName.slice(1, props.user.firstName.length) +
              ' ' +
              props.user.lastName[0].toUpperCase() +
              props.user.lastName.slice(1, props.user.lastName.length)}
          </MDBCardTitle>
          <MDBCardText>
            Doorcode: {props.user.doorCode}
          </MDBCardText>
          <MDBCardText>
            Member Since (yyyy-mm-dd): {props.user.joinDate.slice(0, 10)}
          </MDBCardText>
          <MDBCardText>
            Expiration on (yyyy-mm-dd):{' '}
            {props.user.membershipValidUntil &&
              props.user.membershipValidUntil.slice(0, 10)}
          </MDBCardText>
          <MDBCardText>
            Email: {props.user.email}
          </MDBCardText>
          <MDBCardText>
            Major: {props.user.major}
          </MDBCardText>
          <MDBCardText>
            Pages Print: {props.user.pagesPrinted}/30
          </MDBCardText>
        </MDBCardBody>
      </MDBCard>
    </div>

  //   {/* <Badge color='primary'>
  //     {enums.membershipStateToString(props.user.accessLevel)}
  //   </Badge> */}
  //   <h3>
  //     {props.user.firstName[0].toUpperCase() +
  //       props.user.firstName.slice(1, props.user.firstName.length) +
  //       ' ' +
  //       props.user.lastName[0].toUpperCase() +
  //       props.user.lastName.slice(1, props.user.lastName.length)}
  //   </h3>
  //   <h5>Doorcode: {props.user.doorCode}</h5>
  //   <h5>Member Since (yyyy-mm-dd): {props.user.joinDate.slice(0, 10)}</h5>
  //   <h5>
  //     Expiration on (yyyy-mm-dd):{' '}
  //     {props.user.membershipValidUntil &&
  //       props.user.membershipValidUntil.slice(0, 10)}
  //   </h5>
  //   <h5>Email: {props.user.email}</h5>
  //   <h5>Major: {props.user.major}</h5>
  //   <h5>Pages Print: {props.user.pagesPrinted}/30</h5>
  // </div>
  );
}
