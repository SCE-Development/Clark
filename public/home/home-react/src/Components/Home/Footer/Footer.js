import React from 'react';
import { Row, Col } from 'reactstrap';
import Ionicon from 'react-ionicons';
import './Footer.css';

export default () => {
  return (
    <footer className="text-left bg-dark text-white p-4">
      <Row className="footer-text">
        {/*
      	<Col lg="4" md="12" sm="12">
      		<p>Software and Computer Engineering Society</p>
      		<p>San Jose State University</p>
      		<p>Charles W. Davidson College of Engineering</p>
      		<p>Room: E-294</p>
      	</Col>
      	<Col lg="4" md="12" sm="12">
      		<p>General:<a href={"mailto:asksce@gmail.com"} target="_blank" rel="noopener noreferrer"> asksce@gmail.com</a></p>
      		<p>President: <a href={"mailto: pres.sce.sjsu@gmail.com"} target="_blank" rel="noopener noreferrer">pres.sce.sjsu@gmail.com</a></p>
      	</Col>
      	<Col lg="4" md="12" sm="12">
          <p>This page was developed by <a href="https://www.linkedin.com/in/brensantos17/" target="_blank" rel="noopener noreferrer">Bren Santos</a></p>
          <a href="https://www.linkedin.com/company/sjsu-software-computer-engineering-society/"><Ionicon icon="logo-linkedin" fontSize="35px" color="#757575"/></a>
          <a href="https://www.facebook.com/sjsusce/"><Ionicon icon="logo-facebook" fontSize="35px" color="#757575"/></a>
        </Col>
        */}
          <Col>
            <b>Header1</b>
            <p>Info goes here</p>
            <p>More info goes here</p>
            <p>Something else goes here</p>
          </Col>
          <Col>
            <b>Header2</b>
            <p>Info goes here</p>
            <p>More info goes here</p>
            <p>Something else goes here</p>
          </Col>
          <Col>
            <b>Header3</b>
            <p>Info goes here</p>
            <p>More info goes here</p>
            <p>Something else goes here</p>
          </Col>
          <Col>
            <a href="https://www.linkedin.com/company/sjsu-software-computer-engineering-society/"><Ionicon icon="logo-linkedin" fontSize="35px" color="#E1F5FE"/></a>
            <a href="https://www.facebook.com/sjsusce/"><Ionicon icon="logo-facebook" fontSize="35px" color="#E1F5FE"/></a>
            <p>This page was developed by <a href="https://www.linkedin.com/in/brensantos17/" target="_blank" rel="noopener noreferrer">Bren Santos</a></p>
          </Col>
      </Row>
    </footer>
  );
};
