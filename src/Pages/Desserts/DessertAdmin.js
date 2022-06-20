import React, { useEffect, useState } from 'react';
import Header from '../../Components/Header/Header';
import { createDessert, getAllDesserts } from '../../APIFunctions/Desserts';
import { deleteDessert } from '../../APIFunctions/Desserts';
import { Container, Col, Row, Input, Button } from 'reactstrap';
import EditDessert from './EditDessert';

export default function DessertPage() {
  const [desserts, setDesserts] = useState([]);
  const [description, setDescription] = useState([]);
  const [title, setTitle] = useState([]);
  const [rating, setRating] = useState([]);

  async function getDessertsFromDB() {
    const dessertsFromDB = await getAllDesserts();
    if (!dessertsFromDB.error) {
      setDesserts(dessertsFromDB.responseData);
    }
  }

  useEffect(() => {
    getDessertsFromDB();
  }, []);

  return (
    <div>
      <Header title="Welcome to the Dessert Admin Page!!" />
      <Container>
        <Row className='container' style={{padding: '2em'}}>
          <Col>
            <Input placeholder='title'
              onChange={e => setTitle(e.target.value)} />
          </Col>
          <Col>
            <Input placeholder='description'
              onChange={e => setDescription(e.target.value)} />
          </Col>
          <Col>
            <Input placeholder='rating'
              onChange={e => setRating(e.target.value)} />
          </Col>
          <Col>
            <Button disabled={!title} onClick={() => createDessert({
              title,
              description,
              rating
            })}
            style={{width: '10rem'}}>Submit</Button>
          </Col>
        </Row>
        {desserts.map((dessert, index) => (
          <div key={index}>
            <h1>{dessert.title}
              <EditDessert dessert={dessert}/>
              <Button onClick={() =>
                deleteDessert(dessert)}>Delete</Button>
            </h1>
            <p>description: {dessert.description}</p>
            <p>rating: {dessert.rating}</p>
          </div>
        ))}
      </Container>
    </div>
  );
}

