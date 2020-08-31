import React, { useState, useEffect } from 'react';
import './editor-form.css';
import {
  Button,
  Row,
  Col,
  FormGroup,
  Form,
  Input,
  Modal,
  Label,
  ModalBody,
  ModalFooter
} from 'reactstrap';
import { sendDoorCodeEmail } from '../../../APIFunctions/Mailer.js';
import {
  assignDoorCode,
  removePersonsDoorCode,
  getPersonsDoorCode
} from '../../../APIFunctions/DoorCode.js';
const enums = require('../../../Enums.js');

export default function EditForm(props) {
  const [resetPages, setResetPages] = useState(false);
  const [successDoorCode, setSuccess] = useState(false);
  const [successRemoveDoorCode, setRemove] = useState(false);
  const [hasDoorCode, setHasDoorCode] = useState(false);
  function submitClicked() {
    if (resetPages) {
      props.setPagesPrinted(0);
    }
    props.handleSubmissionToggle();
  }

  async function assignDoorCodeHandler() {
    const doorCode = await assignDoorCode(props.email, props.token);
    if(doorCode.error) {
      alert('No Door Code Available!');
      return;
    }
    const data = await getPersonsDoorCode(props.email, props.token);
    await sendDoorCodeEmail(props.email,
      data.responseData.doorCode.doorCode, props.formGroups[0].placeholder);
    setSuccess(true);
    setHasDoorCode(true);
  }

  async function removeDoorCodeHandler() {
    const doorCode = await removePersonsDoorCode(props.email, props.token);
    if(doorCode.error) {
      alert('Person already has no door code!');
      return;
    }
    setRemove(true);
    setHasDoorCode(false);
  }

  useEffect(() => {
    // if person already has door code, give them button to remove
    async function fetchDoorCode() {
      let data = await getPersonsDoorCode(props.email, props.token);
      if(!data.error){
        setHasDoorCode(true);
      } else {
        setHasDoorCode(false);
      }
    }
    fetchDoorCode();
  }, [props.email, props.token]);

  return (
    <Row>
      <Col>
        <div>
          <Button
            color='primary'
            style={{
              position: 'relative',
              left: '80%'
            }}
            onClick={() => {
              props.handleToggle();
            }}
          >
            Edit
          </Button>
        </div>

        <Modal isOpen={props.toggle} toggle={() => props.handleToggle()}>
          <ModalBody>
            <Form>
              {props.formGroups.map((group, index) => (
                <FormGroup key={index}>
                  <Label>{group.label}</Label>
                  <Input
                    type={group.type || 'email'}
                    name={group.type}
                    placeholder={group.placeholder}
                    onChange={group.handleChange}
                  />
                </FormGroup>
              ))}
              Change expiration date to
              <select
                onChange={event => {
                  props.setNumberOfSemestersToSignUpFor(event.target.value);
                }}
              >
                {props.membership.map((x, ind) => (
                  <option key={ind} value={x.value}>
                    {x.name}
                  </option>
                ))}
              </select>
              <FormGroup className='reset-pages-group' check inline>
                <Label check id='reset-pages-label'>
                  Reset Pages!
                </Label>
                <Input
                  type='checkbox'
                  id='reset-pages'
                  onClick={event => setResetPages(event.target.checked)}
                />
              </FormGroup>
              <div className='door-code-display'>
                {(hasDoorCode) ? <Button color='danger'
                  onClick={() => removeDoorCodeHandler() }>
                  Remove Door Code</Button>:
                  <Button color='success'
                    onClick={() => assignDoorCodeHandler() }>
                  Assign Door Code</Button>}
                {(successDoorCode) ? <span className='door-code-message'>
                  Successful!</span>: null}
                {(successRemoveDoorCode) ? <span className='door-code-message'>
                  Removed!</span>: null}
              </div>
              <FormGroup tag='fieldset'>
                <legend>Membership Status</legend>
                {Object.values(enums.membershipState).map(
                  (membership, index) => (
                    <FormGroup check key={index}>
                      <Label check>
                        <Input
                          type='radio'
                          name='radio1'
                          value={membership}
                          onChange={() => {
                            props.setuserMembership(membership);
                          }}
                        />
                        {enums.membershipStateToString(membership)}
                      </Label>
                    </FormGroup>
                  )
                )}
              </FormGroup>
            </Form>
          </ModalBody>

          <ModalFooter>
            <Button color='primary' onClick={event => submitClicked()}>
              Submit
            </Button>
            <Button
              color='secondary'
              onClick={() => {
                props.handleToggle();
              }}
            >
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </Col>
    </Row>
  );
}
