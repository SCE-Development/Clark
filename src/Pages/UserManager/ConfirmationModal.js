import React, { useState } from 'react';
import
{
  Button,
  Modal, ModalHeader,
  ModalBody,
  ModalFooter
} from 'reactstrap';

export default function ConfirmationModal(props){
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);

  const closeButton = (
    <button
      type="button"
      className="btn-close"
      aria-label="Close"
      onClick={()=> props.toggle()}>

    </button>
  );
  return (
    <Modal isOpen={props.modal} centered toggle={props.toggle}>
      <ModalHeader toggle={toggle} close={closeButton}>
        {props.modalTitle}
      </ModalHeader>
      <ModalBody style={{ textAlign: 'center' }}>
        {props.modalContent}
      </ModalBody>
      <ModalFooter>
        <Button
          color="primary"
          onClick={()=>{
            props.toggle();
            props.buttonFunction();
          }}>
          {props.buttonText}
        </Button>
      </ModalFooter>
    </Modal>
  );
}
