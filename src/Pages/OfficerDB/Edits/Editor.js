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
import Uploader, { upload, getFileName } from './Uploader'
import {
  deletePicture,
  editOfficer,
  editAccessLevel
} from '../../../APIFunctions/OfficerDB'

const enums = require('../../../Enums')

export default function Editor (props) {
  const [roleDropdown, setRoleDropdown] = useState(false)
  const [role, setRole] = useState(props.officer.role)
  const [accessLevel, setAccessLevel] = useState(props.officer.accessLevel)
  const [linkedIn, setLinkedIn] = useState('')
  const [github, setGithub] = useState('')
  const [quote, setQuote] = useState('')
  const [picture] = useState(props.officer.pictureName)
  const optionalInputs = [
    {
      placeholder: 'New linkedIn: ' + props.officer.linkedIn,
      onChange: event => setLinkedIn(event.target.value)
    },
    {
      placeholder: 'New github: ' + props.officer.github,
      onChange: event => setGithub(event.target.value)
    },
    {
      placeholder: 'New quote: ' + props.officer.quote,
      onChange: event => setQuote(event.target.value)
    }
  ]

  async function handleSubmitOfficer () {
    let newPic = ''
    // update image if change
    if (getFileName()) {
      deletePicture(picture)
      newPic = getFileName()
      // upload picture
      upload()
    }

    const officer = props.officer && {
      pictureName: newPic || picture,
      name: props.officer.name,
      email: props.officer.email,
      accessLevel: accessLevel,
      linkedIn: linkedIn,
      github: github,
      quote: quote,
      role: role
    }
    // Delete empty fields
    !officer.linkedIn && delete officer.linkedIn
    !officer.github && delete officer.github
    !officer.quote && delete officer.quote

    // post to db
    await editOfficer(officer, props.user.token)

    // change user accessLevel
    await editAccessLevel(props.officer.email, accessLevel, props.user.token)
  }

  function checkAllFields () {
    !props.officer && window.alert('Please pick someone')
    !role && window.alert('Please pick a role')
    return props.officer && role
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
        {props.officer.name}
      </ModalHeader>

      <ModalBody>
        <h3>Role: </h3>
        <Dropdown
          isOpen={roleDropdown}
          toggle={() => {
            setRoleDropdown(!roleDropdown)
          }}
        >
          <DropdownToggle caret>{role}</DropdownToggle>
          <DropdownMenu>
            <DropdownItem header>
              <Input placeholder='Search' />
            </DropdownItem>

            <DropdownItem divider />
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
        getOfficers={() => {
          props.getOfficers()
        }}
        toggle={() => props.setToggle()}
        check={() => checkAllFields()}
        submit={() => handleSubmitOfficer()}
      />
    </Modal>
  )
}
