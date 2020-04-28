import React, { useState } from 'react';
import './register-page.css';
import { Row, FormGroup, Input, Button, Container } from 'reactstrap';
import { memberApplicationState, memberShipPlanToString } from '../../Enums';
import MajorDropdown from './MajorDropdown';
import { registerUser, checkIfUserExists } from '../../APIFunctions/User';
import { sendVerificationEmail } from '../../APIFunctions/Profile';
import GoogleRecaptcha from './GoogleRecaptcha';

export default function MembershipForm(props) {
  const [verified, setVerified] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [major, setMajor] = useState('');
  const [usernameAvailable, setUsernameAvailable] = useState(true);
  const [passwordValid, setPasswordValid] = useState(true);
  const nameFields = [
    {
      label: 'First Name',
      id: 'first-name',
      type: 'text',
      handleChange: e => setFirstName(e.target.value)
    },
    {
      label: 'Last Name',
      id: 'last-name',
      type: 'text',
      handleChange: e => setLastName(e.target.value)
    }
  ];
  const accountFields = [
    {
      label: 'Email',
      class: 'account-input',
      type: 'email',
      addon: !usernameAvailable && (
        <p className='unavailable'>User already exists!</p>
      ),
      handleChange: e => setEmail(e.target.value)
    },
    {
      label: 'Password (8 or more characters)',
      class: 'account-input',
      type: 'password',
      addon: !passwordValid && (
        <p className='unavailable'>
          Password requires one uppercase character and one number.
        </p>
      ),
      handleChange: e => setPassword(e.target.value)
    }
  ];

  async function submitApplication() {
    const userResponse = await checkIfUserExists(email);
    if (userResponse.error) {
      setUsernameAvailable(false);
      return;
    }
    const registrationStatus = await registerUser({
      firstName,
      lastName,
      email,
      password,
      major,
      numberOfSemestersToSignUpFor: props.selectedPlan
    });
    if (!registrationStatus.error) {
      sendVerificationEmail(email, firstName);
      props.setMembershipState(memberApplicationState.CONFIRMATION);
    } else {
      if (registrationStatus.responseData.status === 409) {
        window.alert('Email already exists in the system.');
      } else if (registrationStatus.responseData.status === 400) {
        setPasswordValid(false);
      }
    }
  }

  function requiredFieldsEmpty() {
    return verified && firstName && lastName && email && password.length >= 8;
  }

  return (
    <Container className='background' fluid>
      <div className='form-card'>
        <h1>Membership Application</h1>
        <hr />
        <p>
          Selected Membership Plan: {memberShipPlanToString(props.selectedPlan)}
        </p>
        <span>
          <span color='red'>*</span>= Required field
        </span>
        <Row id='name-field-row'>
          {nameFields.map((input, index) => {
            return (
              <FormGroup key={index}>
                <Input
                  className='name-input membership-input'
                  type={input.type}
                  onChange={input.handleChange}
                  id={input.id}
                  placeholder={`${input.label}*`}
                />
              </FormGroup>
            );
          })}
        </Row>
        <div id='email-input-container'>
          {accountFields.map((input, index) => {
            return (
              <div key={index} className={input.class}>
                <FormGroup>
                  <Input
                    className='membership-input email-input'
                    type={input.type}
                    onChange={input.handleChange}
                    id={input.id}
                    placeholder={`${input.label}*`}
                  />
                  {input.addon}
                </FormGroup>
              </div>
            );
          })}
          <MajorDropdown setMajor={setMajor} />
        </div>
        <div className='recaptcha'>
          <GoogleRecaptcha setVerified={setVerified} />
        </div>
        <div className='transition-button-wrapper'>
          <Button
            id='change-and-select-btns'
            onClick={() =>
              props.setMembershipState(
                memberApplicationState.SELECT_MEMBERSHIP_PLAN
              )}
          >
            Change membership plan
          </Button>
          <Button
            id='submit-btn'
            disabled={!requiredFieldsEmpty()}
            color='primary'
            onClick={submitApplication}
          >
            Submit application
          </Button>
        </div>
        <hr />
        <p id='login'>
          <a href='/login' style={{ fontSize: '120%' }}>
            Switch to Login
          </a>
        </p>
      </div>
    </Container>
  );
}
