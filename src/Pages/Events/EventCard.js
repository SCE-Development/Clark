import React from 'react';
import { Container, Col } from 'reactstrap';
import { getDateWithSlashes } from '../../APIFunctions/Event';

function EventCard(props) {
  const {
    title,
    description,
    eventDate,
    eventLocation,
    startTime,
    endTime,
    isEventManager,
    handleClick,
    imageURL
  } = props;

  function checkModalStatus(isEventManager) {
    if (isEventManager){
      handleClick();
    }
  }

  return (
    <Container
      className='event-card-button'
      onClick={() => {
        checkModalStatus(isEventManager);
      }}
    >
      <Col className='event-info'>
        <div className='event-title'>{title}</div>
        <div> {description}</div>
        <div><b>DATE </b>
            : {getDateWithSlashes(eventDate.slice(0, 10))}
        </div>
        <div><b>TIME </b>: {startTime} - {endTime}</div>
        <div>
          <b>LOCATION </b>
            : {eventLocation}
        </div>
      </Col>
      <Col id='image-block' >
        <img
          className='event-image'
          src={imageURL} alt=''
        />
      </Col>
    </Container>
  );
}

export default EventCard;
