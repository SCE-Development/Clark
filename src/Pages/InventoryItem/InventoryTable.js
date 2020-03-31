import React, { Component } from 'react';
import './inventory-table.css';
import ItemList from './ItemList';
import InventoryHeading from './InventoryHeading.js';
// import {Modal, ModalHeader, ModalBody, ModalFooter, Label} from 'reactstrap'
// import EditItemModal from './EditItemModal';
import AddEditModal from './AddEditModal';

class InventoryItem extends Component {
  state = {
    items: [{
      name: 'Chips',
      des: 'Snake to eat when you are hungry',
      cat: 'Snack',
      price: 0.75,
      stock: 123,
    },
    {
      name: 'LED lights',
      des: 'Lights that light up',
      cat: 'Electronics',
      price: 5.25,
      /* eslint max-len: ["error", { "ignoreStrings": true }]*/
      pic: 'https://media.digikey.com/photos/Cree%20Photos/C512A-WNN-CZ0B0151.JPG'
    },
    {
      name: 'Panda',
      des: 'Tasty chocolate to eat',
      cat: 'Snack',
      price: 1.00,
      /* eslint max-len: ["error", { "ignoreUrls": true }]*/
      pic: 'https://images-na.ssl-images-amazon.com/images/I/71sVe6fuvPL._SL1500_.jpg'
    }
    ],
    search: '',
    category: 'All',
    addItemModal: false,
    editItemModal: false,
    editItemIndex: 0
  }

  searchHandler = (event) => {
    this.setState({
      search: event.target.value
    });
  };

  categoryHandler = (event) => {
    this.setState({
      category: event.target.value
    });
  };

  toggleAddItem = () => {
    console.log("toggleAddItem")
    this.setState({
      addItemModal: !this.state.addItemModal
    });
  };

  toggleEditItem = () => {
    this.setState({
      editItemModal: !this.state.editItemModal
    })
  };

  getItem = () => {
    return ({
      name: document.getElementById("nameInput").value,
      des: document.getElementById("desInput").value,
      cat: document.getElementById("catInput").value,
      stock: document.getElementById("stockInput").value,
      price: document.getElementById("priceInput").value,
      pic: document.getElementById("picInput").value
    })
  }
  addItemHandler = () => {
    //check if requried fields are filled in
    var newItem = this.getItem()
    this.setState({
      items: [...this.state.items, newItem]
    })
    this.toggleAddItem()
  }

  editItemHandler = (index) =>{
    this.setState({
      editItemModal: !this.state.editItemModal,
      editItemIndex: index
    });
  }

  editItemSubmit = () => {
    console.log("editItemSubmit")
    var editItem = this.getItem();
    console.log(editItem)
    var newItems = [...this.state.items];
    newItems[this.state.index] = editItem;
    console.log(newItems);
     this.setState({
      items: [...newItems],
      editItemModal: !this.state.editItemModal
    });
  }
  // removeModal = () =>{
  //   if(this.state.modal){
  //     this.setState({
  //       modal: false
  //     });
  //   }
  // };

  render() {
    return (
      <div className='inventoryLayout'>
        <h1>Inventory</h1>
        <AddEditModal
          open = {this.state.addItemModal}
          toggle = {this.toggleAddItem}
          title = "Add Item"
          submitHandler = {this.addItemHandler}
        />

        <AddEditModal
          open = {this.state.editItemModal}
          toggle = {this.toggleEditItem}
          title = "Edit Item"
          submitHandler = {this.editItemSubmit}
          data = {this.state.items[this.state.editItemIndex]}
        />  
        
        <div className = "search-add-container">
          <input placeholder='Search...' className='searchBar'
            onChange={this.searchHandler}>
          </input>
          {/*ADD BUTTON*/}
          <button onClick = {this.toggleAddItem}  className = "addItemButton">
            <svg viewBox="0 0 24 24" width="35" height="35" >
    <path d="M 19 13 h -6 v 6 h -2 v -6 H 5 v -2 h 6 V 5 h 2 v 6 h 6 v 2 Z" />
            </svg>
          </button>
        </div>
        <table className='inventoryTable'>
          <thead>
            <InventoryHeading
              categoryHandler={this.categoryHandler}>
            </InventoryHeading>
          </thead>
          <tbody>
            <ItemList
              category={this.state.category}
              items={this.state.items}
              search={this.state.search}
              edit ={this.editItemHandler }>
            </ItemList>
          </tbody>
        </table>
      </div>
    );
  }

}

export default InventoryItem;
