import React from 'react';
import './Dropdown.css';

const Dropdown = (
  { options, selected, setSelected, filterBy, title }) => {
  const [isActive, setIsActive] = React.useState(false);

  return (
    <div className='dropdown-user'>
      <div className='dropdown-user-btn' onClick={() => setIsActive(!isActive)}>
        {title + selected} ▾
      </div>
      {isActive && (
        <div className='dropdown-user-content'>
          {options.map((option, i) => (
            < div
              key={i}
              onClick={(e) => {
                // setSelected(option);
                setIsActive(false);
                filterBy(option);
              }}
              className='dropdown-user-item'
            >
              {option}
            </div>
          ))}
        </div>
      )
      }
    </div >
  );
};
export default Dropdown;
