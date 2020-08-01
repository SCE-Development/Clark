import React, { useState } from "react";
import { CardImg, Card, CardBody, CardTitle, Input } from "reactstrap";
import "./led-sign-message.css";
import pencil from "./pencil.png";
import trash from "./trash.png";

export default function LedSignMessage(props) {
  const [deleted, setIsDeleted] = useState("displayed");

  const deleteMessage = () => {
    setIsDeleted("notDisplayed");
  };
  return (
    <React.Fragment>
      <Card deleted={deleted} className="card-wrapper">
        <CardBody>
          <CardImg className="img-dim" src={pencil} alt="pencil-pic" />
          <CardImg
            onClick={() => deleteMessage()}
            className="img-dim"
            src={trash}
            alt="trash-pic"
          />
          <CardTitle>
            <h1>{props.text}</h1>
          </CardTitle>
          <div className="card-words">
            <p>Brightness: {props.brightness}</p>
            <p>Scroll Speed: {props.scrollSpeed}</p>
            <p className='color-form'>
              Background Color:{" "}
              <div
                className="color-bar"
                style={{ backgroundColor: props.backgroundColor }}
              />
            </p>
            <p className='color-form'>
              Text Color:{" "}
              <div
                className="color-bar"
                style={{ backgroundColor: props.backgroundColor }}
              />
            </p>
            <p className='color-form'>
              Border Color:{" "}
              <div
                className="color-bar"
                style={{ backgroundColor: props.backgroundColor }}
              />
            </p>
          </div>
        </CardBody>
      </Card>
    </React.Fragment>
  );
}
