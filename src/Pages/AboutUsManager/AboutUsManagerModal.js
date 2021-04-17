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
  InputGroupAddon,
  Alert
} from 'reactstrap';
import { officerModalState } from '../../Enums';
import ConfirmationModal from
  '../../Components/DecisionModal/ConfirmationModal.js';

function AboutUsManagerModal(props) {
  const { modal, toggle, modalState } = props;
  const [name, setName] = useState(props.name);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [quote, setQuote] = useState(props.quote);
  const [pictureUrl, setPictureUrl] = useState(props.pictureUrl);
  const [email, setEmail] = useState(props.email);
  const [linkedin, setLinkedin] = useState(props.linkedin);
  const [team, setTeam] = useState(props.team);
  const [position, setPosition] = useState(props.position);

  function toggleConfirmationModal() {
    setConfirmationModal(!confirmationModal);
  }

  async function handleDeletion() {
    await props.handleDelete();
    window.location.reload();
    toggleConfirmationModal();
    props.toggle();
  }

  const confirmModalProps = {
    headerText: `Delete ${props.name}?`,
    bodyText: 'This officer will be permanently removed from the system.',
    toggle: toggleConfirmationModal,
    handleConfirmation: handleDeletion,
    open: confirmationModal
  };
  const inputMatrixExec = [
    [
      {
        addon: 'Name*',
        type: 'text',
        defaultValue: props.name,
        placeholder: 'e.g. John Doe',
        maxlength: '24',
        handleChange: e => setName(e.target.value)
      },
      {
        addon: 'Email*',
        type: 'email',
        defaultValue: props.email,
        handleChange: e => setEmail(e.target.value)
      }
    ],
    [
      {
        addon: 'LinkedIn Profile*',
        type: 'url',
        placeholder:'Enter URL Here',
        defaultValue: props.linkedin,
        handleChange: e => setLinkedin(e.target.value)
      },
      {
        addon: 'Position*',
        type: 'text',
        defaultValue: props.position,
        maxlength: '24',
        handleChange: e => setPosition(e.target.value)
      }
    ],
    [
      {
        addon: 'Description* (320 characters max)',
        type: 'textarea',
        rows: 5,
        placeholder: 'Enter Description',
        defaultValue: props.quote,
        handleChange: e => setQuote(e.target.value),
        maxlength: '320'
      }
    ],
    [
      {
        addon: 'Profile Picture*',
        type: 'url',
        placeholder:'Enter URL Here',
        defaultValue: props.pictureUrl,
        handleChange: e => setPictureUrl(e.target.value)
      }
    ]
  ];

  const inputMatrixOfficers = [
    [
      {
        addon: 'First Name*',
        type: 'text',
        defaultValue: props.name,
        placeholder: 'e.g. John D.',
        maxlength: '15',
        handleChange: e => setName(e.target.value)
      },
      {
        addon: 'Email*',
        type: 'email',
        defaultValue: props.email,
        handleChange: e => setEmail(e.target.value)
      }
    ],
    [
      {
        addon: 'LinkedIn Profile',
        type: 'url',
        placeholder:'Enter URL Here',
        defaultValue: props.linkedin,
        handleChange: e => setLinkedin(e.target.value)
      }
    ],
    [
      {
        addon: 'Profile Picture*',
        type: 'url',
        placeholder: 'Enter URL Here',
        defaultValue: props.pictureUrl,
        handleChange: e => setPictureUrl(e.target.value)
      }
    ]
  ];

  async function handleSubmission() {
    const officerFields = {
      name,
      email,
      linkedin,
      team,
      position,
      quote,
      pictureUrl
    };
    await props.handleSubmit({...officerFields});
    window.location.reload();
    props.toggle();
  }

  function requiredFieldsFilledIn() {
    const nameEmailTeamPicture = name && email
      && team && pictureUrl;
    const linkedInQuotePosition = linkedin && quote && position;
    if (team === 'executive' && (props.modalState === officerModalState.EDIT ||
       props.modalState === officerModalState.SUBMIT)) {
      return nameEmailTeamPicture && linkedInQuotePosition;
    } else if (team === 'officers' &&
       (props.modalState === officerModalState.SUBMIT ||
       props.modalState === officerModalState.EDIT)) {
      return nameEmailTeamPicture;
    } return false;
  }

  return (
    <div>
      <ConfirmationModal {...confirmModalProps} />
      <Modal isOpen={modal} size='lg' toggle={toggle}>
        <ModalHeader>
          {modalState === officerModalState.SUBMIT ? 'Create New ' : 'Edit '}
          Officer
        </ModalHeader>
        <ModalBody>
          <span>
            <span color='red'>*</span>= This is a required field
          </span>
          <Row className='container'>
            <Label>Team*</Label>
            <Input
              type='select'
              defaultValue={props.team}
              onChange={e => setTeam(e.target.value)}
              children= {
                <>
                  <option>Select Team</option>
                  <option value="officers">Officer Team</option>
                  <option value="executive">Executive Team</option>
                </>
              }
            />
          </Row>
          <br></br>
          {team === 'executive'?
            inputMatrixExec.map((row, index) => {
              return (
                <Row key={index} className='container'>
                  {row.map((input, index) => {
                    return (
                      <Col key={index}>
                        <InputGroup className='officer-input-group'>
                          <InputGroupAddon addonType='prepend'>
                            {input.addon}
                          </InputGroupAddon>
                          <Input
                            type={input.type}
                            defaultValue={input.defaultValue}
                            placeholder={input.placeholder}
                            onChange={input.handleChange}
                            maxLength={input.maxlength}
                            children={input.children}
                          />
                        </InputGroup>
                      </Col>
                    );
                  })}
                </Row>
              );
            }) :
            inputMatrixOfficers.map((row, index) => {
              return (
                <Row key={index} className='container'>
                  {row.map((input, index) => {
                    return (
                      <Col key={index}>
                        <InputGroup className='officer-input-group'>
                          <InputGroupAddon addonType='prepend'>
                            {input.addon}
                          </InputGroupAddon>
                          <Input
                            type={input.type}
                            defaultValue={input.defaultValue}
                            placeholder={input.placeholder}
                            onChange={input.handleChange}
                            maxlength={input.maxlength}
                            children={input.children}
                          />
                        </InputGroup>
                      </Col>
                    );
                  })}
                </Row>
              );
            })}
          {!requiredFieldsFilledIn()?
            <Alert color="warning">
                1 or more required fields have been left empty.
                Please fill all required fields to continue.
            </Alert>
            :
            <Alert color="success">
                All required fields are filled.
            </Alert>
          }
        </ModalBody>
        <ModalFooter>
          <Button color='secondary' onClick={toggle}>
            Cancel
          </Button>
          {modalState === officerModalState.EDIT ? (
            <Button color='danger' onClick={toggleConfirmationModal}>
              Delete Officer
            </Button>
          ) : (
            <></>
          )}
          <Button
            color='primary'
            onClick={handleSubmission}
            disabled={!requiredFieldsFilledIn()}
          >
            {modalState === officerModalState.SUBMIT
              ? 'Create New Officer'
              : 'Submit Changes'}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default AboutUsManagerModal;
