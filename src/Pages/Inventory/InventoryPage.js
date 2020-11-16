import React, { Component } from 'react';
import Header from '../../Components/Header/Header';
import AddItemButtonModal from "./AddItem/AddItemButtonModal";
import InventoryRow from "./InventoryRow";
import {Alert, Table} from "reactstrap";
import { validateImageURL } from '../../APIFunctions/Image.js';
import {getAllItems, addItem, editItem, deleteItem} from "../../APIFunctions/InventoryItem";
import "./InventoryPage.css";
// import { waitForTick } from 'pdf-lib';

export default class InventoryPage extends Component {
    constructor(props) {
    super(props);
    this.state = {
      alertVisible: false,
      alertMsg: "",
      alertColor:"",
      name:"",
      price:0,
      stock:0,
      category:"",
      description:"",
      picture:"",
      inventoryItems:[],
      invalidPicture: "https://user-images.githubusercontent.com/25803515/99110346-1ce92000-259f-11eb-97df-7ed5c2284ef3.png",
    };
  }

  componentDidMount = async () => {
    console.log("component did mount poggers");
    this.updateItemList();
  }

  updateItemList = async () =>{
    const res = await getAllItems();
    console.log("res here: ", res);
    if(!res.error){
      this.setState({inventoryItems: res.responseData});
    };
  }

  updateAlertVisible = () =>{
    this.setState({alertVisible: !this.state.alertVisible});
  }

  updateItemName = (e) => {
    this.setState({name: e});
    // console.log("state of name", this.state.name);
  }

  updateItemPrice = (e) => {
    this.setState({price: e});
    // console.log("state of description", this.state.description);
  }

  updateItemStock = (e) => {
    this.setState({stock: e});
    // console.log("state of quantity", this.state.quantity);
  }

  updateItemCategory = (e) => {
    this.setState({category: e});
    // console.log("state of description", this.state.description);
  }

  updateItemDescription = (e) => {
    this.setState({description: e});
    // console.log("state of description", this.state.description);
  }

  updateItemPicture = async (e) => {
    this.setState({picture: e})
  }

  //Boolean for disabled prop of Confirm button in AddItemButtonModal
  checkAllInputs = () =>{
    return (this.state.name==="" || isNaN(this.state.price) || isNaN(this.state.stock) || 
            this.state.category==="" || this.state.description==="");
  }
  
  handleAddItem = async () => {
    console.log("Hi how are you today adding item i see good job");
    console.log("state of name", this.state.name);
    console.log("state of price", this.state.price);
    console.log("state of stock", this.state.stock);
    console.log("state of category", this.state.category);
    console.log("state of description", this.state.description);
    console.log("state of picture", this.state.picture);

    let validURL = false;
    try {
      await validateImageURL(this.state.picture)
      validURL = true
    } catch (error) {
      validURL = false;
    }

    if(validURL === true){
      console.log("True");
    }
    else{
      console.log("False");
      this.state.picture = this.state.invalidPicture;
    }

    const reqItemToAdd = {
      name: this.state.name,
      price: this.state.price,
      stock: this.state.stock,
      category: this.state.category,
      description: this.state.description,
      picture: this.state.picture
    }
    const res = await addItem(reqItemToAdd, this.props.user.token);
    
    console.log("Res: ", res);
    if(!res.error){
      this.handleClear();
      this.updateItemList();
      const alertText = "Add was successful!";
      const alertColor = "success";
      window.setTimeout(() => {
        // alert(alertText);
        this.renderAlert(alertText, alertColor);
      }, 500);
    }
    else{
      const alertText = "Something went wrong with add! Please make sure your item doesn't already exist in the table!";
      const alertColor = "danger";
      window.setTimeout(() => {
        // alert(alertText);
        this.renderAlert(alertText, alertColor);
      }, 500);
    }
  }

  handleEditItem = async (index) => {
    console.log(this.state.inventoryItems);
    //can't change name
    const reqItemToEdit = {
      name: this.state.name,
      price: this.state.price,
      stock: this.state.stock,
      category: this.state.category,
      description: this.state.description,
      picture: this.state.picture    
    }
    console.log("Edit this item: ", reqItemToEdit);
    const res = await editItem(reqItemToEdit, this.props.user.token);
    console.log("Res: ", res);
    if(!res.error){
      this.updateItemList();
      const alertText = "Edit was successful!";
      window.setTimeout(() => {
        // alert(alertText);
        this.renderAlert(alertText);
      }, 500);
    }
  }

  handleDeleteItem = async (itemName) => {
    const reqItemToDelete = {
      name: itemName,
    }    
    const res = await deleteItem(reqItemToDelete, this.props.user.token);
    if(!res.error){
      this.updateItemList();
      const alertText = "Delete was successful!";
      const alertColor = "success";
      window.setTimeout(() => {
        // alert(alertText);
        this.renderAlert(alertText, alertColor);
      }, 500);
    }
  }

  handleClear = () => {
    this.setState({name: "", price: 0, stock: 0, category: "", description: "", picture: ""});
  }

  renderAlert = (msg, color) =>{
    this.setState({alertColor: color || "success"});
    this.setState({alertMsg: msg});
    if(this.state.alertVisible === false)
      this.updateAlertVisible();
  }

  render() { 
    const headerProps = {title: "Inventory Page"}; 

    return (
      <div>
        <Header {...headerProps} />
        <div className="spacer" />
        <Alert color={this.state.alertColor} isOpen={this.state.alertVisible} toggle={this.updateAlertVisible}>{this.state.alertMsg}</Alert>
        <div className="container">
          <div className="search-bar-container">
            <input className="inventory-search-bar" placeholder="Start typing to filter..."/>
            <AddItemButtonModal 
              updateItemName = {this.updateItemName}
              updateItemPrice = {this.updateItemPrice}
              updateItemStock = {this.updateItemStock}
              updateItemCategory = {this.updateItemCategory}
              updateItemDescription = {this.updateItemDescription}
              updateItemPicture = {this.updateItemPicture}
              handleAddItem = {this.handleAddItem}
              checkAllInputs = {this.checkAllInputs}
              name = {this.state.name}
              price = {this.state.price}
              stock = {this.state.stock}
              category = {this.state.category}
              description = {this.state.description}
              picture = {this.state.picture}
              errorPictureURL = {this.state.errorPictureURL}
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
                      handleAddItem = {this.handleAddItem}
                      checkAllInputs = {this.checkAllInputs}
                      //Name, price, stock, description, picture
                      name={item.name}
                      price={item.price}
                      stock={item.stock}
                      category={item.category}
                      description={item.description}
                      picture={item.picture}
                      handleEditItem = {this.handleEditItem.bind(this, index)}
                      handleDeleteItem = {this.handleDeleteItem}
                    />
                  );
                })}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    );
  }
}
 
