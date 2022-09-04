import React, { useState, useEffect } from 'react';
import {
  getUserById,
  editUser,
} from '../../APIFunctions/User';
import Header from '../../Components/Header/Header';
import { Container, FormGroup, Label, Col, Input } from 'reactstrap';
import ConfirmationModal from
  '../../Components/DecisionModal/ConfirmationModal';
import MajorDropdown from '../MembershipApplication/MajorDropdown';
import MembershipDropdown from './MembershipDropdown';

export default function EditUserInfo(props) {
  const token = props.user.token;

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [doorCode, setDoorCode] = useState('');
  const [major, setMajor] = useState('');
  const [pagesPrinted, setPagesPrinted] = useState();
  const [emailVerified, setEmailVerified] = useState();
  const [accessLevel, setAccessLevel] = useState();
  const [email, setEmail] = useState();
  const [emailOptIn, setEmailOptIn] = useState();
  const [membershipExpiration, setMembershipExpiration] = useState();
  const [discordId, setDiscordId] = useState();

  const [loading, setLoading] = useState(true);
  const [userNotFound, setUserNotFound] = useState(false);

  const fields = [
    {
      label: 'First Name',
      defaultValue: firstName,
      onChange: (e) => setFirstName(e.target.value),
    },
    {
      label: 'Last Name',
      defaultValue: lastName,
      onChange: (e) => setLastName(e.target.value),
    },
    {
      label: 'Password',
      onChange: (e) => setPassword(e.target.value),
      placeholder: 'intentionally blank',
      type: 'text',
    },
    {
      label: 'Door Code',
      defaultValue: doorCode,
      onChange: (e) => setDoorCode(e.target.value),
      type: 'number',
    },
    {
      label: 'major',
      defaultValue: major,
      onChange: (e) => setMajor(e.target.value),
      Component:
        <MajorDropdown defaultMajor={major} setMajor={setMajor} />,
    },
    {
      label: 'pagesPrinted',
      defaultValue: pagesPrinted,
      onChange: (e) => setPagesPrinted(e.target.value),
      type: 'number',
    },
    {
      label: 'emailVerified',
      defaultValue: emailVerified,
      onChange: (e) => setEmailVerified(e.target.value),
      type: 'checkbox',
    },
    {
      label: 'accessLevel',
      defaultValue: accessLevel,
      onChange: (e) => setAccessLevel(e.target.value),
      Component: <MembershipDropdown
        setuserMembership={(value) => setAccessLevel(value)}
        defaultValue={accessLevel}
      />
    },
    {
      label: 'email',
      defaultValue: email,
      onChange: (e) => setEmail(e.target.value),
    },
    {
      label: 'emailOptIn',
      defaultValue: emailOptIn,
      onChange: (e) => setEmailOptIn(e.target.value),
    },
    {
      label: 'membershipExpiration',
      defaultValue: membershipExpiration,
      onChange: (e) => setMembershipExpiration(e.target.value),
    },
    {
      label: 'discordId',
      defaultValue: discordId,
      onChange: (e) => setDiscordId(e.target.value),
      type: 'number',
    },
  ];

  useEffect(() => {
    async function getUser() {
      const result = await getUserById(props.match.params.id, token);
      setLoading(false);
      console.log('we got baccc', result);
      if (result.error) {
        setUserNotFound(true);
      } else {
        setFirstName(result.responseData.firstName)
        setLastName(result.responseData.lastName)
        setPassword(result.responseData.password)
        setDoorCode(result.responseData.doorCode)
        setMajor(result.responseData.major)
        setPagesPrinted(result.responseData.pagesPrinted)
        setEmailVerified(result.responseData.emailVerified)
        setAccessLevel(result.responseData.accessLevel)
        setEmailOptIn(result.responseData.emailOptIn)
        setMembershipExpiration(result.responseData.membershipExpiration)
        setDiscordId(result.responseData.discordId)
        setEmail(result.responseData.email);
      }
    }
    getUser();
  }, []);

  function renderInputOrCustomComponent(field) {
    const { label, ...inputProps } = field;
    if (field.Component) {
      return field.Component;
    } else {
      return (
        <FormGroup row style={{ marginBottom: '10px' }}>
          <Label for="exampleEmail" sm={2}>{label}</Label>
          <Col sm={10}>
            <Input
              {...inputProps}
            />
          </Col>
        </FormGroup>
      )
    }
  }

  function renderEditInfo() {
    return (
      <Container>
        {fields.map((field, index) => (
          <React.Fragment key={index}>
            {renderInputOrCustomComponent(field)}
          </React.Fragment>
        ))}
      </Container>
    )
  }

  function renderInfo() {
    if (loading) {
      return <h1 style={{ textAlign: 'center' }}>loading...</h1>
    }

    if (userNotFound) {
      return (
        <h1 style={{ textAlign: 'center' }}>
          User with ID: {props.match.params.id} not found!
        </h1>
      )
    } else {
      return renderEditInfo();
    }
  }

  return (
    <div className='userEditPage'>
      <Header title='Edit User Information' />
      {renderInfo()}
    </div>
  );
}
