import React, { useState } from "react";
import {
  Button,
  Modal,
} from "reactstrap";
import axios from 'axios'
import Display from './Profile.js'
import EditForm from './EditorForm'
const bcrypt = require('bcrypt-nodejs')

export default function Editor(props) {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [middleInitial, setMiddleInitial] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [doorCode, setDoorCode] = useState("")
  const [major, setMajor] = useState("")
  const [user, setUser] = useState({ ...props.user })
  const [toggle, setToggle] = useState(false)
  const [pagesPrinted, setPagesPrinted] = useState(user.pagesPrinted)
  const [toggleSubmit, setToggleSubmit] = useState(false)
  const [userMembership, setuserMembership] = useState(user.accessLevel)
  const [numberOfSemestersToSignUpFor, setNumberOfSemestersToSignUpFor] = useState()
  const [membershipValidUntil, setMembershipValidUntil] = useState(user.membershipValidUntil)

  async function handleSubmission() {
    const queryEmail = user.email

    //hash pass
    const salt = bcrypt.genSaltSync(10)
    const hashed = (password.trim() === '') ?
      user.password : bcrypt.hashSync(password, salt)

    const editedUser = {
      ...user,
      firstName: firstName || user.firstName,
      lastName: lastName || user.lastName,
      middleInitial: middleInitial || user.middleInitial,
      email: email || user.email,
      major: major || user.major,
      password: hashed,
      doorCode: doorCode || user.doorCode,
      pagesPrinted: pagesPrinted,
      accessLevel: userMembership,
      numberOfSemestersToSignUpFor: numberOfSemestersToSignUpFor
    }

    setUser({ ...editedUser })
    setToggle(!toggle)

    await axios
      // get all user!
      .post('/api/user/edit', {
        ...editedUser,
        queryEmail: queryEmail,
        token: props.token
      })
      .then(result => {
        if (result.status >= 200 && result.status < 300) {
          setMembershipValidUntil(result.data.membershipValidUntil)
        }
      })
      .catch(err => {
        console.log(err)
      })

    setToggle(false)
    setToggleSubmit(false)
  }

  function handleSubmissionToggle() {
    if (user.email === email)
      setToggleSubmit(!toggleSubmit)
    else {
      checkIfUserExists(email)
    }
  }

  async function checkIfUserExists(val) {
    await axios
      .post('/api/user/checkIfUserExists', { email: val })
      .then(result => {
        if (result.status >= 200 && result.status < 300) {
          setToggleSubmit(!toggleSubmit)
        }
      })
      .catch(err => {
        window.alert('The Email has already existed, leave it blank if you do not want to change')
        console.log(err)
      })
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
      label: 'Middle Initial',
      placeholder: user.middleInitial,
      handleChange: (e) => setMiddleInitial(e.target.value)
    },
    {
      label: 'Email',
      type: 'email',
      placeholder: user.email,
      handleChange: (e) => setEmail(e.target.value)
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
  ]

  const membership = [
    { value: 0, name: 'Keep Same' },
    { value: 0, name: 'Expired Membership' },
    { value: 1, name: 'This semester' },
    { value: 2, name: '2 semesters' }
  ]

  return (
    <div className="center">
      <ul className="profileInfo">

        <Display 
        user={user} 
        membershipValidUntil={membershipValidUntil} 
        />

        <EditForm 
        formGroups = {formGroups}
        membership = {membership}
        setNumberOfSemestersToSignUpFor ={ (onChangeEvent)=>{setNumberOfSemestersToSignUpFor(onChangeEvent)} }
        setPagesPrinted = {onChangeEvent=>{setPagesPrinted(onChangeEvent)}}
        handleSubmissionToggle = {()=>{handleSubmissionToggle()}}
        handleToggle = {()=>{setToggle(!toggle)}}
        setuserMembership = {(onChangeEvent)=>{setuserMembership(onChangeEvent)}}
        toggle = {toggle} 
        />

        <Modal
          style={
            {
              marginTop: '320px',
            }}
          isOpen={toggleSubmit}>
          <Button
            onClick={async () => { await handleSubmission() }}
            color="primary">
            YES!
          </Button>
          <Button
            style={{
              marginTop: '10px'
            }}
            onClick={() => handleSubmissionToggle()}
            color="danger">
            Nah! It's a mistake.
          </Button>
        </Modal>

      </ul>
    </div>
  )
}

