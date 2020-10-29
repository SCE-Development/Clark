import React, { Component } from 'react';
import Header from '../../Components/Header/Header';
import AddItemButtonModal from "./AddItemButtonModal";
import InventoryRow from "./InventoryRow";
import {Table, Button} from "reactstrap";
import {getAllItems, addItem, editItem, deleteItem} from "../../APIFunctions/InventoryItem";
import "./InventoryPage.css";

export default class InventoryPage extends Component {
    constructor(props) {
    super(props);
    this.state = {
      name:"",
      quantity:"",
      description:"",
      inventoryItems:[],
    };
  }

  componentDidMount = async () => {
    console.log("component did mount poggers");
    //Use this for the actual thang
    // const res = await getAllItems();
    // console.log("res here: ", res);
    // if(!res.error){
    //   this.setState({inventoryItems: res.responseData});
    // };

    const testItem = {
      name: "this.state.name11",
      price: "this.state.price",
      stock: "this.state.stock",
      category: "this.state.category",
      description: "this.state.description",
      picture: "this.state.picture"      
    };
    let arr = [];
    arr[0] = testItem;
    arr[1] = testItem;
    arr[2] = testItem;
    this.setState({inventoryItems: arr});
  }

  updateItemName = (e) => {
    this.setState({name: e});
    // console.log("state of name", this.state.name);
  }

  updateItemQuantity = (e) => {
    this.setState({quantity: e});
    // console.log("state of quantity", this.state.quantity);
  }

  updateItemDescription = (e) => {
    this.setState({description: e});
    // console.log("state of description", this.state.description);
  }

  updateItemImage = () => {
    console.log("Hi this is the image update placeholder");
  }

  handleAddItem = async () => {
    console.log("Hi how are you today adding item i see good job");
    console.log("state of name", this.state.name);
    console.log("state of quantity", this.state.quantity);
    console.log("state of description", this.state.description);
    const reqItemToAdd = {
      name: this.state.name,
      price: this.state.price,
      stock: this.state.stock,
      category: this.state.category,
      description: this.state.description,
      picture: this.state.picture
    }
    const res = await addItem(reqItemToAdd); //Token?
    console.log("Res: ", res);
    if(!res.error){
      console.log("Edit successful!");
    }
  }

  handleEditItem = async () => {
    const reqItemToEdit = {
      name: this.state.name,
      price: this.state.price,
      stock: this.state.stock,
      category: this.state.category,
      description: this.state.description,
      picture: this.state.picture    
    }
    const res = await editItem(reqItemToEdit); //Token?
    console.log("Res: ", res);
    if(!res.error){
      console.log("Edit successful!");
    }
  }

  handleDeleteItem = async () => {
    const reqItemToDelete = {
      name: this.state.name,
      price: this.state.price,
      stock: this.state.stock,
      category: this.state.category,
      description: this.state.description,
      picture: this.state.picture    
    }
    const res = await deleteItem(reqItemToDelete);
    if(!res.error){
      console.log("Delete successful!");
    }
  }

  testAPIFunctions = async () =>{
    console.log("Test");
    const res = await getAllItems();
    console.log("res here: ", res);
  }

  render() { 
    const headerProps = {title: "Inventory Page"}; 

    return (
      <div>
        <Header {...headerProps} />
        <div className="spacer" />
        <div className="container">
          <div className="search-bar-container">
            <Button onClick={this.testAPIFunctions}>Test</Button>
            <input className="input-inventory" placeholder="Hi"/>
            <AddItemButtonModal 
              updateItemName = {this.updateItemName}
              updateItemQuantity = {this.updateItemQuantity}
              updateItemDescription = {this.updateItemDescription}
              updateItemImage = {this.updateItemImage}
              handleAddItem = {this.handleAddItem}
              name = {this.state.name}
              quantity = {this.state.quantity}
              description = {this.state.description}
            />
          </div>
          <div className="table-container">
            <Table>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Description</th>
                  <th>Edit</th>
                </tr>
              </thead>
              <tbody>
                {this.state.inventoryItems.map((item, index)=>{
                  return(
                    <InventoryRow
                      key={index}
                      //Name, price, stock, descri, picture
                      name={item.name}
                      price={item.price}
                      stock={item.stock}
                      category={item.category}
                      description={item.description}
                      picture={item.picture}
                      handleEditItem = {this.handleEditItem}
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
 
