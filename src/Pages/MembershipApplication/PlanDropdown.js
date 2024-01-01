import React, { useState } from 'react';

import {
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Input,
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
    <div id='application-dropdown'>
      <span style={{ paddingRight: '10px' }}>Plan*</span>
      <ButtonDropdown
        isOpen={dropdownOpen}
        toggle={() => setDropdownOpen(!dropdownOpen)}
      >
        <DropdownToggle caret id='change-and-select-btns 1'>
          {plan != null ? plan : 'Select Membership Plan'}
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
    </div>
  );
}
