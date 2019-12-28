import React, { useState } from "react";
//import "./profile.css";
import {
  Container,
  Button,
  Row,
  Col,
  FormGroup,
  Form,
  Input,
  Modal,
  Label,
  ModalBody,
  ModalFooter,
  ModalHeader
} from "reactstrap";
import axios from 'axios'
const bcrypt = require('bcrypt-nodejs')
const enums = require( '../../../Enums' )
const display = require ('./profile.js')

export default function Editor(props) {
  // first name, last name, middle initial, email, pass, door code
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [middleInitial, setMiddleInitial] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [doorCode, setDoorCode] = useState("")
  const [major,setMajor] = useState("")
  const [user, setUser] = useState({ ...props.user })
  const [toggle, setToggle] = useState(false)
  const [pagesPrinted, setPagesPrinted] = useState(user.pagesPrinted)
  const [toggleSubmit, setToggleSubmit] = useState(false)
  const [userMembership, setuserMembership] = useState(user.accessLevel)
  const [numberOfSemestersToSignUpFor, setNumberOfSemestersToSignUpFor] = useState(undefined)
  const [membershipValidUntil, setMembershipValidUntil] = useState(user.membershipValidUntil)

  function handleToggle() {
    setToggle(!toggle)
  }

  async function handleSubmission() {
    const queryEmail = user.email

    //hash pass
    const salt = bcrypt.genSaltSync(10)
    const hashed = (password.trim()==='') ?
    user.password : bcrypt.hashSync(password, salt)

    //Change term?
    numberOfSemestersToSignUpFor===0 &&
    setNumberOfSemestersToSignUpFor(undefined)

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

    setUser({...editedUser})
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

  function editModalButton() {
    let formGroups = [
      {
        label: 'First Name',
        placeholder: user.firstName,
        onChange: (e) => setFirstName(e.target.value)
      },
      {
        label: 'Last Name',
        placeholder: user.lastName,
        onChange: (e) => setLastName(e.target.value)
      },
      {
        label: 'Middle Initial',
        placeholder: user.middleInitial,
        onChange: (e) => setMiddleInitial(e.target.value)
      },
      {
        label: 'Email',
        type: 'email',
        placeholder: user.email,
        onChange: (e) => setEmail(e.target.value)
      },
      {
        label: 'Password',
        type: 'password',
        placeholder: 'make it secure',
        onChange: (e) => setPassword(e.target.value)
      },
      {
        label: 'Door Code',
        placeholder: 'make it secure',
        onChange: (e) => setDoorCode(e.target.value)
      },
      {
        label: 'Major',
        placeholder: user.major,
        onChange: (e) => setMajor(e.target.value)
      }
    ]

    return (
      <div>
        <div>
          <Button
            color="primary"
            style={{
              position: 'relative',
              left: '80%'
            }}
            onClick={() => { handleToggle() }}>
            Edit
          </Button>
        </div>

        <Modal isOpen={toggle}>
          <ModalHeader>Modal title</ModalHeader>
          <ModalBody>
            <Form>

              {formGroups.map((group, index) => {
                return <FormGroup key={index}>
                  <Label>{group.label}</Label>
                  <Input
                    type={group.type || 'email'}
                    name={group.type}
                    placeholder={group.placeholder}
                    onChange={group.onChange}
                  />
                </FormGroup>
              })}

              Change expiration date to
              <select onChange={(e)=>{setNumberOfSemestersToSignUpFor(e.target.value)}}>
                {
                  [{value:0, name:'Keep Same'},
                  {value:0, name:'Expired Membership'},
                  {value:1, name:'This semester'},
                  {value:2, name:'2 semesters'}
                ].map((ele, ind)=>{
                return <option key ={ind} value={ele.value}>{ele.name}</option>
                })}
              </select>

              <Button
                type='button'
                onClick={() => {
                  setPagesPrinted(0);
                }}
                color="info"
                style={{marginTop:'5px'}}>
                Reset Pages!
              </Button>

              <FormGroup tag="fieldset">
                <legend>Membership Status</legend>
                {enums.getAllValues(enums.membershipStatus).map((membership, index) => {
                  return <FormGroup check key={index}>
                    <Label check>
                      <Input
                        type="radio"
                        name="radio1"
                        value={membership}
                        onChange={() => {
                          setuserMembership(membership)
                        }}
                      />
                      {enums.getKey(enums.membershipStatus,membership)}
                    </Label>
                  </FormGroup>
                })}
              </FormGroup>

            </Form>
          </ModalBody>

          <ModalFooter>
            <Button
              color="primary"
              onClick={() => { handleSubmissionToggle() }}>
              Submit
            </Button>
            <Button
              color="secondary"
              onClick={() => { handleToggle() }}>
              Cancel
            </Button>
          </ModalFooter>

        </Modal>
      </div>
    );
  }

  return (
    <div>
      <div>
        <div className="center">
          <ul className="profileInfo">
            <Container>
              <img
                alt='profile'
                style={{ height: '300px' }}
                src='images/SCE-glow.png' />
            </Container>

            {display.displayProfile(user, membershipValidUntil)}

            <Row>
              <Col>{editModalButton()}</Col>
            </Row>

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
      </div>
    </div>
  )
}

