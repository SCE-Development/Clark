import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';

export default function ConfirmationModal(props) {
  const { headerText, bodyText, handleConfirmation, open, toggle } = props;

  const confirmText = props.confirmText || 'Confirm';
  const cancelText = props.cancelText || 'Cancel';
  const confirmButtonColor = props.confirmColor || 'danger';
  const confirmButtonCSS = props.confirmButtonCSS || '';
  const cancelButtonCSS = props.cancelButtonCSS || '';
  return (
    <Modal isOpen={open} toggle={toggle}>
      <ModalHeader toggle={toggle}>{headerText}</ModalHeader>
      <ModalBody>{bodyText}</ModalBody>
      <ModalFooter>
        <Button
          color={confirmButtonColor}
          onClick={handleConfirmation}
          id={confirmButtonCSS}
        >
          {confirmText}
        </Button>
        <Button
          onClick={toggle}
          id={cancelButtonCSS}
        >
          {cancelText}
        </Button>
      </ModalFooter>
    </Modal>
  );
}
