import React from 'react';
import {
  Modal,
  ModalHeader,
  Container,
  ModalBody,
  ModalFooter,
  Button
} from 'reactstrap';

function DessertEditModal(props) {
  const { modal, toggle, currentDessert } = props;
  return (
    <Modal
      isOpen={modal}
      toggle={toggle}
      size='lg'
      centered
    >
      <ModalHeader toggle={toggle}>
        <div>{currentDessert.title}</div>
      </ModalHeader>

      <ModalBody>
        <div>
          {currentEvent.description}
        </div>
      </ModalBody>

      <ModalFooter>
        <Container/>
        <Button color='primary' onClick={toggle}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export default DessertEditModal;