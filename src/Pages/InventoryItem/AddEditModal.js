import React from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const AddEditModal = (props) => {
  return (
    <Modal isOpen={props.open} toggle={props.toggle}>
      <ModalHeader toggle={props.toggle}>{props.title}</ModalHeader>
      <ModalBody className="add-item-body">
        <form>
          <label>Name:</label>
          {console.log(props.data)}
          <input id="nameInput" defaultValue = {(props.data) ? props.data.name : ""} type="text"></input>

          <label>Description:</label>
          <input id="desInput" defaultValue ={(props.data) ? props.data.des: ""} type="text"></input>

          <label>Price:</label>
          <input id="priceInput" defaultValue = {(props.data) ? props.data.price: ""} type="number"></input>

          <label>Stock:</label>
          <input id="stockInput" defaultValue = {(props.data) ? props.data.stock: ""} type="number"></input>

          <label>Category:</label>
          <input id="catInput"   defaultValue = {(props.data) ? props.data.cat: ""} type="text" required></input>

          <label>Picture URL:</label>
          <input id="picInput" defaultValue = {(props.data) ? props.data.pic: ""} type="url"></input>
        </form>
      </ModalBody>
      <ModalFooter>
        {(props.title === "Add Item")?
          <button  
            onClick = {props.submitHandler}>
              Add Item
          </button>: 
          <button onClick = {props.submitHandler}>
            Save Changes
          </button>
        }
      </ModalFooter>
    </Modal>
  )
}

export default AddEditModal;
