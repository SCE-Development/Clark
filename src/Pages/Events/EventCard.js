import React from 'react'
import { Container, Row, Col } from 'reactstrap'
import Ionicon from 'react-ionicons'

function EventCard (props) {
  const {
    title,
    description,
    eventDate,
    eventLocation,
    startTime,
    endTime,
    handleClick,
    imageURL
  } = props
  return (
    <Container
      className='event-container'
      onClick={() => {
        handleClick()
      }}
    >
      <Row className='card-row'>
        <Col>
          <Row className='event-date'>
            {eventDate} {startTime} - {endTime}
          </Row>
          <Row className='event-title'>{title}</Row>
          <Row className='event-location'>
            <Ionicon icon='md-pin' fontSize='1.5rem' color='#414141bd' />
            {eventLocation}
          </Row>
          <Row className='event-desc d-none d-xl-block'>
            {description.length > 250 ? (
              <span>{description.substring(0, 250)} ...</span>
            ) : (
              description
            )}
          </Row>
        </Col>
        <Col className='event-image d-none d-xl-block'>
          <p>
            <img id='event-img' src={imageURL} alt='event visual' />
          </p>
        </Col>
      </Row>
    </Container>
  )
}

export default EventCard
