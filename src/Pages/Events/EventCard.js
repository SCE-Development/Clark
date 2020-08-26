import React from 'react';
import { Row } from 'reactstrap';
import { getDateWithSlashes } from '../../APIFunctions/Event';
import { mapPinSymbol, clockSymbol } from '../Overview/SVG';

function EventCard(props) {
  const {
    title,
    eventDate,
    eventLocation,
    startTime,
    endTime,
    handleClick,
    imageURL
  } = props;

  return (
    <button
      className='event-card-button'
      onClick={() => {
        handleClick();
      }}
    >
      <img id='event-image'
        className='event-image'
        src={imageURL} alt=''
      />
      <Row className='event-title'>{title}</Row>
      <Row className='event-date'>
        {clockSymbol()}
        {'  '}
        {getDateWithSlashes(eventDate.slice(0, 10))} {startTime} -
        {' '}
        {endTime}
      </Row>
      <Row className='event-location'>
        {mapPinSymbol()}
        {eventLocation}
      </Row>
    </button>
  );
}

export default EventCard;
