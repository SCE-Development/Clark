import React, { useState } from 'react'
import './Overview.css'
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap'
import InfoCard from '../Profile/admin/AdminView'
const enums = require('../../Enums.js')
const svg = require('./SVG')

// displaying children of member-board
export default function OverviewProfile (props) {
  const [toggle, setToggle] = useState(false)
  const [toggleDelete, setToggleDelete] = useState(false)

  function mark (bool) {
    return bool ? svg.checkMark() : svg.xMark()
  }

  return (
    <tr>
      <td>
        {props.user.firstName[0].toUpperCase() +
          props.user.firstName.slice(1, props.user.firstName.length) +
          ' ' +
          props.user.lastName[0].toUpperCase() +
          props.user.lastName.slice(1, props.user.lastName.length)}
        {props.user.middleInitial.trim() !== '' &&
          ' ' + props.user.middleInitial.toUpperCase() + '.'}
      </td>

      <td>{props.user.doorCode}</td>

      <td>{props.user.pagesPrinted}/30</td>

      <td>{mark(props.user.emailVerified)}</td>

      <td>{enums.memberShipPlanToString(props.user.accessLevel)}</td>

      <td>{enums.membershipStateToString(props.user.accessLevel)}</td>

      <td>
        <button
          className='delete'
          onClick={() => {
            setToggleDelete(!toggleDelete)
          }}
        >
          {svg.trashcanSymbol()}
        </button>
      </td>

      <td>
        <button
          className='delete'
          onClick={() => {
            setToggle(!toggle)
          }}
        >
          {svg.editSymbol()}
        </button>
      </td>

      <Modal isOpen={toggle}>
        {svg.cancelEditSymbol(props.callDatabase, () => {
          setToggle(!toggle)
        })}
        <InfoCard user={props.user} token={props.token} />
      </Modal>

      <Modal isOpen={toggleDelete}>
        <ModalHeader>ARE YOU SURE?</ModalHeader>
        <ModalBody>
          Are you sure you want to delete this user? They're kinda cute and
          they'll be gone forever if you do.
        </ModalBody>
        <ModalFooter>
          <Button
            color='danger'
            onClick={() => {
              props.deleteUser(props.user)
              setToggleDelete(!toggleDelete)
            }}
          >
            Yes, they're dead to me
          </Button>
          <Button
            color='light'
            onClick={() => {
              setToggleDelete(!toggleDelete)
            }}
          >
            No, they're chill
          </Button>
        </ModalFooter>
      </Modal>
    </tr>
  )
}
