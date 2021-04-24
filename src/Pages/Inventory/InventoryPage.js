import React, { Component } from 'react';
import Header from '../../Components/Header/Header';
import AddItemButtonModal from './AddItem/AddItemButtonModal';
import InventoryRow from './InventoryRow';
import {Alert, Table} from 'reactstrap';
import {DEFAULT_PICS} from '../../Enums.js';
import {validateImageURL} from '../../APIFunctions/Image.js';
import {getAllItems, addItem, editItem, deleteItem} from
  '../../APIFunctions/InventoryItem';
import './InventoryPage.css';

export default class InventoryPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alertVisible: false,
      alertMsg: '',
      alertColor: '',
      name: '',
      price: 0,
      stock: 0,
      category: '',
      description: '',
      picture: '',
      inventoryItems:[],
      allInventoryItems:[],
      invalidPicture: DEFAULT_PICS.INVENTORY,
      searchInput: '',
    };
  }

  componentDidMount = async () => {
    this.updateItemList();
  }

  // Get items from db and update list
  updateItemList = async () =>{
    const res = await getAllItems();
    if(!res.error){
      this.setState({allInventoryItems: res.responseData,
        inventoryItems: res.responseData});
    }
  }

  // Used in search function, only search by name
  filterItemList = async () => {
    if(this.state.searchInput === ''){
      this.setState({inventoryItems: this.state.allInventoryItems});
    } else{
      const filteredItems = await this.state.allInventoryItems.filter(item =>
        item.name.toLowerCase().trim().includes(
          this.state.searchInput.toLowerCase().trim()));
      this.setState({inventoryItems: filteredItems});
    }
  }

  updateAlertVisible = () =>{
    this.setState({alertVisible: !this.state.alertVisible});
  }

  updateItemName = (e) => {
    this.setState({name: e});
  }

  updateItemPrice = (e) => {
    this.setState({price: e});
  }

  updateItemStock = (e) => {
    this.setState({stock: e});
  }

  updateItemCategory = (e) => {
    this.setState({category: e});
  }

  updateItemDescription = (e) => {
    this.setState({description: e});
  }

  updateItemPicture = async (e) => {
    this.setState({picture: e});
  }

  updateLoading = (e) => {
    this.setState({loading: e});
  }

  updateSearchInput = (e) => {
    this.setState({searchInput: e}, this.filterItemList);
  }

  // Boolean for disabled prop of Confirm button in AddItemButtonModal
  // Returns false if valid and true if invalid
  checkAllInputs = () =>{
    return (this.state.name==='' || isNaN(this.state.price) ||
      this.state.price < 0 || this.state.stock < 0 ||
      this.state.price==='' || this.state.stock==='' ||
      isNaN(this.state.stock) || this.state.category==='');
  }

  // Function for add item form/modal
  handleAddItem = async () => {
    try {
      await validateImageURL(this.state.picture);
    } catch (error) { // If invalid picture URL, use the default picture
      this.setState({picture: this.state.invalidPicture});
    }
    const reqItemToAdd = {
      name: this.state.name.trim(),
      price: parseFloat(this.state.price).toFixed(2),
      stock: this.state.stock,
      category: this.state.category.trim(),
      description: this.state.description.trim() || 'N/A',
      picture: this.state.picture.trim()
    };
    const res = await addItem(reqItemToAdd, this.props.user.token);
    if(!res.error){
      this.handleClear();
      this.updateItemList();
      const alertText = 'Add was successful!';
      const alertColor = 'success';
      window.setTimeout(() => {
        this.renderAlert(alertText, alertColor);
      }, 500);
    } else{
      const alertText = 'Something went wrong with add! Please make sure ' +
        'your item doesn\'t already exist in the table!';
      const alertColor = 'danger';
      window.setTimeout(() => {
        this.renderAlert(alertText, alertColor);
      }, 500);
    }
  }

  // Function for edit item form/modal in table
  handleEditItem = async (itemId) => {
    const reqItemToEdit = {
      _id: itemId,
      name: this.state.name.trim(),
      price: parseFloat(this.state.price).toFixed(2),
      stock: this.state.stock,
      category: this.state.category.trim(),
      description: this.state.description.trim() || 'N/A',
      picture: this.state.picture.trim() || this.state.invalidPicture
    };
    const res = await editItem(reqItemToEdit, this.props.user.token);
    if(!res.error){
      this.updateItemList();
      const alertText = 'Edit was successful!';
      const alertColor = 'success';
      window.setTimeout(() => {
        this.renderAlert(alertText, alertColor);
      }, 500);
    } else{
      const alertText = 'Something went wrong with edit!';
      const alertColor = 'danger';
      window.setTimeout(() => {
        this.renderAlert(alertText, alertColor);
      }, 500);
    }
  }

  // Function to delete item in edit item form/modal
  handleDeleteItem = async (itemId) => {
    const reqItemToDelete = {
      _id: itemId,
    };
    const res = await deleteItem(reqItemToDelete, this.props.user.token);
    if(!res.error){
      this.updateItemList();
      const alertText = 'Delete was successful!';
      const alertColor = 'success';
      window.setTimeout(() => {
        this.renderAlert(alertText, alertColor);
      }, 500);
    } else{
      const alertText = 'Something went wrong with delete!';
      const alertColor = 'danger';
      window.setTimeout(() => {
        this.renderAlert(alertText, alertColor);
      }, 500);
    }
  }

  // Used to clear form/modal when exiting them
  handleClear = () => {
    this.setState({name: '', price: 0, stock: 0, category: '',
      description: '', picture: ''});
  }

  // Alert Renderer for error/success messages
  renderAlert = (msg, color) =>{
    this.setState({alertColor: color || 'success'});
    this.setState({alertMsg: msg});
    if(this.state.alertVisible === false)
      this.updateAlertVisible();
  }

  render() {
    const headerProps = {title: 'Inventory Page'};
    return (
      <div>
        <Header {...headerProps} />
        <div className="spacer" />
        <Alert
          color={this.state.alertColor}
          isOpen={this.state.alertVisible}
          toggle={this.updateAlertVisible}
        >
          {this.state.alertMsg}
        </Alert>
        <div className="search-bar-container">
          <input
            className="inventory-search-bar"
            placeholder="Filter by item name..."
            value = {this.searchInput}
            onChange = {(e) => this.updateSearchInput(e.target.value)}
          />
          <AddItemButtonModal
            updateItemName = {this.updateItemName}
            updateItemPrice = {this.updateItemPrice}
            updateItemStock = {this.updateItemStock}
            updateItemCategory = {this.updateItemCategory}
            updateItemDescription = {this.updateItemDescription}
            updateItemPicture = {this.updateItemPicture}
            name = {this.state.name}
            price = {this.state.price}
            stock = {this.state.stock}
            category = {this.state.category}
            description = {this.state.description}
            picture = {this.state.picture}
            handleAddItem = {this.handleAddItem}
            handleClear = {this.handleClear}
            checkAllInputs = {this.checkAllInputs}
          />
        </div>
        <div className="table-container">
          <Table className = "inventory-table">
            <thead>
              <tr>
                <th className="row-image">Image</th>
                <th className="row-name">Name</th>
                <th className="row-category">Category</th>
                <th className="row-price">Price</th>
                <th className="row-quantity">Quantity</th>
                <th className="row-description">Description</th>
                <th className="row-edit">Edit</th>
              </tr>
            </thead>
            <tbody>
              {this.state.inventoryItems.map((item, index)=>{
                return(
                  <InventoryRow
                    key={index}
                    updateItemName = {this.updateItemName}
                    updateItemPrice = {this.updateItemPrice}
                    updateItemStock = {this.updateItemStock}
                    updateItemCategory = {this.updateItemCategory}
                    updateItemDescription = {this.updateItemDescription}
                    updateItemPicture = {this.updateItemPicture}
                    name={this.state.name}
                    price={this.state.price}
                    stock={this.state.stock}
                    category={this.state.category}
                    description={this.state.description}
                    picture={this.state.picture}
                    item = {item}
                    handleEditItem = {this.handleEditItem}
                    handleDeleteItem = {this.handleDeleteItem}
                    handleClear = {this.handleClear}
                    checkAllInputs = {this.checkAllInputs}
                  />
                );
              })}
            </tbody>
          </Table>
        </div>
        <div className="spacer" />
      </div>
    );
  }
}

