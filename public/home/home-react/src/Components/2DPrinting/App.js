import React from 'react';
import Ionicon from 'react-ionicons'
import { NavbarBrand, ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText } from 'reactstrap';
import { Jumbotron, Button } from 'reactstrap';

const Printing = (props) => {

/*
  Jumbotron.propTypes = {
  // Pass in a Component to override default element
  tag: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  fluid: PropTypes.bool,
  className: PropTypes.string
  };

  <hr className="my-2"/>
        <p> </p>
        <p className="lead">
          <Button color="primary">Learn More</Button>
        </p>
  */

  return (
    <div>
      <Jumbotron>
        <h1 className="text-center"><h1 className="display-4">SCE Printing System</h1> </h1>
        <p className="text-center"><p className="lead"> Click on the icon below and upload your file </p></p>
        <p className="text-center"><p className="lead"> Printing may take up to 5 mins </p></p>
      </Jumbotron>
      <Ionicon icon="md-print" fontSize="400px" color="#757575"/>
    </div>
  );
};

export default Printing;
