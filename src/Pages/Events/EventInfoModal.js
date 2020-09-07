import React from 'react';
import {
  Modal,
  ModalHeader,
  Container,
  ModalBody,
  ModalFooter,
  Button
} from 'reactstrap';
import { getDateWithSlashes } from '../../APIFunctions/Event';
import { clockSymbol, mapPinSymbol } from '../Overview/SVG';

function EventInfoModal(props) {
  const { modal, toggle, currentEvent } = props;
  return (
    <Modal className = 'modal-event-border'
      isOpen={modal}
      toggle={toggle}
      size='lg'
      centered
    >
      <ModalHeader toggle={toggle}>
        <div className='modal-event-title'>{currentEvent.title}</div>
        <div className='modal-event-date'>
          {clockSymbol()}
          {' '}
          {getDateWithSlashes(currentEvent.eventDate.slice(0, 10))}
          {' '}
          {currentEvent.startTime} - {currentEvent.endTime}
        </div>
        <div className='modal-event-location'>
          {mapPinSymbol()}
          {' '}
          {currentEvent.eventLocation}
        </div>
      </ModalHeader>

      <ModalBody>
        <div className='modal-event-description'>
          {currentEvent.description}
        </div>
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
