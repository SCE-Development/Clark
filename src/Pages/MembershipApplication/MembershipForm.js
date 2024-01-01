import React, { useState } from 'react';

import { Row, Form, FormGroup, Input, Button, Container } from 'reactstrap';
import { memberApplicationState, memberShipPlanToString } from '../../Enums';
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
  const [major, setMajor] = useState('Other');
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
          className=''
        >Email cannot be left empty</p>;
      }
      if (!checkValidEmail()) {
        return <p
          className=''
        >Your input email is invalid</p>;
      }
      if (!usernameAvailable) {
        return (
          <p className=''>
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
            className=''
          >Password cannot be left empty</p>
        )
      );
    }

    const lengthClass =
      (password.length >= 8 ? 'hidden' : 'text-red-500');
    const lowercaseClass =
      (/[a-z]/.test(password) ? 'hidden ' : 'text-red-500');
    const uppercaseClass =
      (/[A-Z]/.test(password) ? 'hidden' : 'text-red-500');
    const numberClass =
      (/\d/.test(password) ? 'hidden' : 'text-red-500');

    return (
      (
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
              className='text-red'
            >Please confirm your password</p>
          )
        );
      }
      if (password !== confirmPassword) {
        const validOrInvalid =
         password === confirmPassword ? 'hidden' : 'text-red-500';
        const maybeDoNot =  password === confirmPassword ? '' : 'do not';
        return <p
          className={validOrInvalid}
        >Passwords {maybeDoNot} match</p>;
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
          className='text-red'
        >First name cannot be left empty</p>
      ),
    },
    {
      label: 'Last Name*',
      id: 'last-name-field',
      type: 'text',
      ifRequirementsNotMet: clickSubmitted && !lastName && (
        <p
          className='text-red'
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

  const handleMajorChange = (event) => {
    setMajor(event.target.value);
  };

  const handlePlanChange = (event) => {
    setPlan(event.target.value);
  };


  return (
    <div className=''>
      <Container className = 'flex-none md:flex mt-0 pt-20 '>
        <div className='rounded-3xl backdrop-blur-sm shadow-2xl mt-20 mb-auto ml-auto mr-auto px-10 text-center items-center justify-center'>
          <div className = 'text-lg md:text-3xl font-bold pb-2'>
            Semester Plan
          </div>
          <div className="stats stats-vertical text-lg md:text-3xl shadow">
            <div className="stat text-lg md:text-3xl">
              <div className="stat-title text-2xl md:text-3xl">Price</div>
              <div className="stat-value text-2xl md:text-3xl">$20</div>
              <div className="stat-desc">1 semester</div>
            </div>

            <div className="stat">
              <div className="stat-title text-2xl md:text-3xl">Expires</div>
              <div className="stat-value text-2xl md:text-3xl">May 13th 2024</div>
              <div className="stat-desc">↗︎ Only Up From here</div>
            </div>
          </div>
          <div className = 'text-lg md:text-3xl font-bold  pb-2 pt-4'>
            Yearly Plan
          </div>
          <div className="stats stats-vertical shadow">
            <div className="stat">
              <div className="stat-title text-2xl md:text-3xl">Price</div>
              <div className="stat-value text-2xl md:text-3xl">$30</div>
              <div className="stat-desc">2 semester</div>
            </div>

            <div className="stat">
              <div className="stat-title text-2xl md:text-3xl">Expires</div>
              <div className="stat-value text-2xl md:text-3xl">January 1st 2024</div>
              <div className="stat-desc">↗︎ Only Up From here</div>
            </div>
          </div>
          <div className='venmo-link text-2xl  md:text-3xl  py-3'>
            <a
              href='https://venmo.com/u/sce-treasurer'
              style={{ color: 'white' }}
              className='opacity-50 hover:opacity-100 font-bold underline duration-300'
            >
              Click to pay fee
            </a>
            <p className='text-sm no-underline '> You do not need to pay to make an account</p>
          </div>
        </div>
        <div className='rounded-3xl backdrop-blur-sm shadow-2xl  mt-20  ml-auto mr-auto px-10 text-center items-center justify-center'>
          <p className='text-3xl font-bold' >Membership Application</p>
          <p className='text-2xl font-bold '>
            Year: {new Date().getFullYear()}
          </p>
          <h6 className='text-lg'>
            * = Required field
          </h6>
          <Form onSubmit={submitApplication}>
            <div id='name-field-row'>
              {nameFields.map((input, index) => (
                <FormGroup
                  className=' opacity-70 rounded-sm font-sans text-white'
                  key={`name-field-input-${index}`}>
                  <Input
                    type={input.type}
                    onChange={input.handleChange}
                    id={input.id}
                    placeholder={input.label}
                    className='w-full bg-[#ABC9CF] rounded-full mb-4 text-white pl-2'
                  />
                  {input.ifRequirementsNotMet}
                </FormGroup>
              ))}
            </div>
            <div id='email-input-container'>
              {accountFields.map((input, index) => (
                <FormGroup
                  className='opacity-70 rounded-sm font-sans text-black'
                  key={`account-field-${index}`}>
                  <Input
                    type={input.type}
                    onChange={input.handleChange}
                    id={input.id}
                    placeholder={input.label}
                    className='w-full bg-[#ABC9CF] rounded-full mb-4 text-black pl-2'
                  />
                  {input.ifRequirementsNotMet}
                </FormGroup>
              ))}
            </div>
            {/* <MajorDropdown setMajor={setMajor} />
            <PlanDropdown setPlan={setPlan} /> */}
            <p className='text-xl text-center'> Select Major </p>
            <div className='flex text-center justify-center gap-4'>
              <label className="label">
                <p className='text-bold'> CS </p>
                <input type="radio" name="radio-10" className="radio" value='CS'   onClick={handleMajorChange}/>
              </label>
              <label className="label">
                <p className='text-bold'> SWE </p>
                <input type="radio" name="radio-10" className="radio" value='SWE'  onClick={handleMajorChange}/>
              </label>
              <label className="label">
                <p className='text-bold'> Other </p>
                <input type="radio" name="radio-10" className="radio" value='Other'  onClick={handleMajorChange}/>
              </label>
            </div>
            <p className='text-xl text-center'> Select Plan </p>
            <div className='flex text-center justify-center gap-4'>
              <label className="label">
                <p className='text-bold'> Semester </p>
                <input type="radio" name="radio-11" className="radio" value='Semester'   onClick={handlePlanChange}/>
              </label>
              <label className="label">
                <p className='text-bold'> Annual </p>
                <input type="radio" name="radio-11" className="radio" value='Annual'  onClick={handlePlanChange}/>
              </label>
              <label className="label">
                <p className='text-bold'> None </p>
                <input type="radio" name="radio-11" className="radio" value='None'  onClick={handlePlanChange}/>
              </label>
            </div>
            <div id='recaptcha'>
              {maybeShowCaptcha()}
            </div>
            <div className=''>
              <div className=''>
                <Button className = 'mt-20' type='submit'>
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
