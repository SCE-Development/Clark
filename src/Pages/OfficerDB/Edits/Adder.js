import React, { useState } from 'react'
import {
  Modal,
  ModalHeader,
  ModalBody,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Input
} from 'reactstrap'
import ConfirmModule from './ConfirmationModule'
import Uploader, { upload, getFileName, checkUpload } from './Uploader'
import {
  submitOfficer,
  editAccessLevel,
  checkExistedUser
} from '../../../APIFunctions/OfficerDB'

const enums = require('../../../Enums')

export default function Adder (props) {
  const [personDropdown, setPersonDropdown] = useState(false)
  const [roleDropdown, setRoleDropdown] = useState(false)
  const [person, setPerson] = useState('')
  const [role, setRole] = useState('')
  const [accessLevel, setAccessLevel] = useState('')
  const [linkedIn, setLinkedIn] = useState('')
  const [github, setGithub] = useState('')
  const [quote, setQuote] = useState('')
  const [queryUsers, setQueryUsers] = useState('')
  const optionalInputs = [
    {
      placeholder: 'linkedIn',
      onChange: event => setLinkedIn(event.target.value)
    },
    {
      placeholder: 'Github',
      onChange: event => setGithub(event.target.value)
    },
    {
      placeholder: 'Quote',
      onChange: event => setQuote(event.target.value)
    }
  ]

  function findUser (query) {
    query.toLowerCase().trim()
      ? setQueryUsers(
        props.users.filter(user =>
          user.firstName.toLowerCase().includes(query)
        )
      )
      : setQueryUsers('')
  }

  async function handleSubmitOfficer () {
    const officer = person && {
      name:
        person.firstName +
        ' ' +
        person.lastName +
        ' ' +
        person.middleInitial[0] +
        '.',
      email: person.email,
      accessLevel: accessLevel,
      linkedIn: linkedIn,
      github: github,
      quote: quote,
      role: role,
      pictureName: getFileName()
    }
    // Delete empty fields
    !officer.linkedIn && delete officer.linkedIn
    !officer.github && delete officer.github
    !officer.quote && delete officer.quote

    // post to db
    await submitOfficer(officer, props.user.token)

    // uploading pictures to Firebase
    upload()

    // change user accessLevel
    await editAccessLevel(person.email, accessLevel, props.user.token)
  }

  async function checkAllFields () {
    let status = true

    if (!person) {
      window.alert('Please pick someone')
      status = false
    }
    if (!role) {
      window.alert('Please pick a role')
      status = false
    }
    if (!checkUpload()) status = false
    if (!(await checkExistedUser(person.email, props.user.token))) {
      status = false
    }

    return status
  }

  return (
    <Modal
      isOpen={props.toggle}
      toggle={() => {
        props.setToggle()
      }}
    >
      <ModalHeader
        onClick={() => {
          props.setToggle()
        }}
      >
        Add An Officer
      </ModalHeader>

      <ModalBody>
        <h3>Who?</h3>
        <Dropdown
          isOpen={personDropdown}
          toggle={() => {
            setPersonDropdown(!personDropdown)
          }}
        >
          <DropdownToggle caret>
            {person.firstName ? person.firstName : 'Choose One'}
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem header>
              <Input
                onChange={event => {
                  findUser(event.target.value)
                }}
                placeholder='Search First Name'
              />
            </DropdownItem>

            <DropdownItem divider />
            {queryUsers
              ? queryUsers.map((user, ind) => (
                <DropdownItem
                  key={ind}
                  onClick={() => {
                    setPerson(user)
                    setQueryUsers('')
                  }}
                >
                  {user.firstName} {user.lastName} {user.middleInitial[0]}.
                </DropdownItem>
              ))
              : props.users.map((user, ind) => (
                <DropdownItem
                  key={ind}
                  onClick={() => {
                    setPerson(user)
                    setQueryUsers('')
                  }}
                >
                  {user.firstName} {user.lastName} {user.middleInitial[0]}.
                </DropdownItem>
              ))}
          </DropdownMenu>
        </Dropdown>

        <h3>Role: </h3>
        <Dropdown
          isOpen={roleDropdown}
          toggle={() => {
            setRoleDropdown(!roleDropdown)
          }}
        >
          <DropdownToggle caret>{role || 'Choose One'}</DropdownToggle>
          <DropdownMenu>
            {Object.values(enums.officerRole).map((role, ind) => (
              <DropdownItem
                key={ind}
                onClick={() => {
                  setAccessLevel(1)
                  setRole(role)
                }}
              >
                {role}
              </DropdownItem>
            ))}
            {Object.values(enums.chairRole).map((role, ind) => (
              <DropdownItem
                key={ind}
                onClick={() => {
                  setAccessLevel(2)
                  setRole(role)
                }}
              >
                {role}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>

        <Uploader />

        <h3>Info (Optional): </h3>
        {optionalInputs.map((field, ind) => (
          <Input
            key={ind}
            placeholder={field.placeholder}
            onChange={event => field.onChange(event)}
          />
        ))}
      </ModalBody>

      <ConfirmModule
        getOfficers={async () => {
          await props.getOfficers()
        }}
        toggle={() => props.setToggle()}
        check={() => checkAllFields()}
        submit={() => handleSubmitOfficer()}
      />
    </Modal>
  )
}
