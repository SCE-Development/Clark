import React, { useState, useEffect } from 'react';
import {
  getUserById,
  editUser,
} from '../../APIFunctions/User';
import Header from '../../Components/Header/Header';
import {
  Container,
  FormGroup,
  Label,
  Col,
  Input,
  Button,
  Row,
} from 'reactstrap';

import MajorDropdown from '../MembershipApplication/MajorDropdown';
import RoleDropdown from './RoleDropdown';
import ExpirationDropdown from './ExpirationDropdown';
import { membershipState, membershipStateToString } from '../../Enums';
import { sendVerificationEmail } from '../../APIFunctions/Mailer';


export default function EditUserInfo(props) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState(null);
  const [doorCode, setDoorCode] = useState('');
  const [major, setMajor] = useState('');
  const [pagesPrinted, setPagesPrinted] = useState();
  const [emailVerified, setEmailVerified] = useState();
  const [accessLevel, setAccessLevel] = useState();
  const [email, setEmail] = useState();
  const [emailOptIn, setEmailOptIn] = useState();
  const [
    numberOfSemestersToSignUpFor,
    setNumberOfSemestersToSignUpFor
  ] = useState();
  const [discordId, setDiscordId] = useState();
  const [membershipExpiration, setMembershipExpiration] = useState(new Date());
  const [joinDate, setJoinDate] = useState();
  const [submitButtonText, setSubmitButtonText] = useState('Submit');
  const [submitButtonColor, setSubmitButtonColor] = useState('primary');
  const [
    verificationEmailButtonText,
    setVerificationEmailButtonText
  ] = useState('Send');
  const [dataWasChanged, setDataWasChanged] = useState(false);

  const [loading, setLoading] = useState(true);
  const [userNotFound, setUserNotFound] = useState(false);

  let initialState = [
    {
      label: 'Email',
      defaultValue: email,
      onChange: (e) => {
        setDataWasChanged(true);
        setEmail(e.target.value);
      },
    },
    {
      label: 'Password',
      onChange: (e) => {
        setDataWasChanged(true);
        setPassword(e.target.value);
      },
      placeholder: 'intentionally blank',
      type: 'password',
    },
    {
      label: 'Pages Printed',
      defaultValue: pagesPrinted,
      onChange: (e) => {
        setDataWasChanged(true);
        setPagesPrinted(e.target.value);
      },
      type: 'number',
    },
    {
      label: 'Membership Expiration',
      Component: (
        <ExpirationDropdown
          defaultValue={'asdfasf'}
          setNumberOfSemestersToSignUpFor={(value) => {
            setDataWasChanged(true);
            setNumberOfSemestersToSignUpFor(value);
          }}
        />
      ),
    },
    {
      label: 'Door Code',
      defaultValue: doorCode,
      onChange: (e) => {
        setDataWasChanged(true);
        setDoorCode(e.target.value);
      },
      type: 'number',
    },
    {
      label: 'Email Verified?',
      onChange: (e) => {
        setDataWasChanged(true);
        setEmailVerified(e.target.checked);
      },
      checked: !!emailVerified,
      type: 'checkbox',
    },
    {
      label: 'Resend verification email (sends to most recently saved email):',
      onChange: (e) => {
        setDataWasChanged(true);
        setEmailVerified(e.target.checked);
      },
      checked: !!emailVerified,
      Component: <Button
        outline
        color='success'
        onClick={async () => {
          const result = await sendVerificationEmail(email, firstName);
          if (result.error) {
            return alert(
              'unable to send verification email.' +
              ' please contact dev team if retrying fails'
            );
          }
          setVerificationEmailButtonText('Verification email sent!');
          setTimeout(() => {
            setVerificationEmailButtonText('Send');
          }, 1500);
        }}>
        {verificationEmailButtonText}
      </Button>
    },
    {
      label: 'Access Level',
      defaultValue: accessLevel,
      Component: <RoleDropdown
        setuserMembership={(value) => {
          setDataWasChanged(true);
          setAccessLevel(value);
        }}
        defaultValue={accessLevel}
      />
    },
    {
      label: 'Major',
      defaultValue: major,
      Component:
        <MajorDropdown
          hideMajorPrompt={true}
          defaultMajor={major}
          setMajor={(value) => {
            setDataWasChanged(true);
            setMajor(value);
          }} />,
    },
    {
      label: 'First Name',
      defaultValue: firstName,
      onChange: (e) => {
        setDataWasChanged(true);
        setFirstName(e.target.value);
      },
    },
    {
      label: 'Last Name',
      defaultValue: lastName,
      onChange: (e) => {
        setDataWasChanged(true);
        setLastName(e.target.value);
      },
    },
    {
      label: 'Opt into Blast Emails?',
      defaultValue: emailOptIn,
      onChange: (e) => {
        setDataWasChanged(true);
        setEmailOptIn(e.target.checked);
      },
      checked: !!emailOptIn,
      type: 'checkbox',
    },
    {
      label: 'Discord ID',
      defaultValue: discordId,
      onChange: (e) => {
        setDataWasChanged(true);
        setDiscordId(e.target.value);
      },
      type: 'number',
    },
  ];

  useEffect(() => {
    async function getUser() {
      const result = await getUserById(props.match.params.id, props.user.token);
      if (result.error) {
        setUserNotFound(true);
      } else {
        setFirstName(result.responseData.firstName);
        setLastName(result.responseData.lastName);
        setDoorCode(result.responseData.doorCode);
        setMajor(result.responseData.major);
        setPagesPrinted(result.responseData.pagesPrinted);
        setEmailVerified(result.responseData.emailVerified);
        setAccessLevel(result.responseData.accessLevel);
        setEmailOptIn(result.responseData.emailOptIn);
        setJoinDate(new Date(result.responseData.joinDate));
        setMembershipExpiration(
          new Date(result.responseData.membershipValidUntil)
        );
        setDiscordId(result.responseData.discordId);
        setEmail(result.responseData.email);
      }
      setLoading(false);
    }
    getUser();
  }, []);

  async function handleSubmit() {
    if (!dataWasChanged) {
      return;
    }
    const result = await editUser({
      _id: props.match.params.id,
      firstName,
      lastName,
      email,
      password,
      major,
      numberOfSemestersToSignUpFor,
      doorCode,
      discordID: discordId,
      pagesPrinted,
      accessLevel,
      emailVerified,
      emailOptIn,
    }, props.user.token);
    if (result.error) {
      alert(
        'saving user failed. please contact dev team if retrying fails.'
      );
    } else {
      setSubmitButtonText('Saved!');
      setSubmitButtonColor('success');
      setTimeout(() => {
        setDataWasChanged(false);
        setSubmitButtonText('Submit');
      }, 1500);
    }
  }

  function renderInputOrCustomComponent(field) {
    const { label, ...inputProps } = field;
    return (
      <FormGroup row style={{ marginBottom: '10px' }}>
        <Label for="exampleEmail" sm={2}>{label}</Label>
        <Col sm={10}>
          {
            field.Component
            ||
            <Input
              {...inputProps}
            />
          }
        </Col>
      </FormGroup>
    );
  }

  function renderEditInfo() {
    return (
      <React.Fragment>
        {initialState.map((field, index) => (
          <React.Fragment key={index}>
            {renderInputOrCustomComponent(field)}
          </React.Fragment>
        ))}
        {
          dataWasChanged &&
          <div style={{
            display: 'flex',
            width: '10em',
            maxWidth: '15em',
            justifyContent: 'space-between'
          }}
          >
            {/*
              we can do better here, we can keep track of the user's
              initial state and just revert to it instead of reloading
              the page
            */}
            <Button
              onClick={() => window.location.reload()}
              color="secondary">
              Cancel
            </Button>
            <Button
              color={submitButtonColor}
              onClick={() => handleSubmit()}>
              {submitButtonText}
            </Button>
          </div>
        }
      </React.Fragment>
    );
  }

  function renderExpirationDate() {
    // default case, render the users expiration
    let expiresOrExpired = 'expires';
    let maybeFontColor = '';
    let message = null;

    const membershipIsExpired = new Date() > membershipExpiration;
    const userIsOfficerOrAdmin = accessLevel >= membershipState.OFFICER;
    const userIsPendingOrBanned = accessLevel <= membershipState.PENDING;

    if (userIsOfficerOrAdmin) {
      maybeFontColor = 'green';
      message = (<div className="userRolePrompt">
        Membership does not expire as the user is an{' '}
        <b>{membershipStateToString(accessLevel)}</b>
      </div>);
    } else if (userIsPendingOrBanned) {
      maybeFontColor = 'red';
      message = (<div className="userRolePrompt">
        Membership invalid, user has the{' '}
        <b>{membershipStateToString(accessLevel)}</b> role.
      </div>);
    } else {
      // Default case, if a user isn't in one of the above special roles
      // just render the status (valid or expired) of their membership
      if (membershipIsExpired) {
        expiresOrExpired = 'expired';
        maybeFontColor = 'red';
      }
      message = <div className="userRolePrompt">
        Membership {expiresOrExpired} on{' '}
        <b>{membershipExpiration.toDateString()}</b>
      </div>;
    }

    return (
      <span style={{ color: maybeFontColor }}>
        {message}
      </span>
    );
  }

  function renderUserInfo() {
    if (loading) {
      return <h1 style={{ textAlign: 'center' }}>loading...</h1>;
    }

    if (userNotFound) {
      return (
        <h1 style={{ textAlign: 'center' }}>
          User with ID: {props.match.params.id} not found!
        </h1>
      );
    } else {
      return (
        <Container style={{ marginTop: '1em', marginBottom: '3em' }}>
          <Row style={{ marginBottom: '3em', fontSize: '1.5em' }}>
            <Col>
              Joined SCE: <b>{joinDate.toDateString()}</b>
            </Col>
            <Col>
              {renderExpirationDate()}
            </Col>
          </Row>

          {renderEditInfo()}
        </Container>
      );
    }
  }

  return (
    <div className='userEditPage'>
      <Header title='Edit User Information' />
      {renderUserInfo()}
    </div>
  );
}
