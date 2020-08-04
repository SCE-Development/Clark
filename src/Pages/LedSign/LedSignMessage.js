import React, { useState } from "react";
import { CardImg, Card, CardBody, CardTitle, Input } from "reactstrap";
import "./led-sign-message.css";
import pencil from "./pencil.png";
import trash from "./trash.png";
import ex from "./ex.png";
import check from "./check.png";

export default function LedSignMessage(props) {
  const [deleted, setIsDeleted] = useState("displayed");
  const [edited, setIsEdited] = useState(false);

  const deleteMessage = () => {
    setIsDeleted("notDisplayed");
  };

  const editMessage = () => {
    setIsEdited(true);
  };

  const saveMessage = () => {
    setIsEdited(false);
    // Here is where we will actually change the information
  };

  const cancelEdit = () => {
    setIsEdited(false);
    // Information doesn't change, edit mode is canceled
  };

  return (
    <React.Fragment>
      <Card deleted={deleted} className="card-wrapper">
        <CardBody>
          {edited ? (
            <CardImg
              onClick={() => saveMessage()}
              className="img-dim"
              src={check}
              alt="check-pic"
            />
          ) : (
            <CardImg
              onClick={() => editMessage()}
              className="img-dim"
              src={pencil}
              alt="pencil-pic"
            />
          )}
          {edited ? (
            <CardImg
              onClick={() => cancelEdit()}
              className="img-dim"
              src={ex}
              alt="ex-pic"
            />
          ) : (
            <CardImg
              onClick={() => deleteMessage()}
              className="img-dim"
              src={trash}
              alt="trash-pic"
            />
          )}
          <CardTitle>
            {edited ? (
              <Input
                type="text"
                className="input-bar"
                placeholder={props.text}
              ></Input>
            ) : (
              <h1>{props.text}</h1>
            )}
          </CardTitle>
          <div className="card-words">
            <p className="text-form">
              Brightness:
              {edited ? (
                <Input
                  type="range"
                  className="input-bar"
                  value={props.brightness}
                ></Input>
              ) : (
                <p className="scroll-text">{props.brightness}</p>
              )}
            </p>
            <p className="text-form">
              Scroll Speed:{" "}
              {edited ? (
                <Input
                  type="range"
                  className="input-bar"
                  value={props.scrollSpeed}
                ></Input>
              ) : (
                <p className="scroll-text">{props.scrollSpeed}</p>
              )}
            </p>
            <p className="text-form">
              Background Color:{" "}
              {edited ? (
                <Input
                  type="color"
                  className="input-bar"
                  value={props.backgroundColor}
                ></Input>
              ) : (
                <div
                  className="color-bar"
                  style={{ backgroundColor: props.backgroundColor }}
                />
              )}
            </p>
            <p className="text-form">
              Text Color:{" "}
              {edited ? (
                <Input
                  type="color"
                  className="input-bar"
                  value={props.textColor}
                ></Input>
              ) : (
                <div
                  className="color-bar"
                  style={{ backgroundColor: props.textColor }}
                />
              )}
            </p>
            <p className="text-form">
              Border Color:{" "}
              {edited ? (
                <Input
                  type="color"
                  className="input-bar"
                  value={props.borderColor}
                ></Input>
              ) : (
                <div
                  className="color-bar"
                  style={{ backgroundColor: props.borderColor }}
                />
              )}
            </p>
          </div>
        </CardBody>
      </Card>
    </React.Fragment>
  );
}
