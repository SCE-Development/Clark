import React, { Component } from 'react';
import './NotFoundPage.css';
import { MouseEvent } from 'react';
import passClick from '../../ClickStream/ClickStream.js';

class NotFoundPage extends Component {
  render() {
    return (
      <div className='background'
        onMouseDown={(e) => passClick(e.nativeEvent)}>
        <div className='centered'>
          <h1>There's nobody here.</h1>
          <h1>
            <a href='/'>return to safety</a>
          </h1>
        </div>
      </div>
    );
  }
}

export default NotFoundPage;
