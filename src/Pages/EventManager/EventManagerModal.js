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
import { modalStates } from '../../Enums';
import { convertTime12to24, convertTime24to12 } from '../../APIFunctions/Event';
import { validateImageURL } from '../../APIFunctions/Image.js';
import ConfirmationModal from
  '../../Components/DecisionModal/ConfirmationModal.js';

function EventManagerModal(props) {
  const NOT_FOUND_PNG =
    'https://i.gyazo.com/640f22609f95f72a28afa0a130e557a1.png';
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
        // maxLength: '25',
        defaultValue: props.title,
        placeholder: 'e.g. Python Workshop',
        handleChange: e => setTitle(e.target.value)
      },
      {
        addon: 'Event Date*',
        type: 'date',
        defaultValue: props.eventDate ? props.eventDate.slice(0, 10) : '',
        handleChange: e => {
          setEventDate(e.target.value);
        }
      }
    ],
    [
      {
        addon: 'Event Location*',
        type: 'text',
        // maxLength: '25',
        defaultValue: props.eventLocation,
        placeholder: 'e.g. ENGR 294',
        handleChange: e => setEventLocation(e.target.value),
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
        handleChange: e => setStartTime(e.target.value)
      },
      {
        addon: 'End Time*',
        type: 'time',
        defaultValue: convertTime12to24(props.endTime),
        handleChange: e => setEndTime(e.target.value)
      }
    ]
  ];

  async function handleSubmission() {
    const eventFields = {
      title,
      description,
      eventLocation,
      eventDate: new Date(eventDate),
      startTime:
        props.startTime === startTime
          ? startTime
          : convertTime24to12(startTime),
      endTime: props.endTime === endTime ? endTime : convertTime24to12(endTime),
      eventCategory,
      imageURL: imagePreviewURL === NOT_FOUND_PNG ? undefined : imagePreviewURL
    };

    await props.handleSubmit({ _id: props._id, ...eventFields });
    await props.populateEventList();
    props.toggle();
  }

  async function handleURLChange(url) {
    let urlValid = false;
    await validateImageURL(url)
      .then(() => (urlValid = true))
      .catch(() => (urlValid = false));
    setImagePreviewURL(urlValid ? url : NOT_FOUND_PNG);
  }

  function requiredFieldsFilledIn() {
    if (props.modalState === modalStates.EDIT) {
      return (
        title !== '' &&
        eventDate !== '' &&
        startTime !== '' &&
        endTime !== '' &&
        eventLocation !== ''
      );
    } else if (props.modalState === modalStates.SUBMIT) {
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

  return (
    <div>
      <ConfirmationModal {...confirmModalProps} />
      <Modal isOpen={modal} size='lg' toggle={toggle}>
        <ModalHeader>
          <Col>
            <Row>
              {modalState === modalStates.SUBMIT ? 'Create New ' : 'Edit '}
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
          {modalState === modalStates.EDIT ? (
            <Button color='danger' onClick={toggleConfirmationModal}>
              Delete Event
            </Button>
          ) : (
            <></>
          )}
          <Button
            color='primary'
            onClick={handleSubmission}
            disabled={!requiredFieldsFilledIn()}
          >
            {modalState === modalStates.SUBMIT
              ? 'Create New Event'
              : 'Submit Changes'}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default EventManagerModal;
