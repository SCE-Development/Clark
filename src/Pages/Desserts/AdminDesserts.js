import React, { useEffect, useState } from 'react';

import { getAllDesserts, createDessert, editDessert, deleteDessert } from '../../APIFunctions/Desserts';
import { Container, Row, Col, Input, Button } from 'reactstrap';
import DessertCard from './DessertCard';

export default function DessertPage(props) {
  const [desserts, setDesserts] = useState([]);
  const [description, setDescription] = useState();
  const [title, setTitle] = useState();
  const [rating, setRating] = useState();
  const [modal, setModal] = useState(false);

  async function getDessertsFromDB() {
    const dessertsFromDB = await getAllDesserts();
    if (!dessertsFromDB.error) setDesserts(dessertsFromDB.responseData);
  }

  useEffect(() => {
    getDessertsFromDB();
  }, []);

  function toggle(dessert) {
    setModal(!modal);
  }

  return (
    <div>
      <Container>
        
        <Row className='container' style={{padding: '2em'}}>
          <Col>
            <Input placeholder='Title'
              onChange={e => setTitle(e.target.value)} />
          </Col>
          <Col>
            <Input placeholder='Description'
              onChange={e => setDescription(e.target.value)} />
          </Col>
          <Col>
            <Input placeholder='Rating'
              onChange={e => setRating(e.target.value)} />
          </Col>
          <Col>
            <Button disabled={!title} onClick={() => createDessert({
              title,
              description,
              rating,
            }, props.user.token)}
            style={{width: '10rem'}}>
              Submit
            </Button>
          </Col>
        </Row>
        {desserts.map((dessert, index) => (
          <DessertCard 
            key={index}
            isDessertManager = {false}
            {...dessert}
          />
        ))}
      </Container>
    </div>
  );
}