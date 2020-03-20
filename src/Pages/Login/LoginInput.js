import React, { useState } from 'react';

export default function InputBox(props) {
  const [style, setStyle] = useState({});
  const animatedCSS = {
    top: '-5px',
    borderBottom: '2px solid GREEN'
  };

  return (
    <div
      style={style}
      onFocus={() => {
        setStyle(animatedCSS);
      }}
      onBlur={() => {
        setStyle({});
      }}
      className='txtb'
    >
      <span />
      <input
        type={props.field.type}
        name={props.field.type}
        placeholder={props.field.placeholder}
        value={props.field.value}
        onChange={props.field.handleChange}
        required
      />
    </div>
  );
}
