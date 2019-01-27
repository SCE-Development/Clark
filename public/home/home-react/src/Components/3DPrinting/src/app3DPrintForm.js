import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
//import './index.css';
import { Button, Form, FormGroup, Label, Input, Container, Row, Col } from 'reactstrap';

export default class Example extends React.Component {
  render() {
    return (
      <Container>
      <Form>
      <br></br>
      
      <br></br>
        
          
          <FormGroup>
          <Row>
          <Col ><Label for="name">Full Name</Label></Col>
          <Col><Label for="colors"> What color would you like your print to be?</Label></Col>
          </Row>
           
          <Row>
          <Col><Input type="text" name="name" id="name" placeholder="Enter Full Name" /></Col>
          <Col><Input type="select" name="colors" id="colors">
            <option>Any color</option>
            <option>Black</option>
            <option>Blue</option>
            <option>Brown</option>
            <option>Green</option>
            <option>Grey</option>
            <option>Orange</option>
            <option>Red</option>
            <option>Pink</option>
            <option>Purple</option>
            <option>Yellow</option>
            <option>White</option>
            <option>Clear</option>
            
          </Input></Col>
         </Row>
         </FormGroup>
      
       
        <FormGroup>
        <Row>
          
          <Col ><Label for="project">Is this for a school project or a personal project? <br></br>(If a personal project, please explain what it's for)</Label></Col>
          <Col><Label for="url">Please copy the link to the .stl file you would like printed. (NOTE: Maximum print dimensions are 25 x 21 x 21 cm) </Label> </Col>
        </Row> 
          
          
        <Row>
          
          <Col><Input type="text" name="projectType" id="projectType" placeholder="Type of Project" /></Col>
          <Col><Input type="url" name="url" id="url" placeholder="Link to Project File" /></Col>
        </Row>

        </FormGroup>
        
      
        <FormGroup>
        
        <Row>
          <Col>
          <Label for="contact">How would you like to be contacted? (Phone number, email, etc)</Label>
          </Col>
       </Row>

       <Row>
         <Col>
           <Input type="text" name="contact" id="contact" placeholder="Contact Information" />
         </Col>
       </Row>
       </FormGroup>


      
       <FormGroup>
          <Label for="comments"> Do yo have any special comments or requests we should know about?</Label>
          <Input type="text" name="comments" id="comments" placeholder="Comments" />
          </FormGroup>
        
        <FormGroup>
           <Button color="primary">Submit</Button>
        </FormGroup>
        
      </Form>
      </Container>
    );
  }
}

