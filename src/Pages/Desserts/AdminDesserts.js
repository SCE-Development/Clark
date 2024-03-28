import React, { useEffect, useState } from 'react';

import { getAllDesserts, createDessert, editDessert, deleteDessert } from '../../APIFunctions/Desserts';
import { Container, Row, Col, Input, Button } from 'reactstrap';

import DessertEditModal from './DessertEditModal';

export default function DessertPage(props) {
  const [desserts, setDesserts] = useState([]);
  const [description, setDescription] = useState();
  const [title, setTitle] = useState();
  const [rating, setRating] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);

  async function getDessertsFromDB() {
    const dessertsFromDB = await getAllDesserts();
    if (!dessertsFromDB.error) setDesserts(dessertsFromDB.responseData);
  }

  const handleEditClick = (dessert) => {
    setIsModalOpen(true); // Open the modal
  };

  const handleSaveChanges = () => {
    // Implement logic to save changes to dessert
    setIsModalOpen(false); // Close the modal after saving changes
  };

  const handleCancel = () => {
    setIsModalOpen(false); // Close the modal without saving changes
  };

  const handleDeleteClick = (dessert) => {
    deleteDessert(dessert, props.user.token); // Call deleteDessert function passing dessert and token
  };

  useEffect(() => {
    getDessertsFromDB();
  }, []);

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
          
          <div key={index}>
            <h1>{dessert.name}</h1>
            <p>description: {dessert.description}</p>
            <Button onClick={() => {
                handleEditClick(dessert);
            }}
            style={{width: '10rem'}}>
              Edit
            </Button>
            <Button onClick={() => {
                handleDeleteClick(dessert);
            }}
            style={{width: '10rem'}}>
              Delete
            </Button>
          </div>
          
        ))}
        
          <DessertEditModal
            isOpen={isModalOpen}
            toggle={() => setIsModalOpen(!isModalOpen)}
            dessert
            onSave={handleSaveChanges}
            onCancel={handleCancel}
          />
        
      </Container>
    </div>
  );
}