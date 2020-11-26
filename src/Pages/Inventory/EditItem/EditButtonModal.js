import React, { useState } from 'react';
import './edit-item.css';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import EditItemForm from './EditItemForm.js';
const svg = require('../SVG');


export default function EditButtonModal(props) {
  const [toggle, setToggle] = useState(false);

  function handleConfirmation(){
    props.handleEditItem();
    setToggle(!toggle);
    props.handleClear();
  }

  function handleDelete(){
    props.handleDeleteItem(props.name);
    setToggle(!toggle);
    props.handleClear();
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
  }

  function escapeModal(){
    setToggle(!toggle);
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
        </ModalBody>
        <ModalFooter>
          <Button
            onClick={handleConfirmation}
            id="edit-item-button-confirm"
          >
            Confirm
          </Button>
          <Button
            // color="danger"
            onClick={handleDelete}
            id="edit-item-button-delete"
          >
            Delete
          </Button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  );
}
