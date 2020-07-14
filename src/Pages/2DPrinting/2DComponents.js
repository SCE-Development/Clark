import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';

export function StatusModal(props) {
  const {
    headerText,
    bodyText,
    handleConfirmation,
    open,
    toggle,
    confirmText,
    buttonColor
  } = props;

  return (
    <Modal isOpen={open} toggle={toggle}>
      <ModalHeader toggle={toggle}>{headerText}</ModalHeader>
      <ModalBody>{bodyText}</ModalBody>
      <ModalFooter>
        <Button color={buttonColor} onClick={handleConfirmation}>
          {confirmText}
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export const PrintIcon = `Drag & Drop or Touch Here <br />
<svg aria-hidden='true' viewBox='0 0 512 512' width='40%'>
<path
  d='M399.95 160h-287.9C76.824 160 48 188.803 48
  224v138.667h79.899V448H384.1v-85.333H464V224c0-35.197-28.825-64-64.05-64zM352
  416H160V288h192v128zm32.101-352H127.899v80H384.1V64z'
  />
</svg>`;

export const PrintInfo = `Welcome to printing! Click the icon below 
and upload your file. Each member can print up to 30 pages a week.`;

export const failPrintStatus = `Sorry! Our printing system is down 
at the moment. Please see an officer or try again later`;
