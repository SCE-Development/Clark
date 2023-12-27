import React, { useEffect, useState } from 'react';
import { Container, Col, Row, Input, Button } from 'reactstrap';

import Header from '../../Components/Header/Header';
import {
  getAllDesserts,
  createDessert,
  deleteDessert,
  editDessert,
} from '../../APIFunctions/Desserts';

export default function DessertPage(props) {
  const [desserts, setDesserts] = useState([]);
  const [description, setDescription] = useState();
  const [name, setName] = useState();
  const [rating, setRating] = useState();

  const [editDessertID, setEditDessertID] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editName, setEditName] = useState('');
  const [editRating, setEditRating] = useState('');

  const [initialEditDescription, setInitialEditDescription] = useState('');
  const [initialEditName, setInitialEditName] = useState('');
  const [initialEditRating, setInitialEditRating] = useState('');

  const handleEditStart = (dessert) => {
    setEditDessertID(dessert._id);
    setEditDescription(dessert.description);
    setEditName(dessert.name);
    setEditRating(dessert.rating);
    setInitialEditDescription(dessert.description);
    setInitialEditName(dessert.name);
    setInitialEditRating(dessert.rating);
  };

  const handleEditCancel = () => {
    setEditDessertID('');
    setEditDescription(initialEditDescription);
    setEditName(initialEditName);
    setEditRating(initialEditRating);
  };

  const handleEditSave = async () => {
    const updatedDessert = {
      name: editName,
      description: editDescription,
      rating: editRating,
      _id: editDessertID,
    };
    const response = await editDessert(updatedDessert, props.user.token);
    if (!response.error) {
      setEditDessertID('');
      setEditDescription('');
      setEditName('');
      setEditRating('');
      setInitialEditDescription('');
      setInitialEditName('');
      setInitialEditRating('');
    }
  };

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
        <Row className="container" style={{ padding: '2em' }}>
          <Col>
            <Input
              placeholder="Name"
              onChange={(e) => setName(e.target.value)}
            />
          </Col>
          <Col>
            <Input
              placeholder="Description"
              onChange={(e) => setDescription(e.target.value)}
            />
          </Col>
          <Col>
            <Input
              placeholder="Rating"
              onChange={(e) => setRating(e.target.value)}
            />
          </Col>
          <Col>
            <Button
              disabled={!name}
              onClick={() => {
                createDessert(
                  {
                    name,
                    description,
                    rating,
                  },
                  props.user.token
                );
                window.location.reload();
              }}
              style={{ width: '10rem' }}
            >
              Submit
            </Button>
          </Col>
        </Row>
        {desserts.map((dessert, index) => {
          return (
            <div key={index}>
              {editDessertID === dessert._id ? (
                <>
                  <Input
                    placeholder="Name"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                  <Input
                    placeholder="Description"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                  />
                  <Input
                    placeholder="Rating"
                    value={editRating}
                    onChange={(e) => setEditRating(e.target.value)}
                  />
                  <Button
                    onClick={() => {
                      handleEditSave(dessert);
                    }}
                  >
                    Save
                  </Button>
                  <Button onClick={handleEditCancel}>Cancel</Button>
                </>
              ) : (
                <>
                  <h1>{dessert.name}</h1>
                  <p>description: {dessert.description}</p>
                  <p>Rating: {dessert.rating}</p>
                  <Button
                    onClick={() => deleteDessert(dessert._id, props.user.token)}
                  >
                    Delete
                  </Button>
                  <Button
                    onClick={() => {
                      handleEditStart(dessert);
                    }}
                  >
                    Edit
                  </Button>
                </>
              )}
            </div>
          );
        })}
      </Container>
    </div>
  );
}
