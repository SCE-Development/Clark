import React, { useState } from 'react';
import {
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Input,
  InputGroup,
  Col,
  Row,
  InputGroupAddon,
} from 'reactstrap';
import { RFIDModalState } from '../../Enums';
import ConfirmationModal
from '../../Components/DecisionModal/ConfirmationModal.js';

function RFIDManagerModal(props) {
  const { modal, toggle, modalState } = props;
  const [name, setName] = useState(props.name);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [created, setCreated] = useState(props.created);
  const [clickedSubmit, setClickedSubmit] = useState(false);

  function toggleConfirmationModal() {
    setConfirmationModal(!confirmationModal);
  }

  async function handleDeletion() {
    // eslint-disable-next-line
    await props.handleDelete({ _id: props._id });
    await props.populateRFIDList();
    toggleConfirmationModal();
    props.toggle();
  }

  const confirmModalProps = {
    headerText: `Delete ${props.name} ?`,
    bodyText: 'The RFID will be gone forever if you do this.',
    toggle: toggleConfirmationModal,
    handleConfirmation: handleDeletion,
    open: confirmationModal,
  };
  let inputMatrix = [
    [
      {
        addon: 'RFID Holder*',
        type: 'text',
        disabled: false,
        maxLength: '25',
        defaultValue: props.name,
        placeholder: 'First & Last Name',
        handleChange: (e) => setName(e.target.value),
        ifRequirementsNotMet: (name === undefined || name === '') &&
          clickedSubmit && <p className='unavailable'>Please input a name!</p>,
      },
    ],
    [],
    [],
  ];
  if (modalState === RFIDModalState.DELETE) {
    inputMatrix[0][0].disabled = true;
    inputMatrix[2].push({
      addon: 'Created On:',
      type: 'text',
      disabled: true,
      maxLength: '10',
      defaultValue: props.created.substring(0, 10),
      handleChange: (e) => setName(e.target.value),
    });
  }
  function requiredFieldsFilledIn() {
    if (props.modalState === RFIDModalState.DELETE) {
      return name !== '';
    } else if (props.modalState === RFIDModalState.SUBMIT) {
      return name !== undefined;
    }
    return false;
  }

  async function handleSubmission(requiredFieldsFilled) {
    setClickedSubmit(true);
    if (requiredFieldsFilled) {
      const RFIDFields = {
        name,
        created: new Date(created),
      };
      await props.handleSubmit({ _id: props._id, ...RFIDFields });
      await props.populateRFIDList();
      props.toggle();
    }
  }

  function processRequest() {
    const passed = requiredFieldsFilledIn();
    handleSubmission(passed);
  }

  return (
    <div>
      <ConfirmationModal {...confirmModalProps} />
      <Modal isOpen={modal} size='xlg' toggle={toggle}>
        <ModalHeader>
          <Col>
            <Row>
              {modalState === RFIDModalState.SUBMIT ? 'Create New ' : 'Delete '}
              RFID
            </Row>
          </Col>
        </ModalHeader>
        <ModalBody>
          <span>
            <span style={{ color: 'red', display: 'inline' }} color='red'>
              *
            </span>
            = This is a required field
          </span>
          {inputMatrix.map((row, index) => {
            return (
              <Row key={index}>
                {row.map((input, index) => {
                  return (
                    <Col key={index}>
                      <InputGroup className='rfid-input-group'>
                        <InputGroupAddon addonType='prepend'>
                          {input.addon}
                        </InputGroupAddon>
                        <Input
                          type={input.type}
                          disabled={input.disabled}
                          maxLength={input.maxLength}
                          defaultValue={input.defaultValue}
                          placeholder={input.placeholder}
                          onChange={input.handleChange}
                          children={input.children}
                        />
                      </InputGroup>
                      {input.ifRequirementsNotMet}
                    </Col>
                  );
                })}
              </Row>
            );
          })}
        </ModalBody>
        <ModalFooter>
          <Button color='secondary' onClick={toggle}>
            Cancel
          </Button>
          {modalState === RFIDModalState.DELETE ? (
            <Button color='danger' onClick={toggleConfirmationModal}>
              Delete RFID
            </Button>
          ) : (
            <Button color='primary' onClick={handleSubmission}>
              Submit
            </Button>
          )}
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default RFIDManagerModal;
