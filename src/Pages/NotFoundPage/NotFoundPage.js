import React, { Component } from 'react';


class NotFoundPage extends Component {
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
