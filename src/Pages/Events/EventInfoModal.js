import React from 'react';
import {
  Modal,
  ModalHeader,
  Container,
  ModalBody,
  Row,
  Col,
  ModalFooter,
  Button
} from 'reactstrap';
import { getDateWithSlashes } from '../../APIFunctions/Event';
import { clockSymbol, mapPinSymbol} from '../Overview/SVG';

function EventInfoModal(props) {
  const { modal, toggle, currentEvent } = props;
  return (
    <Modal isOpen={modal} toggle={toggle}>
      <ModalHeader toggle={toggle}>
        <Container className='center'>{currentEvent.title}</Container>
      </ModalHeader>
      <ModalBody>
        <Container className='center'>
          <Col>
            <Row className='event-date'>
              {clockSymbol()}{'   '}
              {getDateWithSlashes(currentEvent.eventDate.slice(0, 10))}{'  '}
              {currentEvent.startTime} - {currentEvent.endTime}
            </Row>
          </Col>
          <Col>
            <Row className='event-location'>
              {mapPinSymbol()}
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
  );
}

export default EventInfoModal;
