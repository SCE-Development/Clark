import React from 'react';
import {
  Modal,
  ModalHeader,
  Container,
  ModalBody,
  Row,
  Col,
  ModalFooter,
  Button,
} from 'reactstrap';
import { getDateWithSlashes } from '../../APIFunctions/Event';
import { clockSymbol, mapPinSymbol } from '../Overview/SVG';

function EventInfoModal(props) {
  const { modal, toggle, currentEvent } = props;
  return (
    <Modal
      isOpen={modal}
      toggle={toggle}
      size='lg'
      aria-labelledby='contained-modal-title-vcenter'
      centered
    >
      <ModalHeader toggle={toggle}>
        <Col>
          <Row className='modal-event-title'>{currentEvent.title}</Row>
        </Col>
        <Col>
          <Row className='modal-event-date'>
            {clockSymbol()}
            {'   '}
            {getDateWithSlashes(currentEvent.eventDate.slice(0, 10))}
            {'  '}
            {currentEvent.startTime} - {currentEvent.endTime}
          </Row>
        </Col>
        <Col>
          <Row className='modal-event-location'>
            {mapPinSymbol()}
            {currentEvent.eventLocation}
          </Row>
        </Col>
      </ModalHeader>

      <ModalBody>
        <Container className='center'>
          <Col>
            <Row>{currentEvent.description}</Row>
          </Col>
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
