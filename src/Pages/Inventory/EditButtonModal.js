import React, { useState } from 'react';
import './InventoryPage.css';
import ConfirmationModal from
  '../../Components/DecisionModal/ConfirmationModal.js';
const svg = require('./SVG');


export default function EditButtonModal(props) {
  const [toggle, setToggle] = useState(false);
  const confirmationModalProps = {
    headerText: 'Edit this inventory?',
    bodyText:
      <React.Fragment>
        <p>Idk what do you want here big boi</p>
      </React.Fragment>,
    confirmText: 'Confirm',
    confirmColor: 'primary',
    cancelText: 'Cancel',
    confirmButtonCSS: 'inv-conf-button',
    toggle: () => setToggle(!toggle),
    handleConfirmation: () => {
      props.handleEditItem();
      setToggle(!toggle);
      console.log("Confirm!")
    },
    open: toggle
  };

  //Make my own SVG file in Inventory or throw new SVG icon into Overview/SVG.js

  return (
    <React.Fragment>
      <button
          className='overview-icon'
          onClick={() => {
            setToggle(!toggle);
          }}
        >
          {svg.editSymbol()}
        </button>
      <ConfirmationModal {...confirmationModalProps} />
    </React.Fragment>
  );
}
