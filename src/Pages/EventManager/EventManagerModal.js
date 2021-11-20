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
  const [title, setTitle] = useState(props.title);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [description, setDescription] = useState(props.description);
  const [eventLocation, setEventLocation] = useState(props.eventLocation);
  const [eventDate, setEventDate] = useState(props.eventDate);
  const [startTime, setStartTime] = useState(props.startTime);
  const [endTime, setEndTime] = useState(props.endTime);
  const [eventCategory, setEventCategory] = useState(props.eventCategory);
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
    headerText: `Delete ${props.title} ?`,
    bodyText: 'The event will be gone forever if you do this.',
    toggle: toggleConfirmationModal,
    handleConfirmation: handleDeletion,
    open: confirmationModal
  };
  const inputMatrix = [
    [
      {
        addon: 'Event Title*',
        type: 'text',
        maxLength: '25',
        defaultValue: props.title,
        placeholder: 'e.g. Python Workshop',
        handleChange: e => setTitle(e.target.value),
        ifRequirementsNotMet: (title === undefined || title === '')
          && clickedSubmit && (
          <p className='unavailable'>Please input a title!</p>
        ),
      },
      {
        addon: 'Event Date*',
        type: 'date',
        defaultValue: props.eventDate ? props.eventDate.slice(0, 10) : '',
        handleChange: e => {
          setEventDate(e.target.value);
        },
        ifRequirementsNotMet: (eventDate === undefined || eventDate === '')
          && clickedSubmit && (
          <p className='unavailable'>Please input a date!</p>
        ),
      }
    ],
    [
      {
        addon: 'Event Location*',
        type: 'text',
        maxLength: '25',
        defaultValue: props.eventLocation,
        placeholder: 'e.g. ENGR 294',
        handleChange: e => setEventLocation(e.target.value),
        ifRequirementsNotMet: (eventLocation === undefined ||
          eventLocation === '') && clickedSubmit && (
          <p className='unavailable'>Please input a location!</p>
        ),
      },
      {
        addon: 'Event Category',
        type: 'select',
        defaultValue: props.eventCategory,
        children: (
          <>
            <option />
            <option>Social Event</option>
            <option>Company Tour</option>
            <option>Workshop</option>
          </>
        ),
        handleChange: e => setEventCategory(e.target.value)
      }
    ],
    [
      {
        addon: 'Start Time*',
        type: 'time',
        defaultValue: convertTime12to24(props.startTime),
        handleChange: e => setStartTime(e.target.value),
        ifRequirementsNotMet: startTime === undefined && clickedSubmit && (
          <div className='unavailable'>Please input a time!</div>
        ),
      },
      {
        addon: 'End Time*',
        type: 'time',
        defaultValue: convertTime12to24(props.endTime),
        handleChange: e => setEndTime(e.target.value),
        ifRequirementsNotMet: endTime === undefined && clickedSubmit && (
          <p className='unavailable'>Please input a time!</p>
        ),
      }
    ]
  ];

  function requiredFieldsFilledIn() {
    if (props.modalState === eventModalState.EDIT) {
      return (
        title !== '' &&
        eventDate !== '' &&
        startTime !== '' &&
        endTime !== '' &&
        eventLocation !== ''
      );
    } else if (props.modalState === eventModalState.SUBMIT) {
      return (
        title !== undefined &&
        eventDate !== undefined &&
        startTime !== undefined &&
        endTime !== undefined &&
        eventLocation !== undefined
      );
    }
    return false;
  }

  async function handleSubmission() {
    setClickedSubmit(true);
    if (requiredFieldsFilled) {
      const eventFields = {
        title,
        description,
        eventLocation,
        eventDate: new Date(eventDate),
        startTime:
          props.startTime === startTime
            ? startTime
            : convertTime24to12(startTime),
        endTime: props.endTime === endTime ?
          endTime : convertTime24to12(endTime),
        eventCategory,
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
          <Row className='container'>
            <Label>Event Description</Label>
            <Input
              type='textarea'
              maxLength={100}
              rows={5}
              placeholder='Enter Event Description'
              defaultValue={props.description}
              onChange={e => setDescription(e.target.value)}
            />
          </Row>
          <Row className='modal-event-image'>
            <Label>Event Image + Preview</Label>
            <Input
              type='text'
              placeholder='Enter URL Here'
              defaultValue={props.imageURL}
              onChange={e => handleURLChange(e.target.value)}
            />
            <p className='modal-image-container'>
              <img
                id='event-img'
                src={props.imageURL || imagePreviewURL}
                alt='event visual'
              />
            </p>
          </Row>
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
