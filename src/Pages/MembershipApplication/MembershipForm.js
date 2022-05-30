import React, { useState } from 'react';
import './register-page.css';
import { Row, Form, FormGroup, Input, Button, Container } from 'reactstrap';
import { memberApplicationState, memberShipPlanToString } from '../../Enums';
import MajorDropdown from './MajorDropdown';
import PlanDropdown from './PlanDropdown';
import { checkIfUserExists } from '../../APIFunctions/User';
import { registerUser } from '../../APIFunctions/Auth';
import { sendVerificationEmail } from '../../APIFunctions/Mailer';
import GoogleRecaptcha from './GoogleRecaptcha';

export default function MembershipForm(props) {
  const [verified, setVerified] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassWord] = useState('');
  const [major, setMajor] = useState('');
  const [plan, setPlan] = useState('');
  const [usernameAvailable, setUsernameAvailable] = useState(true);
  const [clickSubmitted, setClickSubmitted] = useState(false);
  const VALID_EMAIL_REGEXP = new RegExp(
    '^\\s*(([^<>()\\[\\]\\\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@"]+)*)' +
      '|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])' +
      '|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))\\s*$'
  );

  const checkValidEmail = () => {
    return email && VALID_EMAIL_REGEXP.test(email);
  };

  const checkValidPassword = () => {
    return (
      password &&
      password.length >= 8 &&
      /[a-z]/.test(password) &&
      /[A-Z]/.test(password) &&
      /\d/.test(password)
    );
  };

  const invalidEmailAlert = () => {
    if (clickSubmitted) {
      if (!email) {
        return <p className="unavailable">Email cannot be left empty</p>;
      }
      if (!checkValidEmail()) {
        return <p className="unavailable">Your input email is invalid</p>;
      }
      if (!usernameAvailable) {
        return (
          <p className="unavailable">
            An account with this email already exists. Contact{' '}
            <a href="mailto:asksce@gmail.com">asksce@gmail.com</a> if you forgot
            your password.
          </p>
        );
      }
    }
  };

  const invalidPasswordAlert = () => {
    if (!password) {
      return (
        clickSubmitted && (
          <p className="unavailable">Password cannot be left empty</p>
        )
      );
    }

    const lengthClass =
      'passwordRequirement' + (password.length >= 8 ? 'Valid' : 'Invalid');
    const lowercaseClass =
      'passwordRequirement' + (/[a-z]/.test(password) ? 'Valid' : 'Invalid');
    const uppercaseClass =
      'passwordRequirement' + (/[A-Z]/.test(password) ? 'Valid' : 'Invalid');
    const numberClass =
      'passwordRequirement' + (/\d/.test(password) ? 'Valid' : 'Invalid');

    return (
      !checkValidPassword() && (
        <ul>
          <li id="passwordLengthRequirement" className={lengthClass}>
            8 or more characters
          </li>
          <li id="passwordLowercaseRequirement" className={lowercaseClass}>
            a lowercase letter
          </li>
          <li id="passwordUppercaseRequirement" className={uppercaseClass}>
            an uppercase letter
          </li>
          <li id="passwordNumberRequirement" className={numberClass}>
            a number 0-9
          </li>
        </ul>
      )
    );
  };

  const invalidConfirmPasswordAlert = () => {
    if (checkValidPassword()) {
      if (!confirmPassword) {
        return (
          clickSubmitted && (
            <p className="unavailable">Please confirm your password</p>
          )
        );
      }
      if (password !== confirmPassword) {
        return <p className="unavailable">Passwords do not match</p>;
      }
    }
  };

  const requiredFieldsMet = () => {
    return (
      verified &&
      firstName &&
      lastName &&
      checkValidEmail() &&
      major &&
      checkValidPassword() &&
      password === confirmPassword
    );
  };

  const nameFields = [
    {
      label: 'First Name*',
      id: 'first-name-field',
      type: 'text',
      handleChange: (e) => setFirstName(e.target.value),
      ifRequirementsNotMet: clickSubmitted && !firstName && (
        <p className="unavailable">First name cannot be left empty</p>
      ),
    },
    {
      label: 'Last Name*',
      id: 'last-name-field',
      type: 'text',
      ifRequirementsNotMet: clickSubmitted && !lastName && (
        <p className="unavailable">Last name cannot be left empty</p>
      ),
      handleChange: (e) => setLastName(e.target.value),
    },
  ];
  const accountFields = [
    {
      label: 'Email*',
      type: 'email',
      id: 'email-field',
      ifRequirementsNotMet: invalidEmailAlert(),
      handleChange: (e) => {
        setEmail(e.target.value);
        if (!usernameAvailable) setUsernameAvailable(true);
      },
    },
    {
      label: 'Password*',
      type: 'password',
      id: 'password-field',
      ifRequirementsNotMet: invalidPasswordAlert(),
      handleChange: (e) => setPassword(e.target.value),
    },
    {
      label: 'Confirm password*',
      type: 'password',
      id: 'confirm-password-field',
      ifRequirementsNotMet: invalidConfirmPasswordAlert(),
      handleChange: (e) => setConfirmPassWord(e.target.value),
    },

  ];

  const majorField = [
    {
      label: 'Major*',
      type: 'text',
      id: 'major-field',
    },
  ];

  const submitApplication = async (e) => {
    e.preventDefault();
    if (!clickSubmitted) setClickSubmitted(true);
    if (requiredFieldsMet()) {
      const userResponse = await checkIfUserExists(email);
      if (userResponse.error) {
        setUsernameAvailable(false);
        return;
      }

      const registrationStatus = await registerUser({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password,
        major,
        numberOfSemestersToSignUpFor: props.selectedPlan,
      });

      if (!registrationStatus.error) {
        sendVerificationEmail(email, firstName);
        props.setMembershipState(memberApplicationState.CONFIRMATION);
      } else {
        if (registrationStatus.responseData.status === 409) {
          window.alert('An account with this email already exists');
        } else if (registrationStatus.responseData.status === 400) {
          window.alert('Password requirements not met');
        }
      }
    }
  };

  return (
    <Container id="loginbackground" fluid>
      <Container className = "planContainer">
        <div className="form-card">
          <div className = "planHeaders">
            Semester Plan
          </div>
          <div class = "circle">
            <div class="circle-text">$20</div>
          </div>
          <div class = "planFooters">
            Expires: May 20, 2021
          </div>
          <div className = "planHeaders">
            Annual Plan
          </div>
          <div class = "circle">
            <div class="circle-text">$30</div>
          </div>
          <div class = "planFooters">
            Expires: December 20, 2021
          </div>
        </div>
        <div className="form-card2">
          <h1>Membership Application</h1>
          <h2>
            Term: {memberShipPlanToString(props.selectedPlan)}
          </h2>
          <h6>
            * = Required field
          </h6>
          <Form onSubmit={submitApplication}>
            <Row id="name-field-row">
              {nameFields.map((input, index) => (
                <FormGroup key={`name-field-input-${index}`}>
                  <Input
                    className="name-input membership-input"
                    type={input.type}
                    onChange={input.handleChange}
                    id={input.id}
                    placeholder={input.label}
                  />
                  {input.ifRequirementsNotMet}
                </FormGroup>
              ))}
            </Row>
            <div id="email-input-container">
              {accountFields.map((input, index) => (
                <FormGroup key={`account-field-${index}`}>
                  <Input
                    className="membership-input email-input"
                    type={input.type}
                    onChange={input.handleChange}
                    id={input.id}
                    placeholder={input.label}
                  />
                  {input.ifRequirementsNotMet}
                </FormGroup>
              ))}
            </div>
            <MajorDropdown setMajor={setMajor} />
            <PlanDropdown setPlan={setPlan} />
            <div id="recaptcha">
              <GoogleRecaptcha setVerified={setVerified} />
            </div>
            <div className="transition-button-wrapper">
              <div className="center">
                <Button className = "submit-btn" type="submit">
                  Submit Application
                </Button>
              </div>
            </div>
          </Form>
        </div>
      </Container>
    </Container>
  );
}
