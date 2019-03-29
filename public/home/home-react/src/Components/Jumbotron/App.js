import React from 'react';
import { Jumbotron, Button } from 'reactstrap';

const aboutJumbotron = (props) => {

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
        <h1 className="display-3">About SCE</h1>
        <p className="lead"> SJSU Software & Computer Engineering Society is a place for students interested in the fields of computer engineering and software engineering to congregate and collaborate. Operated by student volunteers, our student organization strives to offer a good environment for our future engineers to prosper. Study groups, workshops, info sessions, and social events are provided to members of the Society to help our fellow students improve their academics, develop their skill set, learn more about their disciplines, and grow alongside their colleagues. </p>
      </Jumbotron>
    </div>
  );
};

export default aboutJumbotron;