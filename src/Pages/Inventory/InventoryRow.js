import React, { Component } from 'react';
import EditButtonModal from './EditItem/EditButtonModal';
import './InventoryPage.css';
export default class InventoryRow extends Component {
  render() {
    return (
      <tr>
        <td>
          <img
            className='item-image'
            src={this.props.item.picture} alt=''
          />
        </td>
        <td>
          {this.props.item.name}
        </td>
        <td>
          {this.props.item.category}
        </td>
        <td>
          {'$'+this.props.item.price}
        </td>
        <td>
          {this.props.item.stock}
        </td>
        <td>
          {this.props.item.description}
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
            name={this.props.name}
            price={this.props.price}
            stock={this.props.stock}
            category={this.props.category}
            description={this.props.description}
            picture={this.props.picture}
            item = {this.props.item}
            handleClear = {this.props.handleClear}
            handleEditItem = {this.props.handleEditItem}
            handleDeleteItem = {this.props.handleDeleteItem}
          />
        </td>
      </tr>
    );
  }
}

