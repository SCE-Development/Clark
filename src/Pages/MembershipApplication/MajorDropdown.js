import React, { useState } from 'react';
import './register-page.css';
import {
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Input
} from 'reactstrap';

export default function MajorDropdown(props) {
  const [inputEnable, setInputEnable] = useState(props.inputEnable);
  const [major, setMajor] = useState();
  const [dropdownOpen, setDropdownOpen] = useState();

  function handleMajorChange(e) {
    props.setMajor(e.target.value);
    setMajor(e.target.value);
    setInputEnable(e.target.value === 'Other');
  }

  const options = ['Computer Engineering', 'Software Engineering', 'Other'];

  return (
    <>
      <h6>Major*</h6>
      <ButtonDropdown
        isOpen={dropdownOpen}
        toggle={() => setDropdownOpen(!dropdownOpen)}
      >
        <DropdownToggle caret id='change-and-select-btns'>
          {!inputEnable ? major || 'Select major' : 'Other'}
        </DropdownToggle>
        <DropdownMenu id='change-and-select-btns'>
          {options.map((option, index) => {
            return (
              <DropdownItem
                onClick={handleMajorChange}
                key={index}
                value={option}
              >
                {option}
              </DropdownItem>
            );
          })}
        </DropdownMenu>
      </ButtonDropdown>
      {inputEnable ? (
        <Input
          placeholder='Enter major here...'
          onChange={e => props.setMajor(e.target.value)}
        />
      ) : null}
    </>
  );
}
