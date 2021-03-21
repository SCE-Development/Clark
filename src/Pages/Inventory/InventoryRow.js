import React, { Component } from 'react';
import EditButtonModal from './EditItem/EditButtonModal';
import './InventoryPage.css';
export default class InventoryRow extends Component {
  render() {
    return (
      <tr>
        <td className="row-image">
          <img
            className='item-image'
            src={this.props.item.picture} alt=''
          />
        </td>
        <td className="row-name">
          {this.props.item.name}
        </td>
        <td className="row-category">
          {this.props.item.category}
        </td>
        <td className="row-price">
          {'$'+this.props.item.price.toFixed(2)}
        </td>
        <td className="row-quantity">
          {this.props.item.stock}
        </td>
        <td className = "row-description">
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
            checkAllInputs = {this.props.checkAllInputs}
          />
        </td>
      </tr>
    );
  }
}

