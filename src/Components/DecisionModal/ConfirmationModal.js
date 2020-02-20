import React from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap'

export default function ConfirmationModal (props) {
  const { headerText, bodyText, handleConfirmation, open, toggle } = props

  const confirmText = props.confirmText || 'Confirm'
  const cancelText = props.cancelText || 'Cancel'
  const confirmButtonColor = props.confirmColor || 'danger'

  return (
    <Modal isOpen={open} toggle={toggle}>
      <ModalHeader toggle={toggle}>{headerText}</ModalHeader>
      <ModalBody>{bodyText}</ModalBody>
      <ModalFooter>
        <Button color={confirmButtonColor} onClick={handleConfirmation}>
          {confirmText}
        </Button>
        <Button onClick={toggle}>{cancelText}</Button>
      </ModalFooter>
    </Modal>
  )
}
