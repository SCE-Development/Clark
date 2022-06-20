import React, { useState, useEffect } from 'react';
import { Container, Col, Row, Input, Button } from 'reactstrap';
import { editDessert } from '../../APIFunctions/Desserts';



function EditDessert(props) {
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState(props.dessert.title);
  const [description, setDescription] = useState(props.dessert.description);
  const [rating, setRating] = useState(props.dessert.rating);

  return (
    <div>
      <Button onClick={() => setShow(!show)}>Edit</Button>
      {show && (
        <div>
          <Row className='container' style={{padding: '2em'}}>
            <Col>
              <Input placeholder='title'
                onChange={e => setTitle(e.target.value)}
                defaultValue={props.dessert.title}/>
            </Col>
            <Col>
              <Input placeholder='description'
                onChange={e => setDescription(e.target.value)}
                defaultValue={props.dessert.description} />
            </Col>
            <Col>
              <Input placeholder='rating'
                onChange={e => setRating(e.target.value)}
                defaultValue={props.dessert.rating} />
            </Col>
            <Col>
              <Button disabled={!title} onClick={() => {
                editDessert({
                  title,
                  description,
                  rating,
                  _id: props.dessert._id
                });
                setShow(!show);
              }
              }
              style={{width: '10rem'}}>Submit</Button>
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
}

export default EditDessert;
