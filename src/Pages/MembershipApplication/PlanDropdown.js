import React, { useState } from 'react';
import './register-page.css';
import {
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Input
} from 'reactstrap';

export default function PlanDropdown(props) {
  const [plan, setPlan] = useState();
  const [dropdownOpen, setDropdownOpen] = useState();

  function handlePlanChange(e) {
    props.setPlan(e.target.value);
    setPlan(e.target.value);
  }

  const options = ['Semester', 'Annual'];

  return (
    <>
      <h6>Plan*</h6>
      <ButtonDropdown
        isOpen={dropdownOpen}
        toggle={() => setDropdownOpen(!dropdownOpen)}
      >
        <DropdownToggle caret id='change-and-select-btns'>
          {plan != null ? plan : 'Select membership plan'}
        </DropdownToggle>
        <DropdownMenu id='change-and-select-btns'>
          {options.map((option, index) => {
            return (
              <DropdownItem
                onClick={handlePlanChange}
                key={index}
                value={option}
              >
                {option}
              </DropdownItem>
            );
          })}
        </DropdownMenu>
      </ButtonDropdown>
    </>
  );
}
