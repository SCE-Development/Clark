import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, ButtonGroup, Card, CardTitle, CardText, CardBody, Collapse, Form, FormGroup, Label, Input, Container, Row, Col } from 'reactstrap';

export default class Example extends React.Component {

  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = { collapse: false };
  }

  toggle() {
    this.setState({ collapse: !this.state.collapse });
  }


  render() {
    return (
      <Container>
      <Form>
      <br></br>
      
      <br></br>
        
          
          <FormGroup>

          <Card id="Jane" onClick={this.toggle} body inverse style={{ backgroundColor: '#333', borderColor: '#333' }}>
          <CardTitle>Jane Doe</CardTitle>
          <CardText>
            <Row>
              <Col>Username:</Col>
              <Col>E-mail:</Col>
              <Col>Time</Col>
              <Col></Col>
            </Row>
            <Row>
              <Col>JaneDoeSCE</Col>
              <Col>JaneDoe1993@gmail.com</Col>
              <Col>1/12 4:52 PM</Col>
              <Col>
                <ButtonGroup>
                  <Button color="primary">Pending</Button>
                  <Button color="info">In Progress</Button>
                  <Button color="secondary">Completed</Button>
               </ButtonGroup>
              </Col>
            </Row>
          </CardText>
          </Card>
          
          <Collapse isOpen={this.state.collapse}>
          <Card>
            <CardBody>
              <Row>
                <Col>Print Link</Col>
                <Col>Print Color</Col>
              </Row>
            </CardBody>
          </Card>
        </Collapse>
          
         </FormGroup>


         <FormGroup>

          <Card id="John" onClick={this.toggle} body inverse style={{ backgroundColor: '#333', borderColor: '#333' }}>
          <CardTitle>John Smith</CardTitle>
          <CardText>
            <Row>
              <Col>Username:</Col>
              <Col>E-mail:</Col>
              <Col>Time</Col>
              <Col></Col>
            </Row>
            <Row>
              <Col>JohnSmithSCE</Col>
              <Col>JohnSmith1984@gmail.com</Col>
              <Col>1/14 4:52 PM</Col>
              <Col>
                <ButtonGroup>
                  <Button color="primary">Pending</Button>
                  <Button color="info">In Progress</Button>
                  <Button color="secondary">Completed</Button>
               </ButtonGroup>
              </Col>
            </Row>
          </CardText>
          </Card>
          
          <Collapse isOpen={this.state.collapse}>
          <Card>
            <CardBody>
              <Row>
                <Col>Print Link</Col>
                <Col>Print Color</Col>
              </Row>
            </CardBody>
          </Card>
        </Collapse>
          
         </FormGroup>
        
      </Form>
      </Container>
    );
  }
}