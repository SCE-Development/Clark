import React, { useState } from 'react';
import { Button } from 'reactstrap';
import './email-template.css';
import ConfirmationModal from
  '../../Components/DecisionModal/ConfirmationModal.js';

export default function SendButtonModal(props) {
  const [toggle, setToggle] = useState(false);
  const confirmationModalProps = {
    headerText: 'Are you sure?',
    bodyText:
      <React.Fragment>
        <p>Are you sure you want to send your mail?</p>
        <p> There's no going back from here. You should
        double check before you click on the send button.</p>
      </React.Fragment>,
    confirmText: 'Send it!',
    confirmColor: 'primary',
    cancelText: 'Cancel',
    confirmButtonCSS: 'email-conf-button',
    toggle: () => setToggle(!toggle),
    handleConfirmation: () => {
      setToggle(!toggle);
      setTimeout(() => {
        props.handleSend();
      }, 300);
    },
    open: toggle
  };

  return (
    <React.Fragment>
      <Button
        id="email-template-button"
        onClick={() => setToggle(!toggle)}
        disabled={!props.checkEmptyInputs()}
      >
        Send
      </Button>
      <ConfirmationModal {...confirmationModalProps} />
    </React.Fragment>
  );
}
