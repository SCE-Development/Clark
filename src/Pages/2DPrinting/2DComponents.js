import React from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Container,
} from 'reactstrap';
import { FilePond } from 'react-filepond';

export const PrintMessage = 'Insert or drag your file here';

export const PrintInfo = `Each member can print up to 30 pages a week
Pages left for this week: `;

export const failPrintStatus = `Sorry! Our printing system is down 
at the moment. Please see an officer or try again later`;

export const copyrightMessage = `Created with ❤️ by the SCE Development 
Team | © 2021 Software and Computer Engineering Society at SJSU`;
/* eslint-disable */
export function FileUpload(props) {
  const { filePond, printButton, displayPagesLeft } = props;
  return (
    <Container>
      <div classname="buttons">
        <Button className="paperPrinting printingBtn" href="/2DPrinting">
          Paper Printing
        </Button>
        <Button className="threeDPrinting printingBtn" href="/3DPrintingForm">
          3D Printing
        </Button>
      </div>
      <div className="printInfo">
        <p>
          Each member can print up to 30 pages a week <br /> Pages left for this
          week: <span id="pagesLeft">{displayPagesLeft}</span>
        </p>
        <br />
      </div>
      <FilePond {...filePond} />
      <Button {...printButton}> Print </Button>
      <br />
      <div className="copyrightMessage">
        <p>{copyrightMessage}</p>
      </div>
    </Container>
  );
}

export function StatusModal(props) {
  const {
    headerText,
    bodyText,
    handleConfirmation,
    open,
    toggle,
    confirmText,
    buttonColor,
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
