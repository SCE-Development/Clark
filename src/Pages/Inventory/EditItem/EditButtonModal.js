import React, { useState } from 'react';
import './edit-item.css';
import { Alert, Modal, ModalHeader, ModalBody, ModalFooter, Button } from
<<<<<<< HEAD
  'reactstrap';
import ConfirmationModal from
  '../../../Components/DecisionModal/ConfirmationModal.js';
=======
'reactstrap';
import ConfirmationModal from
'../../../Components/DecisionModal/ConfirmationModal.js';
>>>>>>> 2eca280... add all untracked files
import EditItemForm from './EditItemForm.js';
const svg = require('../SVG');


export default function EditButtonModal(props) {
  const [toggle, setToggle] = useState(false);
  const [deleteModalToggle, setDeleteModalToggle] = useState(false);
  const [errorToggle, setErrorToggle] = useState(false);

  function handleDelete(){
    props.handleDeleteItem(props.item._id);
    setToggle(!toggle);
    props.handleClear();
  }

  const confirmationModalProps = {
    headerText: 'Delete Item?',
    bodyText: 'Item will be removed from the table permanently.',
    confirmText: 'Confirm',
    confirmColor: 'primary',
    cancelText: 'Cancel',
    toggle: () => setDeleteModalToggle(!deleteModalToggle),
    handleConfirmation: () => {
      setDeleteModalToggle(!deleteModalToggle);
      setToggle(!toggle);
      handleDelete();
    },
    open: deleteModalToggle
  };

  function handleConfirmation(){
    if(!props.checkAllInputs()){
      props.handleEditItem(props.item._id);
      setToggle(!toggle);
      props.handleClear();
      setErrorToggle(false);
    } else{
      setErrorToggle(true);
    }

  }

  function toggleDeleteConfirmationModal(){
    setDeleteModalToggle(!deleteModalToggle);
  }

  async function fillInputs(){
    props.updateItemName(props.item.name);
    props.updateItemPrice(props.item.price);
    props.updateItemStock(props.item.stock);
    props.updateItemCategory(props.item.category);
    props.updateItemDescription(props.item.description);
    props.updateItemPicture(props.item.picture);
  }

  function enterModal(){
    fillInputs();
    setToggle(!toggle);
    setErrorToggle(false);
  }

  function escapeModal(){
    setToggle(!toggle);
    setErrorToggle(false);
  }

  return (
    <React.Fragment>
      <button
        className='edit-icon'
        onClick={enterModal}
      >
        {svg.editSymbol()}
      </button>
      <Modal isOpen={toggle} toggle={escapeModal}>
        <ModalHeader toggle={escapeModal}>Edit Item</ModalHeader>
        <ModalBody>
          <EditItemForm
            updateItemName = {props.updateItemName}
            updateItemPrice = {props.updateItemPrice}
            updateItemStock = {props.updateItemStock}
            updateItemCategory = {props.updateItemCategory}
            updateItemDescription = {props.updateItemDescription}
            updateItemPicture = {props.updateItemPicture}
            name = {props.name}
            price = {props.price}
            stock = {props.stock}
            category = {props.category}
            description = {props.description}
            picture = {props.picture}
          />
          <Alert
            color="danger"
            isOpen={errorToggle}
            toggle={()=> setErrorToggle(!errorToggle)}
          >
            An error has occurred! Check your inputs again.
          </Alert>
        </ModalBody>
        <ModalFooter>
          <Button
            onClick={handleConfirmation}
            color='primary'
          >
            Confirm
          </Button>
          <Button
            onClick={toggleDeleteConfirmationModal}
            color='danger'
          >
            Delete
          </Button>
        </ModalFooter>
      </Modal>
      <ConfirmationModal {...confirmationModalProps} />
    </React.Fragment>
  );
}
