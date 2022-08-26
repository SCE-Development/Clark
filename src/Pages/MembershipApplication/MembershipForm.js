import React, { useState } from 'react';
import './registerPage.css';
import { Row, Form, FormGroup, Input, Button, Container } from 'reactstrap';
import { memberApplicationState, memberShipPlanToString } from '../../Enums';
import MajorDropdown from './MajorDropdown';
import PlanDropdown from './PlanDropdown';
import { checkIfUserExists } from '../../APIFunctions/User';
import { registerUser } from '../../APIFunctions/Auth';
import { sendVerificationEmail } from '../../APIFunctions/Mailer';
import GoogleRecaptcha from './GoogleRecaptcha';
export default function MembershipForm(props) {
  // we skip captcha verification if the environment is dev
  const [verified, setVerified] = useState(
    process.env.NODE_ENV !== 'production');
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

  const maybeShowCaptcha = () => {
    return process.env.NODE_ENV === 'production' ?
      <GoogleRecaptcha setVerified={setVerified} /> : null;
  };

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
        return <p
          className='unavailable application-text'
        >Email cannot be left empty</p>;
      }
      if (!checkValidEmail()) {
        return <p
          className='unavailable application-text'
        >Your input email is invalid</p>;
      }
      if (!usernameAvailable) {
        return (
          <p className='unavailable application-text'>
            An account with this email already exists. Contact{' '}
            <a href='mailto:asksce@gmail.com'>
              asksce@gmail.com</a>
              if you forgot your password.
          </p>
        );
      }
    }
  };

  const invalidPasswordAlert = () => {
    if (!password) {
      return (
        clickSubmitted && (
          <p
            className='unavailable application-text'
          >Password cannot be left empty</p>
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
          <li id='passwordLengthRequirement' className={lengthClass}>
            8 or more characters
          </li>
          <li id='passwordLowercaseRequirement' className={lowercaseClass}>
            a lowercase letter
          </li>
          <li id='passwordUppercaseRequirement' className={uppercaseClass}>
            an uppercase letter
          </li>
          <li id='passwordNumberRequirement' className={numberClass}>
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
            <p
              className='unavailable application-text'
            >Please confirm your password</p>
          )
        );
      }
      if (password !== confirmPassword) {
        return <p
          className='unavailable application-text'
        >Passwords do not match</p>;
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
        <p
          className='unavailable application-text'
        >First name cannot be left empty</p>
      ),
    },
    {
      label: 'Last Name*',
      id: 'last-name-field',
      type: 'text',
      ifRequirementsNotMet: clickSubmitted && !lastName && (
        <p
          className='unavailable application-text'
        >Last name cannot be left empty</p>
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

  function membershipExpDate(semestersToSignUpFor = 1) {
    const today = new Date();

    const endOfSpringSemThisYear = `June 1, ${today.getFullYear()}`;
    const endOfSpringSemNextYear = `June 1, ${today.getFullYear() + 1}`;
    const endOfFallSemThisYear = `January 1, ${today.getFullYear() + 1}`;

    // Lookup table to resolve a readble expiration date for a
    // new member. The first key is the number of semesters they
    // wish to sign up for and the second (nested) key is whether
    // this page was rendered during spring time or not.
    const expirationMap = {
      1: {
        true: endOfSpringSemThisYear,
        false: endOfFallSemThisYear
      },
      2: {
        true: endOfFallSemThisYear,
        false: endOfSpringSemNextYear
      }
    };

    // spring checks if current month is between January and May
    const spring = today.getMonth() >= 0 && today.getMonth() <= 4;

    return expirationMap[semestersToSignUpFor][spring];
  }

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
    <div className='planBody'>
      <Container className = 'planContainer'>
        <div className='form-card'>
          <div className = 'planHeaders'>
            Semester Plan
          </div>
          <div className = 'circle'>
            <div className='circle-text'>$20</div>
          </div>
          <div className = 'planFooters'>
            Expires: {membershipExpDate(1)}
          </div>
          <div className = 'planHeaders'>
            Annual Plan
          </div>
          <div className = 'circle'>
            <div className='circle-text'>$30</div>
          </div>
          <div className = 'planFooters'>
            Expires: {membershipExpDate(2)}
          </div>
        </div>
        <div className='form-card2'>
          <h1 id='application-header'>Membership Application</h1>
          <h2 id='application-h2'>
            Year: {new Date().getFullYear()}
          </h2>
          <h6 className='white-text'>
            * = Required field
          </h6>
          <Form onSubmit={submitApplication}>
            <Row id='name-field-row'>
              {nameFields.map((input, index) => (
                <FormGroup
                  className='application-form-group'
                  key={`name-field-input-${index}`}>
                  <Input
                    className='name-input membership-input'
                    type={input.type}
                    onChange={input.handleChange}
                    id={input.id}
                    placeholder={input.label}
                  />
                  {input.ifRequirementsNotMet}
                </FormGroup>
              ))}
            </Row>
            <div id='email-input-container'>
              {accountFields.map((input, index) => (
                <FormGroup
                  className='application-form-group'
                  key={`account-field-${index}`}>
                  <Input
                    className='membership-input email-input'
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
            <div id='recaptcha'>
              {maybeShowCaptcha()}
            </div>
            <div className='transition-button-wrapper container-btn'>
              <div className='center'>
                <Button className = 'submit-btn' type='submit'>
                  Submit Application
                </Button>
              </div>
            </div>
          </Form>
        </div>
      </Container>
    </div>
  );
}
