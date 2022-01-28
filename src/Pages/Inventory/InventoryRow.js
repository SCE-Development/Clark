import React, { Component } from 'react';
import EditButtonModal from './EditItem/EditButtonModal';
import './InventoryPage.css';
export default class InventoryRow extends Component {
  render() {
    return (
      <tr className = "inventory-row">
        <td className="row-image">
          <div className="table-contents">
            <img
              className='item-image'
              src={this.props.item.picture} alt=''
            />
          </div>
        </td>
        <td className="row-name">
          <div className="table-contents">
            {this.props.item.name}
          </div>
        </td>
        <td className="row-category">
          <div className="table-contents">
            {this.props.item.category}
          </div>
        </td>
        <td className="row-price">
          <div className="table-contents">
            {'$' + this.props.item.price.toFixed(2)}
          </div>
        </td>
        <td className="row-quantity">
          <div className="table-contents">
            {this.props.item.stock}
          </div>
        </td>
        <td className="row-description">
          <div className="table-contents">
            {this.props.item.description}
          </div>
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

