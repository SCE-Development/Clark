import React, {Component } from 'react';
import './NotFoundPage.css';
import * as countTime from '../../userTimeTraffic.js';

class NotFoundPage extends Component {

  componentDidMount() {
    window.addEventListener('onload', countTime.onLoad);
    document.addEventListener('visibilitychange',
      countTime.visibilityChange);
  }

  componentWillUnmount() {
    window.removeEventListener('onload', countTime.onLoad);
    document.removeEventListener('visibilitychange',
      countTime.visibilityChange);
  }

  render() {
    return (
      <div className='background'>
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
