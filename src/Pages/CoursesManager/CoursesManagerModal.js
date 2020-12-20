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
import { validateImageURL } from '../../APIFunctions/Image.js';
import ConfirmationModal from
  '../../Components/DecisionModal/ConfirmationModal';

function CoursesManagerModal(props) {
  const NOT_FOUND_PNG = 'https://rb.gy/gnrdda';
  const { showModal, toggle, modalState } = props;
  const [title, setTitle] = useState(props.title);
  const [author, setAuthor] = useState(props.author);
  const [description, setDescription] = useState(props.description);
  const [imagePreviewURL, setImagePreviewURL] = useState(
    props.imageURL ? props.imageURL : NOT_FOUND_PNG);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const maxDescLength = 200;
  const lessons = props.lessons ? props.lessons : [];

  function toggleConfirmationModal() {
    setConfirmationModal(!confirmationModal);
  }

  async function handleURLChange(url) {
    let validURL = false;
    await validateImageURL(url)
      .then(() => validURL = true)
      .catch(() => validURL = false);
    setImagePreviewURL(validURL ? url : NOT_FOUND_PNG);
  }

  function validateFields() {
    return (
      title !== undefined &&
      author !== undefined &&
      description !== undefined &&
      title !== '' &&
      author !== '' &&
      description !== '' &&
      description.length <= maxDescLength
    );
  }

  async function handleDelete() {
    await props.handleDelete({ _id: props._id });
    await props.getCourses();
    toggleConfirmationModal();
    props.toggle();
  }
  const confirmationModalProps = {
    headerText: `Delete ${props.title} ?`,
    bodyText: 'The course will be gone forever if you do this.',
    toggle: toggleConfirmationModal,
    handleConfirmation: handleDelete,
    open: confirmationModal
  };

  const inputConstraint = [
    [
      {
        inputTitle: 'Title*',
        type: 'text',
        defaultValue: props.title,
        placeholder: 'e.g. Intro to Docker',
        handleChange: e => setTitle(e.target.value)
      },
      {
        inputTitle: 'Author*',
        type: 'text',
        defaultValue: props.author,
        placeholder: 'e.g. John Smith',
        handleChange: e => setAuthor(e.target.value)
      }
    ]
  ];

  async function handleCourseCreation() {
    const courseFields = {
      title,
      author,
      description,
      lessons,
      imageURL:
        imagePreviewURL === NOT_FOUND_PNG ? undefined : imagePreviewURL
    };

    await props.handleSubmit( props._id, { ...courseFields } );
    await props.getCourses();
    props.toggle();
  }

  return (
    <div>
      <ConfirmationModal {...confirmationModalProps} />
      <Modal isOpen={showModal} size='lg' toggle={toggle}>
        <ModalHeader>
          <Col>
            <Row>
              {modalState === modalStates.SUBMIT ? 'Create New ' : 'Edit '}
              Course
            </Row>
          </Col>
        </ModalHeader>
        <ModalBody>
          <span className='mb-3'>
            <span className='text-danger'>* = All fields must be filled</span>
          </span>
          {inputConstraint.map((row, index) =>{
            return (
              <Row key={index}>
                {row.map((constraint, index) => {
                  return (
                    <Col key={index}>
                      <InputGroup className="course-input-group mb-4">
                        <InputGroupAddon addonType="prepend">
                          {constraint.inputTitle}
                        </InputGroupAddon>
                        <Input
                          type={constraint.type}
                          defaultValue={constraint.defaultValue}
                          placeholder={constraint.placeholder}
                          onChange={constraint.handleChange}
                        />
                      </InputGroup>
                    </Col>
                  );
                })}
              </Row>
            );
          })}
          <Row className="container">
            <Label>Course Description*</Label>
            <Input
              type='textarea'
              rows={5}
              placeholder='Enter Course Description'
              defaultValue={props.description}
              onChange={e => setDescription(e.target.value)}
              maxLength={maxDescLength}
            />
            <p
              className='text-muted float-right'
            >
              <span>
                {description ? description.length : 0}
              </span>/{maxDescLength} characters
            </p>
          </Row>
          <Row className="modal-event-image">
            <Label>Course Image + Preview</Label>
            <Input
              type='text'
              placeholder='Enter image URL'
              defaultValue={props.imageURL}
              onChange={e => handleURLChange(e.target.value)}
            />
            <p className="modal-image-container">
              <img
                src={imagePreviewURL}
                alt="course"
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
              Delete Course
            </Button>
          ) : (
            <></>
          )}
          <Button
            color='primary'
            onClick={handleCourseCreation}
            disabled={!validateFields()}
          >
            {modalState === modalStates.SUBMIT
              ? 'Create New Course'
              : 'Submit Changes'}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default CoursesManagerModal;
