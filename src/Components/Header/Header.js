import React from 'react';
import {
  Jumbotron
} from 'reactstrap';
import './Header.css';

export default function Header(props) {
  const { title } = props;
  return (
    <Jumbotron className='header-jumbo'>
      <div className='header-text'>{title}</div>
    </Jumbotron>
  );
}
