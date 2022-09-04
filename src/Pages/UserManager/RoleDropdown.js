import React from 'react';
import {
  FormGroup,
  Input,
  Label,
} from 'reactstrap';

const enums = require('../../Enums.js');


export default function RoleDropdown(props) {
  return (
    <FormGroup tag='fieldset'>
      <legend>Membership Status</legend>
      {Object.keys(enums.membershipState).map(
        (membership, index) => {
          const numericalValue = enums.membershipState[membership];
          const readableValue = enums.membershipStateToString(numericalValue);
          return (
            <FormGroup check key={index}>
              <Label check>
                <Input
                  type='radio'
                  name='radio1'
                  checked={numericalValue === props.defaultValue}
                  onChange={() => {
                    props.setuserMembership(numericalValue);
                  }}
                />
                {readableValue}
              </Label>
            </FormGroup>
          )
        }
      )}
    </FormGroup>
  );
}
