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
  Tooltip,
  Row,
  InputGroupAddon
} from 'reactstrap';
import ConfirmationModal from
  '../../Components/DecisionModal/ConfirmationModal';
import { modalStates } from '../../Enums';

function LessonsPageModal(props) {
  const { selectedLesson, showModal, toggle, modalState } = props;
  const [lessonTitle, setLessonTitle] = useState(
    modalState === modalStates.EDIT ? selectedLesson.title : undefined);
  const [mdLink, setMdLink] = useState(
    modalState === modalStates.EDIT ? selectedLesson.URL : undefined);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showToolTip, setShowToolTip] = useState(false);

  function toggleShowConfirmationModal() {
    setShowConfirmationModal(!showConfirmationModal);
  }

  function validateFields() {
    return (
      lessonTitle !== undefined &&
      mdLink !== undefined &&
      lessonTitle !== '' &&
      mdLink !== ''
    );
  }

  async function handleLessonCreation() {
    const lessonFields = {
      title:lessonTitle,
      mdLink
    };

    await props.handleSubmit(lessonFields);
    await props.getLessons();
    props.toggle();
  }

  async function handleDelete() {
    await props.handleDelete();
    await props.getLessons();
    toggleShowConfirmationModal();
    props.toggle();
  }

  const confirmationModalProps = {
    headerText: `Delete ${lessonTitle} ?`,
    bodyText: 'The lesson will be gone forever if you do this.',
    toggle: toggleShowConfirmationModal,
    handleConfirmation: handleDelete,
    open: showConfirmationModal
  };

  return (
    <div>
      <ConfirmationModal {...confirmationModalProps} />
      <Modal isOpen={showModal} size='lg' toggle={toggle}>
        <ModalHeader>
          <Col>
            <Row>
              {modalState === modalStates.SUBMIT ? 'Create A New ' : 'Edit '}
              Lesson
            </Row>
          </Col>
        </ModalHeader>
        <ModalBody>
          <span>
            <span className='text-danger'>* = All fields must be filled</span>
          </span>
          <div>
            <Col>
              <InputGroup className='mb-3 mt-2'>
                <InputGroupAddon addonType='prepend'>
                  Lesson Title*
                </InputGroupAddon>
                <Input
                  type='text'
                  onChange={(e) => setLessonTitle(e.target.value)}
                  placeholder='Intro to Python'
                  defaultValue={lessonTitle}
                />
              </InputGroup>
            </Col>
            <Col>
              <InputGroup className='mb-2'>
                <InputGroupAddon addonType='prepend'>
                  MD Link**
                </InputGroupAddon>
                <Input
                  type='text'
                  onChange={(e) => setMdLink(e.target.value)}
                  placeholder='https://repo-name.github.io/path-to-md/README.md'
                  defaultValue={mdLink}
                />
              </InputGroup>
              <p className='text-muted'>**NOTE: The repo of the md file should
                enable github pages</p>
            </Col>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color='secondary' onClick={toggle}>
            Cancel
          </Button>
          {modalState === modalStates.EDIT && (
            <Button color='danger' onClick={toggleShowConfirmationModal}>
              Delete Lesson
            </Button>
          )}
          <Button
            color='primary'
            onClick={handleLessonCreation}
            disabled={!validateFields()}
          >
            {modalState === modalStates.SUBMIT
              ? 'Create New Lesson'
              : 'Submit Changes'}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default LessonsPageModal;
