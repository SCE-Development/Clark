import React, { useState } from 'react';
import './registerPage.css';
import {
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Input,
} from 'reactstrap';

export default function MajorDropdown(props) {
  const [inputEnable, setInputEnable] = useState(props.inputEnable);
  const [major, setMajor] = useState(props.defaultMajor);
  const [dropdownOpen, setDropdownOpen] = useState();

  function handleMajorChange(e) {
    props.setMajor(e.target.value);
    setMajor(e.target.value);
    setInputEnable(e.target.value === 'Other');
  }

  const options = ['Computer Engineering', 'Software Engineering', 'Other'];

  return (
    <div id='application-dropdown'>
      <span style={{paddingRight:'10px'}}>Major*</span>
      <ButtonDropdown
        isOpen={dropdownOpen}
        toggle={() => setDropdownOpen(!dropdownOpen)}
      >
        <DropdownToggle caret id='change-and-select-btns 2'>
          {!inputEnable ? major || 'Select Major' : 'Other'}
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
          onChange={(e) => props.setMajor(e.target.value)}
        />
      ) : null}
    </div>
  );
}
