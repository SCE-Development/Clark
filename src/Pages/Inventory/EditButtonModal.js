import React, { useState } from 'react';
import './InventoryPage.css';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
// import EditItemForm from "./EditItemForm.js";
const svg = require('./SVG');


export default function EditButtonModal(props) {
  const [toggle, setToggle] = useState(false);

  function handleConfirmation(){
    props.handleEditItem();
    setToggle(!toggle);
    console.log("Confirm!")
  }

  function handleDelete(){
    props.handleDeleteItem(props.name);
    setToggle(!toggle);   
    console.log("Delete!");
  }

  function toggleModal(){
    setToggle(!toggle);
  }

  return (
    <React.Fragment>
      <button
          className='overview-icon'
          onClick={() => {
            console.log("Hi", props.image);
            setToggle(!toggle);
          }}
        >
          {svg.editSymbol()}
        </button>
      {/* <ConfirmationModal {...confirmationModalProps} /> */}
      <Modal isOpen={toggle} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Edit Item</ModalHeader>
        <ModalBody>
          {/* <EditItemForm 
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
          /> */}
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            onClick={handleConfirmation}
            // id={confirmButtonCSS}
          >
            Confirm
          </Button>
          <Button
            color="danger"
            onClick={handleDelete}
            // id={cancelButtonCSS}
          >
            Delete
          </Button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  );
}
