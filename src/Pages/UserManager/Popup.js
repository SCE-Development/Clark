import React from 'react';
import './PopupCSS.css';

function PopUp(props) {
  return (props.trigger) ? (
    <div className='popup'>
      <div className='popup-inner'>
        <button
          className='close-btn'
          onClick ={ () => props.setTrigger(false)}>
            x
        </button>
        { props.children }
        <button
          className='yes-btn'
          onClick={() => props.deleteUser()}>
            Yes
        </button>
      </div>
    </div>
  ) : '';
}

export default PopUp;
