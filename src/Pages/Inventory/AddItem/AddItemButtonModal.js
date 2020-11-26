import React, { useState } from 'react';
import '../InventoryPage.css';
import './add-item.css';
import ConfirmationModal from
  '../../../Components/DecisionModal/ConfirmationModal.js';
import AddItemForm from './AddItemForm';
const svg = require('../SVG');


export default function AddItemButtonModal(props) {
  const [toggle, setToggle] = useState(false);
  const confirmationModalProps = {
    headerText: 'Add to inventory?',
    bodyText:
      <React.Fragment>
        <AddItemForm
          updateItemName = {props.updateItemName}
          updateItemPrice = {props.updateItemPrice}
          updateItemStock = {props.updateItemStock}
          updateItemCategory = {props.updateItemCategory}
          updateItemDescription = {props.updateItemDescription}
          updateItemPicture = {props.updateItemPicture}
          handleAddItem = {props.handleAddItem}
          name = {props.name}
          price = {props.price}
          stock = {props.stock}
          category = {props.category}
          description = {props.description}
          picture = {props.picture}
        />
      </React.Fragment>,
    confirmText: 'Confirm',
    confirmColor: 'primary',
    cancelText: 'Cancel',
    cancelButtonCSS: 'add-item-button-cancel',
    confirmButtonCSS: 'add-item-button-confirm',
    confirmButtonDisabled: props.checkAllInputs(),
    toggle: () => setToggle(!toggle),
    handleConfirmation: () => {
      setToggle(!toggle);
      props.handleAddItem();
    },
    open: toggle
  };

  // Clear form inputs every time you open the modal
  function enterModal(){
    props.handleClear();
    setToggle(!toggle);
  }

  return (
    <React.Fragment>
      <div className="button-div">
        <button
          className='add-icon'
          onClick={() => {
            enterModal();
          }}
        >
          {svg.addSymbol()}
        </button>
      </div>
      <ConfirmationModal {...confirmationModalProps} />
    </React.Fragment>
  );
}
