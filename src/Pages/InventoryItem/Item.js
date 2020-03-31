import React from 'react';

const Item = (props) => {
  return (
    <tr>
      {
        [
          props.name,
          props.des || '----------------',
          props.price,
          props.stock || '----------------',
          props.cat,
          props.pic || "https://upload.wikimedia.org/wikipedia/commons/f/fc/No_picture_available.png"
        ].map((ele, index) => {
          if (index === 5 && ele !== '-') {
            return(<td key={index}>
              <div>
                <img alt="" src={ele} width={100} height={100}></img>
              </div>
            </td>);
          } else {
            return <td key={index}>{ele}</td>;
          }

        })
      }
      <td >
        <button className = "edit-button" onClick = {props.edit.bind(this, props.index)}>
          <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/><path d="M0 0h24v24H0z" fill="none"/></svg>
        </button>
      </td>

    </tr>
  );
};

export default Item;
