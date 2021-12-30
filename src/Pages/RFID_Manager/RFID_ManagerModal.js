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
  Label,
  Row,
  InputGroupAddon
} from 'reactstrap';
import { eventModalState } from '../../Enums';
import {DEFAULT_PICS} from '../../Enums.js';
import { convertTime12to24, convertTime24to12 } from '../../APIFunctions/Event';
import { validateImageURL } from '../../APIFunctions/Image.js';
import ConfirmationModal from
'../../Components/DecisionModal/ConfirmationModal.js';

function EventManagerModal(props) {
  const NOT_FOUND_PNG = DEFAULT_PICS.EVENT;
  const { modal, toggle, modalState } = props;
  const [name, setName] = useState(props.name);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [imagePreviewURL, setImagePreviewURL] = useState(NOT_FOUND_PNG);
  const [clickedSubmit, setClickedSubmit] = useState(false);
  const [requiredFieldsFilled, setRequiredFieldsFilled] = useState(false);

  function toggleConfirmationModal() {
    setConfirmationModal(!confirmationModal);
  }

  async function handleDeletion() {
    await props.handleDelete({ _id: props._id });
    await props.populateEventList();
    toggleConfirmationModal();
    props.toggle();
  }

  const confirmModalProps = {
    headerText: `Delete ${props.name} ?`,
    bodyText: 'The event will be gone forever if you do this.',
    toggle: toggleConfirmationModal,
    handleConfirmation: handleDeletion,
    open: confirmationModal
  };
  const inputMatrix = [
    [
      {
        addon: 'Name*',
        type: 'text',
        maxLength: '25',
        defaultValue: props.name,
        placeholder: 'e.g. Name',
        handleChange: e => setName(e.target.value),
        ifRequirementsNotMet: (name === undefined || name === '')
          && clickedSubmit && (
          <p className='unavailable'>Please input a name!</p>
        ),
      },
    ]
  ];

  function requiredFieldsFilledIn() {
    if (props.modalState === eventModalState.EDIT) {
      return (
        name !== ''
      );
    } else if (props.modalState === eventModalState.SUBMIT) {
      return (
        name !== undefined
      );
    }
    return false;
  }

  async function handleSubmission() {
    setClickedSubmit(true);
    if (requiredFieldsFilled) {
      const eventFields = {
        name,
        imageURL: imagePreviewURL === NOT_FOUND_PNG ?
          undefined : imagePreviewURL
      };

      await props.handleSubmit({ _id: props._id, ...eventFields });
      await props.populateEventList();
      props.toggle();
    }
  }

  function processRequest() {
    const passed = requiredFieldsFilledIn();
    setRequiredFieldsFilled(passed);
    handleSubmission();
  }

  async function handleURLChange(url) {
    let urlValid = false;
    await validateImageURL(url)
      .then(() => (urlValid = true))
      .catch(() => (urlValid = false));
    setImagePreviewURL(urlValid ? url : NOT_FOUND_PNG);
  }

  return (
    <div>
      <ConfirmationModal {...confirmModalProps} />
      <Modal isOpen={modal} size='lg' toggle={toggle}>
        <ModalHeader>
          <Col>
            <Row>
              {modalState === eventModalState.SUBMIT ? 'Create New ' : 'Edit '}
          Event
            </Row>
          </Col>
        </ModalHeader>
        <ModalBody>
          <span>
            <span color='red'>*</span>= This is a required field
          </span>
          {inputMatrix.map((row, index) => {
            return (
              <Row key={index}>
                {row.map((input, index) => {
                  return (
                    <Col key={index}>
                      <InputGroup className='event-input-group'>
                        <InputGroupAddon addonType='prepend'>
                          {input.addon}
                        </InputGroupAddon>
                        <Input
                          type={input.type}
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
          {modalState === eventModalState.EDIT ? (
            <Button color='danger' onClick={toggleConfirmationModal}>
              Delete Event
            </Button>
          ) : (
            <></>
          )}
          <Button
            color='primary'
            onClick={processRequest}
          >
            {modalState === eventModalState.SUBMIT
              ? 'Create New Event'
              : 'Submit Changes'}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default EventManagerModal;
