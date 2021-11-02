import React, { useState } from 'react';
import './DoorCode.css';
import {
  Button,
  FormGroup,
  Form,
  Input,
  Modal,
  Label,
  ModalBody,
  ModalFooter,
  ModalHeader
} from 'reactstrap';
import ConfirmationModal from
  '../../Components/DecisionModal/ConfirmationModal.js';
const svg = require('./SVG');

export default function DoorCodeProfile(props) {
  const [code, setCode] = useState('');
  const [date, setDate] = useState('');
  const [toggleDelete, setToggleDelete] = useState(false);
  const [toggleEdit, setToggleEdit] = useState(false);
  const confirmModalProps = {
    headerText: `Delete ${props.doorcode} ?`,
    bodyText: `Are you sure you want to delete 
    ${props.doorcode}?`,
    confirmText: `Yes, delete ${props.doorcode}`,
    cancelText: 'No',
    toggle: () => setToggleDelete(!toggleDelete),
    handleConfirmation: () => {
      props.deleteDoor(props.code);
      setToggleDelete(!toggleDelete);
    },
    open: toggleDelete
  };

  return (
    <tr className='doorcode-table-row'>
      <td>{ props.doorcode }</td>
      <td>{ props.expire }</td>
      <td className = 'content-table-emails'>{ props.emails }</td>
      <td>
        <button
          onClick={() => {
            setToggleDelete(!toggleDelete);
          }}
        >
          {svg.trashcanSymbol()}
        </button>
      </td>
      <td>
        <button
          onClick={() => {
            setToggleEdit(!toggleEdit);
          }}
        >
          {svg.editSymbol()}
        </button>
      </td>

      <ConfirmationModal {...confirmModalProps} />

      <Modal
        isOpen={toggleEdit}
        toggle={()=>{
          setToggleEdit(!toggleEdit);
        }}
      >
        <ModalHeader
          toggle={()=>{
            setToggleEdit(!toggleEdit);
          }}
        >
          Edit Doorcode
        </ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label>Doorcode</Label>
              <Input
                type='String'
                onChange={(e) => setCode(e.target.value)}
                placeholder={props.doorcode}
              />
            </FormGroup>
            <FormGroup>
              <Label>Expire Date</Label>
              <Input
                type='Date'
                onChange={(e) => setDate(e.target.value)}
                placeholder={props.expire}
              />
            </FormGroup>
          </Form>
        </ModalBody>

        <ModalFooter>
          <Button
            color='secondary'
            onClick={() => {
              setToggleEdit(!toggleEdit);
              props.editDoor(props.code, code, date);
            }}
          >
            Edit
          </Button>
          <Button
            color='secondary'
            onClick={() => {
              setToggleEdit(!toggleEdit);
            }}
          >
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </tr>
  );
}
