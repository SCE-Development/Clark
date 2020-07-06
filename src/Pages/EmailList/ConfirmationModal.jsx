import React, { useState } from "react";
import { Button, Modal, ModalBody, ModalHeader, ModalFooter } from "reactstrap";
import "./email-template.css";

export default function ConfirmationModal(props) {
  const [toggle, setToggle] = useState(false);

  async function handleSendButton() {
    props.handleSend();
    setToggle(!toggle);
  }
  return (
    <React.Fragment>
      <Button
        id="email-template-button"
        onClick={() => setToggle(!toggle)}
        disabled={!props.checkEmptyInputs()}
      >
        Send
      </Button>
      <Modal isOpen={toggle} toggle={() => setToggle(!toggle)}>
        <ModalHeader>Are you sure?</ModalHeader>
        <ModalBody>
          <p>Are you sure you want to send your mail?</p>
          <p>
            There's no going back from here bro like seriously you should double
            check all the good stuff before you click on the send button.
          </p>
        </ModalBody>
        <ModalFooter>
          <Button id="email-conf-button" onClick={() => setToggle(!toggle)}>
            Cancel
          </Button>
          <Button id="email-conf-button" onClick={() => handleSendButton()}>
            Send
          </Button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  );
}
