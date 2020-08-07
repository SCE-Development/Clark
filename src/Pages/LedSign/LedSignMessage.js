import React, { useState } from 'react';
import { CardImg, Card, CardBody, CardTitle } from 'reactstrap';
import './led-sign-message.css';
import trash from './trash.png';

export default function LedSignMessage(props) {
  const [deleted, setIsDeleted] = useState('displayed');

  const deleteMessage = () => {
    setIsDeleted('notDisplayed');
    props.handleDelete(props.text, props.index);
  };

  return (
    <React.Fragment>
      <Card deleted={deleted} className="card-wrapper">
        <CardBody>
          <CardImg
            onClick={() => deleteMessage()}
            className="img-dim"
            src={trash}
            alt="trash-pic"
          />
          <CardTitle>
            <h1 className="title-text">{props.text}</h1>
          </CardTitle>
          <div className="card-words">
            <p className="text-form">
              Brightness:
              <p className='value-info'>{props.brightness}</p>
            </p>
            <p className="text-form">
              Scroll Speed:
              <p className='value-info'>{props.scrollSpeed}</p>
            </p>
            <p className="text-form">
              Background Color:{' '}
              <div
                className="color-bar"
                style={{ backgroundColor: props.backgroundColor }}
              />
            </p>
            <p className="text-form">
              Text Color:{' '}
              <div
                className="color-bar"
                style={{ backgroundColor: props.textColor }}
              />
            </p>
            <p className="text-form">
              Border Color:{' '}
              <div
                className="color-bar"
                style={{ backgroundColor: props.borderColor }}
              />
            </p>
          </div>
        </CardBody>
      </Card>
    </React.Fragment>
  );
}
