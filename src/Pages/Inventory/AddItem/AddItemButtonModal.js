import React, { useState } from 'react';
import '../InventoryPage.css';
import './add-item.css';
import ConfirmationModal from
  '../../../Components/DecisionModal/ConfirmationModal.js';
import AddItemForm from './AddItemForm';
import {Alert} from 'reactstrap';
const svg = require('../SVG');


export default function AddItemButtonModal(props) {
  const [toggle, setToggle] = useState(false);
  const [errorToggle, setErrorToggle] = useState(false);
  const confirmationModalProps = {
    headerText: 'Add to inventory?',
    bodyText:
      <React.Fragment>
        <Alert
          color="danger"
          isOpen={errorToggle}
          toggle={()=> setErrorToggle(!errorToggle)}
        >
          An error has occurred! Check your inputs again.
        </Alert>
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
    toggle: () => {
      setToggle(!toggle);
      setErrorToggle(false);
    },
    handleConfirmation: () => {
      if(!props.checkAllInputs()){
        setToggle(!toggle);
        props.handleAddItem();
        setErrorToggle(false);
      } else{
        setErrorToggle(true);
      }
    },
    open: toggle
  };

  // Clear form inputs every time you open the modal
  function enterModal(){
    props.handleClear();
    setToggle(!toggle);
    setErrorToggle(false);
  }

  return (
    <React.Fragment>
      <div className='button-div'>
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
