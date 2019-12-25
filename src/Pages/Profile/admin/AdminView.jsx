import React, { useState } from "react";
//import "./profile.css";
import {
  Container,
  Badge,
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

function ProfilePage(props) {
  // first name, last name, middle initial, email, pass, door code
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [middleInitial, setMiddleInitial] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [doorCode, setDoorCode] = useState("")
  const [user, setUser] = useState({ ...props.user })
  const [toggle, setToggle] = useState(false)
  const [pagesPrinted, setPagesPrinted] = useState(user.pagesPrinted)
  const [toggleSubmit, setToggleSubmit] = useState(false)
  const [userMembership, setuserMembership] = useState(user.accessLevel)

  function handleToggle() {
    setToggle(!toggle)
  }

  async function handleSubmission() {
    const queryEmail = user.email
    const salt = bcrypt.genSaltSync(10)
    const hashed = (password.trim()==='') ?
    user.password : bcrypt.hashSync(password, salt)

    const editedUser = {
      ...user,
      firstName: firstName || user.firstName,
      lastName: lastName || user.lastName,
      middleInitial: middleInitial || user.middleInitial,
      email: email || user.email,
      password: hashed,
      doorCode: doorCode || user.doorCode,
      pagesPrinted: pagesPrinted,
      accessLevel: userMembership
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
          //setUser(result.data)
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

  /*
  translating access Level into role
  The access level is defined as follows:
  -2: Ban
  -1: Pending
   0: Member
   1: Officer
   2: Admin
  */
  function roleTranslator(level) {
    switch (level) {
      case -2:
        return 'Ban'
      case 0:
        return 'Member'
      case 1:
        return 'Officer'
      case 2:
        return 'Admin'
      default:
        return 'Pending'
    }
  }

  function editModalButton() {
    let FormGroups = [
      {
        label: 'First Name',
        type: 'email',
        placeholder: user.firstName,
        onChange: (e) => setFirstName(e.target.value)
      },
      {
        label: 'Last Name',
        type: 'email',
        placeholder: user.lastName,
        onChange: (e) => setLastName(e.target.value)
      },
      {
        label: 'Middle Initial',
        type: 'email',
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
        type: 'email',
        placeholder: 'make it secure',
        onChange: (e) => setDoorCode(e.target.value)
      }
    ]

    /*
    translating access Level into role
    The access level is defined as follows:
    -2: Ban
    -1: Pending
     0: Member
     1: Officer
     2: Admin
    */
    let memberships = [0, 1, -1, 2, -2]

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

              {FormGroups.map((group, index) => {
                return <FormGroup key={index}>
                  <Label>{group.label}</Label>
                  <Input
                    type={group.type}
                    name={group.type}
                    placeholder={group.placeholder}
                    onChange={group.onChange}
                  />
                </FormGroup>
              })}

              {/*Need Improvements, not doing anything currently*/}
              {/* <FormGroup>
                <Label for="exampleFile">Upload New Profile Picture</Label>
                <Input
                  type="file"
                  name="file"
                  id="exampleFile"
                  onChange={event => {
                    change(event, "profile");
                  }}
                />
                <FormText color="muted">(Not Working!)</FormText>
              </FormGroup> */}

              <Button
                type='button'
                onClick={() => {
                  setPagesPrinted(0);
                }}
                color="info">
                Reset Pages!
              </Button>

              <FormGroup tag="fieldset">
                <legend>Membership Status</legend>
                {memberships.map((membership, index) => {
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
                      {roleTranslator(membership)}
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

  function display() {
    return <div>
      <Badge color="primary">{roleTranslator(user.accessLevel)}</Badge>
      <h3>
        {user.firstName[0].toUpperCase() +
          user.firstName.slice(1, user.firstName.length) +
          ' ' +
          user.lastName[0].toUpperCase() +
          user.lastName.slice(1, user.lastName.length)}
        {user.middleInitial.trim() !== '' &&
          ' ' + user.middleInitial.toUpperCase() + '.'}
      </h3>
      <h5>Doorcode: {user.doorCode}</h5>
      <h5>Member Since (yyyy-mm-dd): {user.joinDate.slice(0, 10)}</h5>
      <h5>Expiration on (yyyy-mm-dd): {user.membershipValidUntil.slice(0, 10)}</h5>
      <h5>Email: {user.email}</h5>
      <h5>Major: {user.major}</h5>
      <h5>Pages Print: {user.pagesPrinted}/30</h5>
    </div>
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

            {display()}

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
                YES! mutate them!
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

export default ProfilePage;
