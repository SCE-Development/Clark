import React from 'react';
import {Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';

const EditItemModal = (props) => {
  console.log(props.open)
  return (
    <Modal isOpen={props.open} toggle={props.toggle}>
      <ModalHeader toggle={props.toggle}>Edit Item</ModalHeader>
      <ModalBody className="add-item-body">
        <form>
          <label>Name:</label>
          <input id="nameInput" defaultValue = {props.data.name} type="text"></input>

          <label>Description:</label>
          <input id="desInput" defaultValue ={props.data.des} type="text"></input>

          <label>Price:</label>
          <input id="priceInput" defaultValue = {props.data.price} type="number"></input>

          <label>Stock:</label>
          <input id="stockInput" defaultValue = {props.data.stock} type="number"></input>

          <label>Category:</label>
          <input id="catInput"   defaultValue = {props.data.cat} type="text" required></input>

          <label>Picture URL:</label>
          <input id="picInput" defaultValue = {props.data.pic} type="url"></input>
        </form>
      </ModalBody>
      <ModalFooter>
        {/* <button
          // onClick={this.addItemHandler}>
          Add Item
        </button> */}
      </ModalFooter>
    </Modal>
  )
}

export default EditItemModal;
