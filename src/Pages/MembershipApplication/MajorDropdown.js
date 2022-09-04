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
  const [inputEnabled, setInputEnabled] = useState(props.inputEnable);
  const [major, setMajor] = useState();
  const [dropdownOpen, setDropdownOpen] = useState();


  function handleMajorChange(e) {
    props.setMajor(e.target.value);
    setMajor(e.target.value);
    setInputEnabled(e.target.value === 'Other');
  }

  const options = ['Computer Engineering', 'Software Engineering', 'Other'];

  return (
    <div id='application-dropdown'>
      {
        props.hideMajorPrompt ||
        <span style={{paddingRight:'10px'}}>Major*</span>
      }
      <ButtonDropdown
        isOpen={dropdownOpen}
        toggle={() => setDropdownOpen(!dropdownOpen)}
      >
        <DropdownToggle caret id='change-and-select-btns 2'>
          {
            !inputEnabled ?
              major || props.defaultMajor || 'Select Major'
              : 'Other'}
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
      {inputEnabled ? (
        <Input
          placeholder='Enter major here...'
          onChange={(e) => props.setMajor(e.target.value)}
        />
      ) : null}
    </div>
  );
}
