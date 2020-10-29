import React, { useState } from 'react';
import './InventoryPage.css';
import ConfirmationModal from
  '../../Components/DecisionModal/ConfirmationModal.js';
import AddItemForm from "./AddItemForm";
const svg = require('./SVG');


export default function AddItemButtonModal(props) {
  const [toggle, setToggle] = useState(false);
  const confirmationModalProps = {
    headerText: 'Add to inventory?',
    bodyText:
      <React.Fragment>
        <AddItemForm 
          updateItemName = {props.updateItemName}
          updateItemQuantity = {props.updateItemQuantity}
          updateItemDescription = {props.updateItemDescription}
          updateItemImage = {props.updateItemImage}
          name = {props.name}
          quantity = {props.quantity}
          description = {props.description}
        />
      </React.Fragment>,
    confirmText: 'Confirm',
    confirmColor: 'primary',
    cancelText: 'Cancel',
    confirmButtonCSS: 'inv-conf-button',
    toggle: () => setToggle(!toggle),
    handleConfirmation: () => {
      setToggle(!toggle);
      props.handleAddItem();
    },
    open: toggle
  };

  return (
    <React.Fragment>
      <div className="button-div">
          <button
          className='overview-icon'
          onClick={() => {
            setToggle(!toggle);
          }}
        >
          {svg.addSymbol()}
        </button>
      </div>
      
      <ConfirmationModal {...confirmationModalProps} />
    </React.Fragment>
  );
}
