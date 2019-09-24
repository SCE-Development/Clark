import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app3DConsole.css'
import { Button, ButtonGroup, Card, CardTitle, CardText, CardBody, Collapse, Form, FormGroup, Label, Input, Container, Row, Col } from 'reactstrap';

export default class Example extends React.Component {

  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state =
    {
      collapse: false,
      forms: "",
      data: [],
      list: [1,2,3]
    };
  }

  toggle() {
    this.setState({ collapse: !this.state.collapse });
  }


    ///////GET request
    callDatabase() {
            //const url2 = "http://localhost:3000/api/PrintingFormFor3DPrinting/GetForm";
            const url = 'http://' +
                        window.location.hostname +
                        ':3000/api/3DPrintingForm/GetForm'
      fetch(url)
          .then(response => response.json())
            .then( datajson => this.setState({ data: datajson }) );
        return true;
    }

  request_form(jsonObject, key)
  {

      return <FormGroup key = {key}>

      <Card id="Jane" onClick={this.toggle} body inverse style={{ backgroundColor: '#333', borderColor: '#333' }}>

      {/*NAME*/}
      <CardTitle>{jsonObject.name+"'"}s Request</CardTitle>
      <CardText>
        <Row>
          <Col>E-mail/Contact:</Col>
          <Col>Requested Date:</Col>
          <Col>Progress:</Col>
          <Col></Col>
        </Row>
        <Row>
          <Col>{jsonObject.projectContact}</Col>
          <Col id="secondRow">{jsonObject.date}</Col>
          <Col id="secondRow">{jsonObject.progress}</Col>
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
            <Col xs="6" sm="4">Print Link: {jsonObject.projectLink}</Col>
            <Col xs="6" sm="3">Print Color: {jsonObject.color}</Col>
            <Col xs="6" sm="4">Comments: {jsonObject.projectComments}</Col>
          </Row>
        </CardBody>
      </Card>
    </Collapse>

     </FormGroup>
  }


  render() {
    return (
      <Container>
      <Form>
      <br></br>

      <br></br>
        {this.callDatabase()}
        {this.state.data.map((item,key)=>this.request_form(item,key))}



      </Form>
      </Container>
    );
  }
}
