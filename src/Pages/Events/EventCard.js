import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import { getDateWithSlashes } from '../../APIFunctions/Event';
import { mapPinSymbol, clockSymbol} from '../Overview/SVG';

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
    <Container
      className='event-container'
      onClick={() => {
        handleClick();
      }}
    >
      <Row className='card-row'>
        <Col>
          <Row className='event-date'>
            {clockSymbol()}{'  '}
            {getDateWithSlashes(eventDate.slice(0, 10))} {startTime} - {endTime}
          </Row>
          <Row className='event-title'>{title}</Row>
          <Row className='event-location'>
            {mapPinSymbol()}
            {eventLocation}
          </Row>
          <Row className='event-desc d-none d-xl-block'>
            {description && description.length > 250 ? (
              <span>{description.substring(0, 250)} ...</span>
            ) : (
              description
            )}
          </Row>
        </Col>
        <Col className='event-image d-none d-xl-block'>
          <p className='image-container'>
            <img id='event-img' src={imageURL} alt='event visual' />
          </p>
        </Col>
      </Row>
    </Container>
  );
}

export default EventCard;
