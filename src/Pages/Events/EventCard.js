import React from 'react';
import { Row } from 'reactstrap';
import { getDateWithSlashes } from '../../APIFunctions/Event';

function EventCard(props) {
  const {
    title,
    description,
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
      <div className='event-text-block'>
        <div className='event-info'>
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
        </div>
      </div>
    </button>
  );
}

export default EventCard;
