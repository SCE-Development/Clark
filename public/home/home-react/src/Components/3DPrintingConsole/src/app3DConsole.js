import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
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

  componentDidMount()
  {
    this.get3DForms();
  }

    get3DForms() {
      var request = require( 'superagent' );
      request.get(
          'http://' +
          window.location.hostname +
          ':3000/api/3DPrintingForm/Print3D'
      ).set('Content-Type', 'application/json;charset=utf-8')
      .send()
      .end( function( err, response ){

          if( response && response.status <= 300 ){
            console.log(response);
          } else {

              // Failure
              // TODO: Respond with error
          }
      } );
    }

    ///////GET request ---- NOT WORKING
    callDatabase() {
            //const url2 = "http://localhost:3000/api/3DPrintingForm/GetForm";
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
      <CardTitle>{jsonObject.name}</CardTitle>
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
            <Col>Print Link: {jsonObject.projectLink}</Col>
            <Col>Print Color: {jsonObject.color}</Col>
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
