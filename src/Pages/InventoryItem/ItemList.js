import React from 'react';
import Item from './Item';

const ItemList = (props) => {
  return (
    props.items.filter((ele) => {
      return (ele.name.toLocaleLowerCase().includes(props.search.toLowerCase())
        || props.search === '');
    }).filter((ele) => {
      return (ele.cat === props.category || props.category === 'All');
    }).sort((ele, ele2) => {
      return ele.name.localeCompare(ele2.name);
    }).map((ele, index) => {
      return (
        <Item key ={index}
          index ={index}
          name={ele.name}
          des={ele.des}
          price={ele.price}
          stock={ele.stock}
          cat={ele.cat}
          pic={ele.pic}
          edit = {props.edit}
        />
      );
    })
  );
};

export default ItemList;
