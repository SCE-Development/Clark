import React, { useState } from 'react';
import {
  Button,
  Modal,
} from 'reactstrap';
import Display from './Profile.js';
import EditForm from './EditorForm';
import { editUser } from '../../../APIFunctions/User.js';
const bcrypt = require('bcryptjs');

export default function Editor(props) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [doorCode, setDoorCode] = useState('');
  const [major, setMajor] = useState('');
  const [user, setUser] = useState({ ...props.user });
  const [users] = useState( [...props.users] );
  const [toggle, setToggle] = useState(false);
  const [pagesPrinted, setPagesPrinted] = useState(user.pagesPrinted);
  const [toggleSubmit, setToggleSubmit] = useState(false);
  const [userMembership, setuserMembership] = useState(user.accessLevel);
  const [numberOfSemestersToSignUpFor, setNumberOfSemestersToSignUpFor]
    = useState();
  const [membershipValidUntil, setMembershipValidUntil]
    = useState(user.membershipValidUntil);
  const date = new Date();

  async function handleSubmission() {
    // hash pass
    const salt = bcrypt.genSaltSync(10);
    const hashed = (password.trim() === '') ?
      user.password : bcrypt.hashSync(password, salt);

    const editedUser = {
      ...user,
      firstName: firstName || user.firstName,
      lastName: lastName || user.lastName,
      email: user.email,
      major: major || user.major,
      password: hashed,
      doorCode: doorCode || user.doorCode,
      pagesPrinted: pagesPrinted,
      accessLevel: userMembership,
      numberOfSemestersToSignUpFor: numberOfSemestersToSignUpFor
    };

    setUser({ ...editedUser });
    setToggle(!toggle);
    const apiResponse = await editUser({ ...editedUser }, props.token);
    if (!apiResponse.error) {
      setMembershipValidUntil(apiResponse.responseData.membershipValidUntil);
    }
    setToggle(false);
    setToggleSubmit(false);

    // Map through users and dynamically update frontend
    let newUsers = [];
    for(let i = 0; i < users.length; i++){
      if(users[i]._id === editedUser._id){
        newUsers.push(editedUser);
      }else{
        newUsers.push(users[i]);
      }
    }
    props.updateUserState(newUsers);
  }

  const formGroups = [
    {
      label: 'First Name',
      placeholder: user.firstName,
      handleChange: (e) => setFirstName(e.target.value)
    },
    {
      label: 'Last Name',
      placeholder: user.lastName,
      handleChange: (e) => setLastName(e.target.value)
    },
    {
      label: 'Password',
      type: 'password',
      placeholder: 'make it secure',
      handleChange: (e) => setPassword(e.target.value)
    },
    {
      label: 'Door Code',
      placeholder: 'make it secure',
      handleChange: (e) => setDoorCode(e.target.value)
    },
    {
      label: 'Major',
      placeholder: user.major,
      handleChange: (e) => setMajor(e.target.value)
    }
  ];

  function membershipExpDate() {
    let expDate1 = '';
    let expDate2 = '';
    let actualMonth = date.getMonth() + 1;
    if (actualMonth >= 1 && actualMonth <= 5) {
      expDate1 = `May ${date.getFullYear()}`;
      expDate2 = `Dec ${date.getFullYear()}`;
    } else {
      expDate1 = `Dec ${date.getFullYear()}`;
      expDate2 = `May ${date.getFullYear() + 1}`;
    }
    return [expDate1, expDate2];
  }
  const expDates = membershipExpDate();
  const membership = [
    { value: 0, name: 'Keep Same' },
    { value: 0, name: 'Expired Membership' },
    { value: 1, name: `This semester: ${expDates[0]}` },
    { value: 2, name: `2 semesters: ${expDates[1]}` }
  ];

  return (
    <div className="center">
      <ul className="profileInfo">

        <Display
          user={{...user, membershipValidUntil}}
        />

        <EditForm
          formGroups={formGroups}
          membership={membership}
          setNumberOfSemestersToSignUpFor={
            (onChangeEvent) => {
              setNumberOfSemestersToSignUpFor(onChangeEvent);
            }}
          setPagesPrinted={onChangeEvent => {
            setPagesPrinted(onChangeEvent);
          }}
          handleSubmissionToggle={() => {
            setToggleSubmit(!toggleSubmit);
          }}
          handleToggle={() => {
            setToggle(!toggle);
          }}
          setuserMembership={(onChangeEvent) => {
            setuserMembership(onChangeEvent);
          }}
          toggle={toggle}
        />

        <Modal
          style={
            {
              marginTop: '320px',
            }}
          toggle={()=>setToggleSubmit(!toggleSubmit)}
          isOpen={toggleSubmit}>
          <Button
            onClick={async () => {
              await handleSubmission();
            }}
            color="primary">
            YES!
          </Button>
          <Button
            style={{
              marginTop: '10px'
            }}
            onClick={() => {
              setToggleSubmit(!toggleSubmit);
            }}
            color="danger">
            Nah! It's a mistake.
          </Button>
        </Modal>

      </ul>
    </div>
  );
}

