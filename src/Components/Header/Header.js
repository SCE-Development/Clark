import React from 'react';
import {
  Jumbotron
} from 'reactstrap';

export default function Header(props) {
  const { title } = props;
  return (
    <Jumbotron>
      <div className='text-center'>
        <h1 className='display-4'>{title}</h1>
      </div>
    </Jumbotron>
  );
}
