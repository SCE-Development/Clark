import React from 'react';
import { Container, Col } from 'reactstrap';

function RFIDCard(props) {
  const {
    name,
    byte,
    created,
    _id,
    lastScanned,
    isRFIDManager,
    handleClick
  } = props;

  function checkModalStatus(isRFIDManager) {
    if (isRFIDManager){
      handleClick();
    }
  }

  return (
    <Container
      className='rfid-card-button'
      onClick={() => {
        checkModalStatus(isRFIDManager);
      }}
    >
      <Col className='rfid-info'>
        <div className='rfid-title'>{name}</div>
        <div><b>RFID-Byte: </b>{byte}</div>
        <div><b>Created On: </b>
          {created.substring(0, 10)}
        </div>
        <div><b>ID: </b>{_id}</div>
        <div><b>Last Scanned On: </b>
          {lastScanned.substring(0, 10) + ' '
          + lastScanned.substring(12, 19)}</div>
      </Col>
    </Container>
  );
}

export default RFIDCard;
