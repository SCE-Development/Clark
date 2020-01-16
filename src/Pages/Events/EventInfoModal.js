import React from 'react'
import {
  Modal,
  ModalHeader,
  Container,
  ModalBody,
  Row,
  Col,
  ModalFooter,
  Button
} from 'reactstrap'
import Ionicon from 'react-ionicons'

function EventInfoModal (props) {
  const { modal, toggle, currentEvent } = props
  return (
    <Modal isOpen={modal} toggle={toggle}>
      <ModalHeader toggle={toggle}>
        <Container className='center'>{currentEvent.title}</Container>
      </ModalHeader>
      <ModalBody>
        <Container className='center'>
          <Col>
            <Row className='event-date'>
              <Ionicon icon='md-time' fontSize='1.5rem' color='#0098ab' />
              {currentEvent.eventDate} {currentEvent.startTime} -{' '}
              {currentEvent.endTime}
            </Row>
          </Col>
          <Col>
            <Row className='event-location'>
              <Ionicon icon='md-pin' fontSize='1.5rem' color='#414141bd' />
              {currentEvent.eventLocation}
            </Row>
          </Col>
          <Row>
            <Col>{currentEvent.description}</Col>
          </Row>
        </Container>
      </ModalBody>
      <ModalFooter>
        <Container className='center' />
        <Button color='primary' onClick={toggle}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default EventInfoModal
