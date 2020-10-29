import React, { Component } from 'react';
import EditButtonModal from "./EditButtonModal";
export default class InventoryRow extends Component {
  constructor(props){
    super(props);
    this.state = {};
  }

  render() { 
    return ( 
      <tr>
        <td>
          {/* {this.props.image} */}
          Yuhhh
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
            handleEditItem = {this.props.handleEditItem}
          />
        </td>
      </tr>   
    
    );
  }
}
 
