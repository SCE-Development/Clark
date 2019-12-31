import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Modal, Button, ModalHeader, ModalBody } from 'reactstrap'
import Editor from './Edits/Editor'
import { deletePicture } from '../../APIFunctions/OfficerDB'
import { editSymbol, trashcanSymbol } from './SVG'

export default function InfoRow (props) {
  const [toggleEdit, setToggleEdit] = useState(false)
  const [toggleDelete, setToggleDelete] = useState(false)
  // displaying each row of the map, used for mapping
  return (
    <tr>
      <td>{props.officer.name}</td>
      <td>{props.officer.role}</td>
      <td>{props.officer.linkedIn}</td>
      <td>{props.officer.github}</td>
      <td>{props.officer.quote}</td>
      <td
        onClick={() => {
          setToggleEdit(!toggleEdit)
        }}
      >
        {editSymbol()}
      </td>
      <Editor
        toggle={toggleEdit}
        officer={props.officer}
        user={props.user}
        getOfficers={() => props.getOfficers()}
        setToggle={() => {
          setToggleEdit(!toggleEdit)
        }}
      />
      <td
        onClick={() => {
          setToggleDelete(!toggleDelete)
        }}
      >
        {trashcanSymbol()}
      </td>

      <Modal
        style={{
          marginTop: '200px'
        }}
        isOpen={toggleDelete}
      >
        <ModalHeader>
          Delete {props.officer.name}? They will become a member instead!
        </ModalHeader>

        <ModalBody>
          <Button
            style={{ marginLeft: '10%' }}
            color='danger'
            onClick={async () => {
              await props.deleteOfficer(props.officer.email)
              deletePicture(props.officer.pictureName)
              setToggleDelete(!toggleDelete)
              props.getOfficers()
            }}
          >
            Purge!
          </Button>
          <Button
            style={{
              marginLeft: '45%'
            }}
            color='primary'
            onClick={() => {
              setToggleDelete(!toggleDelete)
            }}
          >
            Nah!
          </Button>
        </ModalBody>
      </Modal>
    </tr>
  )
}
