import React, { useState } from "react";
import { Spinner, Input, Button, Container } from 'reactstrap';
import './led-sign-message.css';

export default function LedSignMessage(props) {
  const [backgroundColor, setBackgroundColor] = useState("#0000ff");
  const [textColor, setTextColor] = useState("#00ff00");
  const [borderColor, setBorderColor] = useState("#ff0000");

  return (
    <React.Fragment>
      <h1>{props.text}</h1>
      <p>Brightness: {props.brightness}</p>
      <p>Scroll Speed: {props.scrollSpeed}</p>
      <p>Background Color: {props.backgroundColor}</p>
      <Input className='input-bar' />
      <p>Text Color: {props.textColor}</p>
      <Input className='input-bar' />
      <p>Border Color: <Input className='input-bar' {...props.borderColor} /></p>
    </React.Fragment>
  );
}
