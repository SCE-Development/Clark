import React, { Component } from 'react';
import EditButtonModal from "./EditItem/EditButtonModal";
import "./InventoryPage.css";
export default class InventoryRow extends Component {
  constructor(props){
    super(props);
    this.state = {};
  }

  render() { 
    return ( 
      <tr>
        <td>
          <img
            className='item-image'
            src={this.props.picture} alt=''
          />
        </td>
        <td>
          {this.props.name}
        </td>
        <td>
          {this.props.category}
        </td>
        <td>
          {this.props.price}
        </td>
        <td>
          {this.props.stock}
        </td>
        <td>
          {this.props.description}
        </td>
        <td>
          <EditButtonModal
            key={this.props.index}
            updateItemName = {this.props.updateItemName}
            updateItemPrice = {this.props.updateItemPrice}
            updateItemStock = {this.props.updateItemStock}
            updateItemCategory = {this.props.updateItemCategory}
            updateItemDescription = {this.props.updateItemDescription}
            updateItemPicture = {this.props.updateItemPicture}
            handleAddItem = {this.props.handleAddItem}
            checkAllInputs = {this.props.checkAllInputs}
            //Name, price, stock, descri, picture
            name={this.props.name}
            price={this.props.price}
            stock={this.props.stock}
            category={this.props.category}
            description={this.props.description}
            picture={this.props.picture}
            handleEditItem = {this.props.handleEditItem}
            handleDeleteItem = {this.props.handleDeleteItem}
          />
        </td>
      </tr>   
    
    );
  }
}
 
