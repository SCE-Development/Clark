import React from 'react';
import { Container, Col } from 'reactstrap';

function DessertCard(props) {
  const { name, description, rating, isEventManager, handleClick, imageURL } =
    props;

  return (
    <Container className="dessert-card-button">
      <Col className="dessert-info">
        <div className="dessert-name">{name}</div>
        <div> {description}</div>
        <div>
          <b>RATING </b>: {rating}
        </div>
      </Col>
      <Col id="image-block">
        <img className="dessert-image" src={imageURL} alt="" />
      </Col>
    </Container>
  );
}

export default DessertCard;
