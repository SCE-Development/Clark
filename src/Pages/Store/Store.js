import React from 'react';
import { Container, Card, CardTitle, CardText, CardImg } from 'reactstrap';
import './Store.css';
const pringles = require('./storePics/pringles.png');


export default function Store() {
  const example = [{
    price: 15,
    stock: 10,
    category: 'snack',
    description: 'Goldfish',
    image: pringles
  },
  {
    price: 15,
    stock: 10,
    category: 'snack',
    description: 'Pringles',
    image: pringles
  },
  {
    price: 15,
    stock: 10,
    category: 'snack',
    description: 'M&Ms',
    image: pringles
  }
  ];
  return (
    <>
      <br />
      <Container>
        <section class='grid'>
          {example.map((object) => {
            return (
              <Card>
                <CardImg src={object.image} />
                <CardTitle className='text-center'>
                  {object.description}
                </CardTitle>
                <CardText>
                  price: {object.price} <br />
                  stock: {object.stock} <br />
                  category: {object.category}
                </CardText>
              </Card>
            );
          }
          )}
        </section>
      </Container>
    </>
  );
}
