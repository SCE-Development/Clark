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
    <React.Fragment>
      <button
        className='event-card-button'
        onClick={() => {
          handleClick();
        }}
      >
        <tbody>
          <td>
            <img id='event-image'
              className='event-image'
              src={imageURL} alt=''
            />
          </td>
          <Row className='event-title'>{title.slice(0, 24)}</Row>
          <Row className='event-date'>
            {clockSymbol()}
            {'  '}
            {getDateWithSlashes(eventDate.slice(0, 10))} {startTime} -
                  {' '}
            {endTime}
          </Row>
          <Row className='event-location'>
            {mapPinSymbol()}
            {eventLocation.slice(0, 28)}
          </Row>
        </tbody>
      </button>
    </React.Fragment>
  );
}

export default EventCard;
