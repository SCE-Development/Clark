import React from 'react';
import { Container, Col } from 'reactstrap';

function DessertCard(props) {
  const {
    name,
    description,
    rating,
    isDessertManager,
    handleClick
  } = props;

  function checkModalStatus(isDessertManager) {
    if (isDessertManager){
      handleClick();
    }
  }

  return (
    <Container
      className='dessert-card-button'
      onClick={() => {
        checkModalStatus(isDessertManager);
      }}
    >
      <Col className='dessert-info'>
        <div className='dessert-name'>{name}</div>
        <div> {description}</div>
        <div>{rating}</div>
      </Col>
    </Container>
  );
}

export default DessertCard;